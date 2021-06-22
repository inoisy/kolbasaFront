<template>
    <v-form v-model="valid">
        <v-text-field
            v-model="name"
            class="xs12 py-0 flex"
            :error-messages="nameErrors"
            :counter="35"
            label="Ваше имя*"
            required
            outlined
            dense
            @blur="$v.name.$touch()"
        >
        </v-text-field>
        <v-text-field
            v-model="phone"
            v-mask="mask"
            class="xs12 py-0 flex"
            :error-messages="phoneErrors"
            label="Телефон*"
            required
            outlined
            dense
            @blur="$v.phone.$touch()"
        >
        </v-text-field>
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
        <v-text-field
            v-model="repeatPassword"
            class="xs12 py-0 flex"
            :append-icon="showPass ? '$eye' : '$eyeOff'"
            label="Повторите пароль*"
            outlined
            dense
            :error-messages="repeatPasswordErrors"
            :type="showPass ? 'text' : 'password'"
            @blur="$v.repeatPassword.$touch()"
            @click:append="showPass = !showPass"
        >
        </v-text-field>
        <v-btn
            color="accent"
            large
            :disabled="submitDisabled"
            :loading="loading"
            style="width: 100%;"
            title="Подтвердить"
            class="mb-3"
            @click="register"
        >
            Зарегистрироваться
        </v-btn>

    </v-form>
</template>
<script>
import { validationMixin } from 'vuelidate';
import { mask } from 'vue-the-mask';
import {
    required,
    maxLength,
    minLength,
    email,
    sameAs,
} from 'vuelidate/lib/validators';
export default {
    directives: {
        mask,
    },
    mixins: [validationMixin],
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
            sameAsPassword: sameAs('password'),
        },
    },
    data() {
        return {
            formSuccess: false,
            formError: false,
            name: '',
            phone: '',
            email: '',
            mask: '+7 (###) ### - ####',
            loading: false,
            password: '',
            repeatPassword: '',
            showPass: false,
            errMail: '',
            errName: '',
            valid: false,
            errorMessage: null,
            error: false,
        };
    },
    computed: {
        submitDisabled() {
            return !this.name || !this.phone || this.$v.$anyError;
        },
        nameErrors() {
            const errors = [];
            if (!this.$v.name.$dirty) {
                return errors;
            }
            !this.$v.name.maxLength && errors.push('Слишком длинное имя');
            !this.$v.name.minLength && errors.push('Слишком короткое имя');
            !this.$v.name.required && errors.push('Введите имя');
            this.errName &&
                errors.push('Пользователь с таким именем уже зарегистрирован');
            return errors;
        },
        phoneErrors() {
            const errors = [];
            if (!this.$v.phone.$dirty) {
                return errors;
            }
            !this.$v.phone.maxLength && errors.push('Слишком длинный телефон');
            !this.$v.phone.minLength && errors.push('Слишком короткий телефон');
            !this.$v.phone.required && errors.push('Введите телефон');

            return errors;
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
        repeatPasswordErrors() {
            const errors = [];
            if (!this.$v.repeatPassword.$dirty) {
                return errors;
            }
            !this.$v.repeatPassword.required && errors.push('Повторите пароль');
            !this.$v.repeatPassword.sameAsPassword &&
                errors.push('Пароли не совпадают');
            return errors;
        },
    },
    methods: {
        async register() {
            this.$v.$touch();
            if (this.$v.$anyError) {
                return;
            }
            this.loading = true;
            await this.$strapi
                .register({
                    phone: this.phone,
                    firstname: this.name,
                    email: this.email,
                    username: this.email,
                    password: this.password,
                })
                .then(() => {
                    this.loading = false;
                    this.$toast.success('Вы зарегистрированы!', {
                        icon: el => {
                            el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="width:27px; height:27px;  margin-right: 15px;"><path d="${this.$vuetify.icons.values.success}"></svg>`;
                            return el;
                        },
                    });
                })
                .catch(() => {
                    this.loading = false;
                });
        },
    },
};
</script>
