// nome_tanque: "",
// endereco: "",
// litros: "",
// idHardware: "",
const columnsTanque = [
  {
    name: "id",
    align: "left",
    label: "id",
    field: "id",
    sortable: true,
  },

  {
    name: "nome_tanque",
    align: "left",
    label: "Nome",
    field: "nome_tanque",
    sortable: true,
  },

  {
    name: "endereco",
    align: "center",
    label: "Endereço",
    field: "endereco",
    sortable: true,
  },
  {
    name: "ph",
    align: "center",
    label: "pH",
    field: "ph",
    sortable: true,
  },
  {
    name: "temperatura",
    align: "center",
    label: "Temperatura",
    field: "temperatura",
    sortable: true,
  },
  {
    name: "oxigenacao",
    align: "center",
    label: "Oxigenação",
    field: "oxigenacao",
    sortable: true,
  },
  {
    name: "nascimento",
    align: "center",
    label: "Nascimento",
    field: "litros",
    sortable: true,
  },
  {
    name: "id_hardware",
    align: "center",
    label: "idHardware",
    field: "id_hardware",
    sortable: true,
  },
  {
    name: "clima",
    align: "left",
    label: "Clima",
    field: "clima",
    sortable: true,
  },

  {
    name: "actions",
    align: "right",
    label: "Ações",
    field: "actions",
    sortable: true,
  },
];

export { columnsTanque };
