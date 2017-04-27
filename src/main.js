import Vue from 'vue';
import App from './App.vue';
import VueResource from 'vue-resource';
import WebSocketFactoryPlugin from './plugins/WebSocketFactoryPlugin.js'
import GameServicePlugin from './plugins/GameServicePlugin.js'
import EventBusPlugin from './plugins/EventBusPlugin.js'

import $ from 'jquery';

window.$ = $;

Vue.use(VueResource);
Vue.use(WebSocketFactoryPlugin);
Vue.use(GameServicePlugin);
Vue.use(EventBusPlugin);

new Vue({
  el: '#app',
  render : function(h) {
    return h(App)
  }
})
