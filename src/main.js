// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import 'mdi/css/materialdesignicons.min.css'
import * as VueGoogleMaps from 'vue2-google-maps'
import App from './App'
import router from './router'
 
/**
 * メイン処理
 * ここでは環境の設定をしているだけ
 * APのメイン処理はApp.vueを参照
 */

Vue.config.productionTip = false

/**
 * Service Workerの登録処理
 * これが無いとPWAの要件を満たさない
 * sw.jsはworkbox-swというツールでビルド時に作成している
 */
if (process.env.NODE_ENV === 'production') {
  if ('serviceWorker' in window.navigator) {
    window.addEventListener('load', () => {
      window.navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('SW registered: ', registration)
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError)
      })
    })
  }
}

/* eslint-disable no-new */
// Vuetify(UI Framework)のロード
// @see https://vuetifyjs.com/ja
Vue.use(Vuetify)
// VueGoogleMapsのロード
// @see https://github.com/Akryum/vue-googlemaps
Vue.use(VueGoogleMaps, {
  load: {
    key: process.env.GOOGLEMAP_API_KEY,
    libraries: 'places'
  }
})
// App Componentのバインド
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
