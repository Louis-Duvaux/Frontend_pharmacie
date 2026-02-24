<template>
  <v-app>
    <!-- Barre de navigation -->
    <v-app-bar color="primary">
      <v-toolbar-title>Ma Pharmacie</v-toolbar-title>
    </v-app-bar>

    <!-- Contenu -->
    <v-main>
      <router-view />
    </v-main>

    <!-- Pied de page -->
    <v-footer color="primary-darken-1" class="text-center text-white pa-3">
      <v-col cols="12" class="text-body-2">
        &copy; {{ new Date().getFullYear() }} — Ma Pharmacie — Projet Vue.js
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
  //
</script>
