<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ isUpdate ? "Atualizar Hardware" : "Adicionar Hardware" }}
        </p>
      </div>
      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <q-input
          label="idHardware"
          v-model="form.id_hardware"
          lazy-rules
        ></q-input>

        <q-input label="pH" v-model="form.ph" lazy-rules></q-input>
        <q-input
          label="Temperatura"
          v-model="form.temperatura"
          lazy-rules
        ></q-input>
        <q-input
          label="Oxigenação"
          v-model="form.oxigenacao"
          lazy-rules
        ></q-input>
        <q-btn
          :label="isUpdate ? 'Atualizar' : 'Salvar'"
          color="primary"
          class="full-width"
          rounded
          type="submit"
        ></q-btn>
        <q-btn
          label="Cancelar"
          color="dark"
          class="full-width"
          flat
          :to="{ name: 'hardware' }"
        ></q-btn>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";

export default defineComponent({
  name: "PageFormHardware",
  setup() {
    const table = "leitura_hardware";
    const router = useRouter();
    const route = useRoute();

    const { post, getById, update } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    //priemira vez usando o computed, se existe ele da true eu acho
    const isUpdate = computed(() => {
      return route.params.id;
    });

    let hardware = {};
    const form = ref({
      id_hardware: "",
      ph: "",
      temperatura: "",
      oxigenacao: "",
    });

    onMounted(() => {
      if (isUpdate.value) {
        handleGetHardware(isUpdate.value);
      }
    });

    const handleSubmit = async () => {
      try {
        if (isUpdate.value) {
          await update(table, form.value);
          notifySuccess("Atualizado com sucesso!");
          router.push({ name: "hardware" });
        } else {
          await post(table, form.value);
          notifySuccess("Salvo com sucesso!");
          router.push({ name: "hardware" });
        }
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetHardware = async (id) => {
      try {
        hardware = await getById(table, id);
        form.value = hardware;
      } catch (error) {}
    };

    return {
      handleSubmit,
      form,
      isUpdate,
    };
  },
});
</script>
