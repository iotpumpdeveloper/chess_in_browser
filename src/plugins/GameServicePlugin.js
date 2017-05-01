/**
 * This is a centralize service component, depends on the EventBusPlugin
 */
import sha1 from 'sha1';
import Storage from '../libs/Storage.js';

export default class 
{
  static install(Vue) {
    Vue.prototype.$gameservice = this;

    this.$eventbus = Vue.prototype.$eventbus;

    this.$eventbus.$on('game_pgn_update', (pgn) => {
      var currentGameData = Storage.getItem('current_game_data');
      currentGameData.pgn = pgn;
    });
  }

  static createNewGame(gameOptions) {
    var gameId = sha1(Date.now() + window.navigator.userAgent).substring(0,16);
    var gameData = {
      gameId : gameId,
      playerColor : gameOptions.player_color,
      pgn : ''
    }
    Storage.setItem('current_game_data', gameData);
    return gameId;
  }

  static saveCurrentGame()
  {
    var currentGameData = Storage.getItem('current_game_data');
    var currentGameId = currentGameData.gameId;
    var savedGameData = Storage.getItem('saved_game_data');

    if (savedGameData == null) {
      savedGameData = {};
    }

    savedGameData[currentGameId] = {
      gameId : currentGameId,
      pgn : currentGameData.pgn,
      playerColor : currentGameData.playerColor
    };
    
    Storage.setItem('saved_game_data', savedGameData);
  }

  static loadGame(gameId) {
    var savedGameData = Storage.getItem('saved_game_data');
    Storage.setItem('current_game_data', savedGameData[gameId]);
  }

  static getSavedGames() 
  {
    var savedGameData = Storage.getItem('saved_game_data');
    return savedGameData;
  }

  static getGameById(gameId)
  {
    var savedGameData = Storage.getItem('saved_game_data');
    return savedGameData[gameId];
  }
}
