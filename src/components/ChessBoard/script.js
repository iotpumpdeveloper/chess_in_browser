import Chess from '../../libs/chess.js';
import ChessBoard from 'chessboardjs';

export default {
  data () {
    return {
      'game_result' : '',
      'game_id' : '',
      'is_board_visible' : false
    }
  },

  mounted () {
    var board;
    var computerMoveInterval = 400;
    var gameOptions;
    var gameStatus;

    var updateStatus = (result) => {
      // has the game ended?
      if ( result.moves.length == 0) {
        var winningColor = 'Black'; 
        if (result.turn === 'b') { //this means black can not move at all, white won
          winningColor = 'White'; 
        }
        this.game_result = 'Game over, ' + winningColor + ' Won.';
      } else { //the game should continue 

        if (result.in_check) {
          computerMoveInterval = 800;

          if (result.turn === 'b'){ //this means white is being checked 
            this.game_result = 'White is checking Black';
          } else {
            this.game_result = 'Black is checking White';
          }
        } else {
          computerMoveInterval = 400;
          if (result.turn === 'b') {
            this.game_result = 'It is Black\'s turn to move';
          } else {
            this.game_result = 'It is White\'s turn to move';
          }
        }

        this.$eventbus.$emit('game_pgn_update', result.pgn);

      }
    };

    // do not pick up pieces if the game is over
    // only pick up pieces for White
    var onDragStart = (source, piece, position, orientation) => {
      var possibleMoves = this.$gameservice.getPossibleMoves();
      if (possibleMoves.length === 0) {
        return false;
      }
    };

    var makeAIMove = () => {
      var result = this.$gameservice.doAIMove();
      gameStatus = result;
      //play some nice audios
      var audio = new Audio('/audios/horse.ogg');
      audio.play();
      updateStatus(result);
      board.position(result.fen);
    };

    var onDrop = (source, target, piece, newPos, oldPos, orientation) => { 
      var result = this.$gameservice.doPlayerMove(source, target);
      gameStatus = result;

      // illegal move
      if (! result.is_valid_move) return 'snapback';

      var audio = new Audio('/audios/horse.ogg');
      audio.play();

      // make AI-Based legal move for black
      window.setTimeout(makeAIMove, computerMoveInterval);

      updateStatus(result);
    };

    // update the board position after the piece snap
    // for castling, en passant, pawn promotion
    var onSnapEnd = () => {
      board.position(gameStatus.fen);
    };

    var waitForChessBoard = () => {
      if ($('#chessboard').length) {
        this.game_id = this.$gameservice.createNewGame(gameOptions);

        computerMoveInterval = 400;

        var cfg = {
          draggable: true,
          position: 'start',
          onDragStart: onDragStart,
          onDrop: onDrop,
          onSnapEnd: onSnapEnd
        };

        board = ChessBoard('chessboard', cfg);
        board.orientation(gameOptions.player_color);
        if (gameOptions.player_color == 'black') { //ai move first
          // make AI-Based move 
          window.setTimeout(makeAIMove, computerMoveInterval);
        }
        this.game_result = 'Game started';
        this.$eventbus.$emit('game_pgn_update', ''); //in the beginning, pgn is an empty string
      } else {
        window.setTimeout(waitForChessBoard, 1);
      }
    }

    this.$eventbus.$on('load_saved_game', (result) => {
      board.position(result.fen);
      board.orientation(result.playerColor);
    });

    this.$eventbus.$on('new_game_started', (_gameOptions) => {
      this.is_board_visible = true; 
      gameOptions = _gameOptions;
      waitForChessBoard();
    });

  }
}
