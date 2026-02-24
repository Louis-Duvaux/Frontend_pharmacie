<template>
  <v-card class="medicament-card" elevation="3" rounded="lg">
    <!-- Image du médicament -->
    <v-img
      :src="medicament.imageURL || 'https://via.placeholder.com/400x200?text=Médicament'"
      height="180"
      cover
      class="bg-grey-lighten-3"
    >
      <!-- Badge stock -->
      <v-chip
        :color="stockColor"
        class="ma-2"
        size="small"
        variant="elevated"
      >
        <v-icon start size="small">mdi-package-variant</v-icon>
        Stock : {{ medicament.unitesEnStock }}
      </v-chip>

      <!-- Badge indisponible -->
      <v-chip
        v-if="medicament.indisponible"
        color="error"
        class="ma-2 float-right"
        size="small"
        variant="elevated"
      >
        Indisponible
      </v-chip>
    </v-img>

    <v-card-title class="text-h6 font-weight-bold text-primary pb-1">
      {{ medicament.nom }}
    </v-card-title>

    <v-card-subtitle class="pb-2">
      Réf. {{ medicament.reference }}
    </v-card-subtitle>

    <v-card-text>
      <v-list density="compact" class="pa-0">
        <v-list-item class="px-0">
          <template #prepend>
            <v-icon color="primary" size="small">mdi-pill</v-icon>
          </template>
          <v-list-item-title class="text-body-2">
            {{ medicament.quantiteParUnite || 'Non renseigné' }}
          </v-list-item-title>
        </v-list-item>

        <v-list-item class="px-0">
          <template #prepend>
            <v-icon color="primary" size="small">mdi-currency-eur</v-icon>
          </template>
          <v-list-item-title class="text-body-2">
            {{ medicament.prixUnitaire?.toFixed(2) ?? '—' }} €
          </v-list-item-title>
        </v-list-item>

        <v-list-item class="px-0">
          <template #prepend>
            <v-icon color="primary" size="small">mdi-reload-alert</v-icon>
          </template>
          <v-list-item-title class="text-body-2">
            Seuil réappro : {{ medicament.niveauDeReappro }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-divider />

    <!-- Actions : quantité +1 / -1 -->
    <v-card-actions class="justify-center">
      <v-tooltip text="Dispensation (-1)">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-minus-circle-outline"
            color="warning"
            size="small"
            :disabled="medicament.unitesEnStock <= 0"
            @click="$emit('dispenser', medicament)"
          />
        </template>
      </v-tooltip>

      <v-chip variant="tonal" color="primary" class="mx-2 font-weight-bold">
        {{ medicament.unitesEnStock }}
      </v-chip>

      <v-tooltip text="Livraison (+1)">
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-plus-circle-outline"
            color="success"
            size="small"
            @click="$emit('livrer', medicament)"
          />
        </template>
      </v-tooltip>
    </v-card-actions>

    <v-divider />

    <!-- Actions : modifier / supprimer -->
    <v-card-actions>
      <v-btn
        variant="text"
        color="primary"
        size="small"
        prepend-icon="mdi-pencil"
        @click="$emit('modifier', medicament)"
      >
        Modifier
      </v-btn>

      <v-spacer />

      <v-btn
        variant="text"
        color="error"
        size="small"
        prepend-icon="mdi-delete"
        @click="$emit('supprimer', medicament)"
      >
        Supprimer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  import { computed } from 'vue'

  const props = defineProps({
    medicament: {
      type: Object,
      required: true,
    },
  })

  defineEmits(['modifier', 'supprimer', 'livrer', 'dispenser'])

  /** Couleur du badge stock selon le niveau */
  const stockColor = computed(() => {
    const stock = props.medicament.unitesEnStock
    const seuil = props.medicament.niveauDeReappro
    if (stock <= 0) return 'error'
    if (stock <= seuil) return 'warning'
    return 'success'
  })
</script>

<style scoped>
  .medicament-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }
  .medicament-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }
</style>
