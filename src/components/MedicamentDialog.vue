<template>
  <v-dialog v-model="visible" max-width="600" persistent>
    <v-card rounded="lg">
      <v-card-title class="bg-primary text-white pa-4">
        <v-icon class="mr-2">{{ isEditing ? 'mdi-pencil' : 'mdi-plus-circle' }}</v-icon>
        {{ isEditing ? 'Modifier le médicament' : 'Ajouter un médicament' }}
      </v-card-title>

      <v-card-text class="pt-4">
        <v-form ref="formRef" v-model="formValid">
          <v-text-field
            v-model="form.nom"
            label="Dénomination"
            prepend-inner-icon="mdi-pill"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-text-field
            v-model="form.quantiteParUnite"
            label="Forme pharmaceutique (ex: Boîte de 16 comprimés)"
            prepend-inner-icon="mdi-package-variant"
            :rules="[rules.required]"
            variant="outlined"
            class="mb-2"
          />

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="form.prixUnitaire"
                label="Prix unitaire (€)"
                prepend-inner-icon="mdi-currency-eur"
                type="number"
                min="0"
                step="0.01"
                :rules="[rules.required, rules.positive]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="form.unitesEnStock"
                label="Unités en stock"
                prepend-inner-icon="mdi-counter"
                type="number"
                min="0"
                :rules="[rules.required, rules.zeroOrPositive]"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="form.niveauDeReappro"
                label="Seuil de réapprovisionnement"
                prepend-inner-icon="mdi-reload-alert"
                type="number"
                min="0"
                :rules="[rules.required, rules.zeroOrPositive]"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="form.fournisseur"
                label="Fournisseur (code)"
                prepend-inner-icon="mdi-truck"
                type="number"
                min="1"
                :rules="[rules.required]"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-text-field
            v-model="form.imageURL"
            label="URL de l'image"
            prepend-inner-icon="mdi-image"
            variant="outlined"
            class="mb-2"
          />

          <v-switch
            v-model="form.indisponible"
            label="Indisponible"
            color="error"
            inset
          />
        </v-form>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn
          variant="outlined"
          color="grey"
          @click="close"
        >
          Annuler
        </v-btn>
        <v-spacer />
        <v-btn
          variant="elevated"
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
  import { ref, computed, watch } from 'vue'

  const props = defineProps({
    modelValue: { type: Boolean, default: false },
    medicament: { type: Object, default: null },
    loading: { type: Boolean, default: false },
  })

  const emit = defineEmits(['update:modelValue', 'save'])

  const formRef = ref(null)
  const formValid = ref(false)

  const visible = computed({
    get: () => props.modelValue,
    set: val => emit('update:modelValue', val),
  })

  const isEditing = computed(() => !!props.medicament)

  /** Formulaire réactif */
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
  })

  const form = ref(defaultForm())

  /** Règles de validation */
  const rules = {
    required: v => !!v || v === 0 || 'Ce champ est obligatoire',
    positive: v => v > 0 || 'Doit être supérieur à 0',
    zeroOrPositive: v => v >= 0 || 'Doit être positif ou nul',
  }

  /** Pré-remplir le formulaire en mode édition */
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
