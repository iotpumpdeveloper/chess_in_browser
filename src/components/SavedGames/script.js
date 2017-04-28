export default {
  data () {
    return {
      'saved_game_list' : []
    }
  },

  methods : {
    loadGameIntoBoard(gameId) {
      var pgn = this.savedGamePGNs[gameId];
      this.$eventbus.$emit('load_saved_game', {gameId:gameId, pgn: pgn});
    }
  },

  mounted () {
    this.$eventbus.$on('game_pgn_saved', () => {
      this.savedGamePGNs = this.$gameservice.getSavedGames();
      this.saved_game_list = Object.keys(this.savedGamePGNs).reverse(); 
    });
  }
}
