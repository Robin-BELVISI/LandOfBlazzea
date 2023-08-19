import { GameObjects } from "phaser";

const runVelocity = 260;
const jumpVelocity = 460;
const healthPoints = 100;
const attackPower = 10;
const attackRange = 50;
const attackSpeed = 1;

const STATE = {
    WALK : function(left) {
        left ? (
            this.flipX = true,
            this.body.velocity.x > 0 && this.body.setVelocityX(this.body.velocity.x * -1)
        ) : (
            this.flipX = false,
            this.body.velocity.x < 0 && this.body.setVelocityX(this.body.velocity.x * -1)
        );
    },
    ATTACK1 : function() {
        this.anims.play("attack_1", true);
    },
    ATTACK2 : function() {
        this.anims.play("attack_2", true);
    },
    ATTACK3 : function() {
        this.anims.play("attack_3", true);
    },
    JUMP : function() {
        this.body.setVelocityY(-jumpVelocity);
        this.anims.create("jump", true);
    } ,
    IDLE : function() {
        this.body.setVelocityX(0);
        this.anims.stop();
    },
    RUN : function(left) {
        left ? this.body.setVelocityX(-runVelocity) : this.body.setVelocityX(runVelocity);
        this.anims.play("run", true);
    },
    RUNATTACK : function(left) {
        left ? this.body.setVelocityX(-runVelocity) : this.body.setVelocityX(runVelocity);
        this.anims.play("runAttack", true);
    },
}

export default class Player extends GameObjects.Sprite {
    
    constructor(config) {
        super(config.scene, config.x, config.y, config.key); //key = frame
        this.scene.add.existing(this); //this line is necessary to add the sprite to the scene
        this.scene.physics.world.enableBody(this); //this line is necessary to add physics to the sprite
        this.body.setCollideWorldBounds(true); // this line is necessary to avoid the sprite to go out of the screen
        this.depth = 10;
        this.scene.physics.add.collider(this, this.scene.mapCollide);
        this.scene.physics.add.collider(this, this.scene.mapCollide2);
        this.scene.physics.add.collider(this, this.scene.mapCollide3);
        this.body.setSize(40, 96, true); //alter the hitbox of the player
        this.createAnimation.call(this, "walk_right", 0, 7, "playerWalk", true);
        this.createAnimation.call(this, "attack_1", 0, 3, "playerAttack1", true);
        this.createAnimation.call(this, "attack_2", 0, 3, "playerAttack2", true);
        this.createAnimation.call(this, "attack_3", 0, 2, "playerAttack3", true);
        this.createAnimation.call(this, "jump", 0, 3, "playerJump", true);
        this.createAnimation.call(this, "run", 0, 5, "playerRun", false);
        this.createAnimation.call(this, "runAttack", 0, 3, "playerRunAttack", true);
    } 

    
    createAnimation(name, startFrame, endFrame, spritesheet, isYoyo) {
      //cette fonction permet de créer les animations du joueur
      this.anims.create({
        key: name,
        frames: this.anims.generateFrameNumbers(spritesheet, {
          start: startFrame,
          end: endFrame,
        }),
        frameRate: 10,
        repeat: 0,
        yoyo: isYoyo,
      });
    }
    
    playerControl() {
        // console.log(this.body.velocity.x);
        //if no key is pressed
        if (this.scene.keys.left.isUp && this.scene.keys.right.isUp && this.scene.keys.up.isUp && this.scene.keys.action.isUp && this.scene.keys.action2.isUp && this.scene.keys.action3.isUp && this.scene.keys.run.isUp) {
            if(!this.anims.isPlaying) { 
                this.anims.play("walk_right", true);
                this.currentState = STATE.IDLE.call(this);
            }

        }
        //JUMP CONTROL
        if ( this.scene.keys.up.isDown && this.body.blocked.down ) {
            this.currentState = STATE.JUMP.call(this);
        } 
        //ATTACK_1 CONTROL
        if (this.scene.keys.action.isDown) {
            this.currentState = STATE.ATTACK1.call(this);
        }     
        //ATTACK_2 CONTROL
        if (this.scene.keys.action2.isDown) {
            this.currentState = STATE.ATTACK2.call(this);
        }   
        //ATTACK_3 CONTROL
        if (this.scene.keys.action3.isDown) {
            this.currentState = STATE.ATTACK3.call(this);
        }     
        
        //LEFT CONTROL
        if (this.scene.keys.left.isDown) {
            this.currentState = STATE.WALK.call(this, true);
            if (this.scene.keys.run.isDown) {
                if(this.scene.keys.action.isUp && this.anims.currentAnim && this.anims.currentAnim.key != "runAttack") {
                    this.currentState = STATE.RUN.call(this, true);
                }
                else if (this.scene.keys.action.isDown) {
                    this.currentState = STATE.RUNATTACK.call(this, true);
                }
            }
            else this.body.setVelocityX(-160);

            if (this.scene.keys.action.isUp &&  !this.anims.isPlaying) {
                this.anims.play("walk_right", true);
            }

        } 

        //RIGHT CONTROL
        if (this.scene.keys.right.isDown) {
            this.currentState = STATE.WALK.call(this, false);
            if(this.scene.keys.run.isDown ) {
                if(this.scene.keys.action.isUp && this.anims.currentAnim && this.anims.currentAnim.key != "runAttack") {
                    this.currentState = STATE.RUN.call(this, false);
                }
                else if (this.scene.keys.action.isDown) {
                    this.currentState = STATE.RUNATTACK.call(this, false);
                }
            } 
            else this.body.setVelocityX(160);

            if (this.scene.keys.action.isUp &&  !this.anims.isPlaying) {
                this.anims.play("walk_right", true);
            }
        }

        //IDLE CONTROL
        if (this.scene.keys.left.isUp && this.scene.keys.right.isUp && this.anims.currentAnim && this.anims.currentAnim.key === "walk_right") {
            this.currentState = STATE.IDLE.call(this);
        } else if (this.scene.keys.left.isUp && this.scene.keys.right.isUp) {
            this.body.setVelocityX(0);
        }
    }
}