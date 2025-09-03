<template>
  <div class="animals-content">
    <div class="page-header">
      <h3 class="page-title">🦁 Gerenciar Animais da Arca</h3>
      <p class="page-subtitle">Adicione, edite e remova animais da coleção</p>
    </div>

    <!-- Formulário de adição -->
    <q-card class="add-form-card">
      <q-card-section>
        <h5 class="form-title">➕ Adicionar Novo Animal</h5>

        <!-- ETAPA 1: Upload da Imagem (OBRIGATÓRIO PRIMEIRO) -->
        <div class="upload-section">
          <div class="upload-header">
            <h6 class="upload-title">📸 1. Selecione a Foto do Animal</h6>
            <p class="upload-subtitle">
              Primeiro faça o upload da imagem para continuar
            </p>
          </div>

          <q-card
            class="upload-card"
            :class="{ 'upload-success': novaAnimal.foto_url }"
          >
            <q-card-section>
              <div class="photo-upload-container">
                <!-- Preview da imagem -->
                <div
                  v-if="imagePreview || novaAnimal.foto_url"
                  class="image-preview-large"
                >
                  <q-img
                    :src="imagePreview || novaAnimal.foto_url"
                    style="height: 200px; width: 200px"
                    class="rounded-borders"
                  />
                  <q-btn
                    flat
                    round
                    icon="close"
                    size="sm"
                    color="negative"
                    class="remove-image-btn"
                    @click="removerImagem"
                  >
                    <q-tooltip>Remover imagem</q-tooltip>
                  </q-btn>
                </div>

                <!-- Estado sem imagem -->
                <div v-else class="upload-placeholder">
                  <q-icon name="photo_camera" size="48px" color="grey-5" />
                  <p class="upload-placeholder-text">Selecione uma foto</p>
                </div>

                <!-- Botões de ação -->
                <div class="upload-actions">
                  <q-btn
                    @click="selecionarImagem"
                    :loading="uploadingImage"
                    color="primary"
                    :label="novaAnimal.foto_url ? 'Trocar' : 'Selecionar'"
                    size="md"
                    class="upload-btn"
                    rounded
                  />

                  <!-- Input file escondido -->
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleImageUpload"
                  />

                  <div v-if="uploadingImage" class="upload-progress">
                    <q-linear-progress indeterminate color="primary" />
                    <p class="upload-progress-text">Carregando...</p>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- ETAPA 2: Informações do Animal (HABILITADO APÓS UPLOAD) -->
        <div
          class="form-section"
          :class="{ 'form-disabled': !novaAnimal.foto_url }"
        >
          <div class="form-header">
            <h6 class="form-section-title">📝 2. Informações do Animal</h6>
            <p v-if="!novaAnimal.foto_url" class="form-disabled-text">
              ⚠️ Faça o upload da imagem primeiro para continuar
            </p>
          </div>

          <div class="form-grid" :class="{ disabled: !novaAnimal.foto_url }">
            <q-input
              v-model="novaAnimal.nome"
              label="Nome do Animal"
              outlined
              dense
              placeholder="Ex: Leão Dourado"
              class="form-input"
              :rules="[(val) => !!val || 'Nome é obrigatório']"
              :disable="!novaAnimal.foto_url"
              @input="onNomeChange"
            >
              <template v-slot:prepend>
                <q-icon name="pets" />
              </template>
            </q-input>

            <q-select
              v-model="novaAnimal.raridade"
              :options="raridadeOptions"
              label="Raridade"
              outlined
              dense
              emit-value
              map-options
              class="form-input"
              :disable="!novaAnimal.foto_url"
            >
              <template v-slot:prepend>
                <q-icon name="star" />
              </template>
            </q-select>

            <q-input
              v-model.number="novaAnimal.pontos_valor"
              label="Pontos"
              type="number"
              outlined
              dense
              min="1"
              class="form-input"
              :disable="!novaAnimal.foto_url"
            >
              <template v-slot:prepend>
                <q-icon name="stars" />
              </template>
            </q-input>

            <q-input
              v-model="novaAnimal.codigo_unico"
              label="Código Único"
              outlined
              dense
              placeholder="Ex: LEO001 (gerado automaticamente)"
              class="form-input"
              :rules="[(val) => !!val || 'Código único é obrigatório']"
              :disable="!novaAnimal.foto_url"
              readonly
            >
              <template v-slot:prepend>
                <q-icon name="qr_code" />
              </template>
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  icon="refresh"
                  @click="gerarCodigoUnico"
                  color="primary"
                  size="sm"
                  :disable="!novaAnimal.foto_url"
                >
                  <q-tooltip>Gerar novo código</q-tooltip>
                </q-btn>
              </template>
            </q-input>

            <q-input
              v-model="novaAnimal.descricao"
              label="Descrição do Animal"
              outlined
              dense
              type="textarea"
              rows="2"
              placeholder="Ex: O leão é conhecido como o rei da selva..."
              class="form-input full-width"
              :disable="!novaAnimal.foto_url"
            >
              <template v-slot:prepend>
                <q-icon name="description" />
              </template>
            </q-input>
          </div>

          <div class="form-actions">
            <q-btn
              @click="adicionarAnimal"
              :loading="loading || uploadingImage"
              :disable="!isFormValid"
              color="primary"
              icon="add"
              label="Adicionar Animal"
              size="md"
              class="add-btn"
            />
            <q-btn
              @click="resetForm"
              flat
              color="grey"
              icon="refresh"
              label="Limpar"
              size="md"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>

    <!-- Tabela de animais -->
    <q-card class="animals-table-card">
      <q-card-section>
        <div class="table-header">
          <h5 class="table-title">📋 Lista de Animais</h5>
          <q-btn
            @click="$emit('refresh-animals')"
            flat
            round
            icon="refresh"
            color="primary"
            :loading="loading"
          >
            <q-tooltip>Atualizar lista</q-tooltip>
          </q-btn>
        </div>

        <q-table
          :rows="animals"
          :columns="columns"
          :loading="loading"
          row-key="id"
          :rows-per-page-options="[10, 25, 50]"
          class="animals-table"
        >
          <template v-slot:body-cell-imagem="props">
            <q-td :props="props">
              <q-avatar size="40px">
                <q-img :src="props.value || '/img/default-avatar.jpg'" />
              </q-avatar>
            </q-td>
          </template>

          <template v-slot:body-cell-raridade="props">
            <q-td :props="props">
              <q-chip
                :color="getRaridadeColor(props.value)"
                text-color="white"
                size="sm"
                :icon="getRaridadeIcon(props.value)"
              >
                {{ formatRaridade(props.value) }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-chip
                :color="props.value ? 'green' : 'grey'"
                text-color="white"
                size="sm"
                :icon="props.value ? 'check_circle' : 'radio_button_unchecked'"
              >
                {{ props.value ? "Ativo" : "Inativo" }}
              </q-chip>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                icon="edit"
                color="primary"
                size="sm"
                @click="$emit('edit-animal', props.row)"
              >
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                icon="delete"
                color="negative"
                size="sm"
                @click="$emit('delete-animal', props.row)"
              >
                <q-tooltip>Excluir</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { cloudinaryUploader } from "@/utils/cloudinary";
import { useQuasar } from "quasar";
import { computed, reactive, ref } from "vue";

// Props
const props = defineProps({
  animals: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits([
  "add-animal",
  "edit-animal",
  "delete-animal",
  "refresh-animals",
]);

// Quasar
const $q = useQuasar();

// Estado local
const uploadingImage = ref(false);
const imagePreview = ref("");
const fileInput = ref(null);

// Estado local
const novaAnimal = reactive({
  nome: "",
  descricao: "",
  foto_url: "",
  raridade: "comum",
  pontos_valor: 10,
  codigo_unico: "",
  ativa: true,
});

// Computed
const isFormValid = computed(() => {
  return (
    novaAnimal.foto_url.trim().length > 0 && // Imagem é obrigatória primeiro
    novaAnimal.nome.trim().length >= 2 &&
    novaAnimal.codigo_unico.trim().length >= 3 &&
    novaAnimal.pontos_valor > 0 &&
    !uploadingImage.value // Não pode estar fazendo upload
  );
});

// Opções
const raridadeOptions = [
  { label: "Comum", value: "comum" },
  { label: "Raro", value: "raro" },
  { label: "Épico", value: "epico" },
  { label: "Lendário", value: "lendario" },
];

// Colunas da tabela
const columns = [
  {
    name: "imagem",
    label: "Imagem",
    field: "foto_url",
    align: "center",
    sortable: false,
  },
  {
    name: "nome",
    label: "Nome",
    field: "nome",
    align: "left",
    sortable: true,
  },
  {
    name: "raridade",
    label: "Raridade",
    field: "raridade",
    align: "center",
    sortable: true,
  },
  {
    name: "pontos",
    label: "Pontos",
    field: "pontos_valor",
    align: "center",
    sortable: true,
  },
  {
    name: "codigo",
    label: "Código",
    field: "codigo_unico",
    align: "center",
    sortable: true,
  },
  {
    name: "status",
    label: "Status",
    field: "ativa",
    align: "center",
    sortable: true,
  },
  {
    name: "actions",
    label: "Ações",
    field: "actions",
    align: "center",
    sortable: false,
  },
];

// Methods
const gerarCodigoUnico = () => {
  // Gerar código baseado no nome + timestamp + random
  const nomeBase = novaAnimal.nome.trim().toUpperCase().slice(0, 3) || "ANI";
  const timestamp = Date.now().toString().slice(-4);
  const random = Math.random().toString(36).substring(2, 4).toUpperCase();

  novaAnimal.codigo_unico = `${nomeBase}${timestamp}${random}`;
};

const selecionarImagem = () => {
  if (fileInput.value) {
    fileInput.value.click();
  }
};

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  // Validar arquivo
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    $q.notify({
      type: "negative",
      message: "Formato não suportado. Use JPEG, PNG ou WebP",
    });
    return;
  }

  // Validar tamanho (máximo 10MB)
  if (file.size > 10 * 1024 * 1024) {
    $q.notify({
      type: "negative",
      message: "Arquivo muito grande. Máximo 10MB",
    });
    return;
  }

  try {
    uploadingImage.value = true;

    // Gerar preview local
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);

    // Upload para Cloudinary
    $q.notify({
      type: "ongoing",
      message: "Fazendo upload da imagem...",
      timeout: 0,
      group: "upload",
    });

    const resultado = await cloudinaryUploader.uploadImage(file, {
      folder: "arca-de-noe/animais",
      compress: true,
      maxWidth: 800,
      maxHeight: 800,
    });

    if (resultado.success) {
      novaAnimal.foto_url = resultado.url;

      $q.notify({
        type: "positive",
        message: "Imagem carregada com sucesso!",
        group: "upload",
      });

      // Log para debug
      console.log("✅ Upload concluído:", {
        url: resultado.url,
        size: `${Math.round(resultado.size / 1024)}KB`,
        compression: `${resultado.compressionRatio}%`,
      });
    } else {
      throw new Error(resultado.error);
    }
  } catch (error) {
    console.error("❌ Erro no upload:", error);
    $q.notify({
      type: "negative",
      message: `Erro ao carregar imagem: ${error.message}`,
      group: "upload",
    });

    // Limpar preview em caso de erro
    imagePreview.value = "";
  } finally {
    uploadingImage.value = false;
    // Limpar input para permitir selecionar o mesmo arquivo novamente
    event.target.value = "";
  }
};

