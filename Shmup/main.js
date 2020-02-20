


var game = new Phaser.Game(360, 590,Phaser.CANVAS, 'gamewindow');


var starfield;


var player;


var bullets;
var bulletTime = 0;


var enemies;

var score = 0;
var scoreText;
var winText;
var button;


var fire = false;
var left = false;
var right = false;



var mainState = {
    preload:function(){
    	game.load.image('starfield',"assets/starfield.png");
    	game.load.image('player',"assets/player.png" );
    	game.load.image('bullet',"assets/bullet.png" );
    	game.load.image('enemy',"assets/enemy.png" );
        game.load.image('buttonleft', "assets/leftkey.png")
        game.load.image('buttonright', "assets/rightkey.png")
        game.load.image('buttonfire', "assets/buttonfire.png")
        game.load.image('button',"assets/button.png")
        },

    create:function(){

    	
         starfield = game.add.tileSprite(0, 0, 800, 600, 'starfield');
    	 player = game.add.sprite(game.world.centerX, game.world.centerY + 200, 'player');
    	 game.physics.enable(player, Phaser.Physics.ARCADE);
    	 player.body.collideWorldBounds = true;
    	 


    	 buttonleft = game.add.button(0, 460, 'buttonleft', null, this, 0, 1, 0, 1);
         buttonleft.fixedToCamera = true;
         buttonleft.events.onInputOver.add(function(){left=true;});
         buttonleft.events.onInputOut.add(function(){left=false;});
         buttonleft.events.onInputDown.add(function(){left=true;});
         buttonleft.events.onInputUp.add(function(){left=false;});

         buttonright = game.add.button(100, 460, 'buttonright', null, this, 0, 1, 0, 1);
         buttonright.fixedToCamera = true;
         buttonright.events.onInputOver.add(function(){right=true;});
         buttonright.events.onInputOut.add(function(){right=false;});
         buttonright.events.onInputDown.add(function(){right=true;});
         buttonright.events.onInputUp.add(function(){right=false;});

         buttonfire = game.add.button(280, 460, 'buttonfire', null, this, 0, 1, 0, 1);
         buttonfire.fixedToCamera = true;
         buttonfire.events.onInputOver.add(function(){fire=true;});
         buttonfire.events.onInputOut.add(function(){fire=false;});
         buttonfire.events.onInputDown.add(function(){fire=true;});
         buttonfire.events.onInputUp.add(function(){fire=false;});  

    	 bullets = game.add.group();
    	 bullets.enableBody = true;
    	 bullets.physicsBodyType = Phaser.Physics.ARCADE;
    	 bullets.createMultiple(30, 'bullet');
    	 bullets.setAll('anchor.x', 0.5);
    	 bullets.setAll('anchor.y', 1);
    	 bullets.setAll('outOfBoundsKill', true);
    	 bullets.setAll('checkWorldBounds', true);


    	 enemies = game.add.group();
    	 enemies.enableBody = true;
    	 enemies.physicsBodyType = Phaser.Physics.ARCADE;

    	 createEnemies();

    	 scoreText = game.add.text(0, 530, 'Score: ', {font: '20px Arial', fill: '#fff'});
    	 winText = game.add.text(110, 120, 'YOU WIN!', {font: '32px Arial', fill: '#fff'});
    	 winText.visible = false;
    	 
    	 button = game.add.button(145, 200, 'button', actionOnClick);
    	 button.visible = false;
    	 
    	 
         


    },

    update:function(){

    	game.physics.arcade.overlap(bullets, enemies, collisionHandler, null, this);

    	player.body.velocity.x = 0;
       
        starfield.tilePosition.y += 2;

         if (left) { 

            player.body.velocity.x = -350; 
            
        }

         if (right) {

            player.body.velocity.x = 350;

         }


         if (fire) {  
           
            fireBullet();

         }


         scoreText.text = 'Score: ' + score;

        if(score == 2400){
        	winText.visible = true;
        	player.body.velocity = 0;
        	fire = false;
        	button.visible = true;
        }


       
    },
}


function fireBullet(){

	if(game.time.now > bulletTime){

		bullet = bullets.getFirstExists(false);

		if(bullet){
			bullet.reset(player.x + 24, player.y);
			bullet.body.velocity.y = -400;
			bulletTime = game.time.now + 200;
		}
	}

}


function createEnemies(){ 
     for(var y = 0; y < 4; y++){
     	for(var x = 0; x < 6; x++){
     		var enemy = enemies.create(x*48, y*50, 'enemy');
     		enemy.anchor.setTo(0.5, 0.5);
     	}
     }

     enemies.x = 30;
     enemies.y = 50;

     var tween = game.add.tween(enemies).to({x:80}, 2000, Phaser.Easing.Linear.None, true, 0, 500, true);

     tween.onRepeat.add(descend,this);
}


function descend(){
	enemies.y +=10;
}


function collisionHandler(bullet, enemy){
	bullet.kill();
	enemy.kill();

	score +=100;
}

function actionOnClick() {
    
    game.state.restart();
    score = 0;
    winText.visible = false;
    player.body.velocity = 350;
    button.visible = false;    

}



game.state.add('mainState', mainState);

game.state.start('mainState');