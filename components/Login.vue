<template>
  <v-form v-model="valid">
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
    <v-btn
      class="my-3"
      @click="forgotPassword"
      large
      outlined
      :disabled="!!emailErrors.length"
      :loading="forgotLoading"
      style="width: 100%"
      title="Войти"
    >забыли пароль?</v-btn>
    <v-alert
      type="error"
      v-if="(loginError || forgotError) && errorMessage"
      dismissible
    >{{errorMessage}}</v-alert>
    <v-alert
      type="success"
      v-if="forgotSuccess"
      dismissible
    >Ссылка для восстановления пароля отправлена!</v-alert>
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
    return {
      formSuccess: false,
      formError: false,
      email: "",
      mask: "+7 (###) ### - ####",
      loading: false,
      password: "",
      showPass: false,
      valid: false,
      forgotLoading: false,
      forgotError: false,
      forgotSuccess: false,
      errorMessage: "",
      loginError: false,
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
      !this.$v.password.required && errors.push("Введите пароль");
      !this.$v.password.minLength &&
        errors.push("Минимальная длина пароля - 6 символов");
      return errors;
    },
  },
  methods: {
    async forgotPassword() {
      this.$v.email.$touch();
      if (this.$v.email.$error) return;
      this.forgotLoading = true;
      const response = await this.$axios
        .post(process.env.baseUrl + "/auth/forgot-password", {
          email: this.email,
        })
        .then((response) => {
          this.forgotLoading = false;
          this.forgotSuccess = true;
          this.forgotError = false;
          this.errorMessage = null;
        })
        .catch((error) => {
          try {
            this.errorMessage =
              error.response.data.message[0].messages[0].message;
          } catch (error) {
            console.log("send -> error", error);
          }
          this.forgotError = true;
          this.forgotLoading = false;
        });
    },
    async login() {
      this.$v.$touch();
      if (this.$v.$anyError) return;
      this.loading = true;
      await this.$axios
        .post(process.env.baseUrl + "/auth/local", {
          identifier: this.email,
          password: this.password,
        })
        .then((response) => {
          if (response.status === 200) {
            this.$store.dispatch("auth/setUser", response.data);
            this.loginError = false;
            this.errorMessage = null;
          }
        })
        .catch((error) => {
          this.loginError = true;
          this.loading = false;

          try {
            this.errorMessage =
              error.response.data.message[0].messages[0].message;
          } catch (error) {
            console.log("send -> error", error);
          }
        });
    },
  },
};
</script>