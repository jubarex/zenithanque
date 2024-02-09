<!-- Página de formulárioo do tanque -->
<template>
  <q-page padding>
    <div class="row justify-center">
      <div class="col-12 text-center">
        <p class="text-h6">
          {{ isUpdate ? "Atualizar Tanque" : "Adicionar Tanque" }}
        </p>
      </div>
      <q-form
        class="col-md-7 col-xs-12 col-sm-12 q-gutter-y-md"
        @submit.prevent="handleSubmit"
      >
        <p class="text-h4">Código: {{ isUpdate }}</p>
        <!-- <q-input label="Imagem" stack-label v-model="img" type="file">
        </q-input> -->

        <q-input
          label="Nome do tanque"
          v-model="form.nome_tanque"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira um nome válido!',
          ]"
        ></q-input>

        <q-input
          label="Endereço (Ex: 'Cascavel, PR')"
          v-model="form.endereco"
          lazy-rules
          :rules="[
            (val) => (val && val.length > 0) || 'Insira um endereço válido!',
          ]"
        ></q-input>

        <q-input
          label="Litros no tanque"
          v-model="form.litros"
          lazy-rules
          type="number"
        ></q-input>

        <q-input
          label="id_hardware"
          v-model="form.id_hardware"
          lazy-rules
        ></q-input>
        <!--
          :rules="[
            (val) => (val && val.length > 0) || 'Insira um hardware válido!',
          ]"
        -->

        <!-- <q-editor v-model="form.descricao" min-height="5rem" /> -->
        <!--
        <q-select
          v-model="form.clinica_id"
          :options="optionsClinica"
          label="Clínica"
          option-value="id"
          option-label="nome"
          map-options
          emit-value
          :rule="[(val) => !!val || 'Insira uma clínica válida!']"
        ></q-select> -->

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
          :to="{ name: 'tanque' }"
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
  name: "PageFormTanque",
  setup() {
    const table = "tanque";
    const router = useRouter();
    const route = useRoute();

    const { post, getById, update, list, uploadImg } = useApi();
    const { notifyError, notifySuccess } = useNotify();

    //priemira vez usando o computed, se existe ele da true eu acho
    const isUpdate = computed(() => {
      return route.params.id;
    });

    let tanque = {};
    const optionsClinica = ref([]);
    const form = ref({
      nome_tanque: "",
      endereco: "",
      litros: "",
      id_hardware: "",
    });

    const img = ref([]);

    onMounted(() => {
      // handleListClinicas();
      if (isUpdate.value) {
        handleGetTanque(isUpdate.value);
      }
    });

    // const handleListClinicas = async () => {
    //   optionsClinica.value = await list("clinica");
    // };

    const handleSubmit = async () => {
      try {
        if (img.value.length > 0) {
          const imgUrl = await uploadImg(img.value[0], "tanques");
          console.log("IMAGE URL: " + imgUrl);
          form.value.img_url = imgUrl;
        }

        if (isUpdate.value) {
          await update(table, form.value);
          notifySuccess("Atualizado com sucesso!");
          router.push({ name: "tanque" });
        } else {
          await post(table, form.value);
          notifySuccess("Salvo com sucesso!");
          router.push({ name: "tanque" });
        }
      } catch (error) {
        notifyError(error.message);
      }
    };

    const handleGetTanque = async (id) => {
      try {
        tanque = await getById(table, id);
        form.value = tanque;
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
