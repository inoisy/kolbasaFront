<template>
  <v-container grid-list-lg class="py-12" fill-height>
    <v-row align="center">
      <v-col cols="12" md="6" class="ma-auto" v-if="!error && !success">
        <h1 class="text-center mb-10">Восстановление пароля</h1>
        <v-form>
          <v-text-field
            class="pa-0"
            v-model="password"
            :append-icon="showPass ? '$eye' : '$eyeOff'"
            label="Пароль*"
            outlined
            dense
            @blur="$v.password.$touch()"
            :error-messages="passwordErrors"
            @click:append="showPass = !showPass"
            :type="showPass ? 'text' : 'password'"
          />
          <v-text-field
            class="pa-0"
            v-model="repeatPassword"
            :append-icon="showPass ? '$eye' : '$eyeOff'"
            label="Повторите пароль*"
            outlined
            dense
            @blur="$v.repeatPassword.$touch()"
            :error-messages="repeatPasswordErrors"
            @click:append="showPass = !showPass"
            :type="showPass ? 'text' : 'password'"
          />
          <v-btn
            color="accent"
            @click="send"
            large
            :disabled="submitDisabled"
            :loading="loading"
            style="width: 100%"
            title="Подтвердить"
          >
            Изменить пароль
          </v-btn>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="ma-auto"
        v-else-if="error"
        style="display: flex; align-items: center; flex-direction: column"
      >
        <h1 class="text-center mb-9">Ошибка!</h1>
        <v-btn color="accent" to="/" class="mx-auto">
          Перейти на главную страницу
        </v-btn>
      </v-col>
      <v-col
        cols="12"
        md="6"
        v-else-if="success"
        class="ma-auto"
        style="display: flex; align-items: center; flex-direction: column"
      >
        <h1 class="text-center mb-9">Ваш пароль успешно изменен!</h1>

        <v-btn color="accent" to="/" class="mx-auto">
          Перейти на главную страницу
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <!-- </div> -->
</template>
<script>
import { validationMixin } from "vuelidate";
import { mask } from "vue-the-mask";
import { required, minLength, sameAs } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  directives: {
    mask,
  },
  validations: {
    password: {
      required,
      minLength: minLength(6),
    },
    repeatPassword: {
      required,
      sameAsPassword: sameAs("password"),
    },
  },
  data() {
    return {
      password: "",
      repeatPassword: "",
      showPass: false,
      loading: false,
      // errorMessage: null,
      error: false,
      success: false,
    };
  },
  computed: {
    submitDisabled() {
      return (
        !this.password ||
        !this.repeatPassword ||
        this.$v.$anyError ||
        this.$v.anyDirty
      );
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
    async send() {
      this.$v.$touch();
      if (this.$v.$anyError) return;
      this.loading = true;

      await this.$strapi
        .resetPassword({
          code: this.code,
          password: this.password,
          passwordConfirmation: this.repeatPassword,
        })
        .then(() => {
          this.loading = false;
          this.success = true;
        })
        .catch(() => {
          this.error = true;
          this.loading = false;
        });
    },
  },
  async asyncData({ redirect, query }) {
    if (!query || !query.code) {
      redirect("/");
    }
    return {
      code: query.code,
    };
  },
};
</script>