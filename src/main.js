import Vue from 'vue';
import VueResource from 'vue-resource';
import App from './App.vue';
import WebSocketFactoryPlugin from './plugins/WebSocketFactoryPlugin.js'
import $ from 'jquery';

window.$ = $;

Vue.use(VueResource);
Vue.use(WebSocketFactoryPlugin);

new Vue({
  el: '#app',
  render : function(h) {
    return h(App)
  }
})
