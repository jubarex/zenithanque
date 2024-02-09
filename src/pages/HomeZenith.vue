<template>
  <q-page>
    <div class="row justify-center">
      <div class="col-md-4 col-sm-6 col-xs-10 q-gutter-y-md">
        <p
          class="full-width q-pa-sm q-pt-lg text-left text-caption"
          v-if="user"
        >
          {{ user.email }}
        </p>

        <div class="q-pa-sm full-width">
          <span class="text-h6"
            >Fase da Lua Atual: {{ faseDaLua.toFixed(2) }}</span
          >
          <br />
          <span class="text-caption">(0 = lua nova, 0.5 = lua cheia)</span>
        </div>
        <div class="full-width q-pa-sm">
          <span class="text-h6">Avisos:</span>
          <div class="col-sm-3 bg-negative q-mt-md q-pa-sm">
            <span>Tanque 1 - Cascavel, PR</span>
            <br />
            <span>PH muito elevado</span>
          </div>
          <div class="col-sm-3 bg-negative q-mt-md q-pa-sm">
            <span>Tanque 35 - Salvador, BA</span>
            <br />
            <span>PH muito elevado</span>
          </div>
          <div class="col-sm-3 bg-warning q-mt-md q-pa-sm">
            <span>Tanque 12 - Santa Tereza, PR</span>
            <br />
            <span>PH instável</span>
          </div>
        </div>

        <div class="full-width q-pt-md">
          <q-btn
            label="Cadastro de Tanque"
            color="dark"
            class="full-width"
            rounded
            size="lg"
            to="/tanque"
          />
        </div>
        <div class="full-width">
          <q-btn
            label="DEMONSTRAÇÃO: Cadastro Manual de Dados"
            color="dark"
            class="full-width text-caption"
            rounded
            size="sm"
            to="/Tanque"
          />
        </div>
        <!-- <div class="full-width">
          <q-btn
            label="Dispositivo"
            color="primary"
            class="full-width"
            rounded
            size="lg"
            to="/dispositivo"
          />
        </div> -->
        <div class="full-width">
          <!-- <q-btn
            label="Paciente"
            color="primary"
            class="full-width"
            rounded
            size="lg"
            to="/PacienteHome"
          /> -->
          <div>
            <!-- a -->
            <q-card v-for="tanque in tanques" :key="tanque.id" class="q-mb-md">
              <q-card-section>
                <div class="text-h6">{{ tanque.nome_tanque }}</div>
                <div class="text-subtitle2">{{ tanque.endereco }}</div>
              </q-card-section>

              <q-separator />

              <q-card-section>
                <q-item>
                  <q-item-section>
                    <div class="text-weight-medium">pH:</div>
                  </q-item-section>
                  <q-item-section v-if="tanque.ph">
                    <div
                      class="circle"
                      :class="getPHCircleClass(tanque.ph)"
                    ></div>
                    {{ tanque.ph }}
                  </q-item-section>
                  <q-item-section v-else> Aguardando Dados </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-weight-medium">Temperatura:</div>
                  </q-item-section>
                  <q-item-section v-if="tanque.temperatura">
                    <div
                      class="circle"
                      :class="getTemperatureCircleClass(tanque.temperatura)"
                    ></div>
                    {{ tanque.temperatura }}°C
                  </q-item-section>
                  <q-item-section v-else> Aguardando Dados </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-weight-medium">Oxigenação:</div>
                  </q-item-section>
                  <q-item-section v-if="tanque.oxigenacao">
                    <div
                      class="circle"
                      :class="getOxigenacaoCircleClass(tanque.oxigenacao)"
                    ></div>
                    {{ tanque.oxigenacao }}%
                  </q-item-section>
                  <q-item-section v-else> Aguardando Dados </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import useAuthUser from "src/composables/UseAuthUser";
import useApi from "src/composables/UseApi";
import useNotify from "src/composables/UseNotify";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";

import { columnsTanque } from "./tanque/table";

export default defineComponent({
  name: "PageMe",

  setup() {
    // const { banana, testarBanana } = useTeste();

    const { user } = useAuthUser();

    const { notifyError, notifySuccess } = useNotify();

    const quasar$ = useQuasar();

    const tanques = ref([]);
    const { list, remove } = useApi();
    const loading = ref(true);
    const table = "tanque";

    const addRow = async () => {};

    const router = useRouter();

    const handleListTanque = async () => {
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
      router.push({ name: "form-Tanque", params: { id: tanque.id } });
    };

    const handleRemoveTanque = async (tanque) => {
      try {
        quasar$
          .dialog({
            title: "Confirmar",
            message: `Você tem certeza de que quer excluir  ${tanque.nome_tanque} ?`,
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            await remove(table, tanque.id);
            notifySuccess("Tanque removido com sucesso!");
            handleListTanque();
          });
      } catch (error) {
        notifyError(error.message);
      }
    };

    const getPHCircleClass = (ph) => {
      if (ph) {
        if (ph >= 7.5) {
          return "circle-high";
        } else if (ph >= 6.5) {
          return "circle-medium";
        } else {
          return "circle-low";
        }
      }
    };
    const getTemperatureCircleClass = (temperature) => {
      if (temperature) {
        if (temperature >= 28) {
          return "circle-high";
        } else if (temperature >= 25) {
          return "circle-medium";
        } else {
          return "circle-low";
        }
      }
    };
    const getOxigenacaoCircleClass = (oxigenacao) => {
      if (oxigenacao) {
        oxigenacao = oxigenacao.replace("%", "");
        if (oxigenacao >= 90) {
          return "circle-high";
        } else if (oxigenacao >= 80) {
          return "circle-medium";
        } else {
          return "circle-low";
        }
      }
    };

    onMounted(() => {
      //primeiro exemplo que eu fiz de pedir dados na hora de iniciar
      handleListTanque();
    });

    const pegarFaseLuaHoje = () => {
      let data = Date.now();

      // Constantes
      const julianDateEpoch = 2444238.5; // Epoch Julian Date (1 de janeiro de 1970)
      const lunarMonth = 29.53058868; // Média do ciclo lunar em dias

      // Converter a data para o formato Julian Date
      let dataJuliana = data / 86400000 + 2440587.5;

      // Calcular o número de dias desde o início do ciclo lunar (nova lua)
      let diasDesdeNovaLua = dataJuliana - julianDateEpoch;

      // Calcular a fase da lua
      let fase = ((diasDesdeNovaLua % lunarMonth) / lunarMonth + 1) % 1;

      // Retornar a fase da lua (0 = nova lua, 0.5 = lua cheia)
      // if (error) throw error;
      return fase;
    };

    const faseDaLua = pegarFaseLuaHoje();

    console.log(user);

    return {
      user,
      // banana,
      // testarBanana,
      faseDaLua,

      columnsTanque,
      tanques,
      handleListTanque,
      addRow,
      loading,
      handleEdit,
      handleRemoveTanque,
      quasar$,
      getOxigenacaoCircleClass,
      getPHCircleClass,
      getTemperatureCircleClass,
    };
  },
});
</script>

<style scoped>
.circle {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  display: inline-block;
  margin-right: 5px;
}

.circle-high {
  background-color: green; /* Defina a cor para valores altos */
}

.circle-medium {
  background-color: orange; /* Defina a cor para valores médios */
}

.circle-low {
  background-color: red; /* Defina a cor para valores baixos */
}
</style>
