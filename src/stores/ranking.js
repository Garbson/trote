// src/stores/ranking.js
import { supabase } from '@/lib/supabase'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useAuthStore } from './auth'

export const useRankingStore = defineStore('ranking', () => {
  // Estado
  const ranking = ref([])
  const loading = ref(false)
  const minhaColecao = ref(null)
  const currentPage = ref(1)
  const itemsPerPage = ref(10)

  // Getters
  const top10 = computed(() => ranking.value.slice(0, 10))

  const totalPages = computed(() => {
    return Math.ceil(ranking.value.length / itemsPerPage.value)
  })

  const paginatedRanking = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return ranking.value.slice(start, end)
  })

  const minhaPosicao = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return null

    return ranking.value.findIndex(user => user.usuario_id === authStore.user.id) + 1
  })

  const estatisticasGerais = computed(() => {
    if (ranking.value.length === 0) return null

    const totalUsuarios = ranking.value.length
    const mediaCartas = ranking.value.reduce((acc, user) => acc + user.total_cartas, 0) / totalUsuarios
    const mediaPontos = ranking.value.reduce((acc, user) => acc + user.pontos_totais, 0) / totalUsuarios

    return {
      total_usuarios: totalUsuarios,
      media_cartas: Math.round(mediaCartas * 10) / 10,
      media_pontos: Math.round(mediaPontos),
      lider: ranking.value[0] || null
    }
  })

  // Actions
  const fetchRanking = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('ranking_atual')
        .select('*')
        .order('posicao')

      if (error) throw error

      ranking.value = data || []
    } catch (error) {
      console.error('Erro ao buscar ranking:', error)
      ranking.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchMinhaColecao = async () => {
    const authStore = useAuthStore()
    if (!authStore.isAuthenticated) return

    try {
      const { data, error } = await supabase
        .from('usuario_colecao')
        .select('*')
        .eq('usuario_id', authStore.user.id)
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = not found
        throw error
      }

      minhaColecao.value = data || {
        total_cartas: 0,
        cartas_comuns: 0,
        cartas_raras: 0,
        cartas_epicas: 0,
        cartas_lendarias: 0,
        percentual_completo: 0
      }
    } catch (error) {
      console.error('Erro ao buscar minha coleção:', error)
    }
  }

  const salvarRankingDiario = async () => {
    loading.value = true
    try {
      // Buscar dados atualizados do ranking
      const { data: rankingAtual, error } = await supabase
        .from('ranking_atual')
        .select('*')
        .order('posicao')

      if (error) throw error

      // Salvar snapshot do ranking na tabela ranking
      const rankingParaSalvar = rankingAtual.map(user => ({
        usuario_id: user.usuario_id,
        posicao: user.posicao,
        pontos: user.pontos_totais,
        total_cartas: user.total_cartas,
        cartas_raras: user.cartas_raras,
        cartas_epicas: user.cartas_epicas,
        cartas_lendarias: user.cartas_lendarias,
        data_calculo: new Date().toISOString().split('T')[0] // Apenas a data
      }))

      const { error: salvarError } = await supabase
        .from('ranking')
        .upsert(rankingParaSalvar, {
          onConflict: 'usuario_id,data_calculo'
        })

      if (salvarError) throw salvarError


    } catch (error) {
      console.error('Erro ao salvar ranking diário:', error)
    } finally {
      loading.value = false
    }
  }

  const buscarHistoricoRanking = async (diasAtras = 30) => {
    try {
      const dataInicio = new Date()
      dataInicio.setDate(dataInicio.getDate() - diasAtras)

      const { data, error } = await supabase
        .from('ranking')
        .select(`
          data_calculo,
          posicao,
          pontos,
          total_cartas,
          usuarios!ranking_usuario_id_fkey (
            nome
          )
        `)
        .gte('data_calculo', dataInicio.toISOString().split('T')[0])
        .order('data_calculo', { ascending: false })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Erro ao buscar histórico de ranking:', error)
      return []
    }
  }

  const buscarEvolucaoUsuario = async (usuarioId, diasAtras = 30) => {
    try {
      const dataInicio = new Date()
      dataInicio.setDate(dataInicio.getDate() - diasAtras)

      const { data, error } = await supabase
        .from('ranking')
        .select('data_calculo, posicao, pontos, total_cartas')
        .eq('usuario_id', usuarioId)
        .gte('data_calculo', dataInicio.toISOString().split('T')[0])
        .order('data_calculo', { ascending: true })

      if (error) throw error

      return data || []
    } catch (error) {
      console.error('Erro ao buscar evolução do usuário:', error)
      return []
    }
  }

  // Actions para paginação
  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const previousPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  const goToMyPosition = () => {
    const position = minhaPosicao.value
    if (position) {
      const page = Math.ceil(position / itemsPerPage.value)
      setPage(page)
    }
  }

  return {
    // Estado
    ranking,
    loading,
    minhaColecao,
    currentPage,
    itemsPerPage,

    // Getters
    top10,
    minhaPosicao,
    estatisticasGerais,
    totalPages,
    paginatedRanking,

    // Actions
    fetchRanking,
    fetchMinhaColecao,
    salvarRankingDiario,
    buscarHistoricoRanking,
    buscarEvolucaoUsuario,
    setPage,
    nextPage,
    previousPage,
    goToMyPosition
  }
})