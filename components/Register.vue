<template>
  <v-form v-model="valid">
    <v-text-field
      class="xs12 py-0 flex"
      v-model="name"
      :error-messages="nameErrors"
      :counter="35"
      label="Ваше имя*"
      required
      outlined
      dense
      @blur="$v.name.$touch()"
    ></v-text-field>
    <v-text-field
      class="xs12 py-0 flex"
      v-model="phone"
      :error-messages="phoneErrors"
      v-mask="mask"
      label="Телефон*"
      required
      outlined
      dense
      @blur="$v.phone.$touch()"
    ></v-text-field>
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
    <v-text-field
      class="xs12 py-0 flex"
      v-model="repeatPassword"
      :append-icon="showPass ? 'explore' : 'explore_off'"
      label="Повторите пароль*"
      outlined
      dense
      @blur="$v.repeatPassword.$touch()"
      :error-messages="repeatPasswordErrors"
      @click:append="showPass = !showPass"
      :type="showPass ? 'text' : 'password'"
    ></v-text-field>
    <v-btn
      color="accent"
      @click="register"
      large
      :disabled="submitDisabled"
      :loading="loading"
      style="width: 100%"
      title="Подтвердить"
      class="mb-3"
    >Зарегистрироваться</v-btn>
    <v-alert type="error" v-if="error" dismissible>{{errorMessage}}</v-alert>
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
    name: { required, maxLength: maxLength(35), minLength: minLength(3) },
    phone: { required, minLength: minLength(10), maxLength: maxLength(19) },
    email: { required, email },
    password: {
      required,
      minLength: minLength(6),
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs("password"),
    },
  },
  data: function () {
    // const user = this.$store.state.localStorage.user;
    return {
      formSuccess: false,
      formError: false,
      name: "",
      phone: "",
      email: "",
      mask: "+7 (###) ### - ####",
      loading: false,
      password: "",
      repeatPassword: "",
      showPass: false,
      errMail: "",
      errName: "",
      valid: false,
      errorMessage: null,
      error: false,
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
      return !this.name || !this.phone || this.$v.$anyError;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength && errors.push("Слишком длинное имя");
      !this.$v.name.minLength && errors.push("Слишком короткое имя");
      !this.$v.name.required && errors.push("Введите имя");
      this.errName &&
        errors.push("Пользователь с таким именем уже зарегистрирован");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.phone.$dirty) return errors;
      !this.$v.phone.maxLength && errors.push("Слишком длинный телефон");
      !this.$v.phone.minLength && errors.push("Слишком короткий телефон");
      !this.$v.phone.required && errors.push("Введите телефон");

      return errors;
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
    repeatPasswordErrors() {
      const errors = [];
      if (!this.$v.repeatPassword.$dirty) return errors;
      !this.$v.repeatPassword.required && errors.push("Повторите пароль");
      !this.$v.repeatPassword.sameAsPassword &&
        errors.push("Пароли не совпадают");
      return errors;
    },
  },
  methods: {
    async logout() {
      this.$store.commit("auth/logout");
    },
    async register() {
      this.$v.$touch();
      if (this.$v.$anyError) return;
      this.loading = true;
      const response = await this.$axios
        .post(process.env.baseUrl + "/auth/local/register", {
          username: this.email,
          phone: this.phone,
          email: this.email,
          password: this.password,
          firstname: this.name,
        })
        .then((response) => {
          this.$store.dispatch("auth/setUser", response.data);
          this.errMail = false;
          this.errName = false;
          this.formSuccess = true;
          this.loading = false;
          this.errorMessage = null;
          this.error = false;
        })
        .catch((error) => {
          this.error = true;
          this.errorMessage =
            error.response.data.message[0].messages[0].message;
          if (this.errorMessage === "Email is already taken.") {
            this.errMail = true;
          } else if (this.errorMessage === "Username already taken") {
            this.errName = true;
          }
          this.loading = false;
        });
    },
  },
};
</script>