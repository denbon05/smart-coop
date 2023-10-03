import { createApp } from 'vue';
// Vuetify
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as nativeComponents from 'vuetify/components';
import * as directives from 'vuetify/directives';

import App from './App.vue';
import router from './router';

const vuetify = createVuetify({
  components: {
    ...nativeComponents,
  },
  directives,
});

const app = createApp(App);

app.use(router);
app.use(vuetify);

app.mount('#app');
