<template>
  <q-page padding>
    <div class="row justify-center">
      <p class="text-h5 text-center col-12"></p>

      <!-- @row-click.prevent="handleGrafico" -->
      <q-table
        :rows="tanques"
        :columns="columnsTanque"
        row-key="id"
        class="col-12"
        :loading="loading"
      >
        <template v-slot:top>
          <span class="text-h6">Tanque</span>
          <!-- <q-space /> -->
          <!-- <q-input
            borderless
            dense
            debounce="300"
            color="primary"
            v-model="filter"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input> -->
          <q-space />
          <q-btn
            v-if="quasar$.platform.is.desktop"
            icon="add"
            color="info"
            label="Adicionar"
            to="form-tanque"
          />
        </template>
        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm">
            <q-btn
              icon="edit"
              color="dark"
              round
              size="md"
              @click="handleEdit(props.row)"
              ><q-tooltip> Editar </q-tooltip></q-btn
            >
            <q-btn
              icon="delete"
              color="negative"
              round
              size="md"
              @click="handleRemoveTanque(props.row)"
            >
              <q-tooltip> Deletar </q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-page-sticky
      position="bottom-right"
      :offset="[18, 18]"
      v-if="quasar$.platform.is.mobile"
    >
      <q-btn fab icon="add" color="info" to="form-tanque" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

import { columnsTanque } from "./table";

export default defineComponent({
  //bom pra identificação no vue
  name: "PageTanqueList",
  setup() {
    const { notifyError, notifySuccess } = useNotify();

    const quasar$ = useQuasar();

    const tanques = ref([]);
    const { list, remove } = useApi();
    const loading = ref(true);
    const table = "tanque";

    const addRow = async () => {};

    const router = useRouter();

    const handleListTanques = async () => {
      try {
        loading.value = true;
        tanques.value = await list(table);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
        loading.value = false;
      }
    };

    const handleEdit = (tanque) => {
      router.push({ name: "form-tanque", params: { id: tanque.id } });
    };

    // const handleGrafico = (event, row, index) => {
    //   const tanque = tanques.value[index];
    //   console.log(tanque);

    //   router.push({
    //     name: "grafico-tanque",
    //     params: {
    //       id: tanque.id,
    //       nome: tanque.nome,
    //       sexo: tanque.sexo,
    //       nascimento: tanque.nascimento,
    //       profissao: tanque.profissao,
    //       clinica_id: tanque.clinica_id,
    //       descricao: tanque.descricao,
    //       img_url: tanque.img_url,
    //     },
    //   });
    // };

    const handleRemoveTanque = async (tanque) => {
      try {
        quasar$
          .dialog({
            title: "Confirmar",
            message: `Você tem certeza de que quer excluir  ${tanque.nome} ?`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            await remove(table, tanque.id);
            notifySuccess("Tanque removido com sucesso!");
            handleListTanques();
          });
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      //primeiro exemplo que eu fiz de pedir dados na hora de iniciar
      handleListTanques();
    });

    return {
      columnsTanque,
      tanques,
      handleListTanques,
      addRow,
      loading,
      handleEdit,
      handleRemoveTanque,
      quasar$,
      // handleGrafico,
    };
  },
});
</script>
