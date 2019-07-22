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

    <v-flex xs12 class="mt-4">
      <v-btn class="ml-0" color="#d50000" @click="submit" dark large>Отправить</v-btn>
      <v-btn flat color="#d50000" @click="clear" outline large>Очистить</v-btn>
    </v-flex>

    <v-slide-y-transition>
      <v-flex xs12 v-if="this.formSuccess || this.formError">
        <v-alert
          :value="this.formSuccess"
          class="flex xs12 mt-3"
          type="success"
        >Cообщение отправлено</v-alert>
        <v-alert :value="this.formError" class="flex xs12 mt-3" type="error">Ошибка при отправке</v-alert>
      </v-flex>
    </v-slide-y-transition>
    <!-- {{formMessage}} -->
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
    email: { required, email },
    subject: {
      required,
      maxLength: maxLength(35),
      minLength: minLength(3)
    },
    phone: { required, minLength: minLength(10), maxLength: maxLength(15) },
    message: { required, maxLength: maxLength(1500), minLength: minLength(3) }
  },
  data: () => ({
    formMessage: "",
    formSuccess: false,
    formError: false,
    name: "",
    email: "",
    subject: "",
    phone: "",
    message: "",
    valid: ""
  }),
  methods: {
    clear() {
      this.$v.$reset();
      this.subject = "";
      this.phone = "";
      this.message = "";
      this.name = "";
      this.email = "";
    },
    async submit() {
      //   console.log(this.valid);
      this.$v.$touch();

      const msg = {
        name: this.name,
        email: this.email,
        subject: this.subject,
        phone: this.phone,
        message: this.message
      };
      //   console.log(this.$v);
      if (!this.$v.$anyError) {
        const req = await this.$axios
          .post(process.env.baseUrl + "/email", {
            to: process.env.formContactTo,
            from: process.env.formFrom,
            subject: `Обращение с сайта`,

            text: `Обращение с сайта от ${msg.name} на тему ${msg.subject}. Email: ${msg.email}. Телефон: ${msg.phone}. Сообщение: ${msg.message}`,
            html: `Обращение с сайта от ${msg.name} на тему ${msg.subject}.<br/> Email: ${msg.email}. Телефон: ${msg.phone}.<br/> Сообщение: ${msg.message}`
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
    currLocale() {
      return this.$i18n.locale;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.maxLength && errors.push("Слишком длинное имя");
      !this.$v.name.minLength && errors.push("Слишком короткое имя");
      !this.$v.name.required && errors.push("Введите имя");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.email && errors.push("Введите корректный email");
      !this.$v.email.required && errors.push("Введите email");
      return errors;
    },
    subjectErrors() {
      const errors = [];
      if (!this.$v.subject.$dirty) return errors;
      !this.$v.subject.maxLength && errors.push("Слишком длинная тема");
      !this.$v.subject.minLength && errors.push("Слишком короткая тема");
      !this.$v.subject.required && errors.push("Введите тему");
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
    },
    messageErrors() {
      const errors = [];
      if (!this.$v.message.$dirty) return errors;
      !this.$v.message.maxLength && errors.push("Слишком длинное сообщение");
      !this.$v.message.minLength && errors.push("Введите сообщение");
      !this.$v.message.required && errors.push("Введите сообщение");
      return errors;
    }
  }
};
</script>
