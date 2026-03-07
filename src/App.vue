<template>
  <v-app>
    <v-app-bar color="primary">
      <v-toolbar-title>Ma Pharmacie</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>

    <v-footer color="primary-darken-1" class="text-center text-white pa-3">
      <v-col cols="12" class="text-body-2">
        &copy; {{ new Date().getFullYear() }} — Ma Pharmacie — Projet Vue.js
      </v-col>
    </v-footer>
  </v-app>
</template>

<script setup>
</script>
