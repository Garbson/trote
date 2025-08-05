// src/utils/cloudinary.js
class CloudinaryUploader {
  constructor() {
    this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

    if (!this.cloudName || !this.uploadPreset) {
      console.error('❌ Configurações do Cloudinary não encontradas no .env')
    }

    this.apiUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`
  }

  // Função para comprimir imagem
  async compressImage(file, quality = 0.8, maxWidth = 800, maxHeight = 800) {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()

      img.onload = () => {
        // Calcular novas dimensões mantendo proporção
        let { width, height } = img
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        canvas.width = width
        canvas.height = height

        // Desenhar imagem redimensionada
        ctx.drawImage(img, 0, 0, width, height)

        // Converter para blob comprimido
        canvas.toBlob(resolve, file.type, quality)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Validação robusta de imagem
  validateImage(file) {
    const errors = []

    // Verificar se arquivo existe
    if (!file) {
      errors.push('Arquivo não fornecido')
      return { valid: false, errors }
    }

    // Verificar se é uma imagem
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      errors.push('Formato não suportado. Use JPEG, PNG ou WebP')
    }

    // Verificar tamanho (máximo 10MB)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      errors.push('Arquivo muito grande (máximo 10MB)')
    }

    // Verificar tamanho mínimo (para evitar imagens muito pequenas)
    const minSize = 1024 // 1KB
    if (file.size < minSize) {
      errors.push('Arquivo muito pequeno (mínimo 1KB)')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Gerar preview da imagem
  generatePreview(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      
      reader.onerror = () => {
        reject(new Error('Erro ao gerar preview da imagem'))
      }
      
      reader.readAsDataURL(file)
    })
  }

  async uploadImage(file, options = {}) {
    try {
      // Opções padrão
      const {
        compress = true,
        quality = 0.8,
        maxWidth = 800,
        maxHeight = 800,
        folder = 'bixo-royale/cartas'
      } = options

      // Validação robusta
      const validation = this.validateImage(file)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }

      let fileToUpload = file

      // Comprimir imagem se solicitado
      if (compress && file.size > 500 * 1024) { // Comprimir se maior que 500KB
        console.log('🔄 Comprimindo imagem...')
        fileToUpload = await this.compressImage(file, quality, maxWidth, maxHeight)
        
        if (!fileToUpload) {
          throw new Error('Erro na compressão da imagem')
        }

        console.log(`✅ Imagem comprimida: ${Math.round(file.size / 1024)}KB → ${Math.round(fileToUpload.size / 1024)}KB`)
      }

      // Criar FormData para o upload
      const formData = new FormData()
      formData.append('file', fileToUpload)
      formData.append('upload_preset', this.uploadPreset)
      formData.append('folder', folder)

      console.log('📤 Iniciando upload para Cloudinary...')

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

      console.log('✅ Upload concluído com sucesso!')

      // Retornar informações úteis
      return {
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        size: result.bytes,
        format: result.format,
        originalSize: file.size,
        compressedSize: fileToUpload.size,
        compressionRatio: Math.round((1 - fileToUpload.size / file.size) * 100)
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