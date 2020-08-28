<template>
  <!-- <div > -->
  <v-container grid-list-lg class="py-12" fill-height>
    <v-row align="center">
      <v-col cols="12" md="6" class="ma-auto" v-if="!error && !success">
        <h1 class="text-center mb-12">Восстановление пароля</h1>
        <!-- <div>{{$router}}</div> -->
        <!-- <p>error {{error}}</p>
        <p>success {{success}}</p>
        <p>code {{code}}</p>
        <p>errorMessage {{errorMessage}}</p>-->
        <v-form>
          <v-text-field
            class="pa-0"
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
            class="pa-0"
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
            @click="send"
            large
            :disabled="submitDisabled"
            :loading="loading"
            style="width: 100%"
            title="Подтвердить"
          >Изменить пароль</v-btn>
        </v-form>
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="ma-auto"
        v-else-if="error"
        style="display: flex; align-items: center; flex-direction: column;"
      >
        <h1 class="text-center mb-9">Ошибка!</h1>
        <p
          class="text-center mb-9"
          v-if="errorMessage"
          style="font-size: 20px;font-weight: bold;"
        >{{errorMessage}}</p>
        <v-btn color="accent" to="/" class="mx-auto">Перейти на главную страницу</v-btn>
      </v-col>
      <v-col
        cols="12"
        md="6"
        v-else-if="success"
        class="ma-auto"
        style="display: flex; align-items: center; flex-direction: column;"
      >
        <h1 class="text-center mb-9">Ваш пароль успешно изменен!</h1>

        <v-btn color="accent" to="/" class="mx-auto">Перейти на главную страницу</v-btn>
      </v-col>
    </v-row>
  </v-container>
  <!-- </div> -->
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
      password: "",
      repeatPassword: "",
      showPass: false,
      loading: false,
      errorMessage: null,
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
      //   console.log("repeatPassword", this.$v.repeatPassword);
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
      try {
        const response = await this.$axios
          .post(process.env.baseUrl + "/auth/reset-password", {
            code: this.code, // code contained in the reset link of step 3.
            password: this.password,
            passwordConfirmation: this.repeatPassword,
          })
          .then((response) => {
            // console.log("Your user's password has been reset.");
            this.$store.dispatch("auth/setUser", response.data);
            this.loading = false;
            this.success = true;
          })
          .catch((error) => {
            console.log("An error occurred:", error.response);
            try {
              this.errorMessage =
                error.response.data.message[0].messages[0].message;
            } catch (error) {
              console.log("send -> error", error);
            }
            this.error = true;
            // console.log("register -> message", message);
            this.loading = false;
          });
        console.log("send -> response", response);
      } catch (error) {}
    },
  },
  async asyncData(ctx) {
    console.log(ctx.query);
    if (!ctx.query || !ctx.query.code) {
      ctx.redirect("/");
    }
    return {
      code: ctx.query.code,
    };
  },
};
</script>