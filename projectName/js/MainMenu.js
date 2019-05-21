// MainMenu

var game;

window.onload = function() {
	game = new Phaser.Game(600, 600, Phaser.AUTO);
	game.state.add('MainMenu', MainMenu);
	game.state.add('Level1', Level1);
	game.state.add('Level2', Level2);
	game.state.add('GameOver', GameOver);
	game.state.start('MainMenu');
}

var MainMenu = function(game) {};
MainMenu.prototype = {
  preload: function(){
    console.log('Mainmenu: preload');

    game.load.image('ground', 'assets/img/platform.png');
    game.load.image('spike', 'assets/img/spikes_24.png');
    game.load.image('heart', 'assets/img/heart_full.png');
    game.load.image('heartHalf', 'assets/img/heart_half.png');
    game.load.image('door', 'assets/img/door.png');
    game.load.audio('oof', 'assets/audio/oof.mp3');
    game.load.atlas('pAtlas', 'assets/img/player.png', 'assets/img/player.json');
    game.load.spritesheet('ghost', 'assets/img/ghost.png', 32, 24);
    game.load.spritesheet('player', 'assets/img/player2.png', 32, 24);
    game.stage.backgroundColor = "#8A8A8A";
  },
  create: function(){
    game.stage.backgroundColor = "#8A8A8A";
    //Starting screen text
    var gameText = game.add.text(180, 100, 'Illinois Johnny',
      { fontSize: '32px', fill: '#FFF' });
    var startText1 = game.add.text(110, 150, 'Use arrow keys to move.',
      { fontSize: '32px', fill: '#FFF' });
    var startText2 = game.add.text(130, 200, 'Press [space] to start.',
      { fontSize: '32px', fill: '#FFF' });
    console.log('Mainmenu: create');
  },
  update: function(){
    if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)){
      game.state.start('Level1');
    }
  }
}
