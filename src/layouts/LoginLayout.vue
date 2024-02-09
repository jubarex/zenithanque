<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-img
            clickable
            src="../assets/logo-zenith-transparente.png"
            fit="scale-down"
            height="75px"
            @click="router.push({ name: 'me' })"
          />
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent } from "vue";

import { useRouter } from "vue-router";

export default defineComponent({
  name: "LoginLayout",

  setup() {
    const router = useRouter();

    return { router };
  },
});
</script>
