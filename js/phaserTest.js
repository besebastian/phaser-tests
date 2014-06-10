/* globals Phaser */
var game = new Phaser.Game(800, 600, Phaser.AUTO, '', {
    preload: preload,
    create: create,
    update: update
});

function preload() {
    'use strict';
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

var platforms;
var player;
var keys;
var stars;
var score = 0;
var scoreText;

function create() {
    'use strict';
    game.world.setBounds(0, 0, 1600, 1200);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    platforms.enableBody = true;

    scoreText = game.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000'});

    keys = {
        left: game.input.keyboard.addKey(Phaser.Keyboard.A),
        right: game.input.keyboard.addKey(Phaser.Keyboard.D),
        up: game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    };

    stars = game.add.group();
    stars.enableBody = true;

    for (var i = 0; i < 12; i++) {
        var star = stars.create(i * 70, 0, 'star');
        star.body.gravity.y = 6;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }

    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 5);
    ground.body.immovable = true;

    var ledge = platforms.create(400, 400, 'ground');
    ledge.body.immovable = true;
    ledge = platforms.create(-150, 250, 'ground');
    ledge.body.immovable = true;

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);
}

function update() {
    'use strict';
    game.physics.arcade.collide(player, platforms);

    game.physics.arcade.collide(stars, platforms);

    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    if (keys.left.isDown) {
        player.body.velocity.x = -150;
        player.animations.play('left');
    } else if (keys.right.isDown) {
        player.body.velocity.x = 150;
        player.animations.play('right');
    } else {
        player.animations.stop();
        player.frame = 4;
        player.body.velocity.x = 0;
    }

    if (keys.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -350;
    }
}

function collectStar(player, star) {
    'use strict';
    star.kill();
    score += 10;
    scoreText.text = 'Score: ' + score;
}