<template>
  <v-form v-model="valid">
    <!-- {{valid}} -->
    <v-text-field
      class="xs12 py-0 flex"
      v-model="email"
      label="E-mail*"
      outlined
      dense
      @blur="$v.email.$touch()"
      :error-messages="emailErrors"
    ></v-text-field>
    <v-text-field
      class="xs12 py-0 flex"
      v-model="password"
      :append-icon="showPass ? 'explore' : 'explore_off'"
      label="Пароль*"
      outlined
      dense
      @blur="$v.password.$touch()"
      :error-messages="passwordErrors"
      @click:append="showPass = !showPass"
      :type="showPass ? 'text' : 'password'"
    ></v-text-field>

    <v-btn
      class
      color="accent"
      @click="login"
      large
      :disabled="submitDisabled"
      :loading="loading"
      style="width: 100%"
      title="Войти"
    >Войти</v-btn>
    <!-- <v-btn
      class="mt-3"
      @click="forgotPassword"
      large
      outlined
      :disabled="!!emailErrors.length"
      :loading="loading"
      style="width: 100%"
      title="Войти"
    >забыли пароль?</v-btn>-->
  </v-form>
</template>
<script>
import { validationMixin } from "vuelidate";
import { mask } from "vue-the-mask";
import {
  required,
  maxLength,
  minLength,
  email,
  alpha,
  sameAs,
} from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  directives: {
    mask,
  },
  validations: {
    email: { required, email },
    password: {
      required,
      minLength: minLength(6),
    },
  },
  data: function () {
    // const user = this.$store.state.localStorage.user;
    return {
      formSuccess: false,
      formError: false,
      email: "",
      mask: "+7 (###) ### - ####",
      loading: false,
      password: "",
      showPass: false,
      valid: false,
    };
  },
  computed: {
    isLogined() {
      return this.$store.getters["auth/isLogined"];
    },
    userData() {
      return this.isLogined && this.$store.getters["auth/getUser"];
    },
    submitDisabled() {
      console.log("submitDisabled -> this.$v.$anyError", this.$v.$anyError);
      return this.$v.$anyError;
    },

    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Введите корректный email");
      !this.$v.email.required && errors.push("Введите email");
      this.errMail &&
        errors.push("Пользователь с таким email уже зарегистрирован");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      //   console.log(this.$v.password);
      !this.$v.password.required && errors.push("Введите пароль");
      !this.$v.password.minLength &&
        errors.push("Минимальная длина пароля - 6 символов");
      return errors;
    },
  },
  methods: {
    async forgotPassword() {
      this.$v.email.$touch();
      console.log("login -> this.$v", this.$v.email.$error);
      if (this.$v.email.$error) return;
      console.log("forgotPassword -> this.email", this.email);

      const response = await this.$axios.post(
        process.env.baseUrl + "/auth/forgot-password",
        {
          email: this.email,
        }
      );

      console.log("forgotPassword -> response", response);
    },
    async login() {
      this.$v.$touch();
      if (this.$v.$anyError) return;
      this.loading = true;
      try {
        const response = await this.$axios.post(
          process.env.baseUrl + "/auth/local",
          {
            identifier: this.email,
            password: this.password,
          }
        );
        if (response.status === 200) {
          this.$store.dispatch("auth/setUser", response.data);

          // console.log("login -> response.data", response.data);
          // await this.$cookies.set("userData", response.data, {
          //   path: "/",
          //   maxAge: 60 * 60 * 24 * 365,
          // });
          // const user = await this.app.$cookies.get("userData");
          // console.log("login -> user", user);
        }
      } catch (err) {
        console.log("login -> err", err);
        this.loading = false;
      }
      this.loading = false;
    },
  },
};
</script>