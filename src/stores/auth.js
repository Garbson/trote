// src/stores/auth.js
import { supabase } from '@/lib/supabase'
import { defineStore } from 'pinia'
import { Notify } from 'quasar'
import { computed, ref, watch } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // Estado - SEMPRE inicializar loadings como false
  const user = ref(null)
  const session = ref(null)
  const loading = ref(false)
  const googleLoading = ref(false)
  const initialized = ref(false)

  // Garantir que loadings sempre iniciem como false
  loading.value = false
  googleLoading.value = false

  // Watch para garantir que loadings sejam resetados após inicialização
  watch(initialized, (isInit) => {
    if (isInit) {
      // Após inicialização, qualquer loading deve ser resetado
      setTimeout(() => {
        loading.value = false
        googleLoading.value = false
      }, 50)
    }
  })

  // Getters
  const isAuthenticated = computed(() => !!session.value && !!user.value)
  const userProfile = computed(() => user.value)

  // Função para salvar estado no localStorage
  const saveToStorage = () => {
    try {
      if (user.value && session.value) {
        localStorage.setItem('bixo_user', JSON.stringify(user.value))
        localStorage.setItem('bixo_session', JSON.stringify(session.value))
      }
    } catch (error) {
      console.error('Erro ao salvar no localStorage:', error)
    }
  }

  // Função para carregar estado do localStorage
  const loadFromStorage = () => {
    try {
      const savedUser = localStorage.getItem('bixo_user')
      const savedSession = localStorage.getItem('bixo_session')
      
      if (savedUser && savedSession) {
        user.value = JSON.parse(savedUser)
        session.value = JSON.parse(savedSession)
        return true
      }
    } catch (error) {
      console.error('Erro ao carregar do localStorage:', error)
      clearStorage()
    }
    return false
  }

  // Função para limpar localStorage
  const clearStorage = () => {
    try {
      localStorage.removeItem('bixo_user')
      localStorage.removeItem('bixo_session')
    } catch (error) {
      console.error('Erro ao limpar localStorage:', error)
    }
  }

  // Função auxiliar para criar perfil de usuário
  const createUserProfile = async (userId, email, nome = null) => {
    try {
      // Se não tiver nome, extrair do email
      const userName = nome || email.split('@')[0]

      // Primeira tentativa: inserção direta
      let { error: profileError } = await supabase
        .from('usuarios')
        .insert({
          id: userId,
          nome: userName,
          email,
          senha_hash: 'supabase_managed',
          pontos_totais: 0,
          nivel: 1
        })

      // Se falhar por RLS, usar função que bypassa RLS
      if (profileError) {
        const { error: functionError } = await supabase.rpc('criar_usuario_completo', {
          user_id: userId,
          user_email: email,
          user_nome: userName
        })

        if (functionError) {
          console.error('Erro ao criar perfil via função:', functionError)
        }
      }
    } catch (error) {
      console.error('Erro ao criar perfil do usuário:', error)
    }
  }

  // Actions
  const signUp = async (email, password, nome) => {
    loading.value = true
    try {
      // 1. Criar usuário no Supabase Auth (sem confirmação de email)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: undefined // Não redirecionar para confirmação
        }
      })

      if (authError) throw authError

      // 2. Se o usuário foi criado, definir sessão imediatamente
      if (authData.user && authData.session) {
        session.value = authData.session

        // 3. Criar perfil na tabela usuarios
        await createUserProfile(authData.user.id, email, nome)

        // 4. Buscar perfil criado
        await fetchUserProfile()

        // 5. Salvar no localStorage
        saveToStorage()

        Notify.create({
          type: 'positive',
          message: 'Conta criada com sucesso! Bem-vindo!'
        })
      } else {
        // Se não houver sessão, significa que precisa confirmação
        Notify.create({
          type: 'positive',
          message: 'Cadastro realizado! Você já pode fazer login.'
        })
      }

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

      // Definir sessão e buscar perfil
      session.value = data.session
      await fetchUserProfile()

      // Salvar no localStorage
      saveToStorage()

      Notify.create({
        type: 'positive',
        message: 'Login realizado com sucesso!'
      })

      return { data, error: null }
    } catch (error) {
      console.error('❌ Erro no login:', error)
      clearStorage()
      Notify.create({
        type: 'negative',
        message: error.message || 'Erro ao fazer login'
      })
      return { data: null, error }
    } finally {
      loading.value = false
    }
  }

  const signInWithGoogle = async () => {
    googleLoading.value = true
    try {
      // SEMPRE redirecionar para home após login Google
      const baseUrl = window.location.origin
      const redirectUrl = `${baseUrl}/home`

      console.log('🔗 window.location.origin:', window.location.origin)
      console.log('🔗 URL de redirecionamento completa:', redirectUrl)
      console.log('🔗 Ambiente detectado:', baseUrl.includes('localhost') ? 'desenvolvimento' : 'produção')

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // FORÇAR redirectTo para localhost durante desenvolvimento
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        console.error('❌ Erro no OAuth:', error)
        throw error
      }

      console.log('✅ OAuth iniciado com sucesso')

      // Não resetar o loading aqui pois o usuário será redirecionado
      // O loading será resetado no onAuthStateChange ou no initAuth
      return { data, error: null }
    } catch (error) {
      console.error('❌ Erro no login com Google:', error)
      googleLoading.value = false

      let errorMessage = 'Erro ao fazer login com Google'

      // Mensagens de erro mais específicas
      if (error.message?.includes('redirect_uri_mismatch')) {
        errorMessage = 'URL de redirecionamento não configurada. Verifique as configurações do Google OAuth.'
      } else if (error.message?.includes('unauthorized_client')) {
        errorMessage = 'Cliente não autorizado. Verifique as credenciais do Google.'
      }

      Notify.create({
        type: 'negative',
        message: errorMessage
      })
      return { data: null, error }
    }
  }

  const signOut = async () => {
    loading.value = true
    try {
      // Primeiro limpar estado local independentemente da resposta do Supabase
      const currentUser = user.value
      const currentSession = session.value

      // Tentar fazer logout no Supabase
      try {
        const { error } = await supabase.auth.signOut()
        if (error && error.message !== 'Auth session missing!') {
          console.warn('⚠️ Aviso no logout:', error)
          // Não falhar se for apenas sessão ausente
        }
      } catch (supabaseError) {
        console.warn('⚠️ Erro do Supabase no logout (continuando):', supabaseError)
        // Continuar com limpeza local mesmo se Supabase falhar
      }

      // SEMPRE limpar estado local
      user.value = null
      session.value = null
      clearStorage()

      // Notificar sucesso se havia usuário logado
      if (currentUser || currentSession) {
        Notify.create({
          type: 'positive',
          message: 'Logout realizado com sucesso!'
        })
      }

    } catch (error) {
      console.error('❌ Erro crítico no logout:', error)

      // Forçar limpeza mesmo em erro crítico
      user.value = null
      session.value = null
      clearStorage()

      Notify.create({
        type: 'positive',
        message: 'Logout realizado!'
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
          // Se não encontrar o perfil, tentar criar (especialmente útil para login Google)
          if (error.code === 'PGRST116') { // Not found
            // Extrair nome do metadata do Google ou usar email
            const nomeUsuario = authUser.user_metadata?.full_name ||
                               authUser.user_metadata?.name ||
                               authUser.email.split('@')[0]

            await createUserProfile(authUser.id, authUser.email, nomeUsuario)

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
      saveToStorage() // Atualizar localStorage

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

  const initAuth = async () => {
    if (initialized.value) {
      return
    }

    // SEMPRE resetar loading states ao inicializar
    // Importante para casos de OAuth redirect onde a página recarrega
    loading.value = false
    googleLoading.value = false

    try {
      // 1. Verificar se há dados no localStorage
      const hasStoredData = loadFromStorage()

      // 2. Verificar sessão no Supabase
      const { data: { session: supabaseSession }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('❌ Erro ao verificar sessão:', error)
        clearStorage()
        return
      }

      if (supabaseSession) {
        // Resetar loading states quando sessão válida for encontrada
        loading.value = false
        googleLoading.value = false

        session.value = supabaseSession
        await fetchUserProfile()
        saveToStorage()

        // Carregar cartas do usuário na restauração da sessão
        try {
          const { useCartasStore } = await import('./cartas')
          const cartasStore = useCartasStore()
          await cartasStore.fetchCartasUsuario()
        } catch (error) {
          console.error('❌ Erro ao carregar cartas:', error)
        }
      } else {
        // Resetar loading states quando não há sessão
        loading.value = false
        googleLoading.value = false
        clearStorage()
        user.value = null
        session.value = null
      }

      // 3. Configurar listener para mudanças na autenticação
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        console.log('🔔 AUTH STATE CHANGE:', event, newSession?.user?.email || 'sem usuário')

        if (event === 'SIGNED_IN' && newSession?.user) {
          // Resetar loading states quando o login for bem-sucedido
          googleLoading.value = false
          loading.value = false

          session.value = newSession
          await fetchUserProfile()
          saveToStorage()

          // Carregar cartas do usuário após login
          try {
            const { useCartasStore } = await import('./cartas')
            const cartasStore = useCartasStore()
            await cartasStore.fetchCartasUsuario()
          } catch (error) {
            console.error('❌ Erro ao carregar cartas após login:', error)
          }

          // SEMPRE redirecionar para home após login bem-sucedido
          const currentPath = window.location.pathname
          console.log('🏠 Login detectado! Página atual:', currentPath)

          // Se estiver em qualquer página que não seja /home, redirecionar IMEDIATAMENTE
          if (currentPath !== '/home') {
            console.log('🔄 Redirecionamento IMEDIATO para /home...')
            // Redirecionamento duplo para garantir
            window.location.href = '/home'
            // Backup com router se disponível
            try {
              if (window.$router) {
                window.$router.push('/home')
              }
            } catch (e) {
              // Silenciar erro de router
            }
          }

        } else if (event === 'SIGNED_OUT') {
          // Resetar loading states quando fazer logout
          googleLoading.value = false
          loading.value = false
          user.value = null
          session.value = null
          clearStorage()
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          session.value = newSession
          saveToStorage()
        }
      })

      initialized.value = true

    } catch (error) {
      console.error('❌ Erro crítico ao inicializar auth:', error)
      clearStorage()
      user.value = null
      session.value = null
      loading.value = false
      googleLoading.value = false
    } finally {
      // Garantir que os loadings sejam sempre resetados ao final da inicialização
      loading.value = false
      googleLoading.value = false
    }
  }

  return {
    // Estado
    user,
    session,
    loading,
    googleLoading,
    initialized,

    // Getters
    isAuthenticated,
    userProfile,

    // Actions
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    fetchUserProfile,
    updateProfile,
    initAuth
  }
}, {
  persist: {
    key: 'bixo-auth-store',
    storage: localStorage,
    // Apenas persistir user e session, NUNCA os loadings
    paths: ['user', 'session'],
    afterRestore: (ctx) => {
      // SEMPRE resetar loadings após restaurar do localStorage
      ctx.store.loading = false
      ctx.store.googleLoading = false
      console.log('🔄 Estados de loading resetados após restauração')
    }
  }
})