<template>
  <v-container fluid class="pa-6">
    <!-- En-tête avec titre et bouton d'ajout -->
    <v-row align="center" class="mb-4">
      <v-col>
        <h1 class="text-h4 font-weight-bold text-primary">
          <v-icon size="large" class="mr-2">mdi-pharmacy</v-icon>
          Stock de médicaments
        </h1>
        <p class="text-subtitle-1 text-grey mt-1">
          {{ pageInfo.totalElements ?? 0 }} médicament(s) en pharmacie
        </p>
      </v-col>
      <v-col cols="auto">
        <v-btn
          color="primary"
          size="large"
          prepend-icon="mdi-plus"
          @click="openAddDialog"
        >
          Ajouter un médicament
        </v-btn>
      </v-col>
    </v-row>

    <!-- Barre de recherche -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Rechercher un médicament…"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
          density="comfortable"
        />
      </v-col>
      <v-col cols="12" md="3">
        <v-select
          v-model="itemsPerPage"
          :items="[12, 24, 48, 100]"
          label="Par page"
          variant="outlined"
          hide-details
          density="comfortable"
        />
      </v-col>
    </v-row>

    <!-- Indicateur de chargement -->
    <v-row v-if="loading" justify="center" class="my-8">
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-row>

    <!-- Message si aucun résultat -->
    <v-row v-else-if="filteredMedicaments.length === 0" justify="center" class="my-8">
      <v-col cols="12" class="text-center">
        <v-icon size="80" color="grey-lighten-1">mdi-pill-off</v-icon>
        <p class="text-h6 text-grey mt-4">Aucun médicament trouvé</p>
        <p class="text-body-2 text-grey">Essayez un autre terme de recherche ou ajoutez un médicament.</p>
      </v-col>
    </v-row>

    <!-- Grille de cartes médicaments -->
    <v-row v-else>
      <v-col
        v-for="med in filteredMedicaments"
        :key="med.reference"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <MedicamentCard
          :medicament="med"
          @modifier="openEditDialog"
          @supprimer="confirmDelete"
          @livrer="livrer"
          @dispenser="dispenser"
        />
      </v-col>
    </v-row>

    <!-- Pagination -->
    <v-row v-if="pageInfo.totalPages > 1" justify="center" class="mt-6">
      <v-pagination
        v-model="currentPage"
        :length="pageInfo.totalPages"
        :total-visible="7"
        rounded="circle"
        color="primary"
      />
    </v-row>

    <!-- Dialogue ajouter / modifier -->
    <MedicamentDialog
      v-model="dialogOpen"
      :medicament="selectedMedicament"
      :loading="saving"
      @save="handleSave"
    />

    <!-- Dialogue de confirmation de suppression -->
    <v-dialog v-model="deleteDialogOpen" max-width="450">
      <v-card rounded="lg">
        <v-card-title class="bg-error text-white pa-4">
          <v-icon class="mr-2">mdi-alert</v-icon>
          Confirmer la suppression
        </v-card-title>
        <v-card-text class="pt-4">
          Êtes-vous sûr de vouloir supprimer
          <strong>{{ medicamentToDelete?.nom }}</strong>
          (réf. {{ medicamentToDelete?.reference }}) ?
          <br>
          Cette action est irréversible.
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-btn variant="outlined" @click="deleteDialogOpen = false">Annuler</v-btn>
          <v-spacer />
          <v-btn
            variant="elevated"
            color="error"
            :loading="deleting"
            @click="handleDelete"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar de notification -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000" location="bottom right">
      {{ snackbar.text }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
  import { ref, computed, watch, onMounted } from 'vue'
  import MedicamentCard from '@/components/MedicamentCard.vue'
  import MedicamentDialog from '@/components/MedicamentDialog.vue'
  import {
    getMedicaments,
    createMedicament,
    updateMedicament,
    patchMedicament,
    deleteMedicament,
  } from '@/services/pharmacieApi'

  // --- État réactif ---
  const medicaments = ref([])
  const pageInfo = ref({ totalElements: 0, totalPages: 0 })
  const currentPage = ref(1)
  const itemsPerPage = ref(12)
  const searchQuery = ref('')
  const loading = ref(false)

  // Dialogue ajout / modification
  const dialogOpen = ref(false)
  const selectedMedicament = ref(null)
  const saving = ref(false)

  // Dialogue suppression
  const deleteDialogOpen = ref(false)
  const medicamentToDelete = ref(null)
  const deleting = ref(false)

  // Notifications
  const snackbar = ref({ show: false, text: '', color: 'success' })

  // --- Méthodes ---

  /** Affiche un message de notification */
  function notify (text, color = 'success') {
    snackbar.value = { show: true, text, color }
  }

  /** Charge les médicaments depuis l'API */
  async function loadMedicaments () {
    loading.value = true
    try {
      const { medicaments: data, page } = await getMedicaments(
        currentPage.value - 1,
        itemsPerPage.value
      )
      medicaments.value = data
      pageInfo.value = page
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      loading.value = false
    }
  }

  /** Filtre local par recherche textuelle */
  const filteredMedicaments = computed(() => {
    if (!searchQuery.value) return medicaments.value
    const q = searchQuery.value.toLowerCase()
    return medicaments.value.filter(m =>
      m.nom?.toLowerCase().includes(q) ||
      m.quantiteParUnite?.toLowerCase().includes(q) ||
      String(m.reference).includes(q)
    )
  })

  /** Ouvrir le dialogue d'ajout */
  function openAddDialog () {
    selectedMedicament.value = null
    dialogOpen.value = true
  }

  /** Ouvrir le dialogue de modification */
  function openEditDialog (med) {
    selectedMedicament.value = { ...med }
    dialogOpen.value = true
  }

  /** Sauvegarder (ajout ou modification) */
  async function handleSave (formData, isEditing) {
    saving.value = true
    try {
      if (isEditing) {
        await updateMedicament(formData.reference, formData)
        notify(`${formData.nom} modifié avec succès`)
      } else {
        await createMedicament(formData)
        notify(`${formData.nom} ajouté avec succès`)
      }
      dialogOpen.value = false
      await loadMedicaments()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      saving.value = false
    }
  }

  /** Confirmer la suppression */
  function confirmDelete (med) {
    medicamentToDelete.value = med
    deleteDialogOpen.value = true
  }

  /** Supprimer un médicament */
  async function handleDelete () {
    deleting.value = true
    try {
      await deleteMedicament(medicamentToDelete.value.reference)
      notify(`${medicamentToDelete.value.nom} supprimé`)
      deleteDialogOpen.value = false
      await loadMedicaments()
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      deleting.value = false
    }
  }

  /** Livraison : +1 au stock */
  async function livrer (med) {
    try {
      await patchMedicament(med.reference, {
        unitesEnStock: med.unitesEnStock + 1,
      })
      notify(`+1 unité de ${med.nom} (livraison)`)
      await loadMedicaments()
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  /** Dispensation : -1 au stock */
  async function dispenser (med) {
    if (med.unitesEnStock <= 0) {
      notify('Stock insuffisant !', 'warning')
      return
    }
    try {
      await patchMedicament(med.reference, {
        unitesEnStock: med.unitesEnStock - 1,
      })
      notify(`-1 unité de ${med.nom} (dispensation)`)
      await loadMedicaments()
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  // --- Watchers ---

  watch(currentPage, loadMedicaments)
  watch(itemsPerPage, () => {
    currentPage.value = 1
    loadMedicaments()
  })

  // --- Chargement initial ---
  onMounted(loadMedicaments)
</script>
