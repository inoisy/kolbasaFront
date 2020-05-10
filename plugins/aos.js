import AOS from "aos/dist/aos";
import "aos/dist/aos.css";
import Vue from 'vue'

Vue.use(AOS.init({
  once: true,
  startEvent: 'load',
}));
