<template>
    <v-form v-model="valid">
        <v-text-field
            v-model="email"
            class="xs12 py-0 flex"
            label="E-mail*"
            outlined
            dense
            :error-messages="emailErrors"
            @blur="$v.email.$touch()"
        >
        </v-text-field>
        <v-text-field
            v-model="password"
            class="xs12 py-0 flex"
            :append-icon="showPass ? '$eye' : '$eyeOff'"
            label="Пароль*"
            outlined
            dense
            :error-messages="passwordErrors"
            :type="showPass ? 'text' : 'password'"
            @blur="$v.password.$touch()"
            @click:append="showPass = !showPass"
        >
        </v-text-field>
        <v-btn
            class
            color="accent"
            large
            :disabled="submitDisabled"
            :loading="loading"
            style="width: 100%;"
            title="Войти"
            @click="login"
        >
            Войти
        </v-btn>
        <v-btn
            class="my-3"
            large
            outlined
            :disabled="!!emailErrors.length"
            :loading="forgotLoading"
            style="width: 100%;"
            title="Войти"
            @click="forgotPassword"
        >
            забыли пароль?
        </v-btn>
    <!-- <v-alert
      type="error"
      v-if="(loginError || forgotError) && errorMessage"
      dismissible
      >{{ errorMessage }}</v-alert
    >
    <v-alert type="success" v-if="forgotSuccess" dismissible
      >Ссылка для восстановления пароля отправлена!</v-alert
    > -->
    </v-form>
</template>
<script>
import { validationMixin } from 'vuelidate';
import { mask } from 'vue-the-mask';
import {
    required,

    minLength,
    email,


} from 'vuelidate/lib/validators';
export default {
    directives: {
        mask,
    },
    mixins: [validationMixin],
    validations: {
        email: { required, email },
        password: {
            required,
            minLength: minLength(6),
        },
    },
    data() {
        return {
            formSuccess: false,
            formError: false,
            email: '',
            mask: '+7 (###) ### - ####',
            loading: false,
            password: '',
            showPass: false,
            valid: false,
            forgotLoading: false,


        };
    },
    computed: {
        isLogined() {
            return this.$store.getters['auth/isLogined'];
        },
        userData() {
            return this.isLogined && this.$store.getters['auth/getUser'];
        },
        submitDisabled() {
            return this.$v.$anyError;
        },
        emailErrors() {
            const errors = [];
            if (!this.$v.email.$dirty) {
                return errors;
            }
            !this.$v.email.email && errors.push('Введите корректный email');
            !this.$v.email.required && errors.push('Введите email');
            this.errMail &&
                errors.push('Пользователь с таким email уже зарегистрирован');
            return errors;
        },
        passwordErrors() {
            const errors = [];
            if (!this.$v.password.$dirty) {
                return errors;
            }
            !this.$v.password.required && errors.push('Введите пароль');
            !this.$v.password.minLength &&
                errors.push('Минимальная длина пароля - 6 символов');
            return errors;
        },
    },
    methods: {
        async forgotPassword() {
            this.$v.email.$touch();
            if (this.$v.email.$error) {
                return;
            }
            this.forgotLoading = true;
            await this.$strapi
                .forgotPassword({ email: this.email })
                .then(() => {
                    this.forgotLoading = false;
                    this.$toast.success('Ссылка для восстановления пароля отправлена!', {
                        icon: el => {
                            el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="width:27px; height:27px;  margin-right: 15px;"><path d="${this.$vuetify.icons.values.success}"></svg>`;
                            return el;
                        },
                    });
                })
                .catch(() => {
                    this.forgotLoading = false;
                });
            this.forgotLoading = false;
        },
        async login() {
            this.$v.$touch();
            if (this.$v.$anyError) {
                return;
            }
            this.loading = true;
            await this.$strapi
                .login({
                    identifier: this.email,
                    password: this.password,
                })
                .catch(() => {
                    this.loading = false;
                });
            this.loading = false;
        },
    },
};
</script>
