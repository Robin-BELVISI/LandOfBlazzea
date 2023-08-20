import { type } from "os";
import { Scene } from "phaser";
import { pipeline } from "stream";
import KawaseBlurPipelinePlugin from "phaser3-rex-plugins/plugins/kawaseblurpipeline";
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline";
import KawaseBlurFilterPostFxPipeline from "phaser3-rex-plugins/plugins/kawaseblurpipeline";
import Game from "../components/Game";

export default class MainMenu extends Scene {
  /** @type {Array<Phaser.GameObjects>} */
  buttons = [];
  /** @type {Array<Phaser.GameObjects>} */
  texts = [];
  /** @type {Phaser.GameObjects.Image} */
  backgroundImg;
  /** @type {Array<Phaser.GameObjects.Image>} */
  backgroundImgs = [];
  /** @type {Array<Phaser.GameObjects.Image>} */
  elementsImgs = [];
  /** @type {Phaser.GameObjects.Image} */
  titleImg;
  /** @type {Phaser.GameObjects.Image} */
  menuImg;

  buttonsChilds = [];

  music = {};
  soundButton = {};

  tilesetKey = 'buttonDefault';
  pressAnyKeyText;
  isAnyKeyPressed = false;
  titlePipelineInstance;
  backgroundPipelineInstance = [];
  elementsPipelineInstance = [];
  elementsPosition = {
    element01: {x: 362, y: 372},
    element02: {x: 412, y: 468},
    element03: {x: 1137, y: 293},
    element04: {x: 1153, y: 546},
    element05: {x: 1209, y: 590},
  };

  container;
  menu;
  layer;
  perspective = {};
  isPerspective = false;
  containerScaleFactor = 1;
  background;

  sceneCenterX = window.innerWidth / 2;
  sceneCenterY = window.innerHeight / 2; 
  offsetTimeMusic = 580;

  topLeft;
  topRight;
  bottomLeft;
  bottomRight;

  isStarted;

  constructor() {
    super("mainMenu");
  }

  init() {
    this.music = this.sound.add('intro');
    this.soundButton = this.sound.add('selectionMenu');
    this.backgroundImgs = [];
    this.elementsImgs = [];
    this.perspective = {};
    this.isPerspective = false;
    this.isAnyKeyPressed = false;
    this.titlePipelineInstance;
    this.backgroundPipelineInstance = [];
    this.elementsPipelineInstance = [];
    this.elementsPosition = {
      element01: {x: 362, y: 372},
      element02: {x: 412, y: 468},
      element03: {x: 1137, y: 293},
      element04: {x: 1153, y: 546},
      element05: {x: 1209, y: 590},
    };
  } // Called before preload()
  
  create() {
    console.log("mainMenu");
    console.log(this);
    // this.container = this.add.container(0, 0).setDepth(20);
    // this.container = this.add.rexContainerLite(0, 0, window.innerWidth, window.innerHeight).setDepth(20).setOrigin(0.5);

    this.container = this.rexUI.add.label({
      width: 300, height: 400,
      orientation: 1,
      // background: this.add.image(window.innerWidth/2, window.innerHeight/2+28, "menuDefault").setOrigin(0.5, 0.5).setScale(2.5).setDepth(20),
      // text: this.add.text(this.sceneCenterX, this.sceneCenterY, "content", {
      //     wordWrap: { width: 300 - 20 - 20 }
      // }),
      // icon: this.rexUI.add.roundRectangle(this.sceneCenterX, this.sceneCenterY, 160, 160, 20, COLOR_DARK),
      space: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
          icon: 10,
        }
      }).layout();
      
    this.container.setPosition(this.sceneCenterX, this.sceneCenterY + 28);

    // this.container.enableLayer();
    // this.layer = this.container.getLayer();
    this.perspective = this.rexUI.add.perspective(this.container, { 
      useParentBounds: false,
    });

