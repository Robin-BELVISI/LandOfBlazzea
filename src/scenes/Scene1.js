import { Scene } from "phaser";
import MobOB from "./MobOB";
import Player from "./Player";
import { type } from "os";
import { pipeline } from "stream";
import KawaseBlurPipelinePlugin from "phaser3-rex-plugins/plugins/kawaseblurpipeline";
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline";
import KawaseBlurFilterPostFxPipeline from "phaser3-rex-plugins/plugins/kawaseblurpipeline";
import Game from "../components/Game";


export default class Scene1 extends Scene {

  /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
  keys;

  /** @type {Player} */
  player;

  /** @type {MobOB}*/
  mobOB;

  /** @type {Array<Phaser.GameObjects>} */
  buttons = [];
  /** @type {Array<Phaser.GameObjects>} */
  texts = [];

  buttonsChilds = [];

  // music = this.scene.get('MainMenu').music;
  music = {};
  soundButton = {};

  tilesetKey = 'buttonDefault';
  container;
  menu;
  sceneCenterX = window.innerWidth / 2;
  sceneCenterY = window.innerHeight / 2;
  offsetTimeMusic = 580; 

  constructor() {
    super("scene1");
    // this.fpsText = null; // Variable pour stocker la référence du texte du FPS
    // this.fpsRectangle = null; // Variable pour stocker la référence du rectangle
    this.zoomFactor = 2;
  }

  init() {
    this.scene.get("mainMenu").scene.stop();
    this.scene.get("panelMainMenu").scene.stop();
  } // Called before preload()
  
  create() {
    console.log(this);
    
    this.initMap();
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.SPACE,
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      down: Phaser.Input.Keyboard.KeyCodes.DOWN,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      action: Phaser.Input.Keyboard.KeyCodes.E,
      action2: Phaser.Input.Keyboard.KeyCodes.Z,
      action3: Phaser.Input.Keyboard.KeyCodes.R,
      run: Phaser.Input.Keyboard.KeyCodes.SHIFT,
      escape: Phaser.Input.Keyboard.KeyCodes.ESC,
    }); // définit des touches personnalisées
    
    this.player = new Player({ scene: this, x: 32, y: window.innerHeight-64, key: "playerWalk" })
    this.mobOB = new MobOB({ scene: this, x:332, y: window.innerHeight-640, key: "mobOBWalk"})
    
    this.initMobs();
    
    // this.cameras.main.setBounds(0, 0, this.map.width, this.map.height);
    
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true; // évite le flou des textures
    this.cameras.main.setZoom(this.zoomFactor);
    this.cameras.main.preRender(1);
    
    // /** Rectangle d'affichage des FPS */
    // this.fpsBox();
    /** Affichage des FPS dans le rectangle */
    this.showFps();
    // console.log("cameras.main width height : "+this.cameras.main.width , this.cameras.main.height);
    this.scene.launch("UI");
    this.scene.get("UI").scene.bringToTop();
    
    // this.scene.launch("panelMainMenu");
  }
  
  fpsBox() {
    this.cameras.main.preRender(1);
    console.log(this.cameras.main.width);
    console.log(this.cameras.main.worldView.width);
    const x =  (this.cameras.main.width - this.cameras.main.worldView.width) / (2+this.zoomFactor);
    const y =  (this.cameras.main.height - this.cameras.main.worldView.height) / (2+this.zoomFactor);
    console.log("x : "+x+" y : "+y);
    this.fpsContainer = this.add.container(x,y);
    const background = this.rexUI.add.roundRectangle(x + 65, y + 20, 120, 40, 20, 0x000000, 0.5);
    this.fpsText = this.add.text(x + 65, y + 20, '0', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
    this.fpsContainer.add([background, this.fpsText]);
    this.fpsContainer.setScrollFactor(0,0);
    this.fpsContainer.setDepth(1000);
  }
  
  showFps() {
    const getFps = this.utilsFpsDisplay(this);
    // Mettre à jour le texte avec la valeur de fps à chaque intervalle
    setInterval(() => {
      const fps = getFps();
      if (this.fpsText) {
        this.fpsText.setText(fps);
      }
    }, 500);
  }
  
  utilsFpsDisplay(scene) {
    let fps = 0;
    
    setInterval(() => {
      fps = Math.round(scene.game.loop.actualFps);
    }, 500);

    return () => fps;
  }

  update() {
    //IF THIS SCENE IS NOT PAUSED, STOP SCENE "panelGameMenu"
    // this.scene.get("panelGameMenu").scene.stop();

    console.log(this.player.x , this.player.y);
    this.physics.collide(this.player, this.mapCollide);
    //if escape is pressed, go to main menu
    if (this.keys.escape.isDown) {
      this.scene.launch("panelGameMenu");
      this.scene.pause();
    }
    this.player.playerControl();
    
    // Vérifier si le mob a atteint sa destination et changer de direction si nécessaire
    if (this.mobOB.body.velocity.x > 0 && this.mobOB.x >= this.mobMoveTargetX
      || this.mobOB.body.velocity.x < 0 && this.mobOB.x <= this.mobMoveTargetX) {
        this.mobOB.body.setVelocityX(0);
        this.mobOB.anims.stop();
        this.mobMoveTimer.paused = false;
    }
  }
  
  
  initMap() {
    this.map = this.make.tilemap({ key: "donjonMap" }); //the key should be the same as the name of the json file
    this.map.addTilesetImage("twilight-tiles", "tileset");
    for (let i = 0; i < this.map.layers.length; i++) {
      const layerData = this.map.layers[i];
      const layer = this.map.createLayer(layerData.name, "twilight-tiles", 0, 0);
      if(layerData.name === 'Collide') {
        layer.setCollisionBetween(1, 999, true, 'Collide'); 
        // layer.setCollisionByProperty({ collide: true });
        this.mapCollide = layer;
        console.log("layer : "+this.mapCollide);
      }
      if(layerData.name === 'Collide2') {
        layer.setCollisionBetween(1, 999, true, 'Collide2'); 
        // layer.setCollisionByProperty({ collide: true });
        this.mapCollide2 = layer;
      }
      if(layerData.name === 'Collide3') {
        layer.setCollisionBetween(1, 999, true, 'Collide3'); 
        // layer.setCollisionByProperty({ collide: true });
        this.mapCollide3 = layer;
      }
      // layer.x += 40;
      layer.scale = 1.5;
    }
  }

  initMobs() {
    const mobDefaultDistance = 50;
    // Définir le déplacement initial du mob
    this.setMobMoveDirection(mobDefaultDistance);

    // Créer le timer qui déclenche l'événement de déplacement du mob toutes les 3 secondes
    this.mobMoveTimer = this.time.addEvent({
      delay: 3000,
      callback: () => this.setMobMoveDirection(mobDefaultDistance),
      callbackScope: this,
      loop: true,
    });
  }

  setMobMoveDirection(distance) {
    const speed = 150;
    const direction = Math.floor(Math.random() * 2); // 0 = droite, 1 = gauche

    if (direction === 0) {
      this.mobOB.body.setVelocityX(speed);
      this.mobOB.STATE.WALK.call(direction);
      this.mobMoveTargetX = this.mobOB.x + distance;
    } else {
      this.mobOB.body.setVelocityX(-speed);
      this.mobOB.STATE.WALK.call(direction);
      this.mobMoveTargetX = this.mobOB.x - distance;
    }
  }
}

