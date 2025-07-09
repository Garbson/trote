// src/stores/auth.js
import { supabase } from '@/lib/supabase'
import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { computed, ref } from 'vue'


export const useAuthStore = defineStore('auth', () => {
  // Estado
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userProfile = computed(() => user.value)

  // Actions
  const signUp = async (email, password, nome) => {
    loading.value = true
    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      })

      if (authError) throw authError

      // 2. Criar perfil na tabela usuarios
      if (authData.user) {
        // Primeira tentativa: inserção direta
        let { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            id: authData.user.id,
            nome,
            email,
            senha_hash: 'supabase_managed',
            pontos_totais: 0,
            nivel: 1
          })

        // Se falhar por RLS, usar função que bypassa RLS
        if (profileError) {
          console.log('Tentativa direta falhou, usando função...', profileError)

          const { error: functionError } = await supabase.rpc('criar_usuario_completo', {
            user_id: authData.user.id,
            user_email: email,
            user_nome: nome
          })

          if (functionError) {
            console.error('Erro ao criar perfil via função:', functionError)
            // Não falha o cadastro se o perfil não for criado
          }
        }
      }

      Notify.create({
        type: 'positive',
        message: 'Cadastro realizado! Verifique seu email.'
      })

      return { data: authData, error: null }
    } catch (error) {
      console.error('Erro no cadastro:', error)
      Notify.create({
        type: 'negative',
        message: error.message || 'Erro ao criar conta'
      })
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email, password) => {
    loading.value = true
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Buscar dados do perfil do usuário
      await fetchUserProfile()

      Notify.create({
        type: 'positive',
        message: 'Login realizado com sucesso!'
      })

      return { data, error: null }
    } catch (error) {
      console.error('Erro no login:', error)
      Notify.create({
        type: 'negative',
        message: error.message || 'Erro ao fazer login'
      })
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      user.value = null
      session.value = null

      Notify.create({
        type: 'positive',
        message: 'Logout realizado com sucesso!'
      })
    } catch (error) {
      console.error('Erro no logout:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao fazer logout'
      })
    } finally {
      loading.value = false
    }
  }

  const fetchUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser()

      if (authUser) {
        const { data: profile, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', authUser.id)
          .single()

        if (error) {
          console.error('Erro ao buscar perfil:', error)
          // Se não encontrar o perfil, tentar criar
          if (error.code === 'PGRST116') { // Not found
            console.log('Perfil não encontrado, tentando criar...')
            await supabase.rpc('criar_usuario_completo', {
              user_id: authUser.id,
              user_email: authUser.email,
              user_nome: authUser.email.split('@')[0] // Nome padrão
            })
            // Tentar buscar novamente
            const { data: newProfile } = await supabase
              .from('usuarios')
              .select('*')
              .eq('id', authUser.id)
              .single()
            user.value = newProfile
          }
          return
        }

        user.value = profile
      }
    } catch (error) {
      console.error('Erro ao buscar perfil do usuário:', error)
    }
  }

  const updateProfile = async (updates) => {
    loading.value = true
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .update(updates)
        .eq('id', user.value.id)
        .select()
        .single()

      if (error) throw error

      user.value = { ...user.value, ...data }

      Notify.create({
        type: 'positive',
        message: 'Perfil atualizado com sucesso!'
      })

      return { data, error: null }
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      Notify.create({
        type: 'negative',
        message: 'Erro ao atualizar perfil'
      })
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const initAuth = () => {
    // Configurar listener para mudanças na autenticação
    supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log('Auth state changed:', event, newSession?.user?.email)
      session.value = newSession

      if (event === 'SIGNED_IN' && newSession?.user) {
        await fetchUserProfile()

        // Carregar cartas do usuário após login/restauração da sessão
        try {
          const { useCartasStore } = await import('./cartas')
          const cartasStore = useCartasStore()
          await cartasStore.fetchCartasUsuario()
        } catch (error) {
          console.error('Erro ao carregar cartas do usuário:', error)
        }

      } else if (event === 'SIGNED_OUT') {
        user.value = null
        session.value = null
      }
    })

    // Verifica sessão existente na inicialização
    const initializeSession = async () => {
      try {
        const { data: { session: existingSession } } = await supabase.auth.getSession()

        if (existingSession) {
          console.log('Sessão existente encontrada:', existingSession.user.email)
          session.value = existingSession
          await fetchUserProfile()

          // Carregar cartas do usuário na restauração da sessão
          try {
            const { useCartasStore } = await import('./cartas')
            const cartasStore = useCartasStore()
            await cartasStore.fetchCartasUsuario()
          } catch (error) {
            console.error('Erro ao carregar cartas do usuário na inicialização:', error)
          }
        } else {
          console.log('Nenhuma sessão ativa encontrada')
        }
      } catch (error) {
        console.error('Erro ao inicializar sessão:', error)
      }
    }

    initializeSession()
  }

  return {
    // Estado
    user,
    session,
    loading,

    // Getters
    isAuthenticated,
    userProfile,

    // Actions
    signUp,
    signIn,
    signOut,
    fetchUserProfile,
    updateProfile,
    initAuth
  }
})