const removerImagem = () => {
  novaAnimal.foto_url = "";
  imagePreview.value = "";
};

const adicionarAnimal = async () => {
  if (!isFormValid.value) {
    $q.notify({
      type: "warning",
      message: "Preencha todos os campos obrigatórios",
    });
    return;
  }

  emit("add-animal", { ...novaAnimal });
};

const resetForm = () => {
  Object.assign(novaAnimal, {
    nome: "",
    descricao: "",
    foto_url: "",
    raridade: "comum",
    pontos_valor: 10,
    codigo_unico: "",
    ativa: true,
  });
  imagePreview.value = "";

  // Gerar novo código automaticamente
  setTimeout(() => {
    if (novaAnimal.nome.trim()) {
      gerarCodigoUnico();
    }
  }, 100);
};

// Gerar código quando o nome muda
const onNomeChange = () => {
  if (novaAnimal.nome.trim().length >= 2) {
    gerarCodigoUnico();
  }
};

const getRaridadeColor = (raridade) => {
  const colors = {
    comum: "grey",
    raro: "blue",
    epico: "purple",
    lendario: "orange",
  };
  return colors[raridade] || "grey";
};

const getRaridadeIcon = (raridade) => {
  const icons = {
    comum: "radio_button_unchecked",
    raro: "star_half",
    epico: "star",
    lendario: "stars",
  };
  return icons[raridade] || "radio_button_unchecked";
};

