import { Scene } from "phaser";

export default class UI extends Scene {
  
  constructor() {
    super("UI");
    this.fpsText = null; // Variable pour stocker la référence du texte du FPS
  }

  init() {
  } // Called before preload()

  create() {
    console.log("UI");
    console.log(this);

    // /** Rectangle d'affichage des FPS */
    this.fpsBox();
    // /** Affichage des FPS dans le rectangle */
    this.showFps();
  }
  
  fpsBox() {
    this.fpsContainer = this.add.container(0,0);
    const background = this.rexUI.add.roundRectangle(65, 20, 120, 40, 20, 0x000000, 0.5);
    this.fpsText = this.add.text(65, 20, '0', { fontSize: '24px', color: '#ffffff' }).setOrigin(0.5);
    this.fpsContainer.add([background, this.fpsText]);
    this.fpsContainer.setScrollFactor(0);
    this.fpsContainer.setDepth(1000);
  }
  
  // showFps() {
  //   const getFps = this.utilsFpsDisplay(this);
  //   // Mettre à jour le texte avec la valeur de fps à chaque intervalle
  //   setInterval(() => {
  //     const fps = getFps();
  //     if (this.fpsText) {
  //       this.fpsText.setText(fps);
  //     }
  //   }, 500);
  // }
  
  // utilsFpsDisplay(scene) {
  //   let fps = 0;
    
  //   setInterval(() => {
  //     fps = Math.round(scene.game.loop.actualFps);
  //   }, 500);

  //   return () => fps;
  // }

  showFps() {
    this.scene.bringToTop("UI"); // Assurez-vous que la scène d'interface est au-dessus de toutes les autres scènes
  
    this.time.delayedCall(1000, this.updateFpsText, [], this); // Appel de la méthode updateFpsText toutes les 1000 ms
  }
  
  updateFpsText() {
    const fps = this.game.loop.actualFps.toFixed(0); // Récupère les FPS arrondis
    this.fpsText.setText(fps); // Met à jour le texte du FPS dans la boîte
  }

  update() {
    this.updateFpsText();
  }


  
}

