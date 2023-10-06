import 'vuetify/styles';
import {
  createVuetify,
  // type ThemeDefinition
} from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// const v1Theme: ThemeDefinition = {
//   dark: false,
//   colors: {
//     background: '#000000',
//     surface: '#000000',
//     primary: '#000000',
//     'primary-darken-1': '#000000',
//     secondary: '#000000',
//     'secondary-darken-1': '#000000',
//     error: '#000000',
//     info: '#000000',
//     success: '#000000',
//     warning: '#000000',
//   },
// };

export default createVuetify({
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
  // theme: {
  //   defaultTheme: 'v1Theme',
  //   themes: {
  //     v1Theme,
  //   },
  // },
});