const formatRaridade = (raridade) => {
  const labels = {
    comum: "Comum",
    raro: "Raro",
    epico: "Épico",
    lendario: "Lendário",
  };
  return labels[raridade] || raridade;
};
</script>

<style scoped>
.animals-content {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--arca-wood);
  margin: 0 0 8px 0;
}

.page-subtitle {
  color: #6c757d;
  font-size: 1.1rem;
  margin: 0;
}

.add-form-card,
.animals-table-card {
  border-radius: 16px;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.form-title,
.table-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--arca-wood);
  margin: 0 0 20px 0;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.form-input {
  width: 100%;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-start;
}

.add-btn {
  background: linear-gradient(135deg, var(--arca-wood), var(--arca-gold));
}

/* Upload Section Styles */
.upload-section {
  margin-bottom: 32px;
}

.upload-header {
  text-align: center;
  margin-bottom: 16px;
}

.upload-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--arca-wood);
  margin: 0 0 8px 0;
}

.upload-subtitle {
  color: #6c757d;
  margin: 0;
  font-size: 0.9rem;
}

.upload-card {
  border: 2px dashed #ddd;
  transition: all 0.3s ease;
}

.upload-card.upload-success {
  border-color: var(--arca-gold);
  background: rgba(139, 69, 19, 0.05);
}

