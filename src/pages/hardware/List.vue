<template>
  <q-page padding>
    <div class="row justify-center">
      <p class="text-h5 text-center col-12"></p>

      <q-table
        :rows="hardwares"
        :columns="columnsHardware"
        row-key="id"
        class="col-12"
        :loading="loading"
      >
        <template v-slot:top>
          <span class="text-h6">Hardware</span>
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
            to="form-hardware"
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
              @click="handleRemoveHardware(props.row)"
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
      <q-btn fab icon="add" color="info" to="form-hardware" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

import { columnsHardware } from "./table";

export default defineComponent({
  //bom pra identificação no vue
  name: "PageHardwareList",
  setup() {
    const { notifyError, notifySuccess } = useNotify();

    const quasar$ = useQuasar();

    const hardwares = ref([]);
    const { list, remove } = useApi();
    const loading = ref(true);
    const table = "leitura_hardware";

    const addRow = async () => {};

    const router = useRouter();

    const handleListHardware = async () => {
      try {
        loading.value = true;
        hardwares.value = await list(table);
        loading.value = false;
      } catch (error) {
        notifyError(error.message);
        loading.value = false;
      }
    };

    const handleEdit = (hardware) => {
      router.push({ name: "form-hardware", params: { id: hardware.id } });
    };

    const handleRemoveHardware = async (hardware) => {
      try {
        quasar$
          .dialog({
            title: "Confirmar",
            message: `Você tem certeza de que quer excluir  ${hardware.id_hardware} ?`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            await remove(table, hardware.id);
            notifySuccess("Hardware removido com sucesso!");
            handleListHardware();
          });
      } catch (error) {
        notifyError(error.message);
      }
    };

    onMounted(() => {
      //primeiro exemplo que eu fiz de pedir dados na hora de iniciar
      handleListHardware();
    });

    return {
      columnsHardware,
      hardwares,
      handleListHardware,
      addRow,
      loading,
      handleEdit,
      handleRemoveHardware,
      quasar$,
    };
  },
});
</script>
