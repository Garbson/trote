// src/stores/cartas.js
import { METODO_OBTENCAO, supabase } from '@/lib/supabase'
import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth'

export const useCartasStore = defineStore('cartas', () => {
  // Estado
  const cartas = ref([])
  const cartasUsuario = ref([])
  const loading = ref(false)
  const loadingObter = ref(false)

  // Getters
  const cartasDisponiveis = computed(() =>
    cartas.value.filter(carta => carta.ativa)
  )

  const cartasObtidas = computed(() =>
    cartasUsuario.value.map(uc => ({
      ...cartas.value.find(c => c.id === uc.carta_id),
      data_obtencao: uc.data_obtencao,
      metodo_obtencao: uc.metodo_obtencao
    })).filter(Boolean)
  )

  const cartasNaoObtidas = computed(() =>
    cartas.value.filter(carta =>
      carta.ativa && !cartasUsuario.value.some(uc => uc.carta_id === carta.id)
    )
  )

  const estatisticas = computed(() => {
    const obtidas = cartasObtidas.value
    const total = cartasDisponiveis.value.length

    return {
      total_cartas: obtidas.length,
      total_disponiveis: total,
      percentual_completo: total > 0 ? Math.round((obtidas.length / total) * 100) : 0,
      cartas_comuns: obtidas.filter(c => c.raridade === 'comum').length,
      cartas_raras: obtidas.filter(c => c.raridade === 'raro').length,
      cartas_epicas: obtidas.filter(c => c.raridade === 'epico').length,
      cartas_lendarias: obtidas.filter(c => c.raridade === 'lendario').length
    }
  })

  // Actions
  const fetchCartas = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('cartas')
        .select('*')
        .eq('ativa', true)
        .order('nome')

      if (error) throw error

      cartas.value = data || []
    } catch (error) {
      console.error('Erro ao buscar cartas:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao carregar cartas'
      })
    } finally {
      loading.value = false
    }
  }

  const fetchCartasUsuario = async () => {
    const authStore = useAuthStore()

    if (!authStore.isAuthenticated) {
      console.log('❌ Usuario não autenticado, pulando carregamento de cartas')
      return
    }

    if (!authStore.user?.id) {
      console.log('❌ ID do usuário não disponível, pulando carregamento de cartas')
      return
    }

    console.log('🔄 Buscando cartas do usuário:', authStore.user.id)

    try {
      const { data, error } = await supabase
        .from('usuario_cartas')
        .select(`
          *,
          cartas (
            id,
            nome,
            foto_url,
            raridade,
            pontos_valor
          )
        `)
        .eq('usuario_id', authStore.user.id)
        .order('data_obtencao', { ascending: false })

      if (error) {
        console.error('❌ Erro na query:', error)
        throw error
      }

      cartasUsuario.value = data || []
      console.log('✅ Cartas do usuário carregadas:', cartasUsuario.value.length)

      // Log das cartas obtidas para debug
      if (cartasUsuario.value.length > 0) {
        console.log('📝 Cartas obtidas:', cartasUsuario.value.map(uc => ({
          carta_id: uc.carta_id,
          nome: uc.cartas?.nome,
          data_obtencao: uc.data_obtencao
        })))
      }

    } catch (error) {
      console.error('❌ Erro ao buscar cartas do usuário:', error)

      // Não resetar as cartas em caso de erro - manter estado anterior
      Notify.create({
        type: 'warning',
        message: 'Erro ao carregar suas cartas. Tentando novamente...',
        timeout: 2000
      })

      throw error // Re-throw para permitir retry
    }
  }

  const obterCartaPorCodigo = async (codigo) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      Notify.create({
        type: 'negative',
        message: 'Você precisa estar logado para obter cartas'
      })
      return { success: false, error: 'Não autenticado' }
    }

    loadingObter.value = true
    try {
      // 1. Buscar carta pelo código
      const { data: carta, error: cartaError } = await supabase
        .from('cartas')
        .select('*')
        .eq('codigo_unico', codigo)
        .eq('ativa', true)
        .single()

      if (cartaError || !carta) {
        Notify.create({
          type: 'negative',
          message: 'Código incorreto ou carta não encontrada'
        })
        return { success: false, error: 'Carta não encontrada' }
      }

      // 2. Verificar se usuário já possui a carta
      const { data: cartaExistente } = await supabase
        .from('usuario_cartas')
        .select('id')
        .eq('usuario_id', authStore.user.id)
        .eq('carta_id', carta.id)
        .single()

      if (cartaExistente) {
        Notify.create({
          type: 'warning',
          message: 'Você já possui esta carta!'
        })
        return { success: false, error: 'Carta já obtida' }
      }

      // 3. Adicionar carta ao usuário
      const { error: insercaoError } = await supabase
        .from('usuario_cartas')
        .insert({
          usuario_id: authStore.user.id,
          carta_id: carta.id,
          metodo_obtencao: METODO_OBTENCAO.CODIGO_MANUAL
        })

      if (insercaoError) throw insercaoError

      // 4. Atualizar dados locais
      await fetchCartasUsuario()
      await authStore.fetchUserProfile() // Atualiza pontos

      Notify.create({
        type: 'positive',
        message: `Parabéns! Você obteve ${carta.nome}!`,
        avatar: carta.foto_url
      })

      return { success: true, carta }
    } catch (error) {
      console.error('Erro ao obter carta:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao obter carta'
      })
      return { success: false, error: error.message }
    } finally {
      loadingObter.value = false
    }
  }

  const obterCartaPorQR = async (qrCodeHash) => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) {
      Notify.create({
        type: 'negative',
        message: 'Você precisa estar logado para obter cartas'
      })
      return { success: false, error: 'Não autenticado' }
    }

    loadingObter.value = true
    try {
      // 1. Buscar carta pelo QR code hash
      const { data: carta, error: cartaError } = await supabase
        .from('cartas')
        .select('*')
        .eq('qr_code_hash', qrCodeHash)
        .eq('ativa', true)
        .single()

      if (cartaError || !carta) {
        Notify.create({
          type: 'negative',
          message: 'QR Code inválido ou carta não encontrada'
        })
        return { success: false, error: 'Carta não encontrada' }
      }

      // 2. Verificar se usuário já possui a carta
      const { data: cartaExistente } = await supabase
        .from('usuario_cartas')
        .select('id')
        .eq('usuario_id', authStore.user.id)
        .eq('carta_id', carta.id)
        .single()

      if (cartaExistente) {
        Notify.create({
          type: 'warning',
          message: 'Você já possui esta carta!'
        })
        return { success: false, error: 'Carta já obtida' }
      }

      // 3. Adicionar carta ao usuário
      const { error: insercaoError } = await supabase
        .from('usuario_cartas')
        .insert({
          usuario_id: authStore.user.id,
          carta_id: carta.id,
          metodo_obtencao: METODO_OBTENCAO.QR_CODE
        })

      if (insercaoError) throw insercaoError

      // 4. Atualizar dados locais
      await fetchCartasUsuario()
      await authStore.fetchUserProfile() // Atualiza pontos

      Notify.create({
        type: 'positive',
        message: `Parabéns! Você obteve ${carta.nome}!`,
        avatar: carta.foto_url
      })

      return { success: true, carta }
    } catch (error) {
      console.error('Erro ao obter carta via QR:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao obter carta'
      })
      return { success: false, error: error.message }
    } finally {
      loadingObter.value = false
    }
  }

  const verificarCartaObtida = (cartaId) => {
    const obtida = cartasUsuario.value.some(uc => uc.carta_id === cartaId)

    // Log apenas em desenvolvimento para debug
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔍 Verificando carta ${cartaId}: ${obtida ? '✅ obtida' : '❌ não obtida'}`)
    }

    return obtida
  }

  // ============ FUNÇÕES DE ADMINISTRAÇÃO ============

  const fetchTodasCartas = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('cartas')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      cartas.value = data || []
      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar todas as cartas:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao carregar cartas'
      })
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const criarCarta = async (dadosCarta) => {
    loading.value = true
    try {
      // Gerar hash do QR code baseado no código único
      const qrCodeHash = btoa(dadosCarta.codigo_unico + Date.now()).replace(/[^a-zA-Z0-9]/g, '')

      const { data, error } = await supabase
        .from('cartas')
        .insert({
          ...dadosCarta,
          qr_code_hash: qrCodeHash
        })
        .select()
        .single()

      if (error) throw error

      // Atualizar lista local
      await fetchTodasCartas()

      Notify.create({
        type: 'positive',
        message: `Animal "${dadosCarta.nome}" criado com sucesso!`
      })

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao criar carta:', error)
      let message = 'Erro ao criar animal'

      if (error.code === '23505') {
        if (error.detail.includes('codigo_unico')) {
          message = 'Código único já existe!'
        } else if (error.detail.includes('qr_code_hash')) {
          message = 'QR Code já existe!'
        }
      }

      Notify.create({
        type: 'negative',
        message
      })

      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const atualizarCarta = async (cartaId, dadosAtualizados) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('cartas')
        .update({
          ...dadosAtualizados,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartaId)
        .select()
        .single()

      if (error) throw error

      // Atualizar lista local
      await fetchTodasCartas()

      Notify.create({
        type: 'positive',
        message: 'Animal atualizado com sucesso!'
      })

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao atualizar carta:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao atualizar animal'
      })
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const excluirCarta = async (cartaId) => {
    loading.value = true
    try {
      const { error } = await supabase
        .from('cartas')
        .delete()
        .eq('id', cartaId)

      if (error) throw error

      // Atualizar lista local
      await fetchTodasCartas()

      Notify.create({
        type: 'positive',
        message: 'Animal excluído com sucesso!'
      })

      return { success: true }
    } catch (error) {
      console.error('Erro ao excluir carta:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao excluir animal'
      })
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const toggleStatusCarta = async (cartaId, novoStatus) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('cartas')
        .update({
          ativa: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', cartaId)
        .select()
        .single()

      if (error) throw error

      // Atualizar lista local
      await fetchTodasCartas()

      Notify.create({
        type: 'positive',
        message: `Animal ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`
      })

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao alterar status da carta:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao alterar status do animal'
      })
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  return {
    // Estado
    cartas,
    cartasUsuario,
    loading,
    loadingObter,

    // Getters
    cartasDisponiveis,
    cartasObtidas,
    cartasNaoObtidas,
    estatisticas,

    // Actions
    fetchCartas,
    fetchCartasUsuario,
    obterCartaPorCodigo,
    obterCartaPorQR,
    verificarCartaObtida,

    // Admin Actions
    fetchTodasCartas,
    criarCarta,
    atualizarCarta,
    excluirCarta,
    toggleStatusCarta,

    // Aliases para compatibilidade
    editarCarta: atualizarCarta
  }
})