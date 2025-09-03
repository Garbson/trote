// src/stores/adminUsers.js
import { supabase } from '@/lib/supabase'
import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { computed, ref } from 'vue'

export const useAdminUsersStore = defineStore('adminUsers', () => {
  // Estado
  const usuarios = ref([])
  const loading = ref(false)
  const estatisticasUsuarios = ref({
    total: 0,
    ativos: 0,
    admins: 0,
    topColetores: 0
  })

  // Getters
  const usuariosAtivos = computed(() =>
    usuarios.value.filter(user => user.ativo)
  )

  const usuariosAdmins = computed(() =>
    usuarios.value.filter(user => user.is_admin)
  )

  // Actions
  const fetchUsuarios = async () => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          usuario_cartas!inner(
            carta_id,
            cartas!inner(
              id,
              nome,
              raridade,
              pontos_valor
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Processar dados dos usuários com estatísticas de cartas
      const usuariosProcessados = (data || []).map(usuario => {
        const cartasUsuario = usuario.usuario_cartas || []
        return {
          ...usuario,
          total_cartas: cartasUsuario.length,
          cartas_raras: cartasUsuario.filter(uc => uc.cartas?.raridade === 'raro').length,
          cartas_epicas: cartasUsuario.filter(uc => uc.cartas?.raridade === 'epico').length,
          cartas_lendarias: cartasUsuario.filter(uc => uc.cartas?.raridade === 'lendario').length
        }
      })

      usuarios.value = usuariosProcessados

      // Calcular estatísticas
      estatisticasUsuarios.value = {
        total: usuariosProcessados.length,
        ativos: usuariosProcessados.filter(u => u.ativo).length,
        admins: usuariosProcessados.filter(u => u.is_admin).length,
        topColetores: usuariosProcessados.filter(u => u.pontos_totais > 1000).length
      }

      return { success: true, data: usuariosProcessados }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao carregar usuários'
      })
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const buscarUsuarios = async (termo) => {
    loading.value = true
    try {
      let query = supabase
        .from('usuarios')
        .select(`
          *,
          usuario_cartas!inner(
            carta_id,
            cartas!inner(
              id,
              nome,
              raridade,
              pontos_valor
            )
          )
        `)

      if (termo && termo.trim()) {
        query = query.or(`nome.ilike.%${termo}%,email.ilike.%${termo}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      // Processar dados
      const usuariosProcessados = (data || []).map(usuario => {
        const cartasUsuario = usuario.usuario_cartas || []
        return {
          ...usuario,
          total_cartas: cartasUsuario.length,
          cartas_raras: cartasUsuario.filter(uc => uc.cartas?.raridade === 'raro').length,
          cartas_epicas: cartasUsuario.filter(uc => uc.cartas?.raridade === 'epico').length,
          cartas_lendarias: cartasUsuario.filter(uc => uc.cartas?.raridade === 'lendario').length
        }
      })

      usuarios.value = usuariosProcessados
      return { success: true, data: usuariosProcessados }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const alterarStatusUsuario = async (usuarioId, novoStatus) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          ativo: novoStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', usuarioId)
        .select()
        .single()

      if (error) throw error

      // Atualizar lista local
      await fetchUsuarios()

      Notify.create({
        type: 'positive',
        message: `Usuário ${novoStatus ? 'ativado' : 'desativado'} com sucesso!`
      })

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao alterar status do usuário:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao alterar status do usuário'
      })
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const alterarPermissaoAdmin = async (usuarioId, isAdmin) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update({
          is_admin: isAdmin,
          updated_at: new Date().toISOString()
        })
        .eq('id', usuarioId)
        .select()
        .single()

      if (error) throw error

      // Atualizar lista local
      await fetchUsuarios()

      Notify.create({
        type: 'positive',
        message: `Permissões de admin ${isAdmin ? 'concedidas' : 'removidas'} com sucesso!`
      })

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao alterar permissões de admin:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao alterar permissões de admin'
      })
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const obterDetalhesUsuario = async (usuarioId) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          *,
          usuario_cartas(
            *,
            cartas(
              id,
              nome,
              foto_url,
              raridade,
              pontos_valor,
              descricao
            )
          )
        `)
        .eq('id', usuarioId)
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erro ao buscar detalhes do usuário:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao carregar detalhes do usuário'
      })
      return { success: false, error: error.message }
    } finally {
      loading.value = false
    }
  }

  const exportarUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select(`
          nome,
          email,
          pontos_totais,
          nivel,
          ativo,
          is_admin,
          created_at
        `)
        .order('pontos_totais', { ascending: false })

      if (error) throw error

      // Converter para CSV
      const headers = ['Nome', 'Email', 'Pontos', 'Nível', 'Ativo', 'Admin', 'Data Cadastro']
      const csvContent = [
        headers.join(','),
        ...data.map(user => [
          `"${user.nome}"`,
          `"${user.email}"`,
          user.pontos_totais,
          user.nivel,
          user.ativo ? 'Sim' : 'Não',
          user.is_admin ? 'Sim' : 'Não',
          new Date(user.created_at).toLocaleDateString('pt-BR')
        ].join(','))
      ].join('\n')

      // Download do arquivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `usuarios_arca_${new Date().toISOString().split('T')[0]}.csv`
      link.click()

      Notify.create({
        type: 'positive',
        message: 'Dados dos usuários exportados com sucesso!'
      })

      return { success: true }
    } catch (error) {
      console.error('Erro ao exportar usuários:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao exportar dados dos usuários'
      })
      return { success: false, error: error.message }
    }
  }

  return {
    // Estado
    usuarios,
    loading,
    estatisticasUsuarios,

    // Getters
    usuariosAtivos,
    usuariosAdmins,

    // Actions
    fetchUsuarios,
    buscarUsuarios,
    alterarStatusUsuario,
    alterarPermissaoAdmin,
    obterDetalhesUsuario,
    exportarUsuarios
  }
})
