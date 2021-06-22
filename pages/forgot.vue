<template>
    <v-container grid-list-lg
                 class="py-12"
                 fill-height
    >
        <v-row align="center">
            <v-col v-if="!error && !success"
                   cols="12"
                   md="6"
                   class="ma-auto"
            >
                <h1 class="text-center mb-10">Восстановление пароля</h1>
                <v-form>
                    <v-text-field
                        v-model="password"
                        class="pa-0"
                        :append-icon="showPass ? '$eye' : '$eyeOff'"
                        label="Пароль*"
                        outlined
                        dense
                        :error-messages="passwordErrors"
                        :type="showPass ? 'text' : 'password'"
                        @blur="$v.password.$touch()"
                        @click:append="showPass = !showPass"
                    />
                    <v-text-field
                        v-model="repeatPassword"
                        class="pa-0"
                        :append-icon="showPass ? '$eye' : '$eyeOff'"
                        label="Повторите пароль*"
                        outlined
                        dense
                        :error-messages="repeatPasswordErrors"
                        :type="showPass ? 'text' : 'password'"
                        @blur="$v.repeatPassword.$touch()"
                        @click:append="showPass = !showPass"
                    />
                    <v-btn
                        color="accent"
                        large
                        :disabled="submitDisabled"
                        :loading="loading"
                        style="width: 100%;"
                        title="Подтвердить"
                        @click="send"
                    >
                        Изменить пароль
                    </v-btn>
                </v-form>
            </v-col>
            <v-col
                v-else-if="error"
                cols="12"
                md="6"
                class="ma-auto"
                style="display: flex; align-items: center; flex-direction: column;"
            >
                <h1 class="text-center mb-9">Ошибка!</h1>
                <v-btn color="accent"
                       to="/"
                       class="mx-auto"
                >
                    Перейти на главную страницу
                </v-btn>
            </v-col>
            <v-col
                v-else-if="success"
                cols="12"
                md="6"
                class="ma-auto"
                style="display: flex; align-items: center; flex-direction: column;"
            >
                <h1 class="text-center mb-9">Ваш пароль успешно изменен!</h1>

                <v-btn color="accent"
                       to="/"
                       class="mx-auto"
                >
                    Перейти на главную страницу
                </v-btn>
            </v-col>
        </v-row>
    </v-container>
</template>
<script>
import { validationMixin } from 'vuelidate';
import { mask } from 'vue-the-mask';
import { required, minLength, sameAs } from 'vuelidate/lib/validators';
export default {
    directives: {
        mask,
    },
    mixins: [validationMixin],
    validations: {
        password: {
            required,
            minLength: minLength(6),
        },
        repeatPassword: {
            required,
            sameAsPassword: sameAs('password'),
        },
    },
    async asyncData({ redirect, query }) {
        if (!query || !query.code) {
            redirect('/');
        }
        return {
            code: query.code,
        };
    },
    data() {
        return {
            password: '',
            repeatPassword: '',
            showPass: false,
            loading: false,

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
        async send() {
            this.$v.$touch();
            if (this.$v.$anyError) {
                return;
            }
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
};
</script>
