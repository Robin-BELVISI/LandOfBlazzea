import { type } from "os";
import { Scene } from "phaser";
import { pipeline } from "stream";
import KawaseBlurPipelinePlugin from "phaser3-rex-plugins/plugins/kawaseblurpipeline";
import OutlinePipelinePlugin from "phaser3-rex-plugins/plugins/outlinepipeline";
import KawaseBlurFilterPostFxPipeline from "phaser3-rex-plugins/plugins/kawaseblurpipeline";
import Game from "../components/Game";

export default class PanelGameMenu extends Scene {

    /** @type {Array<Phaser.GameObjects>} */
    texts = [];

    /** @type {Phaser.Types.Input.Keyboard.CursorKeys} */
    keys; 
  
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
        super("panelGameMenu");
    }

    init() {
        console.log("init panelGameMenu");
        this.soundButton = this.sound.add('selectionMenu');
        console.log("scene: panelGameMenu", this.scene);  
    } // Called before preload()

    create() {
        this.keys = this.input.keyboard.addKeys({
            up: Phaser.Input.Keyboard.KeyCodes.SPACE,
            left: Phaser.Input.Keyboard.KeyCodes.LEFT,
            down: Phaser.Input.Keyboard.KeyCodes.DOWN,
            right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
            escape: Phaser.Input.Keyboard.KeyCodes.ESC,
        }); // définit des touches personnalisées

        console.log("PanelGameMenu");
        
        this.container = this.rexUI.add.label({
            width: 300, height: 400,
            orientation: 1,
            space: {
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
                icon: 10,
            }
        }).layout();
            
        this.container.setPosition(this.sceneCenterX, this.sceneCenterY + 28);
        this.container.add(this.add.image(window.innerWidth/2, window.innerHeight/2+28, "menuDefault").setOrigin(0.5, 0.5).setScale(2.5).setDepth(20));
        // this.container.add(this.buttons[0]);
        this.menuCreation(this.container,this.texts);

        this.buttonsChilds.push(this.container.getChildren()[4]);
        this.buttonsChilds.push(this.container.getChildren()[5]);
        this.buttonsChilds.push(this.container.getChildren()[6]);
        this.buttonsChilds.push(this.container.getChildren()[7]);
        this.container.setInteractive();

    }

    update() { 
        if (this.keys.escape.isDown) {
            this.scene.resume("scene1");
            this.scene.stop();
          }
    }

    menuCreation(container,texts) {
        const tilesetTexture = this.textures.get(this.tilesetKey);
        const buttons = [];
        if (tilesetTexture) {
            // Récupération de la région spécifique du tileset
            const unoverKey= tilesetTexture.getFrameNames()[0];
            const overKey = tilesetTexture.getFrameNames()[1];
            const clickKey = tilesetTexture.getFrameNames()[2];
            const disableKey = tilesetTexture.getFrameNames()[3];
            const unoverTexture = tilesetTexture.get(unoverKey);
            const overTexture = tilesetTexture.get(overKey);
            const clickTexture = tilesetTexture.get(clickKey);
            const disableTexture = tilesetTexture.get(disableKey);

            // Utilisation de la région spécifique du tileset
            if (unoverTexture&&overTexture&&clickTexture&&disableTexture) { 
                // // Ajoutez chaque sprite au tableau
                buttons.push(this.add.sprite((window.innerWidth / 2), (window.innerHeight / 2)-28*2, this.tilesetKey, unoverTexture));
                buttons.push(this.add.sprite((window.innerWidth / 2), (window.innerHeight / 2), this.tilesetKey, unoverTexture));
                buttons.push(this.add.sprite((window.innerWidth / 2), (window.innerHeight / 2)+28*2, this.tilesetKey, unoverTexture));
                buttons.push(this.add.sprite((window.innerWidth / 2), (window.innerHeight / 2)+28*4, this.tilesetKey, unoverTexture));
                // // Ajoutez autant de buttons que nécessaire
                texts.push(this.add.text((window.innerWidth / 2), (window.innerHeight / 2)-28*2, 'Continuer', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setColor('black'));
                texts.push(this.add.text((window.innerWidth / 2), (window.innerHeight / 2), 'Options', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setColor('black'));
                texts.push(this.add.text((window.innerWidth / 2), (window.innerHeight / 2)+28*2, 'Crédits', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setColor('black'));
                texts.push(this.add.text((window.innerWidth / 2), (window.innerHeight / 2)+28*4, 'Quitter', { fontSize: '32px', color: '#ffffff' }).setOrigin(0.5).setColor('black'));

                // Utilisez les buttons
                console.log("buttons :" + buttons);

                buttons.forEach((button, index) => {
                    button.scene = this;
                    button.setDepth(30);
                    // Faites des opérations avec chaque button
                    button.setScale(2);
                    // this.menuInteraction(button);
                    // Faites des opérations avec chaque button
                    button.setInteractive();
                    button.on('pointerdown', () => {
                        console.log('pointerdown : '+ button.getIndexList());
                        button.setTexture(this.tilesetKey, clickKey);
                    });
                    button.on('pointerup', () => {
                        console.log('pointerup');
                        console.log('index : '+ index);
                        button.setTexture(this.tilesetKey, overKey);
                        if(index==0){
                            this.scene.resume("scene1");
                            this.scene.stop();
                        }
                        if(index==3){
                            this.scene.start("mainMenu");
                            this.scene.stop();
                            this.scene.get("scene1").scene.stop();
                        }
                    });
                    button.on('pointerover', () => {
                        console.log('pointerover');
                        button.setTexture(this.tilesetKey, overKey);
                        this.soundButton.play();
                    });
                    button.on('pointerout', () => {
                        console.log('pointerout');
                        button.setTexture(this.tilesetKey, unoverKey);
                    });
                    // this.container.add(button);
                });
                container.add(buttons);
                texts.forEach((text, index) => {
                    container.add(text);
                    text.setDepth(40);
                });
        
            }
        }
    }
}
    
    