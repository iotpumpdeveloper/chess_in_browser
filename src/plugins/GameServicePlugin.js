/**
 * This is a centralize service component, depends on the EventBusPlugin
 */
import sha1 from 'sha1';
import Storage from '../libs/Storage.js';

export default class GameServicePlugin 
{
  static install(Vue) {
    Vue.prototype.$gameservice = GameServicePlugin;

    this.$eventbus = Vue.prototype.$eventbus;

    this.$eventbus.$on('game_pgn_update', (pgn) => {
      this.pgn = pgn; 
    });
  }

  static createNewGame() {
    var gameId = sha1(Date.now() + window.navigator.userAgent);
    Storage.setItem('current_game_id', gameId);
    return gameId;
  }

  static saveCurrentGame()
  {
    var currentGameId = Storage.getItem('current_game_id');
    var savedGamePGNs = Storage.getItem('saved_game_pgns');

    if (savedGamePGNs == null) {
      savedGamePGNs = {};
    }

    savedGamePGNs[currentGameId] = this.pgn; 
    
    Storage.setItem('saved_game_pgns', savedGamePGNs);

    this.$eventbus.$emit('game_pgn_saved');
  }

  static loadGame(gameId) {
    Storage.setItem('current_game_id', gameId);
    var savedGamePGNs = Storage.getItem('saved_game_pgns');
    var pgn = savedGamePGNs[gameId];
    this.$eventbus.$emit('load_saved_game', {gameId:gameId, pgn: pgn});
  }

  static getSavedGames() 
  {
    var savedGamePGNs = Storage.getItem('saved_game_pgns');
    return savedGamePGNs;
  }
}
