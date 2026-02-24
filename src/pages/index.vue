<template>
  <v-container class="pa-4">
    <!-- Titre et bouton ajouter -->
    <v-row align="center" class="mb-4">
      <v-col>
        <h1 class="text-h5 text-primary">Stock de médicaments</h1>
        <p class="text-body-2 text-grey">{{ totalElements }} médicament(s)</p>
      </v-col>
      <v-col cols="auto">
        <v-btn color="primary" @click="openAddDialog">Ajouter</v-btn>
      </v-col>
    </v-row>

    <!-- Recherche -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="searchQuery"
          label="Rechercher…"
          variant="outlined"
          clearable
          hide-details
        />
      </v-col>
    </v-row>

    <!-- Chargement -->
    <v-row v-if="loading" justify="center" class="my-8">
      <v-progress-circular indeterminate color="primary" />
    </v-row>

    <!-- Aucun résultat -->
    <v-row v-else-if="filteredMedicaments.length === 0" justify="center" class="my-8">
      <v-col cols="12" class="text-center">
        <p class="text-grey">Aucun médicament trouvé.</p>
      </v-col>
    </v-row>

    <!-- Grille de cartes -->
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



    <!-- Dialogue ajouter / modifier -->
    <MedicamentDialog
      v-model="dialogOpen"
      :medicament="selectedMedicament"
      :loading="saving"
      @save="handleSave"
    />

    <!-- Dialogue de confirmation de suppression -->
    <v-dialog v-model="deleteDialogOpen" max-width="400">
      <v-card>
        <v-card-title>Confirmer la suppression</v-card-title>
        <v-card-text>
          Supprimer <strong>{{ medicamentToDelete?.nom }}</strong> (réf. {{ medicamentToDelete?.reference }}) ?
        </v-card-text>
        <v-card-actions>
          <v-btn @click="deleteDialogOpen = false">Annuler</v-btn>
          <v-spacer />
          <v-btn color="error" :loading="deleting" @click="handleDelete">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Message de notification -->
    <v-alert
      v-if="message.text"
      :type="message.type"
      closable
      class="mt-4"
      @click:close="message.text = ''"
    >
      {{ message.text }}
    </v-alert>
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

  const medicaments = ref([])
  const totalElements = ref(0)
  const searchQuery = ref('')
  const loading = ref(false)

  const dialogOpen = ref(false)
  const selectedMedicament = ref(null)
  const saving = ref(false)

  const deleteDialogOpen = ref(false)
  const medicamentToDelete = ref(null)
  const deleting = ref(false)

  const message = ref({ text: '', type: 'success' })

  function notify (text, type = 'success') {
    message.value = { text, type }
    setTimeout(() => { message.value.text = '' }, 4000)
  }

  async function loadMedicaments () {
    loading.value = true
    try {
      const { medicaments: data, page } = await getMedicaments(0, 1000)
      medicaments.value = data
      totalElements.value = page.totalElements
    } catch (error) {
      notify(error.message, 'error')
    } finally {
      loading.value = false
    }
  }

  const filteredMedicaments = computed(() => {
    if (!searchQuery.value) return medicaments.value
    const q = searchQuery.value.toLowerCase()
    return medicaments.value.filter(m =>
      m.nom?.toLowerCase().includes(q) ||
      m.quantiteParUnite?.toLowerCase().includes(q) ||
      String(m.reference).includes(q)
    )
  })

  function openAddDialog () {
    selectedMedicament.value = null
    dialogOpen.value = true
  }

  function openEditDialog (med) {
    selectedMedicament.value = { ...med }
    dialogOpen.value = true
  }

  async function handleSave (formData, isEditing) {
    saving.value = true
    try {
      if (isEditing) {
        await updateMedicament(formData.reference, formData)
        notify('Médicament modifié avec succès !')
      } else {
        // Construire le payload avec le lien catégorie pour Spring Data REST
        const { categorieCode, ...rest } = formData
        const payload = {
          ...rest,
          categorie: `https://springajax.herokuapp.com/api/categories/${categorieCode}`,
        }
        await createMedicament(payload)
        notify('Médicament ajouté avec succès !')
      }
      dialogOpen.value = false
      await loadMedicaments()
    } catch (error) {
      notify('Erreur : ' + error.message, 'error')
    } finally {
      saving.value = false
    }
  }

  function confirmDelete (med) {
    medicamentToDelete.value = med
    deleteDialogOpen.value = true
  }

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

  async function livrer (med) {
    try {
      await patchMedicament(med.reference, { unitesEnStock: med.unitesEnStock + 1 })
      notify(`+1 unité de ${med.nom}`)
      await loadMedicaments()
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  async function dispenser (med) {
    if (med.unitesEnStock <= 0) {
      notify('Stock insuffisant !', 'warning')
      return
    }
    try {
      await patchMedicament(med.reference, { unitesEnStock: med.unitesEnStock - 1 })
      notify(`-1 unité de ${med.nom}`)
      await loadMedicaments()
    } catch (error) {
      notify(error.message, 'error')
    }
  }

  onMounted(loadMedicaments)
</script>
