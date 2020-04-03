<template>
  <v-form class="layout wrap">
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
        style="width: 100%"
        title="Подтвердить заказ"
      >Подтвердить заказ</v-btn>
    </v-flex>

    <v-slide-y-transition>
      <v-flex xs12 v-if="this.formSuccess || this.formError">
        <v-alert
          :value="this.formSuccess"
          dismissible
          class="flex xs12 mt-3"
          type="success"
        >Заказ успешно отправлен.</v-alert>
        <v-alert
          :value="this.formError"
          dismissible
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
  data: () => ({
    formSuccess: false,
    formError: false,
    name: "",
    phone: "",
    message: "",
    address: "",
    email: "",
    mask: "+7 (###) ### - ####"
  }),
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
      const req = await this.$axios
        .post(process.env.baseUrl + "/orders", {
          oneClickbuy: this.oneClickBuy,
          productName: this.oneClickBuy ? this.productName : null,
          busket: busketObj,
          name: this.name,
          phone: this.phone,
          message: this.message,
          address: this.address,
          email: this.email
        })
        .then(response => {
          this.formSuccess = true;
          this.clear();
          if (window.yaCounter54918895) {
            window.yaCounter54918895.reachGoal("order");
          }
        })
        .catch(error => {
          console.log("submit -> error", error);
          this.formError = true;
          this.clear();
        });
      // let busketText = "",
      //   busketHtml = "";
      // if (busket && busket.length > 0) {
      //   for (let item of busket) {
      //     busketText += `${item.name} * ${item.count} \n`;
      //     busketHtml += `<p>${item.name} * ${item.count} </p>`;
      //   }
      // }
      // const req = await this.$axios
      //   .post(process.env.baseUrl + "/email", {
      //     to: "zakaz@prodaem-kolbasu.ru",
      //     from: "noreply@prodaem-kolbasu.ru",
      //     subject: `Обращение с сайта`,
      //     text: `Обращение с сайта от ${this.name}. Телефон: ${this.phone}. ${busketText}`,
      //     html: `<p>Обращение с сайта от ${this.name}.<p/><p>Телефон: ${this.phone}.<p/> ${busketHtml}`
      //   })

      // const req = await this.$axios
      //   .post(process.env.baseUrl + "/email", {
      //     to: "zakaz@prodaem-kolbasu.ru",
      //     from: "noreply@prodaem-kolbasu.ru",
      //     subject: `Обращение с сайта`,
      //     text: `Обращение с сайта от ${this.name}. Телефон: ${this.phone}. ${busketText}`,
      //     html: `<p>Обращение с сайта от ${this.name}.<p/><p>Телефон: ${this.phone}.<p/> ${busketHtml}`
      //   })
      //   .then(response => {
      //     this.formSuccess = true;
      //     this.clear();
      //     if (window.yaCounter54918895) {
      //       window.yaCounter54918895.reachGoal("order");
      //       // console.log("submit -> reachGoal", reachGoal);
      //     }
      //   })
      //   .catch(error => {
      //     console.log("submit -> error", error);
      //     this.formError = true;
      //     this.clear();
      //   });
      // }
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
      // console.log("emailErrors -> this.$v.email", this.$v.email.email);

      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Введите корректный email");

      return errors;
    }
  }
};
</script>
