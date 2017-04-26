export default {
  components : { //register component locally
    'chessboard' : require('../ChessBoard/ChessBoard.vue') //one line require local components!!!
  },

  data () {
    return {
      'welcome_message' : 'Welcome to the chess game!',
    }
  },

  mounted () {
    /*
    this.$http.get('http://ip-api.com/json').then(response => {
      // success callback
      this.ip_info = response.data;
    }, response => {
      // error callback
    });
    */
  }

}
