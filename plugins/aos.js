import AOS from "aos/dist/aos";
import "aos/dist/aos.css";
import Vue from 'vue'

// Vue.use(AOS);
// export default ({
//   app
// }, inject) => {
//   app.AOS = new AOS.init({
//     once: true
//   })
// }
Vue.use(AOS.init({
  once: true
}));
