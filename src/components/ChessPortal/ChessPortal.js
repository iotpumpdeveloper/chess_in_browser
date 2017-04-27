export default {
  components : { //register component locally
    'chessboard' : require('../ChessBoard/ChessBoard.vue'), //one line require local components!!!
    'chess-status' : require('../ChessStatus/ChessStatus.vue')
  },

  data () {
    return {
      'welcome_message' : 'Welcome to the chess game!',
    }
  },
}
