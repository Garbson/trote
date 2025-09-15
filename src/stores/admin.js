// src/stores/admin.js
import { supabase } from '@/lib/supabase'
import { cloudinaryUploader } from '@/utils/cloudinary'
import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { computed, ref } from 'vue'

export const useAdminStore = defineStore('admin', () => {
  // Estados
  const cartas = ref([])
  const usuarios = ref([])
  const usuarioCartas = ref([])
  const estatisticasRaw = ref({})
  const loading = ref(false)
  const salvando = ref(false)
  const loadingUsuarios = ref(false)
  const loadingEstatisticas = ref(false)

  // Getters computados
  const cartasAtivas = computed(() =>
    cartas.value.filter(carta => carta.ativa)
  )

  const estatisticas = computed(() => {
    // Usar dados reais se disponíveis, senão calcular
    if (estatisticasRaw.value.total_cartas !== undefined) {
      return estatisticasRaw.value
    }
    
    // Fallback para cálculo local
    const codigosUsados = usuarioCartas.value.length
    const cartasLendarias = cartas.value.filter(c => c.raridade === 'lendario').length
    
    return {
      total_cartas: cartas.value.length,
      cartas_ativas: cartasAtivas.value.length,
      total_usuarios: usuarios.value.length,
      codigos_usados: codigosUsados,
      cartas_lendarias: cartasLendarias,
      usuarios_ativos: usuarios.value.filter(u => u.ativo !== false).length
    }
  })

  const cartasPorRaridade = computed(() => {
    const counts = { comum: 0, raro: 0, epico: 0, lendario: 0 }
    cartas.value.forEach(carta => {
      counts[carta.raridade] = (counts[carta.raridade] || 0) + 1
    })
    return counts
  })

  const usuariosPorNivel = computed(() => {
    const counts = {}
    usuarios.value.forEach(usuario => {
      const nivel = usuario.nivel || 1
      counts[nivel] = (counts[nivel] || 0) + 1
    })
    return counts
  })

  const topUsuarios = computed(() => {
    return [...usuarios.value]
      .sort((a, b) => (b.pontos_totais || 0) - (a.pontos_totais || 0))
      .slice(0, 10)
  })

  // Buscar todas as cartas
  const fetchCartas = async () => {
    loading.value = true
    try {
      console.log('🔄 Admin: Carregando cartas...')
      
      const { data, error } = await supabase
        .from('cartas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar cartas:', error)
        throw error
      }

      cartas.value = data || []
      console.log('✅ Admin: Cartas carregadas:', cartas.value.length)

    } catch (error) {
      console.error('❌ Erro ao carregar cartas:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao carregar cartas: ' + error.message
      })
    } finally {
      loading.value = false
    }
  }

  // Buscar todos os usuários
  const fetchUsuarios = async () => {
    loadingUsuarios.value = true
    try {
      console.log('🔄 Admin: Carregando usuários...')
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar usuários:', error)
        throw error
      }

      usuarios.value = data || []
      console.log('✅ Admin: Usuários carregados:', usuarios.value.length)

    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao carregar usuários: ' + error.message
      })
    } finally {
      loadingUsuarios.value = false
    }
  }

  // Buscar relações usuário-cartas para estatísticas
  const fetchUsuarioCartas = async () => {
    try {
      console.log('🔄 Admin: Carregando relações usuário-cartas...')
      
      const { data, error } = await supabase
        .from('usuario_cartas')
        .select(`
          *,
          usuarios (nome, email),
          cartas (nome, raridade)
        `)
        .order('data_obtencao', { ascending: false })

      if (error) {
        console.error('❌ Erro ao buscar usuário-cartas:', error)
        throw error
      }

      usuarioCartas.value = data || []
      console.log('✅ Admin: Relações usuário-cartas carregadas:', usuarioCartas.value.length)

    } catch (error) {
      console.error('❌ Erro ao carregar usuário-cartas:', error)
    }
  }

  // Buscar estatísticas consolidadas
  const fetchEstatisticas = async () => {
    loadingEstatisticas.value = true
    try {
      console.log('🔄 Admin: Carregando estatísticas...')
      
      // Buscar estatísticas de cartas
      const { data: statsCartas, error: errorCartas } = await supabase
        .from('cartas')
        .select('raridade, ativa')

      // Buscar estatísticas de usuários
      const { data: statsUsuarios, error: errorUsuarios } = await supabase
        .from('usuarios')
        .select('nivel, pontos_totais, created_at')

      // Buscar estatísticas de códigos usados
      const { data: codigosUsados, error: errorCodigos } = await supabase
        .from('usuario_cartas')
        .select('id, data_obtencao')

      if (errorCartas || errorUsuarios || errorCodigos) {
        throw new Error('Erro ao buscar estatísticas')
      }

      // Calcular estatísticas
      const totalCartas = statsCartas?.length || 0
      const cartasAtivas = statsCartas?.filter(c => c.ativa)?.length || 0
      const cartasLendarias = statsCartas?.filter(c => c.raridade === 'lendario')?.length || 0
      const totalUsuarios = statsUsuarios?.length || 0
      const usuariosAtivos = statsUsuarios?.filter(u => {
        // Usuários que se cadastraram nos últimos 30 dias ou têm pontos
        const created = new Date(u.created_at)
        const now = new Date()
        const diffDays = (now - created) / (1000 * 60 * 60 * 24)
        return diffDays <= 30 || u.pontos_totais > 0
      })?.length || 0

      estatisticasRaw.value = {
        total_cartas: totalCartas,
        cartas_ativas: cartasAtivas,
        cartas_lendarias: cartasLendarias,
        total_usuarios: totalUsuarios,
        usuarios_ativos: usuariosAtivos,
        codigos_usados: codigosUsados?.length || 0
      }

      console.log('✅ Admin: Estatísticas carregadas:', estatisticasRaw.value)

    } catch (error) {
      console.error('❌ Erro ao carregar estatísticas:', error)
    } finally {
      loadingEstatisticas.value = false
    }
  }

  const criarCarta = async (dadosCarta) => {
    salvando.value = true
    try {
      // Validações
      if (!dadosCarta.nome || !dadosCarta.codigo_unico) {
        throw new Error('Nome e código são obrigatórios')
      }

      // Verificar se código já existe
      const { data: cartaExistente } = await supabase
        .from('cartas')
        .select('id')
        .eq('codigo_unico', dadosCarta.codigo_unico)
        .single()

      if (cartaExistente) {
        throw new Error('Este código já está sendo usado')
      }

      // Gerar QR code hash único
      const qrCodeHash = `qr_${dadosCarta.codigo_unico}_${Date.now()}`

      const novaCarta = {
        nome: dadosCarta.nome,
        descricao: dadosCarta.descricao || null,
        foto_url: dadosCarta.foto_url || null,
        raridade: dadosCarta.raridade,
        pontos_valor: parseInt(dadosCarta.pontos_valor),
        codigo_unico: dadosCarta.codigo_unico,
        qr_code_hash: qrCodeHash,
        ativa: true
      }

      const { data, error } = await supabase
        .from('cartas')
        .insert(novaCarta)
        .select()
        .single()

      if (error) throw error

      // Adicionar à lista local
      cartas.value.unshift(data)

      Notify.create({
        type: 'positive',
        message: `Carta "${dadosCarta.nome}" criada com sucesso!`,
        avatar: dadosCarta.foto_url
      })

      return { success: true, carta: data }
    } catch (error) {
      console.error('Erro ao criar carta:', error)
      Notify.create({
        type: 'negative',
        message: error.message || 'Erro ao criar carta'
      })
      return { success: false, error: error.message }
    } finally {
      salvando.value = false
    }
  }

  const atualizarCarta = async (id, dadosAtualizados) => {
    salvando.value = true
    try {
      console.log('🔄 Admin: Atualizando carta:', id)

      // Verificar se código único não está em uso (se foi alterado)
      if (dadosAtualizados.codigo_unico) {
        const { data: cartaExistente } = await supabase
          .from('cartas')
          .select('id')
          .eq('codigo_unico', dadosAtualizados.codigo_unico)
          .neq('id', id)
          .single()

        if (cartaExistente) {
          throw new Error('Este código já está sendo usado por outra carta')
        }
      }

      // Preparar dados para atualização
      const dadosUpdate = {
        ...dadosAtualizados,
        pontos_valor: parseInt(dadosAtualizados.pontos_valor),
        updated_at: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('cartas')
        .update(dadosUpdate)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Atualizar no estado local
      const index = cartas.value.findIndex(carta => carta.id === id)
      if (index !== -1) {
        cartas.value[index] = data
      }

      console.log('✅ Admin: Carta atualizada:', data.nome)

      Notify.create({
        type: 'positive',
        message: `Carta "${data.nome}" atualizada com sucesso!`
      })

      return { success: true, carta: data }
    } catch (error) {
      console.error('❌ Erro ao atualizar carta:', error)
      Notify.create({
        type: 'negative',
        message: error.message || 'Erro ao atualizar carta'
      })
      return { success: false, error: error.message }
    } finally {
      salvando.value = false
    }
  }


  const excluirCarta = async (id) => {
    salvando.value = true
    try {
      console.log('🔄 Admin: Excluindo carta:', id)

      // Buscar nome da carta antes de excluir
      const carta = cartas.value.find(c => c.id === id)
      if (!carta) {
        throw new Error('Carta não encontrada')
      }

      const cartaNome = carta.nome

      // Verificar se carta tem usuários vinculados
      const { data: usuariosVinculados, error: errorCheck } = await supabase
        .from('usuario_cartas')
        .select('id')
        .eq('carta_id', id)
        .limit(1)

      if (errorCheck) throw errorCheck

      if (usuariosVinculados && usuariosVinculados.length > 0) {
        // Se tem usuários vinculados, apenas desativar
        const { error } = await supabase
          .from('cartas')
          .update({ ativa: false, updated_at: new Date().toISOString() })
          .eq('id', id)

        if (error) throw error

        // Atualizar no estado local
        const index = cartas.value.findIndex(carta => carta.id === id)
        if (index !== -1) {
          cartas.value[index].ativa = false
        }

        Notify.create({
          type: 'warning',
          message: `Carta "${cartaNome}" foi desativada (possui usuários vinculados)`
        })
      } else {
        // Se não tem usuários vinculados, pode excluir
        const { error } = await supabase
          .from('cartas')
          .delete()
          .eq('id', id)

        if (error) throw error

        // Remover do estado local
        const index = cartas.value.findIndex(carta => carta.id === id)
        if (index !== -1) {
          cartas.value.splice(index, 1)
        }

        Notify.create({
          type: 'positive',
          message: `Carta "${cartaNome}" excluída com sucesso!`
        })
      }

      console.log('✅ Admin: Carta processada:', cartaNome)
      return { success: true }

    } catch (error) {
      console.error('❌ Erro ao excluir carta:', error)
      Notify.create({
        type: 'negative',
        message: error.message || 'Erro ao excluir carta'
      })
      return { success: false, error: error.message }
    } finally {
      salvando.value = false
    }
  }

  // Reativar carta desativada
  const reativarCarta = async (id) => {
    salvando.value = true
    try {
      console.log('🔄 Admin: Reativando carta:', id)

      const { data, error } = await supabase
        .from('cartas')
        .update({ ativa: true, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Atualizar no estado local
      const index = cartas.value.findIndex(carta => carta.id === id)
      if (index !== -1) {
        cartas.value[index] = data
      }

      Notify.create({
        type: 'positive',
        message: `Carta "${data.nome}" reativada com sucesso!`
      })

      return { success: true, carta: data }
    } catch (error) {
      console.error('❌ Erro ao reativar carta:', error)
      Notify.create({
        type: 'negative',
        message: error.message || 'Erro ao reativar carta'
      })
      return { success: false, error: error.message }
    } finally {
      salvando.value = false
    }
  }

  const toggleStatusCarta = async (id) => {
    const carta = cartas.value.find(c => c.id === id)
    if (carta) {
      if (carta.ativa) {
        return await excluirCarta(id) // Vai desativar se tem usuários vinculados
      } else {
        return await reativarCarta(id)
      }
    }
    return { success: false, error: 'Carta não encontrada' }
  }

  const gerarCodigoUnico = async () => {
    // Gera um código alfanumérico único de 6 caracteres
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let codigo = ''
    let tentativas = 0
    const maxTentativas = 50

    do {
      codigo = ''
      for (let i = 0; i < 6; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length))
      }
      
      tentativas++
      
      // Verificar no banco se código já existe
      const { data: cartaExistente } = await supabase
        .from('cartas')
        .select('id')
        .eq('codigo_unico', codigo)
        .single()
        
      if (!cartaExistente) {
        break // Código único encontrado
      }
      
    } while (tentativas < maxTentativas)

    if (tentativas >= maxTentativas) {
      throw new Error('Não foi possível gerar código único')
    }

    return codigo
  }

  const uploadImagem = async (arquivo, opcoes = {}) => {
    try {
      // Upload para o Cloudinary com opções personalizadas
      const resultado = await cloudinaryUploader.uploadImage(arquivo, opcoes)

      if (resultado.success) {
        // Não mostrar notificação aqui, deixar para o componente decidir
        return {
          success: true,
          url: resultado.url,
          publicId: resultado.publicId,
          compressionRatio: resultado.compressionRatio || 0,
          originalSize: resultado.originalSize,
          compressedSize: resultado.compressedSize,
          width: resultado.width,
          height: resultado.height,
          format: resultado.format
        }
      } else {
        throw new Error(resultado.error)
      }

    } catch (error) {
      console.error('Erro no upload:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // Método para carregar todos os dados do admin
  const fetchTodosOsDados = async () => {
    try {
      console.log('🔄 Admin: Carregando todos os dados...')
      
      // Carregar em paralelo para melhor performance
      await Promise.all([
        fetchCartas(),
        fetchUsuarios(),
        fetchUsuarioCartas(),
        fetchEstatisticas()
      ])
      
      console.log('✅ Admin: Todos os dados carregados')
    } catch (error) {
      console.error('❌ Erro ao carregar dados do admin:', error)
    }
  }

  return {
    // Estado
    cartas,
    usuarios,
    usuarioCartas,
    estatisticasRaw,
    loading,
    salvando,
    loadingUsuarios,
    loadingEstatisticas,

    // Getters
    cartasAtivas,
    estatisticas,
    cartasPorRaridade,
    usuariosPorNivel,
    topUsuarios,

    // Actions - Cartas
    fetchCartas,
    criarCarta,
    atualizarCarta,
    excluirCarta,
    reativarCarta,
    toggleStatusCarta,

    // Actions - Usuários
    fetchUsuarios,
    fetchUsuarioCartas,

    // Actions - Estatísticas
    fetchEstatisticas,

    // Actions - Utilitários
    gerarCodigoUnico,
    uploadImagem,
    fetchTodosOsDados,

    // Aliases para compatibilidade com o painel admin
    carregarCartas: fetchCartas,
    adicionarCarta: criarCarta,
    editarCarta: atualizarCarta
  }
})