.photo-upload-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  width: 100%;
  align-items: center;
}

.image-preview-large {
  position: relative;
  display: inline-block;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  text-align: center;
}

.upload-placeholder-text {
  color: #6c757d;
  font-size: 0.9rem;
  margin: 0;
}

.remove-image-btn {
  position: absolute;
  top: -8px;
  right: -8px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
}

.upload-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}

.upload-btn {
  min-width: 120px;
  max-width: 200px;
  height: 40px;
  font-size: 0.9rem;
  font-weight: 500;
}

.upload-progress {
  width: 200px;
  text-align: center;
}

.upload-progress-text {
  margin: 8px 0 0 0;
  color: var(--arca-wood);
  font-size: 0.9rem;
}

/* Form Section Styles */
.form-section {
  transition: all 0.3s ease;
}

.form-section.form-disabled {
  opacity: 0.5;
  pointer-events: none;
}

.form-header {
  text-align: center;
  margin-bottom: 24px;
}

.form-section-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: var(--arca-wood);
  margin: 0 0 8px 0;
}

.form-disabled-text {
  color: #ff6b35;
  margin: 0;
  font-size: 0.9rem;
  font-weight: 500;
}

.form-grid.disabled {
  opacity: 0.5;
  pointer-events: none;
}

.form-input.full-width {
  grid-column: 1 / -1;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.animals-table {
  border-radius: 8px;
}

@media (max-width: 768px) {
  .animals-content {
    padding: 16px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .upload-btn {
    min-width: 100px;
    max-width: 150px;
    font-size: 0.8rem;
  }

  .upload-placeholder {
    padding: 16px;
  }

  .upload-placeholder-text {
    font-size: 0.8rem;
  }

  .image-preview-large q-img {
    height: 150px !important;
    width: 150px !important;
  }
}
</style>
