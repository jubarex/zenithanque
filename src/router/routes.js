const routes = [
  {
    path: "",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      //  todo: fazer uma landing page aqui
      {
        path: "",
        name: "loginDefault",
        component: () => import("pages/Login.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/LoginLayout.vue"),
    children: [
      //  todo: fazer uma landing page aqui
      {
        path: "",
        name: "loginDefaultPath",
        component: () => import("pages/Login.vue"),
      },
      {
        path: "login",
        name: "login",
        component: () => import("pages/Login.vue"),
      },
      {
        path: "register",
        name: "register",
        component: () => import("pages/Register.vue"),
      },
      {
        path: "email-confirmation",
        name: "email-confirmation",
        component: () => import("pages/EmailConfirmation.vue"),
      },
      {
        path: "forgot-password",
        name: "forgot-password",
        component: () => import("pages/ForgotPassword.vue"),
      },
      {
        path: "reset-password",
        name: "reset-password",
        component: () => import("pages/ResetPassword.vue"),
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    children: [
      // { path: '', component: () => import('pages/IndexPage.vue') },
      {
        path: "me",
        name: "me",
        component: () => import("pages/HomeZenith.vue"),
      },
      {
        path: "hardware",
        name: "hardware",
        component: () => import("pages/hardware/List.vue"),
      },
      {
        path: "form-hardware/:id?",
        name: "form-hardware",
        component: () => import("pages/hardware/Form.vue"),
      },

      {
        path: "tanque",
        name: "tanque",
        component: () => import("pages/tanque/List.vue"),
      },
      {
        path: "form-tanque/:id?",
        name: "form-tanque",
        component: () => import("pages/tanque/Form.vue"),
      },
    ],
    meta: {
      //isso aqui faz com que só as rotas que tem isso precisem de autenticação
      requiresAuth: true,
    },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/ErrorNotFound.vue"),
  },
];

export default routes;
