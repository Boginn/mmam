import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
  // defaultAssets: {
  //   font: {
  //     family: 'Poppins'
  //   },
  // },
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#496F5D',
        secondary: '#394034',
        tertiary: '#1e1e1e',
        fourth: '#5E6019',
        fifth: '#D17B0F',
        sixth: '#503D3F',
        seventh: '#112436',
        eight: '#161821',

        bgcolor: '#32292F',
        abcolor: '#34292F',
        accent: '#7391a3',

        vuegrey: '#babbc3',
        error: 'e42315',
        success: '#24aa0e',
      },
    },
  },
});
