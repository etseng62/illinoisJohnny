/*
Game: Illinois Johnny
Group #: 55
Names: Joey Cressa, Eric Tseng, Sandy Evsanaa
Github: https://github.com/jcressa/illinoisJohnny
*/

var playerGravity = 2000;
var playerJump = 725
var playerSpeed = 350;
var yHeart = 16;
var hurt = false;
var heartNum = 3;
var heart1;
var heart2;
var heart3;
var dead = false;
var ghostCounter = 0;
var last = 0;
var lastFrame = 5;
var ivCount = 0;
var ivFrame = false;
var paused = false;
var pauseText;
var count = 0;

var Level1 = function(game) {this.ghost;};
Level1.prototype = {
  preload: function(){
    console.log('Play: preload');
    game.load.tilemap('level', 'assets/img/B1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.spritesheet('tilesheet', 'assets/img/B1.png');
    game.load.image('B1', 'assets/img/B1.png');
    //game.load.sprite('background', 'assets/img/background.png');
  },
  create: function(){
    console.log('Play: create');
    //Reset player to alive state
    dead = false;
    heartNum = 3;
    //Enable physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);
    //Set world bounds
    game.world.setBounds(0, 0, 600, 1200);

    //Add noise
    oof = game.add.audio('oof');

    //Background
    back = game.add.sprite(0, 0, 'background');
    level = game.add.sprite(0,0, 'B1');
    this.map = game.add.tilemap('level');
    this.map.addTilesetImage('textures', 'tilesheet');
    this.map.setCollisionByExclusion([]);
    mapLayer = this.map.createLayer('Tile Layer 1');
    mapLayer.resizeWorld();

    //Spikes
    spikes = game.add.group();
    makeSpikes(504, 288, 4);
    makeSpikes(384, 528, 5);
    makeSpikes(120, 648, 3);
    makeSpikes(408, 960, 4);
    makeSpikes(0, 1128, 12);

    //door
    door = game.add.sprite(450, 1050, 'door');
    door.scale.setTo(.15, .15);
    game.physics.arcade.enable(door);
    door.body.setSize(200,400,280,300);

    //Player
    player = game.add.sprite(32, 32, 'player', '0');
    player.anchor.set(0.5);
    player.scale.setTo(1.5, 1.5);
    game.physics.arcade.enable(player);
    player.body.setSize(13, 32, 10, 0);
    player.body.bounce.y = 0;
    player.body.gravity.y = playerGravity;
    player.body.collideWorldBounds = true;

    //Animations
    //Moving player left
    pLeft = player.animations.add('left', [4, 5, 6], 10, true);
    //Moving player right
    pRight = player.animations.add('right', [1, 2, 3], 10, true);

    //Hitboxes
    hitboxes = game.add.group();
    hitboxes.enableBody = true;
    player.addChild(hitboxes);
    sideAtt = hitboxes.create(0,0,null);
    sideAtt.body.enable = false;

    //Create ghosts
     g1Vel = game.rnd.integerInRange(-40,40);
     g2Vel = game.rnd.integerInRange(-40,40);
     g3Vel = game.rnd.integerInRange(-40,40);
     g4Vel = game.rnd.integerInRange(-40,40);
     g5Vel = game.rnd.integerInRange(-40,40);
    this.ghost1 = new ghosts(game, 'ghost', '4', 130, 920, g1Vel, 1.5);
    game.add.existing(this.ghost1);
    this.ghost2 = new ghosts(game, 'ghost', '4', 400, 160, g2Vel, 1.5);
    game.add.existing(this.ghost2);
    this.ghost3 = new ghosts(game, 'ghost', '4', 340, 1110, g3Vel, 1.5);
    game.add.existing(this.ghost3);
    this.ghost4 = new ghosts(game, 'ghost', '4', 430, 920, g4Vel, 1.5);
    game.add.existing(this.ghost4);
    this.ghost5 = new ghosts(game, 'ghost', '4', 240, 1000, g5Vel, 1.5);
    game.add.existing(this.ghost5);
    
    // Create Mummies
    this.mummy1 = new mummies(game, 'mummy', '2', 48,264, 1.3);
    game.add.existing(this.mummy1);
    this.mummy2 = new mummies(game, 'mummy', '2', 360, 744, 1.3);
    game.add.existing(this.mummy2);
    this.mummy3 = new mummies(game, 'mummy', '2', 216, 744, 1.3);
    game.add.existing(this.mummy3);
    this.mummy4 = new mummies(game, 'mummy', '2', 552, 744, 1.3);
    game.add.existing(this.mummy4);
    this.mummy5 = new mummies(game, 'mummy', '2', 384, 506, 1.3);
    game.add.existing(this.mummy5);

    //Invisible walls
    walls = game.add.group();
    makeWalls(144,288);
    makeWalls(96, 768);
    makeWalls(168, 768);
    makeWalls(408,768);
    makeWalls(480, 768);
    makeWalls(264, 528);

    //black
    //black = game.add.sprite(0, 0, 'black');
    //light
    light = game.add.sprite(0, 0, 'light');
    game.physics.arcade.enable(light);
    light.scale.setTo(1.75, 1.75);
    light.anchor.set(0.5);
    light.alpha = 0.9;


    //Hearts
    hearts = game.add.group();
    health(heartNum);

    //Pause text
    pauseText = game.add.text(game.camera.x + 120, game.camera.y + 250, 'Paused', { fontSize: '100px', fill: '#000' });
    pauseText.alpha = 0;

    // make camera follow player
    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER, 0.2, 0.2);
  },
  update: function(){
    //light movement
    light.body.x = player.body.x - 840;
    light.body.y = player.body.y - 890;

    //Hearts move ith camera
    hearts.y = game.camera.y + 16;
    //Player collisions
    game.physics.arcade.collide(player, mapLayer);

    //Creates collision between player and platforms
    this.isGrounded = player.body.blocked.down;
    //var hitGround = game.physics.arcade.collide(player, this.mapLayer);
    cursors = game.input.keyboard.createCursorKeys();
    //Stop moving player
    player.body.velocity.x = 0;

    if(paused == false){
      if(cursors.left.isDown){
        //Moving left
        player.body.velocity.x = -playerSpeed;
        player.animations.play('left');
        last = 0;
        lastFrame = 4;
      }else if(cursors.right.isDown){
        //Moving right
        player.body.velocity.x = playerSpeed;
        player.animations.play('right');
        last = 1;
        lastFrame = 1;
      }else{
        //Standing
        if(last == 0){
          //player.animations.play('iLeft');
          player.frame = 4;
        } else {
          //player.animations.play('iRight');
          player.frame = 1;
        }
        //player.frame = 4;
      }
      player.body.gravity.y = playerGravity;

      //Player can jump if they're on the ground
      if (cursors.up.isDown && this.isGrounded){
        player.body.velocity.y = -playerJump;
      }
    }

    //Plays sound and decrements health when the player hits spikes
    if(game.physics.arcade.overlap(player, spikes) == true && hurt == false
    && ivFrame == false){
      oof.play();
      hurt = true;
      heartNum -= .5;
      health(heartNum);
      if(ivFrame == false){
        ivFrame = true;
      }
    }

    //Plays sound and decrements health when the player hits ghost
    if(game.physics.arcade.overlap(player, this.ghost1) == true
    && hurt == false && ivFrame == false && !this.ghost1.body.touching.up && !player.body.touching.down){
      ouch();
    } else if(game.physics.arcade.overlap(player, this.ghost2) == true
    && hurt == false && ivFrame == false && !this.ghost2.body.touching.up && !player.body.touching.down){
      ouch();
    } else if(game.physics.arcade.overlap(player, this.ghost3) == true
    && hurt == false && ivFrame == false && !this.ghost3.body.touching.up && !player.body.touching.down){
      ouch();
    } else if(game.physics.arcade.overlap(player, this.ghost4) == true
    && hurt == false && ivFrame == false && !this.ghost4.body.touching.up && !player.body.touching.down){
      ouch();
    } else if(game.physics.arcade.overlap(player, this.ghost5) == true
    && hurt == false && ivFrame == false && !this.ghost5.body.touching.up && !player.body.touching.down){
      ouch();
    }

    //IV Frames
    if(ivFrame == true){
      if(ivCount < 120){
        player.alpha = 0.5;
        ivCount++;
      } else {
        player.alpha = 1;
        ivFrame = false;
        ivCount = 0;
        hurt = false;
      }
    }

    //In-game pause
    if(game.input.keyboard.downDuration(Phaser.Keyboard.P)){
      if(paused == false){
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
        player.body.gravity.y = 0;
        player.animations.stop(null, true);
        paused = true;
        pauseText.x = game.camera.x + 120;
        pauseText.y = game.camera.y + 250;
        pauseText.alpha = 1;
      } else {
        paused = false;
        player.animations.play('left');
        player.body.gravity.y = playerGravity;
        pauseText.alpha = 0;
      }
    }

    //Checks if the player has moved off of the spikes to reset
    if(game.physics.arcade.overlap(player, spikes) == false
    && game.physics.arcade.overlap(player, this.ghost1) == false
    && game.physics.arcade.overlap(player, this.ghost2) == false
    && game.physics.arcade.overlap(player, this.ghost3) == false
    && game.physics.arcade.overlap(player, this.ghost4) == false
    && game.physics.arcade.overlap(player, this.ghost5) == false
    && hurt == true && ivFrame == false){
      hurt = false;
    }

    //Attack
    if(game.input.keyboard.downDuration(Phaser.Keyboard.F)){
      makeHitBox();
      game.time.events.add(Phaser.Timer.SECOND * 1, killBox, this);
    }

    //door
    if(game.physics.arcade.overlap(player, door) == true){
      game.state.start('Level2');
    }

    //Death
    if(dead == true){
      game.state.start('GameOver');
    }
  },
  render: function(){
    //game.debug.body(sideAtt);
    //game.debug.body(player);
    //game.debug.body(ghost);
    //game.debug.body(door);
  }
}

