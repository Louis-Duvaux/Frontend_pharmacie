<template>
  <v-card elevation="2">
    <!-- Image du médicament -->
    <v-img
      :src="medicament.imageURL || 'https://via.placeholder.com/400x200?text=Médicament'"
      height="160"
      cover
    />

    <v-card-title>{{ medicament.nom }}</v-card-title>

    <v-card-subtitle>Réf. {{ medicament.reference }}</v-card-subtitle>

    <v-card-text>
      <p><strong>Forme :</strong> {{ medicament.quantiteParUnite || 'Non renseigné' }}</p>
      <p><strong>Prix :</strong> {{ medicament.prixUnitaire?.toFixed(2) ?? '—' }} €</p>
      <p><strong>Stock :</strong> {{ medicament.unitesEnStock }}</p>
      <p><strong>Seuil réappro :</strong> {{ medicament.niveauDeReappro }}</p>
      <p v-if="medicament.indisponible" class="text-error font-weight-bold">Indisponible</p>
    </v-card-text>

    <v-divider />

    <!-- Boutons +1 / -1 -->
    <v-card-actions class="justify-center">
      <v-btn
        color="warning"
        size="small"
        :disabled="medicament.unitesEnStock <= 0"
        @click="$emit('dispenser', medicament)"
      >
        - 1
      </v-btn>

      <span class="mx-3 font-weight-bold">{{ medicament.unitesEnStock }}</span>

      <v-btn
        color="success"
        size="small"
        @click="$emit('livrer', medicament)"
      >
        + 1
      </v-btn>
    </v-card-actions>

    <v-divider />

    <!-- Boutons modifier / supprimer -->
    <v-card-actions>
      <v-btn
        color="primary"
        size="small"
        @click="$emit('modifier', medicament)"
      >
        Modifier
      </v-btn>

      <v-spacer />

      <v-btn
        color="error"
        size="small"
        @click="$emit('supprimer', medicament)"
      >
        Supprimer
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
  defineProps({
    medicament: {
      type: Object,
      required: true,
    },
  })

  defineEmits(['modifier', 'supprimer', 'livrer', 'dispenser'])
</script>
