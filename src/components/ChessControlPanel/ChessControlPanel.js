export default {
  methods : {
    startNewGame () {
      this.$eventbus.$emit('new_game_started');
    }
  }
}