    this.displayBeforeMenu();
    this.pressAnyKeyAnimation();
    this.applyBlurEffects();
    //click or any key press event to change the quality
    this.input.keyboard.on('keydown', (event) =>{
      this.isAnyKeyPressed = true;
      console.log("key down");
      if (this.backgroundPipelineInstance[0].quality === 12){
        this.backgroundPipelineInstance.forEach(pipeline => {
          pipeline.setBlur(0);
          pipeline.setQuality(1);
        });
        this.elementsPipelineInstance.forEach(pipeline => {
          pipeline.setBlur(0);
          pipeline.setQuality(1);
        });
        this.titlePipelineInstance.setBlur(0);
        this.titlePipelineInstance.setQuality(1);
        console.log("quality 0");
        this.pressAnyKeyText.destroy();
        this.displayMenu(this.container); 
        this.elementsFallAnimation();
        this.container.getLayer(0).setDepth(100);
        // this.perspective.enter();
        this.isPerspective = true;
      } 
    });
  }
  
  displayBeforeMenu() {
    this.elementsImgs.push(this.add.image(this.elementsPosition.element01.x, 0 , "element01").setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setDepth(3));
    this.elementsImgs.push(this.add.image(this.elementsPosition.element02.x, 0, "element02").setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setDepth(3));
    this.elementsImgs.push(this.add.image(this.elementsPosition.element03.x, 0, "element03").setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setDepth(3));
    this.elementsImgs.push(this.add.image(this.elementsPosition.element04.x, 0, "element04").setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setDepth(3));
    this.elementsImgs.push(this.add.image(this.elementsPosition.element05.x, 0, "element05").setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setDepth(3));
    this.backgroundImgs.push(this.add.image(window.innerWidth / 2, window.innerHeight / 2, "bgBehind").setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setDepth(0));
    this.backgroundImgs.push(this.add.image(window.innerWidth / 2, window.innerHeight / 2, "bgMid02").setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setDepth(1));
    this.backgroundImgs.push(this.add.image(window.innerWidth / 2, window.innerHeight / 2, "bgMid01").setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setDepth(2));
    this.backgroundImgs.push(this.add.image(window.innerWidth / 2, window.innerHeight / 2 , "bgFront").setOrigin(0.5).setDisplaySize(this.cameras.main.width, this.cameras.main.height).setDepth(9));
    this.titleImg = this.add.image(0, 0, "titleMenu").setOrigin(0.5, 0.5).setPosition(window.innerWidth/2, window.innerHeight/4).setDepth(10);
    this.container.add(this.titleImg);

    console.log(this.titleImg.x + " " + this.titleImg.y);
    this.backgroundImgs.forEach(img => {
      img.scene = this;
      img.scale = 1.2;
      // console.log("imgs xy : " + img.x + img.y);
    });
    this.elementsImgs.forEach(img => {
      img.scene = this;
      img.scale = 1.2;
    });
  }

  pressAnyKeyAnimation() {
    this.pressAnyKeyText = this.add.image(0, 0, "pressAnyKeyText");
    this.pressAnyKeyText.setOrigin(0.5).setPosition(window.innerWidth/2, window.innerHeight/1.5).setDepth(50);
    this.tweens.add({
      targets: this.pressAnyKeyText,
      scaleX: 1.2, // Facteur d'échelle pour le zoom
      scaleY: 1.2,
      duration: 1000, // Durée de l'animation (en millisecondes)
      yoyo: true, // Permet à l'animation d'alterner entre zoom et dézoom
      repeat: -1 // Répéter indéfiniment
    });
  }

  applyBlurEffects() {
    console.log("applyBlurEffects");
    this.backgroundPipelineInstance[0] = this.plugins.get('rexKawaseBlurPipeline').add(this.backgroundImgs[0], {
      blur: 4,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });
    this.backgroundPipelineInstance[1] = this.plugins.get('rexKawaseBlurPipeline').add(this.backgroundImgs[1], {
      blur: 4,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });
    this.backgroundPipelineInstance[2] = this.plugins.get('rexKawaseBlurPipeline').add(this.backgroundImgs[2], {
      blur: 4,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });
    this.backgroundPipelineInstance[3] = this.plugins.get('rexKawaseBlurPipeline').add(this.backgroundImgs[3], {
      blur: 4,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });

    this.titlePipelineInstance = this.plugins.get('rexKawaseBlurPipeline').add(this.titleImg, {
      blur: 2,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });
    this.elementsPipelineInstance[0] = this.plugins.get('rexKawaseBlurPipeline').add(this.elementsImgs[0], {
      blur: 2,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });
    this.elementsPipelineInstance[1] = this.plugins.get('rexKawaseBlurPipeline').add(this.elementsImgs[1], {
      blur: 2,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });
    this.elementsPipelineInstance[2] = this.plugins.get('rexKawaseBlurPipeline').add(this.elementsImgs[2], {
      blur: 2,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });
    this.elementsPipelineInstance[3] = this.plugins.get('rexKawaseBlurPipeline').add(this.elementsImgs[3], {
      blur: 2,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });
    this.elementsPipelineInstance[4] = this.plugins.get('rexKawaseBlurPipeline').add(this.elementsImgs[4], {
      blur: 2,
      quality: 12,
      pixelWidth: 1,
      pixelHeight: 1,
      name: 'rexKawaseBlurPostFx'
    });
  }
  
  displayMenu(container) {
    this.music.play();
    const flashRect = this.add.rectangle(0, 0, window.innerWidth, window.innerHeight, 0xffffff).setOrigin(0);
    flashRect.depth = 100;
    
    if(this.music.isPlaying) {
      this.time.delayedCall(this.offsetTimeMusic, () => {
        const flashTween = this.tweens.add({
          targets: flashRect,
          alpha: 0, // Transparence du rectangle (0 = totalement transparent, 1 = totalement opaque)
          duration: 500, // Durée de l'animation (en millisecondes)
          ease: 'Linear', // Effet de l'animation (ici, pas d'effet) effets : https://photonstorm.github.io/phaser3-docs/Phaser.Types.Tweens.html#.Easing
          repeat: 0, // Répéter indéfiniment
          yoyo: false // Alterner entre l'opacité et la transparence
        });
      }, [], this);
      //MENU CREATION
      // this.container.add(this.add.image(window.innerWidth/2, window.innerHeight/2+28, "menuDefault").setOrigin(0.5, 0.5).setScale(2.5).setDepth(20));
      // this.menuCreation();
      this.scene.launch("panelMainMenu", { music: this.music });
      // this.container.setScale(this.containerScaleFactor*1.5);
      // this.container.setPosition(window.innerWidth/2-(this.container.width/2)*this.containerScaleFactor*1.5, window.innerHeight/2-(this.container.height/2)*this.containerScaleFactor*1.5);
      // this.container.setPosition(window.innerWidth/2, window.innerHeight/2);
      console.log("layer width : " + this.container.width);
      // Créez une instance du pipeline de filtres Outline
      const outlinePipeline = this.plugins.get('rexOutlinePipeline').add(container.getLayer(), {
        thickness: 4, // Épaisseur du contour en pixels
        color: 0xffffff, // Couleur du contour (blanc)
      });
  
      // Appliquez le pipeline de filtres au conteneur
      container.getLayer().setPipeline('rexOutlinePipeline');
  
      //animation menu zoom
      // this.time.delayedCall(this.offsetTimeMusic, () => {
      //   const zoomTween = this.tweens.add({
      //     targets: this.container,
      //     scaleX: this.containerScaleFactor, // Facteur d'échelle pour le zoom
      //     scaleY: this.containerScaleFactor,
      //     // set x position to center of the screen
      //     x: window.innerWidth/2-(this.container.getLayer().defaultPipeline.width/2)*this.containerScaleFactor,
      //     // set y position to center of the screen
      //     y: window.innerHeight/2-(this.container.getLayer().defaultPipeline.height/2)*this.containerScaleFactor,
      //     duration: 1000, // Durée de l'animation (en millisecondes)
      //     ease: 'Power2', // Power0 : pas d'effet, Power1 : effet linéaire, Power2 : effet quadratique, Power3 : effet cubique, Power4 : effet quartique
      //     repeat: 0,
      //   });
      // }, [], this);

      // this.buttonsChilds.push(this.container.getChildren()[4]);
      // this.buttonsChilds.push(this.container.getChildren()[5]);
      // this.buttonsChilds.push(this.container.getChildren()[6]);
      // this.buttonsChilds.push(this.container.getChildren()[7]);
      // this.container.setInteractive();
    }
  } 
  

  handleMouseMove(pointer) {
    this.cursorX = pointer.x;
    this.cursorY = pointer.y;
  }
  backgroundAnimation() {
    var offsetX = 0;
    var offsetY = 0;
    
    // this.input.on('pointermove', this.handleMouseMove, this);
    
    if(this.isAnyKeyPressed) {

      // Calcul des décalages en fonction des coordonnées du curseur
      if(this.cursorX != null && this.cursorY != null) {
        
          
        offsetX = (this.cursorX - this.sceneCenterX) * 0.1; // Ajustez le coefficient selon votre préférence
        offsetY = (this.cursorY - this.sceneCenterY) * 0.1; // Ajustez le coefficient selon votre préférence
        // console.log("offsetX : "+offsetX);
        // console.log("offsetY : "+offsetY);
        // Déplacez les layers de fond en utilisant les décalages calculés
        this.backgroundImgs[1].setX(this.sceneCenterX + offsetX * 0.2);
        this.backgroundImgs[1].setY(this.sceneCenterY + offsetY * 0.2);
        this.backgroundImgs[2].setX(this.sceneCenterX + offsetX * 0.4);
        this.backgroundImgs[2].setY(this.sceneCenterY + offsetY * 0.4);
          this.elementsImgs[0].setX(this.elementsPosition.element01.x + offsetX * 0.8);
          this.elementsImgs[1].setX(this.elementsPosition.element02.x + offsetX * 0.8);
          this.elementsImgs[2].setX(this.elementsPosition.element03.x + offsetX * 0.8);
          this.elementsImgs[3].setX(this.elementsPosition.element04.x + offsetX * 0.8);
          this.elementsImgs[4].setX(this.elementsPosition.element05.x + offsetX * 0.8);
          this.backgroundImgs[3].setX(this.sceneCenterX + offsetX);
          this.backgroundImgs[3].setY(this.sceneCenterY + offsetY);
        this.perspective.angleY = offsetX * 0.1; 
        this.perspective.angleX= offsetY * 0.1; 

      } 
      // console.log("this.sceneCenterX - this.container.width / 2 : "+this.sceneCenterX - this.container.width / 2);
      // console.log("this.cursorX : "+this.cursorX);
      // console.log("this.sceneCenterX - this.container.width / 2 : "+this.sceneCenterX - this.container.width / 2);
      // if ((this.cursorX <= this.sceneCenterX - this.container.width / 2 + 28 || this.cursorX >= this.sceneCenterX + this.container.width -28 / 2 &&
      // this.cursorY <= this.sceneCenterY - this.container.width / 2 +28 || this.cursorY >= this.sceneCenterY + this.container.width / 2 - 28 ) && !this.isPerspective) {
      //     this.perspective.enter();
      //     this.isPerspective = true;
      //     console.log("perspective");
      // }
      // if(this.cursorX >= this.sceneCenterX - this.container.width / 2 && this.cursorX <= this.sceneCenterX + this.container.width / 2 &&
      // this.cursorY >= this.sceneCenterY - this.container.width / 2 && this.cursorY <= this.sceneCenterY + this.container.width / 2) {
      //   this.perspective.exit();
      //   this.isPerspective = false;
      //   console.log("exit");
      // }
    }
  }
  
  elementsFallAnimation(element){
    if(element==null || element==0){
      this.tweens.add({
        targets: this.elementsImgs[0],
        y: window.innerHeight + 200,
        angle: 180,
        duration: 4500,
        ease: 'linear',
        repeat: 0,
        yoyo: false
      });
    }
    if(element==null || element==1){
      this.tweens.add({
        targets: this.elementsImgs[1],
        y: window.innerHeight + 200,
        angle: 280,
        duration: 15600,
        ease: 'linear',
        repeat: 0,
        yoyo: false
      });
    }
    if(element==null || element==2){
      this.tweens.add({
        targets: this.elementsImgs[2],
        y: window.innerHeight + 200,
        angle: 180,
        duration: 8500,
        ease: 'linear',
        repeat: 0,
        yoyo: false
      });
    }
    if(element==null || element==3){
      this.tweens.add({
        targets: this.elementsImgs[3],
        y: window.innerHeight + 200,
        angle: 180,
        duration: 6800,
        ease: 'linear',
        repeat: 0,
        yoyo: false
      });
    }
    if(element==null || element==4){
      this.tweens.add({
        targets: this.elementsImgs[4],
        y: window.innerHeight + 200,
        angle: 180,
        duration: 13500,
        ease: 'linear',
        repeat: 0,
        yoyo: false
      });
    }
  }

  update() { 
    this.input.on('pointermove', this.handleMouseMove, this);
    this.backgroundAnimation();
    // this.perspective.enter();
    // this.container.layout();

    // console.log("buttonsChild : " + this.buttonsChilds);        

    // this.buttons.forEach((button, index) => {
    //   // Faites des opérations avec chaque button
    //   button.setInteractive();

    // });

    
    //inifinite loop animation fall for elements
    if(this.elementsImgs[0].y >= window.innerHeight + 200){
      this.elementsImgs[0].y = 0;
      this.elementsFallAnimation(0);
    } 
    if(this.elementsImgs[1].y >= window.innerHeight + 200){
      this.elementsImgs[1].y = 0;
      this.elementsFallAnimation(1);
    }
    if(this.elementsImgs[2].y >= window.innerHeight + 200){
      this.elementsImgs[2].y = 0;
      this.elementsFallAnimation(2);
    }
    if(this.elementsImgs[3].y >= window.innerHeight + 200){
      this.elementsImgs[3].y = 0;
      this.elementsFallAnimation(3);
    }
    if(this.elementsImgs[4].y >= window.innerHeight + 200){
      this.elementsImgs[4].y = 0;
      this.elementsFallAnimation(4);
    }
      
  }
  
}