//Creates a line of spikes
function makeSpikes(xPos, yPos, n){
  for(var i = 0; i < n; i += 1){
    var spike = spikes.create(xPos,yPos, 'spike');
    game.physics.arcade.enable(spike);
    spike.enableBody = true;
    spike.body.immovable = true;
    xPos += 24;
  }
}

//Creates invisible walls so mummies don't fall off
function makeWalls(xPos, yPos){
  var wall = walls.create(xPos, yPos, 'wall');
  game.physics.arcade.enable(wall);
  wall.enableBody = true;
  wall.body.immovable = true;
  wall.body.gravity = false;
  wall.alpha = 0;
}

//Creates players attack hitbox
function makeHitBox(){
  //Side Attack
  attacked = true;
  sideAtt = hitboxes.create(0,0,null);
  sideAtt.body.setSize(0,0,0,0);
  if(last == 0){
    //sideAtt.scale.setTo(-1, 1);
    sideAtt.body.setSize(48,16,-50,-10);
  } else if(last == 1){
    //sideAtt.scale.setTo(1, 1);
    sideAtt.body.setSize(48,16, 0, -10);
  }
  sideAtt.body.allowGravity = false;
  sideAtt.body.enable = true;
}

//Destroys the hitbox off the attack
function killBox(){
  sideAtt.destroy();
}

