import Chess from 'chess.js';
import ChessBoard from 'chessboardjs';
import sha1 from 'sha1';

export default {
  data () {
    return {
      'game_pgn_entries' : [],
      'game_result' : '',
      'game_id' : '',
    }
  },

  methods : {
    startNewGame () {

      this.game_id = sha1(Date.now() + window.navigator.userAgent);

      this.game_pgn_entries = [];

      var game = new Chess();

      var computerMoveInterval = 500;

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
            computerMoveInterval = 2000;

            if (game.turn() === 'b'){ //this means white is being checked 
              this.game_result = 'White is checking Black';
            } else {
              this.game_result = 'Black is checking White';
            }
          } else {
            computerMoveInterval = 250;
            if (game.turn() === 'b') {
              this.game_result = 'It is Black\'s turn to move';
            } else {
              this.game_result = 'It is White\'s turn to move';
            }
          }

          var _pgnEntries = game.pgn()
            .trim()
            .replace(new RegExp(/\s[0-9]+./g),'\n$&')
            .split('\n')
            .map(function(entry) {
              return entry.trim();
            });

          this.game_pgn_entries = _pgnEntries;
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

      var makeRandomMove = () => {
        var possibleMoves = game.moves(); 
        var randomIndex = Math.floor(Math.random() * possibleMoves.length);
        game.move(possibleMoves[randomIndex]);
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

        updateStatus();

        // make random legal move for black
        window.setTimeout(makeRandomMove, computerMoveInterval);

      };

      // update the board position after the piece snap
      // for castling, en passant, pawn promotion
      var onSnapEnd = function() {
        board.position(game.fen());
      };

      var cfg = {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd
      };
      var board = ChessBoard('chessboard', cfg);
      this.game_result = 'New game started';

    }
  },

  mounted () {
    this.startNewGame();
  }
}
