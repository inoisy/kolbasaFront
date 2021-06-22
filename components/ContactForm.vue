<template>
    <v-form>
        <slot></slot>
        <template v-if="!formSuccess && !formError">
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
            />
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
            />
            <v-text-field
                v-model="email"
                class="xs12 py-0 flex"
                label="E-mail"
                outlined
                dense
                :error-messages="emailErrors"
                @blur="$v.email.$touch()"
            />
            <v-text-field
                v-model="address"
                class="xs12 py-0 flex"
                outlined
                dense
                label="Адрес"
            />
            <v-textarea
                v-model="message"
                class="xs12 py-0 flex"
                outlined
                dense
                height="100px"
                hide-details
                label="Комментарий"
            />

            <v-btn
                class="submit-button"
                color="accent"
                large
                :disabled="submitDisabled"
                :loading="loading"
                block
                title="Подтвердить заказ"
                @click="submit"
            >
                Подтвердить заказ
            </v-btn>

        </template>
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
} from 'vuelidate/lib/validators';
export default {
    directives: {
        mask,
    },
    mixins: [validationMixin],
    props: {
        productName: {
            type: String,
            default: '',
        },
        oneClickBuy: {
            type: Boolean,
            default: false,
        },
    },
    validations: {
        name: { required, maxLength: maxLength(35), minLength: minLength(3) },
        phone: { required, minLength: minLength(10), maxLength: maxLength(19) },
        email: { email },
    },
    data() {
        const user = this.$strapi.user || {};
        return {
            formSuccess: false,
            formError: false,
            name: user.firstname || '',
            phone: user.phone || '',
            address: user.address || '',
            email: user.email || '',
            userID: user.id || '',
            message: '',
            mask: '+7 (###) ### - ####',
            loading: false,
        };
    },
    computed: {
        user() {
            return this.$strapi.user;
        },
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
            return errors;
        },
    },
    methods: {
        clear() {
            this.$v.$reset();
            this.phone = '';
            this.name = '';
            this.message = '';
            this.address = '';
            this.email = '';
        },
        async submit() {
            this.$v.$touch();
            if (this.$v.$anyError) {
                return;
            }
            const busketObj = this.$store.getters['cart/cart'].map(item => ({
                name: item.name,
                qty: item.quantity,
                id: item.id,
                price: item.isDiscount ?
                    Math.round(item.discountPrice) :
                    Math.round(item.priceNum),
                subSumm: item.subSumm,
            }));
            try {
                this.loading = true;
                await this.$strapi.$orders
                    .create({
                        oneClickbuy: this.oneClickBuy,
                        productName: this.oneClickBuy ? this.productName : null,
                        busket: busketObj,
                        name: this.name,
                        phone: this.phone,
                        message: this.message,
                        address: this.address,
                        email: this.email,
                        user: this.userID,
                        summa: this.$store.getters['cart/cartSumm'],

                        isTest: false,
                    })
                    .then(() => {
                        this.loading = false;
                        this.$toast.success('Заказ успешно отправлен!', {

                            icon: el => {
                                el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="width:27px; height:27px;  margin-right: 15px;"><path d="${this.$vuetify.icons.values.success}"></svg>`;
                                return el;
                            },
                        });
                        if (window.yaCounter54918895) {
                            window.yaCounter54918895.reachGoal('order');
                        }
                    })
                    .catch(() => {
                        this.loading = false;
                    });
            } catch (error) {
                this.loading = false;
                this.formError = true;
                this.clear();
            }
        },
    },
};
</script>
<style lang="scss" scoped>
    .submit-button {
        margin-top: var(--card-padding, 40px);
    }
</style>
