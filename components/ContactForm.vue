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
        autofocus
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
        label="E-mail"
        outlined
        dense
        @blur="$v.email.$touch()"
        :error-messages="emailErrors"
      ></v-text-field>
      <v-text-field class="xs12 py-0 flex" outlined dense v-model="address" label="Адрес"></v-text-field>
      <v-textarea
        class="xs12 py-0 flex"
        outlined
        dense
        height="100px"
        v-model="message"
        hide-details
        label="Комментарий"
      ></v-textarea>
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
        >Подтвердить заказ</v-btn>
      </v-flex>
    </template>
    <v-slide-y-transition>
      <v-flex xs12 v-if="this.formSuccess || this.formError">
        <v-alert
          :value="this.formSuccess"
          class="flex xs12 mt-3"
          type="success"
        >Заказ успешно отправлен.</v-alert>
        <v-alert
          :value="this.formError"
          class="flex xs12 mt-3"
          type="error"
        >Ошибка при отправке заказа.</v-alert>
      </v-flex>
    </v-slide-y-transition>
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
  alpha
} from "vuelidate/lib/validators";
export default {
  props: {
    productName: {
      type: String,
      default: ""
    },
    oneClickBuy: {
      type: Boolean,
      default: false
    }
  },
  mixins: [validationMixin],
  directives: {
    mask
  },
  validations: {
    name: { required, maxLength: maxLength(35), minLength: minLength(3) },
    phone: { required, minLength: minLength(10), maxLength: maxLength(19) },
    email: { email }
  },
  data: function() {
    const user = this.$store.state.localStorage.user;
    return {
      formSuccess: false,
      formError: false,
      name: user.name,
      phone: user.phone,
      address: user.address,
      email: user.email,
      message: "",
      mask: "+7 (###) ### - ####",
      loading: false
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

      const busketObj = this.$store.state.localStorage.basket.map(item => {
        return {
          name: item.name,
          count: item.count
        };
      });
      // console.log("submit -> busket", busketObj);
      try {
        this.loading = true;
        const req = await this.$axios.post(process.env.baseUrl + "/orders", {
          oneClickbuy: this.oneClickBuy,
          productName: this.oneClickBuy ? this.productName : null,
          busket: busketObj,
          name: this.name,
          phone: this.phone,
          message: this.message,
          address: this.address,
          email: this.email
        });
        this.loading = false;
        if (req.status === 200) {
          this.$store.commit("saveBasket");

          this.$store.commit("setUserData", {
            name: this.name,
            phone: this.phone,
            address: this.address,
            email: this.email
          });
          this.formSuccess = true;
          if (window.yaCounter54918895) {
            window.yaCounter54918895.reachGoal("order");
          }
          setTimeout(() => {
            this.$emit("offerClose");
            !this.oneClickBuy && this.$store.commit("clearBasket");
          }, 4000);
        } else {
          this.formError = true;
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
        // console.log("submit -> error", error);
        this.formError = true;
        this.clear();
      }
    }
  },
  computed: {
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
    }
  }
};
</script>
