<template>
  <v-dialog v-model="visible" max-width="550" persistent>
    <v-card>
      <v-card-title class="bg-primary text-white">
        {{ isEditing ? 'Modifier le médicament' : 'Ajouter un médicament' }}
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form ref="formRef" v-model="formValid">
          <v-text-field
            v-model="form.nom"
            label="Dénomination"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.quantiteParUnite"
            label="Forme pharmaceutique"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model.number="form.prixUnitaire"
            label="Prix unitaire (€)"
            type="number"
            min="0"
            step="0.01"
            :rules="[rules.required, rules.positive]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model.number="form.unitesEnStock"
            label="Unités en stock"
            type="number"
            min="0"
            :rules="[rules.required, rules.zeroOrPositive]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model.number="form.niveauDeReappro"
            label="Seuil de réapprovisionnement"
            type="number"
            min="0"
            :rules="[rules.required, rules.zeroOrPositive]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model.number="form.fournisseur"
            label="Fournisseur (code)"
            type="number"
            min="1"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-select
            v-model="form.categorieCode"
            :items="categories"
            item-title="libelle"
            item-value="code"
            label="Catégorie"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.imageURL"
            label="URL de l'image"
            variant="outlined"
            class="mb-2"
          />

          <v-checkbox
            v-model="form.indisponible"
            label="Indisponible"
            color="error"
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="close">Annuler</v-btn>
        <v-spacer />
        <v-btn
          color="primary"
          :disabled="!formValid"
          :loading="loading"
          @click="submit"
        >
          {{ isEditing ? 'Enregistrer' : 'Ajouter' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import { getCategories } from '@/services/pharmacieApi'

  const props = defineProps({
    modelValue: { type: Boolean, default: false },
    medicament: { type: Object, default: null },
    loading: { type: Boolean, default: false },
  })

  const emit = defineEmits(['update:modelValue', 'save'])

  const formRef = ref(null)
  const formValid = ref(false)
  const categories = ref([])

  const visible = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  const isEditing = computed(() => !!props.medicament)

  const defaultForm = () => ({
    nom: '',
    quantiteParUnite: '',
    prixUnitaire: 0,
    unitesEnStock: 0,
    unitesCommandees: 0,
    niveauDeReappro: 0,
    fournisseur: 1,
    indisponible: false,
    imageURL: '',
    categorieCode: null,
  })

  const form = ref(defaultForm())

  async function loadCategories () {
    try {
      categories.value = await getCategories()
    } catch (e) {
      console.error('Impossible de charger les catégories', e)
    }
  }

  onMounted(loadCategories)

  const rules = {
    required: v => !!v || v === 0 || 'Ce champ est obligatoire',
    positive: v => v >= 0 || 'Doit être positif',
    zeroOrPositive: v => v >= 0 || 'Doit être positif ou nul',
  }

  watch(() => props.modelValue, open => {
    if (open && props.medicament) {
      form.value = { ...props.medicament }
    } else if (open) {
      form.value = defaultForm()
    }
  })

  function close () {
    visible.value = false
  }

  function submit () {
    emit('save', { ...form.value }, isEditing.value)
  }
</script>
