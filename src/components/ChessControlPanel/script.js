export default {

  data () {
    return {
      player_color : 'white', //default player color is white
    }
  },

  methods : {
    startNewGame () {
      var gameOptions = {
        player_color : this.player_color
      };

      this.$eventbus.$emit('new_game_started', gameOptions);
    },

    saveCurrentGame () {
      this.$gameservice.saveCurrentGame();

      this.$eventbus.$emit('game_saved');
    }
  }
}
