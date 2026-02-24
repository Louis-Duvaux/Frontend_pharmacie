<template>
  <v-app>
    <!-- Barre de navigation supérieure -->
    <v-app-bar color="primary" prominent>
      <v-app-bar-nav-icon icon="mdi-pharmacy" />

      <v-toolbar-title class="text-h5 font-weight-bold">
        <v-icon class="mr-2">mdi-medical-bag</v-icon>
        Ma Pharmacie
      </v-toolbar-title>

      <v-spacer />

      <v-chip color="white" variant="elevated" class="mr-2">
        <v-icon start>mdi-pill</v-icon>
        Gestion de Stock
      </v-chip>
    </v-app-bar>

    <!-- Contenu principal -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Pied de page -->
    <v-footer color="primary-darken-1" class="text-center text-white pa-4">
      <v-row no-gutters>
        <v-col cols="12">
          <v-icon class="mr-1">mdi-pharmacy</v-icon>
          Ma Pharmacie &mdash; Gestion de stock de médicaments
        </v-col>
        <v-col cols="12" class="text-caption mt-1">
          &copy; {{ new Date().getFullYear() }} &mdash; Projet Vue.js + Vuetify
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup>
  //
</script>
