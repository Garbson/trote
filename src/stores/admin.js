// src/stores/admin.js
import { supabase } from '@/lib/supabase'
import { cloudinaryUploader } from '@/utils/cloudinary'
import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { computed, ref } from 'vue'


export const useAdminStore = defineStore('admin', () => {

  const cartas = ref([])

  const usuarios = ref([
    { id: 1, nome: "Admin", email: "admin@bixo.com" },
    { id: 2, nome: "Usuário 1", email: "user1@bixo.com" }
  ])

  const loading = ref(false)
  const salvando = ref(false)

  // Getters computados
  const cartasAtivas = computed(() =>
    cartas.value.filter(carta => carta.ativa)
  )

  const estatisticas = computed(() => ({
    totalCartas: cartas.value.length,
    cartasAtivas: cartasAtivas.value.length,
    totalUsuarios: usuarios.value.length,
    codigosUsados: Math.floor(cartas.value.length * 0.7),
    cartasLendarias: cartas.value.filter(c => c.raridade === 'lendario').length
  }))

  const cartasPorRaridade = computed(() => {
    const counts = { comum: 0, raro: 0, epico: 0, lendario: 0 }
    cartas.value.forEach(carta => {
      counts[carta.raridade] = (counts[carta.raridade] || 0) + 1
    })
    return counts
  })

  const fetchCartas = async () => {
    loading.value = true
    try {
      // Simular carregamento com dados iniciais
      await new Promise(resolve => setTimeout(resolve, 500))

      // Adicionar algumas cartas de exemplo se não existirem
      if (cartas.value.length === 0) {
        cartas.value = [
          {
            id: 1,
            nome: "João Silva",
            descricao: "Calouro dedicado aos estudos",
            foto_url: "/img/default-avatar.jpg",
            raridade: "comum",
            pontos_valor: 10,
            codigo_unico: "SI001",
            qr_code_hash: "qr_hash_001",
            ativa: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 2,
            nome: "Maria Santos",
            descricao: "Especialista em algoritmos",
            foto_url: "/img/default-avatar.jpg",
            raridade: "raro",
            pontos_valor: 25,
            codigo_unico: "EC002",
            qr_code_hash: "qr_hash_002",
            ativa: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ]
      }

      Notify.create({
        type: 'positive',
        message: 'Cartas carregadas com sucesso'
      })
    } catch (error) {
      console.error('Erro ao carregar cartas:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao carregar cartas'
      })
    } finally {
      loading.value = false
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
      const index = cartas.value.findIndex(carta => carta.id === id)
      if (index === -1) {
        throw new Error('Carta não encontrada')
      }

      // Verificar código único se foi alterado
      if (dadosAtualizados.codigo_unico &&
        dadosAtualizados.codigo_unico !== cartas.value[index].codigo_unico) {
        const codigoExiste = cartas.value.some(
          (carta, i) => i !== index && carta.codigo_unico === dadosAtualizados.codigo_unico
        )

        if (codigoExiste) {
          throw new Error('Este código já está sendo usado')
        }
      }

      const cartaAtualizada = {
        ...cartas.value[index],
        ...dadosAtualizados,
        pontos_valor: parseInt(dadosAtualizados.pontos_valor),
        updated_at: new Date().toISOString()
      }

      // Simular atualização no banco
      await new Promise(resolve => setTimeout(resolve, 600))

      cartas.value[index] = cartaAtualizada

      Notify.create({
        type: 'positive',
        message: `Carta "${cartaAtualizada.nome}" atualizada com sucesso!`
      })

      return { success: true, carta: cartaAtualizada }
    } catch (error) {
      console.error('Erro ao atualizar carta:', error)
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
      const index = cartas.value.findIndex(carta => carta.id === id)
      if (index === -1) {
        throw new Error('Carta não encontrada')
      }

      const cartaNome = cartas.value[index].nome

      // Simula exclusão no banco
      await new Promise(resolve => setTimeout(resolve, 400))

      // Em produção, você pode preferir desativar ao invés de excluir:
      // cartas.value[index].ativa = false
      // Ou excluir completamente:
      cartas.value.splice(index, 1)

      Notify.create({
        type: 'positive',
        message: `Carta "${cartaNome}" excluída com sucesso!`
      })

      return { success: true }
    } catch (error) {
      console.error('Erro ao excluir carta:', error)
      Notify.create({
        type: 'negative',
        message: error.message || 'Erro ao excluir carta'
      })
      return { success: false, error: error.message }
    } finally {
      salvando.value = false
    }
  }

  const toggleStatusCarta = async (id) => {
    const carta = cartas.value.find(c => c.id === id)
    if (carta) {
      return await atualizarCarta(id, { ativa: !carta.ativa })
    }
    return { success: false, error: 'Carta não encontrada' }
  }

  const gerarCodigoUnico = () => {
    // Gera um código alfanumérico único de 6 caracteres
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let codigo = ''

    do {
      codigo = ''
      for (let i = 0; i < 6; i++) {
        codigo += chars.charAt(Math.floor(Math.random() * chars.length))
      }
    } while (cartas.value.some(carta => carta.codigo_unico === codigo))

    return codigo
  }

  const uploadImagem = async (arquivo) => {
    try {
      // Upload para o Cloudinary
      const resultado = await cloudinaryUploader.uploadImage(arquivo)


      if (resultado.success) {
        Notify.create({
          type: 'positive',
          message: 'Imagem enviada com sucesso!'
        })

        return {
          success: true,
          url: resultado.url,
          publicId: resultado.publicId
        }
      } else {
        throw new Error(resultado.error)
      }

    } catch (error) {
      console.error('Erro no upload:', error)

      Notify.create({
        type: 'negative',
        message: `Erro no upload: ${error.message}`
      })

      return {
        success: false,
        error: error.message
      }
    }
  }

  return {
    // Estado
    cartas,
    usuarios,
    loading,
    salvando,

    // Getters
    cartasAtivas,
    estatisticas,
    cartasPorRaridade,

    // Actions
    fetchCartas,
    criarCarta,
    atualizarCarta,
    excluirCarta,
    toggleStatusCarta,
    gerarCodigoUnico,
    uploadImagem
  }
})