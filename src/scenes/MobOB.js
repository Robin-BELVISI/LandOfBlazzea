import { GameObjects } from "phaser";

const runVelocityX = 260;



export default class MobOB extends GameObjects.Sprite {

    STATE = {
        WALK : function(left) {
            left ? (
                this.flipX = true,
                this.body.velocity.x > 0 && this.body.setVelocityX(this.body.velocity.x * -1),
                this.anims.play("walk_right", true)
                ) : (
                    this.flipX = false,
                    this.body.velocity.x < 0 && this.body.setVelocityX(this.body.velocity.x * -1),
                    this.anims.play("walk_right", true)
            );
        }.bind(this),

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
            this.body.setVelocityY(-260);
            this.anims.play("jump", true);
        } ,
        IDLE : function() {
            this.body.setVelocityX(0);
            this.anims.stop();
        },
        RUN : function(left) {
            left ? this.body.setVelocityX(-runVelocityX) : this.body.setVelocityX(runVelocityX);
            this.anims.play("run", true);
        },
        RUNATTACK : function(left) {
            left ? this.body.setVelocityX(-runVelocityX) : this.body.setVelocityX(runVelocityX);
            this.anims.play("runAttack", true);
        },
    }
    
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
        this.createAnimation.call(this, "walk_right", 0, 7, "mobOBWalk", true);
        this.createAnimation.call(this, "attack_1", 0, 3, "mobOBAttack1", true);
        this.createAnimation.call(this, "attack_2", 0, 4, "mobOBAttack2", true);
        this.createAnimation.call(this, "attack_3", 0, 1, "mobOBAttack3", true);
        this.createAnimation.call(this, "jump", 0, 4, "mobOBJump", true);
        this.createAnimation.call(this, "run", 0, 5, "mobOBRun", false);
        this.createAnimation.call(this, "runAttack", 0, 4, "mobOBRunAttack", true);
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
    
    // moveMob(direction) {
    //     const speed = 150;
    //     if (direction === 0) {
    //         console.log("right mob");
    //         this.body.setVelocity(speed);
    //         this.flipX = false;
    //     } else {
    //         console.log("left mob");
    //         this.body.setVelocity(-speed);
    //         this.flipX = true;
    //     }
    // }
}