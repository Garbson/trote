// src/utils/cloudinary.js
class CloudinaryUploader {
  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!this.cloudName || !this.uploadPreset) {
      console.error('❌ Configurações do Cloudinary não encontradas no .env')
      console.log('VITE_CLOUDINARY_CLOUD_NAME:', this.cloudName)
      console.log('VITE_CLOUDINARY_UPLOAD_PRESET:', this.uploadPreset)
    } else {
      console.log('✅ Cloudinary configurado com sucesso')
    }

    this.apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`
  }

  async uploadImage(file) {
    try {
      console.log('🚀 Iniciando upload para Cloudinary...')

      // Validações básicas
      if (!file) {
        throw new Error('Arquivo não fornecido')
      }

      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        throw new Error('Arquivo deve ser uma imagem')
      }

      // Verificar tamanho (máximo 10MB)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('Arquivo muito grande (máximo 10MB)')
      }

      // Criar FormData para o upload
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', this.uploadPreset)
      formData.append('folder', 'bixo-royale/cartas')

      console.log('📤 Enviando para:', this.apiUrl)
      console.log('📁 Upload preset:', this.uploadPreset)

      // Fazer upload
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Erro na resposta:', errorText)
        throw new Error(`Erro no upload: ${response.status} - ${errorText}`)
      }

      const result = await response.json()
      console.log('✅ Upload bem-sucedido:', result)

      // Retornar informações úteis
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        size: result.bytes,
        format: result.format
      }

    } catch (error) {
      console.error('❌ Erro no upload para Cloudinary:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

// Criar instância e exportar
export const cloudinaryUploader = new CloudinaryUploader()