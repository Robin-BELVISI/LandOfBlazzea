import { Scene } from "phaser";

export default class Preloader extends Scene {
  constructor() {
    super("preloader");
  }

  preload() {
    this.load.spritesheet("playerWalk", "assets/Orc_Warrior/Walk.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("playerAttack1", "assets/Orc_Warrior/Attack_1.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("playerAttack2", "assets/Orc_Warrior/Attack_2.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("playerAttack3", "assets/Orc_Warrior/Attack_3.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("playerJump", "assets/Orc_Warrior/Jump.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("playerRun", "assets/Orc_Warrior/Run.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("playerRunAttack", "assets/Orc_Warrior/Run+Attack.png", {
      frameWidth: 96,
      frameHeight: 96,
    });

    this.load.spritesheet("mobOBWalk", "assets/Orc_Berserk/Walk.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("mobOBAttack1", "assets/Orc_Berserk/Attack_1.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("mobOBAttack2", "assets/Orc_Berserk/Attack_2.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("mobOBAttack3", "assets/Orc_Berserk/Attack_3.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("mobOBJump", "assets/Orc_Berserk/Jump.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("mobOBRun", "assets/Orc_Berserk/Run.png", {
      frameWidth: 96,
      frameHeight: 96,
    });
    this.load.spritesheet("mobOBRunAttack", "assets/Orc_Berserk/Run+Attack.png", {
      frameWidth: 96,
      frameHeight: 96,
    });

    this.load.tilemapTiledJSON("donjonMap", "assets/tilemaps/dungeon.json");
    this.load.image("tileset", "assets/tilesets/twilight-tiles.png");

    this.load.image("backgroundMenu", "assets/background.jpg");
    this.load.image("bgFrontElements", "assets/background/bgFrontElements.png");
    this.load.image("element01", "assets/background/elements/elm01.png");
    this.load.image("element02", "assets/background/elements/elm02.png");
    this.load.image("element03", "assets/background/elements/elm03.png");
    this.load.image("element04", "assets/background/elements/elm04.png");
    this.load.image("element05", "assets/background/elements/elm05.png");
    this.load.image("bgFront", "assets/background/bgFront.png");
    this.load.image("bgMid01", "assets/background/bgMid01.png");
    this.load.image("bgMid02", "assets/background/bgMid02.png");  
    this.load.image("bgBehind", "assets/background/bgBehind.png");

    this.load.image("titleMenu", "assets/titleMainMenu.png");
    this.load.image("pressAnyKeyText", "assets/pressAnyKey.png");
    this.load.image('menuDefault', 'assets/UI_ELEMENTS/UI_ELEMENTS/previews/menu_default_00.png');
    this.load.spritesheet('buttonDefault', 'assets/UI_ELEMENTS/UI_ELEMENTS/previews/button_default_00.png', { frameWidth: 142, frameHeight: 28 });
  
    this.load.audio('intro', 'assets/audio/music/scrapland_menu_theme_intro.mp3');
    this.load.audio('selectionMenu', 'assets/audio/sound/Menu_Selection_Click.wav');
  
    let loadingBar = this.add.graphics({
      fillStyle: {
        color: 0xffffff //white
      }
    });
    
    /*
    Loader Events:
    complete - when done loading everything
    progress - loader number progress in decimal 
    */

    this.load.on('progress', (percent) => {
      loadingBar.fillRect(0, this.game.renderer.height / 2, this.game.renderer.width * percent, 50)
      console.log(percent);
    });
    
   
  }
  create() {
      this.scene.start("mainMenu");
  }
  

}
