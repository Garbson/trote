// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL e Anon Key são obrigatórios')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Tipos auxiliares para TypeScript (opcional)
export const RARIDADE = {
  COMUM: 'comum',
  RARO: 'raro',
  EPICO: 'epico',
  LENDARIO: 'lendario'
}

export const METODO_OBTENCAO = {
  QR_CODE: 'qr_code',
  CODIGO_MANUAL: 'codigo_manual'
}