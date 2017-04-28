export default {
  data () {
    return {
      'saved_game_list' : []
    }
  },

  methods : {
    loadGameIntoBoard(gameId) {
      this.$gameservice.loadGame(gameId);
    }
  },

  mounted () {
    this.$eventbus.$on('game_pgn_saved', () => {
      this.savedGamePGNs = this.$gameservice.getSavedGames();
      this.saved_game_list = Object.keys(this.savedGamePGNs).reverse(); 
    });
  }
}
