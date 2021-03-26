<template>
  <yandex-map
    :settings="mapSettings"
    :coords="coords"
    zoom="16"
    style="width: 100%; height: 100%"
  >
    <ymap-marker
      marker-id="1"
      marker-type="placemark"
      :coords="coords"
    ></ymap-marker>
  </yandex-map>
</template>
<script>
import { yandexMap, ymapMarker } from "vue-yandex-maps";

export default {
  components: { yandexMap, ymapMarker },
  props: { coords: { type: Array, default: () => [] } },

  data() {
    return {
      mapSettings: {
        apiKey: process.env.MAP_KEY,
        lang: "ru_RU",
        version: "2.1",
      },
    };
  },
};
</script>