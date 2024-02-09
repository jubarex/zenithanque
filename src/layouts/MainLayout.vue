<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          <q-img
            clickable
            src="../assets/logo-zenith-transparente.png"
            fit="scale-down"
            height="75px"
            @click="router.push({ name: 'me' })"
          />
        </q-toolbar-title>

        <q-btn-dropdown flat color="white" icon="person">
          <q-list>
            <q-item clickable v-close-popup @click="handleLogout">
              <q-item-section>
                <q-item-label>Encerrar Sessão</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
      <q-list>
        <q-item-label header> Apoio </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
const linksList = [
  {
    title: "Cadastro de Tanque",
    caption: "",
    icon: "home",
    link: "tanque",
  },
  {
    title: "Cadastro de Hardware",
    caption: "",
    icon: "home",
    link: "hardware",
  },
  {
    title: "Home",
    caption: "",
    icon: "home",
    link: "me",
  },
];

import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import useAuthUser from "src/composables/UseAuthUser";
import { useRouter } from "vue-router";

import { useQuasar } from "quasar";
import { route } from "quasar/wrappers";

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },

  setup() {
    const leftDrawerOpen = ref(false);

    const $q = useQuasar();

    const router = useRouter();

    const { logout } = useAuthUser();

    const handleLogout = async () => {
      $q.dialog({
        title: "Sair",
        message: "Você realmente 😲 quer desconectar?  :(",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        await logout();
        router.replace({ name: "login" });
      });
    };

    return {
      router,
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
      handleLogout,
    };
  },
});
</script>
