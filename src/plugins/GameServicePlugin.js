/**
 * This is a centralize service component
 */
import sha1 from 'sha1';

export default class GameServicePlugin 
{
  static install(Vue) {
    Vue.prototype.$gameservice = GameServicePlugin;
  }

  static createNewGameID() {
      return sha1(Date.now() + window.navigator.userAgent);
  }
}
