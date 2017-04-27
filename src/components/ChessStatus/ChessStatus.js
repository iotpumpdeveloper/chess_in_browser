export default {
  data () {
    return {
      'game_pgn_entries' : []
    }
  },

  mounted () { 
    this.$eventbus.$on('game_pgn_update', (game_pgn) => {
      this.game_pgn_entries = game_pgn
        .trim()
        .replace(new RegExp(/\s[0-9]+./g),'\n$&')
        .split('\n')
        .map(function(entry) {
          return entry.trim();
        });
    });
  }

}