function ouch(){
  oof.play();
  hurt = true;
  heartNum -= .5;
  health(heartNum);
  if(ivFrame == false){
    ivFrame = true;
  }
}

//Updates the players current health
function health(heartNum){
  hearts = game.add.group();
  //Kills off previous heart sprites and creates new updated health
  if(heartNum == 3){
    heart1 = hearts.create(225,yHeart, 'heart');
    heart2 = hearts.create(275,yHeart, 'heart');
    heart3 = hearts.create(325,yHeart, 'heart');
  } else if(heartNum == 2.5){
    heart1.kill();
    heart2.kill();
    heart3.kill();
    heart1 = hearts.create(225,yHeart, 'heart');
    heart2 = hearts.create(275,yHeart, 'heart');
    heart3 = hearts.create(325,yHeart, 'heartHalf');
  } else if(heartNum == 2){
    heart1.kill();
    heart2.kill();
    heart3.kill();
    heart1 = hearts.create(225,yHeart, 'heart');
    heart2 = hearts.create(275,yHeart, 'heart');
  } else if(heartNum == 1.5){
    heart1.kill();
    heart2.kill();
    heart1 = hearts.create(225,yHeart, 'heart');
    heart2 = hearts.create(275,yHeart, 'heartHalf');
  } else if(heartNum == 1){
    heart1.kill();
    heart2.kill();
    heart1 = hearts.create(225,yHeart, 'heart');
  } else if(heartNum == .5){
    heart1.kill();
    heart1 = hearts.create(225,yHeart, 'heartHalf');
  } else {
    heart1.kill();
    dead = true;
  }
}
