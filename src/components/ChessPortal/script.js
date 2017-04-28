export default {
  components : { //register component locally
    'chessboard' : require('../ChessBoard/component.vue'), //one line require local components!!!
    'chess-status' : require('../ChessStatus/component.vue'),
    'chess-controlpanel' : require('../ChessControlPanel/component.vue'),
    'saved-games' : require('../SavedGames/component.vue'),
  },

  data () {
    return {
      'welcome_message' : 'Welcome to the chess game!',
    }
  },
}
