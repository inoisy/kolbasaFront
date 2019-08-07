<template>
  <v-form v-model="valid" class="layout wrap" style="max-width:500px">
    <v-text-field
      class="xs12 py-0 flex"
      solo
      v-model="name"
      :error-messages="nameErrors"
      :counter="35"
      label="Ваше имя"
      required
      @blur="$v.name.$touch()"
    ></v-text-field>

    <v-text-field
      class="xs12 py-0 flex"
      solo
      v-model="phone"
      :error-messages="phoneErrors"
      mask="(###) ### - ####"
      label="Телефон"
      required
      @blur="$v.phone.$touch()"
    ></v-text-field>

    <v-flex xs12 class>
      <v-btn class="ml-0" color="accent" @click="submit" large :disabled="$v.$anyError">Отправить</v-btn>
    </v-flex>

    <v-slide-y-transition>
      <v-flex xs12 v-if="this.formSuccess || this.formError">
        <v-alert
          :value="this.formSuccess"
          dismissible
          class="flex xs12 mt-3"
          type="success"
        >Cообщение отправлено</v-alert>
        <v-alert
          :value="this.formError"
          dismissible
          class="flex xs12 mt-3"
          type="error"
        >Ошибка при отправке</v-alert>
      </v-flex>
    </v-slide-y-transition>
  </v-form>
</template>


<script>
// import axios from "axios";

import { validationMixin } from "vuelidate";
import {
  required,
  maxLength,
  minLength,
  email,
  alpha
} from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(35), minLength: minLength(3) },

    phone: { required, minLength: minLength(10), maxLength: maxLength(15) }
  },
  data: () => ({
    formMessage: "",
    formSuccess: false,
    formError: false,
    name: "",
    phone: "",
    valid: ""
  }),
  methods: {
    clear() {
      this.$v.$reset();
      this.phone = "";
      this.name = "";
    },
    async submit() {
      this.$v.$touch();

      //   console.log(this.$v);
      if (!this.$v.$anyError) {
        const busket = Object.values(this.$store.state.localStorage.basket);
        const busketItems =
          busket && busket.length > 0
            ? busket.map(item => {
                return {
                  count: item.count,
                  name: item.item.name
                };
              })
            : [];
        console.log("TCL: submit -> busketItems", busketItems);

        const busketText =
          busketItems && busket.length > 0
            ? busketItems.reduce((acc, val) => {
                acc = acc + `${val.name} * ${val.count} \n`;
                return acc;
              }, "")
            : "";
        console.log("TCL: submit -> busketText", busketText);
        const busketHtml =
          busketItems && busket.length > 0
            ? busketItems.reduce((acc, val) => {
                acc = acc + `<p>${val.name} * ${val.count} </p>`;
                return acc;
              }, "")
            : "";
        console.log("TCL: submit -> busketHtml", busketHtml);

        const msg = {
          name: this.name,
          phone: this.phone
        };
        const req = await this.$axios
          .post(process.env.baseUrl + "/email", {
            to: "noreply@azb-es.ru",
            from: "noreply@azb-es.ru",
            subject: `Обращение с сайта`,

            text: `Обращение с сайта от ${msg.name}. Телефон: ${msg.phone}. ${busketText}`,
            html: `Обращение с сайта от ${msg.name}.<br/> Телефон: ${msg.phone}.<br/> ${busketHtml}`
          })
          .then(response => {
            this.formSuccess = true;
            this.clear();
          })
          .catch(error => {
            this.formError = true;
            this.clear();
          });
      }
    }
  },
  computed: {
    // basket() {
    //   return Object.values(this.$store.state.localStorage.basket);
    // },
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
      !this.$v.phone.maxLength &&
        errors.push("Phone must be at most 15 characters long");
      !this.$v.phone.minLength && errors.push("Слишком короткий телефон");
      !this.$v.phone.required && errors.push("Введите телефон");
      return errors;
    }
  }
};
</script>
