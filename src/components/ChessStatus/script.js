import PGNParser from '../../libs/PGNParser.js';

export default {
  data () {
    return {
      'game_pgn_entries' : []
    }
  },

  mounted () { 
    this.$eventbus.$on('game_pgn_update', (game_pgn) => {
      this.game_pgn_entries = PGNParser.parse(game_pgn);
    });

    this.$eventbus.$on('load_saved_game', (gameId) => {
      var gameData = this.$gameservice.getGameById(gameId);
      this.game_pgn_entries = PGNParser.parse(gameData.pgn);
    });
  }

}
