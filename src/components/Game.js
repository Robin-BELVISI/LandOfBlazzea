import React, { useEffect, useState, useRef } from "react";
//import { getEnabledCategories } from "trace_events";

export default function Game() {
  const gameRef = useRef(); // this is the DOM element that Phaser will use
  const [game, setGame] = useState(null); // this keeps track of the game instance

  useEffect(() => {
    async function initPhaser() {
      if (game) {
        console.log("Return earlying Phaser");
        return;
      }

      const Phaser = await import("phaser");
      const { default: UIPlugin } = await import("phaser3-rex-plugins/templates/ui/ui-plugin.js");
      const { default: KawaseBlurPipelinePlugin } = await import("phaser3-rex-plugins/plugins/kawaseblurpipeline-plugin.js");
      const { default: KawaseBlurPostFx } = await import("phaser3-rex-plugins/plugins/kawaseblurpipeline.js");
      const { default: RexOutlinePipeline } = await import("phaser3-rex-plugins/plugins/outlinepipeline-plugin.js");
      const { default: ContainerLitePlugin } = await import("phaser3-rex-plugins/plugins/containerlite-plugin.js");
      const { default: PerspectiveImagePlugin } = await import("phaser3-rex-plugins/plugins/perspectiveimage-plugin.js");
      const { default: Preloader } = await import("../scenes/Preloader");
      const { default: MainMenu } = await import("../scenes/MainMenu");
      const { default: UI } = await import("../scenes/UI");
      const { default: Scene1 } = await import("../scenes/Scene1");
      const { default: PanelMainMenu } = await import("../scenes/PanelMainMenu");
      const { default: PanelGameMenu } = await import("../scenes/PanelGameMenu");

      const phaserGame = new Phaser.Game({
        type: Phaser.WEBGL,
        title: "Nomekop",
        parent: gameRef.current,
        width: window.innerWidth,
        height: window.innerHeight,
        pixelArt: true,
        pipeline: [KawaseBlurPostFx],
        render: {
          antialias: false,
        },
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
        scene: [Preloader, MainMenu, UI, Scene1, PanelMainMenu, PanelGameMenu],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 600 },
            fps: 900,
            debug: false,
          },
        },
        backgroundColor: "#000000",
        plugins: {
          global: [{
            key: 'rexKawaseBlurPipeline',
            plugin: KawaseBlurPipelinePlugin,
            start: true
          },
          {
            key: 'rexOutlinePipeline',
            plugin: RexOutlinePipeline,
            start: true
          },
          {
            key: 'rexContainerLitePlugin',
            plugin: ContainerLitePlugin,
            start: true
          },
          {
            key: 'rexPerspectiveImagePlugin',
            plugin: PerspectiveImagePlugin,
            start: true
        },
        ],
        scene: [
          {
            key: "rexUI",
            plugin: UIPlugin,
            mapping: "rexUI",
          },
        ]
      },
    });

 
      setGame(phaserGame);  
      phaserGame.scene.start("preloader");
    }
    initPhaser();
  });
  return <div ref={gameRef} />; // this is the DOM element that Phaser will use
}
