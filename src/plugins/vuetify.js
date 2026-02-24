/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Thème pharmacie : vert et blanc
const pharmacieTheme = {
  dark: false,
  colors: {
    background: '#F1F8E9',
    surface: '#FFFFFF',
    primary: '#2E7D32',
    'primary-darken-1': '#1B5E20',
    secondary: '#66BB6A',
    'secondary-darken-1': '#388E3C',
    accent: '#81C784',
    error: '#D32F2F',
    info: '#1976D2',
    success: '#388E3C',
    warning: '#F9A825',
  },
}

export default createVuetify({
  theme: {
    defaultTheme: 'pharmacie',
    themes: {
      pharmacie: pharmacieTheme,
    },
  },
})
