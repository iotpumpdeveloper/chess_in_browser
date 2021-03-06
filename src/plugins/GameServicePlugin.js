/**
 * This is a centralize service component, depends on the EventBusPlugin
 */
import sha1 from 'sha1';
import Storage from '../libs/Storage.js';
import SimpleChessAI from '../libs/SimpleChessAI.js';
import Chess from '../libs/chess.js';

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
    this.game = new Chess();
    SimpleChessAI.setAIColor(gameOptions.player_color == "white"? "black" : "white");
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
    SimpleChessAI.setAIColor(savedGameData[gameId].playerColor == "white"? "black" : "white");
    this.game.load_pgn(savedGameData[gameId].pgn);
    var result = savedGameData[gameId];
    result.fen = this.game.fen();
    return result;
  }

  static getSavedGames() 
  {
    var savedGameData = Storage.getItem('saved_game_data');
    return savedGameData;
  }

  static doAIMove() {
    var move = SimpleChessAI.getNextBestMove(this.game);
    this.game.ugly_move(move);  
    return {
      fen : this.game.fen(),
      pgn : this.game.pgn(),
      moves : this.game.moves(),
      turn : this.game.turn(),
      in_check : this.game.in_check(),
    };
  }

  static doPlayerMove(source, target)
  {
    var move = this.game.move({
      from: source,
      to: target,
      promotion: 'q' // NOTE: always promote to a queen for example simplicity
    });

    return {
      fen : this.game.fen(),
      pgn : this.game.pgn(),
      moves : this.game.moves(),
      turn : this.game.turn(),
      in_check : this.game.in_check(),
      is_valid_move : (move != null)
    };
  }

  static getPossibleMoves() 
  {
    return this.game.moves();
  }
}
