var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};

var createScene = function () {
  var scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(1, 1, 1);

  BABYLON.appendSceneAsync("objs/solar_system.glb", scene).then(function () {
    var camera = new BABYLON.ArcRotateCamera(
      "camera",
      BABYLON.Tools.ToRadians(180),
      BABYLON.Tools.ToRadians(80),
      30,
      BABYLON.Vector3.Zero(),
      scene
    );
    camera.attachControl(canvas, true);
    camera.radius = 1000; // Définissez un grand rayon pour un dézoom maximal

    var light = new BABYLON.HemisphericLight(
      "light",
      new BABYLON.Vector3(0, 1, 0),
      scene
    );
    light.intensity = 0.7;

    var ground = BABYLON.MeshBuilder.CreateGround(
      "ground",
      { width: 6, height: 6 },
      scene
    );
  });
  return scene;
};

window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";

  startRenderLoop(engine, canvas);

  window.scene = createScene();
};

initFunction().then(() => {
  sceneToRender = scene;
});

window.addEventListener("resize", function () {
  engine.resize();

  // Récupère les dimensions de la fenêtre
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;

  // Calcule le ratio du canvas
  const canvasRatio = canvas.width / canvas.height;

  // Redimensionne le canvas en fonction du ratio et de l'orientation
  if (windowWidth / windowHeight > canvasRatio) {
    canvas.style.width = windowHeight * canvasRatio + "px";
    canvas.style.height = windowHeight + "px";
  } else {
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowWidth / canvasRatio + "px";
  }
});
