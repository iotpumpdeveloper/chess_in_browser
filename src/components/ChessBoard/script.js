import Chess from '../../libs/chess.js';
import ChessBoard from 'chessboardjs';
import SimpleChessAI from '../../libs/SimpleChessAI.js';

export default {
  data () {
    return {
      'game_result' : '',
      'game_id' : '',
    }
  },

  mounted () {
    var game, board;
    var computerMoveInterval;

    this.$eventbus.$on('load_saved_game', (gameData) => {
      this.game_id = gameData.gameId;
      game = new Chess();
      game.load_pgn(gameData.pgn);
      board.position(game.fen());
    });

    this.$eventbus.$on('new_game_started', () => {
      this.game_id = this.$gameservice.createNewGame();
      game = new Chess();
      this.$eventbus.$emit('game_pgn_update', game.pgn());
      computerMoveInterval = 400;
      this.game_result = 'Game started';
      makeAIMove();
    });

    //sound for move
    var updateStatus = () => {
      // has the game ended?
      if ( game.moves().length == 0) {
        var winningColor = 'Black'; 
        if (game.turn() === 'b') { //this means black can not move at all, white won
          winningColor = 'White'; 
        }
        this.game_result = 'Game over, ' + winningColor + ' Won.';
      } else { //the game should continue 

        if (game.in_check()) {
          computerMoveInterval = 800;

          if (game.turn() === 'b'){ //this means white is being checked 
            this.game_result = 'White is checking Black';
          } else {
            this.game_result = 'Black is checking White';
          }
        } else {
          computerMoveInterval = 400;
          if (game.turn() === 'b') {
            this.game_result = 'It is Black\'s turn to move';
          } else {
            this.game_result = 'It is White\'s turn to move';
          }
        }

        this.$eventbus.$emit('game_pgn_update', game.pgn());

      }
    };

    // do not pick up pieces if the game is over
    // only pick up pieces for White
    var onDragStart = (source, piece, position, orientation) => {
      var possibleMoves = game.moves();
      if (possibleMoves.length === 0) {
        return false;
      }
    };

    var makeAIMove = () => {
      var move = SimpleChessAI.getNextBestMove(game);
      game.ugly_move(move);
      //play some nice audios
      var audio = new Audio('/audios/horse.ogg');
      audio.play();
      updateStatus();

      board.position(game.fen());
    };

    var onDrop = (source, target, piece, newPos, oldPos, orientation) => { 
      var move = game.move({
        from: source,
        to: target,
        promotion: 'q' // NOTE: always promote to a queen for example simplicity
      });

      // illegal move
      if (move === null) return 'snapback';

      var audio = new Audio('/audios/horse.ogg');
      audio.play();

      // make AI-Based legal move for black
      window.setTimeout(makeAIMove, computerMoveInterval);

      updateStatus();
    };

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    var onSnapEnd = () => {
      board.position(game.fen());
    };


    var cfg = {
      draggable: true,
      position: 'start',
      onDragStart: onDragStart,
      onDrop: onDrop,
      onSnapEnd: onSnapEnd
    };
    board = ChessBoard('chessboard', cfg);
    board.orientation('black');
    this.$eventbus.$emit('new_game_started');
  }
}
