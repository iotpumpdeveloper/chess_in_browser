<template>
  <div id="main-content">
    <chess-portal></chess-portal>
  </div>
</template>

<script>
  document.title = "Welcome to The Chess Game!";

export default {
  components : { //register component locally
    'chess-portal' : require('./components/ChessPortal/component.vue') //one line require local components!!!
  }
}

  </script>
