<template>
  <q-page>
    <div class="full-width justify-center">
      <div class="col-sm-12 q-gutter-xs q-pa-md">
        <div class="full-width text-center">
          <span class="text-h6">
            <span class="spanLineBehind"></span>
            <span class="moon-emoji h3LineBehind" @click="moonDialog = true">{{
              mostrarEmojiLua(faseDaLua)
            }}</span>
          </span>
        </div>

        <q-card
          v-for="aviso in avisos"
          :key="aviso.id"
          class="col-sm-3 q-mt-md"
        >
          <q-card-section class="bg-warning q-pa-sm">
            <div class="text-h6">{{ aviso.nome }}</div>
            <div class="text-subtitle2">{{ aviso.endereco }}</div>
            <div class="text-body2">{{ aviso.mensagem }}</div>
            <div class="text-caption">Tempo: {{ aviso.tempo_atual }}</div>
            <div class="text-caption">Data: {{ aviso.data_atual }}</div>
          </q-card-section>
        </q-card>

        <div class="full-width row q-mt-md">
          <q-btn
            label="Cadastrar novo Tanque"
            color="dark"
            class="col-sm-6 q-pr-sm"
            rounded
            size="md"
            to="/tanque"
          />

          <q-btn
            label="Cadastro Manual de Dados"
            color="secondary"
            class="col-sm-6"
            rounded
            size="md"
            to="/hardware"
          />
        </div>

        <div class="full-width q-pt-sm">
          <div class="row">
            <q-card
              v-for="tanque in tanques"
              :key="tanque.id"
              class="col-12 col-sm-6 col-md-4 q-mb-md"
            >
              <q-card-section class="tanque-info">
                <q-item-label class="tanque-name text-h6">{{
                  tanque.nome_tanque
                }}</q-item-label>
                <q-item-label class="tanque-address text-subtitle2">{{
                  tanque.endereco
                }}</q-item-label>
              </q-card-section>

              <q-separator />

              <q-card-section class="tanque-details">
                <div
                  v-if="tanque.ph || tanque.temperatura || tanque.oxigenacao"
                >
                  <q-item v-if="tanque.ph">
                    <q-item-section>
                      <q-item-label class="tanque-label text-weight-medium"
                        >pH:</q-item-label
                      >
                    </q-item-section>
                    <q-item-section>
                      <div class="d-flex align-center">
                        <div
                          class="circle mr-xs"
                          :class="getPHCircleClass(tanque.ph)"
                        ></div>
                        <q-item-label>{{ tanque.ph }}</q-item-label>
                      </div>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="tanque.temperatura">
                    <q-item-section>
                      <q-item-label class="tanque-label text-weight-medium"
                        >Temperatura:</q-item-label
                      >
                    </q-item-section>
                    <q-item-section>
                      <div class="d-flex align-center">
                        <div
                          class="circle mr-xs"
                          :class="getTemperatureCircleClass(tanque.temperatura)"
                        ></div>
                        <q-item-label>{{ tanque.temperatura }}°C</q-item-label>
                      </div>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="tanque.oxigenacao">
                    <q-item-section>
                      <q-item-label class="tanque-label text-weight-medium"
                        >Oxigenação:</q-item-label
                      >
                    </q-item-section>
                    <q-item-section>
                      <div class="d-flex align-center">
                        <div
                          class="circle mr-xs"
                          :class="getOxigenacaoCircleClass(tanque.oxigenacao)"
                        ></div>
                        <q-item-label>{{ tanque.oxigenacao }}%</q-item-label>
                      </div>
                    </q-item-section>
                  </q-item>
                </div>
                <q-item v-else>
                  <q-item-section>
                    <q-item-label class="tanque-no-data"
                      >Aguardando Dados</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="moonDialog" persistent>
      <q-card>
        <q-bar class="text-right">
          <q-space />
          <q-btn dense flat icon="close" v-close-popup>
            <q-tooltip>Fechar</q-tooltip>
          </q-btn>
        </q-bar>

        <q-card-section>
          <span>Fase da Lua Atual: </span>
          <span style="font-weight: bold"> {{ faseDaLua.toFixed(2) }}</span>
        </q-card-section>
      </q-card>
    </q-dialog>
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
    const avisos = ref([]);
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

    const handleListAvisos = async () => {
      try {
        loading.value = true;
        // Obtenha os id_hardware dos seus tanques
        const idHardwares = tanques.value.map((tanque) => tanque.id_hardware);

        // Consulte os avisos filtrando pelo nível e id_hardware
        avisos.value = (await list("avisos")).filter((aviso) => {
          return aviso.nivel >= 1 && idHardwares.includes(aviso.id_hardware);
        });

        loading.value = false;
      } catch (error) {
        notifyError(error.message);
        loading.value = false;
      }
    };

    const handleEdit = (tanque) => {
      router.push({ name: "form-Tanque", params: { id: tanque.id } });
    };

    const mostrarEmojiLua = (fase) => {
      if (fase === 0) {
        return "🌑"; // Lua Nova
      } else if (fase < 0.25) {
        return "🌒"; // Lua Crescente
      } else if (fase === 0.5) {
        return "🌕"; // Lua Cheia
      } else if (fase > 0.5) {
        return "🌓"; // Lua Minguante
      } else {
        return "🌘"; // Lua Crescente
      }
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
      // Primeiro, obtenha os dados dos tanques
      handleListTanque()
        .then(() => {
          // Quando os dados dos tanques estiverem disponíveis, chame handleListAvisos
          handleListAvisos();
        })
        .catch((error) => {
          // Trate qualquer erro que ocorra ao obter os dados dos tanques
          notifyError(error.message);
          loading.value = false;
        });
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
      avisos,
      mostrarEmojiLua,
      moonDialog: ref(false),
    };
  },
});
</script>

<style scoped>
.circle {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  /* display: inline-block; */
  /* margin-right: 5px; */
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

.moon-emoji {
  font-size: 32px; /* Tamanho do emoji */
}

.bg-image {
}
</style>
