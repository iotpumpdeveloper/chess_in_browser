export default {
  componentMap : { //register component locally
    'chessboard' : 'ChessBoard',
    'chess-status' : 'ChessStatus',
    'chess-controlpanel' : 'ChessControlPanel',
    'saved-games' : 'SavedGames',
  },

  data () {
    return {
      'welcome_message' : 'Welcome to the chess game!',
    }
  },

  beforeCreate () {
    var componentImports = [];
    var componentTagNames = [];
    for (var tagName in this.$options.__proto__.componentMap) {
      this.$options.__proto__.components[tagName] = {render: (h) => {}}; //by default no render function
      var compName = this.$options.__proto__.componentMap[tagName];
      componentTagNames.push(tagName);
      componentImports.push(System.import('../' + compName + '/component.vue'));
    }

    Promise.all(componentImports).then( (modules) => {
      for (var i = 0; i < modules.length; i ++ ) {
        var tagName = componentTagNames[i];
        this.$options.__proto__.components[tagName] = modules[i];
        this.$forceUpdate();
      }
    });
  }

}
