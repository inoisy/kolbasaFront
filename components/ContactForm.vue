<template>
  <v-form class="layout wrap">
    <template v-if="!this.formSuccess && !this.formError">
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
      />
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
      />
      <v-text-field
        class="xs12 py-0 flex"
        v-model="email"
        label="E-mail"
        outlined
        dense
        @blur="$v.email.$touch()"
        :error-messages="emailErrors"
      />
      <v-text-field
        class="xs12 py-0 flex"
        outlined
        dense
        v-model="address"
        label="Адрес"
      />
      <v-textarea
        class="xs12 py-0 flex"
        outlined
        dense
        height="100px"
        v-model="message"
        hide-details
        label="Комментарий"
      />
      <v-flex xs12>
        <v-btn
          class="ml-0 mt-5"
          color="accent"
          @click="submit"
          large
          :disabled="submitDisabled"
          :loading="loading"
          style="width: 100%"
          title="Подтвердить заказ"
        >
          Подтвердить заказ
        </v-btn>
      </v-flex>
    </template>
    <!-- <v-slide-y-transition>
      <v-flex xs12 v-if="this.formSuccess || this.formError">
        <v-alert :value="this.formSuccess" class="flex xs12 mt-3" type="success"
          >Заказ успешно отправлен.</v-alert
        >
        <v-alert :value="this.formError" class="flex xs12 mt-3" type="error"
          >Ошибка при отправке заказа.</v-alert
        >
      </v-flex>
    </v-slide-y-transition> -->
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
} from "vuelidate/lib/validators";
export default {
  props: {
    productName: {
      type: String,
      default: "",
    },
    oneClickBuy: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [validationMixin],
  directives: {
    mask,
  },
  validations: {
    name: { required, maxLength: maxLength(35), minLength: minLength(3) },
    phone: { required, minLength: minLength(10), maxLength: maxLength(19) },
    email: { email },
  },
  data() {
    // let user; // = this.$store.state.localStorage.user;
    // if (this.$store.getters["auth/isLogined"]) {
    //   const getUser = this.$store.getters["auth/getUser"];
    //   user = {
    //     name: getUser.firstname,
    //     phone: getUser.phone,
    //     email: getUser.email,
    //     address: "",
    //     id: getUser.id,
    //   };
    // } else {
    //   user = this.$store.state.localStorage.user;
    // }
    const user = this.$strapi.user || {};
    return {
      formSuccess: false,
      formError: false,
      name: user.firstname || "",
      phone: user.phone || "",
      address: user.address || "",
      email: user.email || "",
      userID: user.id || "",
      message: "",
      mask: "+7 (###) ### - ####",
      loading: false,
    };
  },
  methods: {
    clear() {
      this.$v.$reset();
      this.phone = "";
      this.name = "";
      this.message = "";
      this.address = "";
      this.email = "";
    },
    async submit() {
      this.$v.$touch();
      if (this.$v.$anyError) return;
      const busketObj = this.$store.getters.cart.map((item) => {
        return {
          name: item.name,
          qty: item.quantity,
          id: item.id,
          price: item.isDiscount
            ? Math.round(item.discountPrice)
            : Math.round(item.priceNum),
          subSumm: item.subSumm,
        };
      });
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
            summa: this.$store.getters.cartSumm,
            // REMOVE
            isTest: false,
          })
          .then(() => {
            this.loading = false;
            this.$toast.success("Заказ успешно отправлен!", {
              // duration: 999999,
              icon: (el) => {
                el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" role="img" aria-hidden="true" class="v-icon__svg" style="width:27px; height:27px;  margin-right: 15px;"><path d="${this.$vuetify.icons.values.success}"></svg>`;
                return el;
              },
            });
            if (window.yaCounter54918895) {
              window.yaCounter54918895.reachGoal("order");
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
  computed: {
    user() {
      return this.$strapi.user;
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
      return errors;
    },
  },
};
</script>
