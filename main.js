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

  BABYLON.SceneLoader.Append(
    "",
    "objs/solar_system.glb",
    scene,
    function (scene) {
      var camera = new BABYLON.ArcRotateCamera(
        "camera",
        BABYLON.Tools.ToRadians(180),
        BABYLON.Tools.ToRadians(80),
        100,
        BABYLON.Vector3.Zero(),
        scene
      );
      camera.attachControl(canvas, true);
      camera.radius = 1000;

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

      // Créer une interface utilisateur pour afficher le nom de la planète
      var advancedTexture =
        BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      // Créer un conteneur pour le texte avec un fond
      var planetNameContainer = new BABYLON.GUI.Container();
      planetNameContainer.width = "100%";
      planetNameContainer.height = "50px";
      planetNameContainer.background = "black";
      planetNameContainer.horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      planetNameContainer.verticalAlignment =
        BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
      advancedTexture.addControl(planetNameContainer);

      var planetNameText = new BABYLON.GUI.TextBlock();
      planetNameText.text = "Le système solaire"; // Texte par défaut
      planetNameText.fontSize = 24;
      planetNameText.color = "white";
      planetNameText.horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER; // Centrer horizontalement
      planetNameText.verticalAlignment =
        BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER; // Centrer verticalement
      planetNameContainer.addControl(planetNameText);

      // Noms des planètes
      var planetNames = {
        "Sphere_Material.001_0": "Soleil",
        "Sphere.001_Material.002_0": "Mercure",
        "Sphere.002_Material.003_0": "Vénus",
        "Sphere.003_Material.004_0": "Terre",
        "Sphere.004_Material.005_0": "Lune",
        "Sphere.005_Material.006_0": "Mars",
        "Sphere.006_Material.007_0": "Jupiter",
        "Sphere.007_Material.008_0": "Saturne",
        "Sphere.008_Material.009_0": "Uranus",
        "Sphere.009_Material.011_0": "Neptune",
      };

      // Liste des planètes dans l'ordre de navigation
      var planets = [
        scene.getMeshByName("Sphere_Material.001_0"),
        scene.getMeshByName("Sphere.001_Material.002_0"),
        scene.getMeshByName("Sphere.002_Material.003_0"),
        scene.getMeshByName("Sphere.003_Material.004_0"),
        scene.getMeshByName("Sphere.004_Material.005_0"),
        scene.getMeshByName("Sphere.005_Material.006_0"),
        scene.getMeshByName("Sphere.006_Material.007_0"),
        scene.getMeshByName("Sphere.007_Material.008_0"),
        scene.getMeshByName("Sphere.008_Material.009_0"),
        scene.getMeshByName("Sphere.009_Material.011_0"),
      ];
      var currentPlanetIndex = 0;

      // Fonction pour naviguer vers une planète
      var navigateToPlanet = function (index) {
        if (index >= 0 && index < planets.length) {
          currentPlanetIndex = index;
          zoomOnPlanet(planets[currentPlanetIndex]);
          displayPlanetName(planets[currentPlanetIndex]);
        }
      };

      // Gestionnaires d'événements pour les boutons précédent/suivant
      document.getElementById("prevPlanet").addEventListener("click", function () {
        navigateToPlanet(currentPlanetIndex - 1);
    });
    
    document.getElementById("nextPlanet").addEventListener("click", function () {
        // Boucler à la première planète si on est à la fin
        navigateToPlanet((currentPlanetIndex + 1) % planets.length); 
    });
    
      // Gestionnaire d'événements pour le bouton "Découvrir les planètes"
      var discoverButton = document.getElementById("discoverPlanets");
      discoverButton.addEventListener("click", function () {
        discoverButton.disabled = true; // Désactiver le bouton pendant l'animation

        // Démarrer l'animation immédiatement avec la première planète
        navigateToPlanet(0);

        var i = 1; // Commencer à la deuxième planète pour setInterval
        var animationInterval = setInterval(function () {
          navigateToPlanet(i);
          i++;
          if (i >= planets.length) {
            clearInterval(animationInterval);
            discoverButton.disabled = false; // Réactiver le bouton à la fin de l'animation
          }
        }, 3000); // 3 secondes par planète
      });

      // Ajouter un gestionnaire d'événements pour les clics
      scene.onPointerDown = function (evt, pickResult) {
        if (pickResult.hit && pickResult.pickedMesh) {
          var pickedPlanet = pickResult.pickedMesh;
          zoomOnPlanet(pickedPlanet); // Zoom sur la planète cliquée
          displayPlanetName(pickedPlanet); // Afficher le nom de la planète cliquée

          // Mettre à jour currentPlanetIndex en fonction de la planète cliquée
          currentPlanetIndex = planets.indexOf(pickedPlanet);
        }
      };

      // Fonction pour afficher le nom de la planète
      function displayPlanetName(planet) {
        if (planetNames[planet.name]) {
          planetNameText.text = planetNames[planet.name];
        } else {
          planetNameText.text = "Planète inconnue";
        }
      }
    }
  );

  return scene;
};

// Fonction pour zoomer sur une planète
var zoomOnPlanet = function (planet) {
  var camera = scene.activeCamera;
  if (camera) {
    var targetPosition = planet.getAbsolutePosition().clone();

    // Distance dynamique avec une valeur minimale
    var distance = Math.max(
      planet.getBoundingInfo().boundingSphere.radius * 2, // Distance proportionnelle à la taille de la planète
      300 // Distance minimale pour éviter d'être trop près des gros objets
    );

    BABYLON.Animation.CreateAndStartAnimation(
      "zoomCamera",
      camera,
      "target",
      30,
      60,
      camera.target,
      targetPosition,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    BABYLON.Animation.CreateAndStartAnimation(
      "zoomCamera",
      camera,
      "radius",
      30,
      60,
      camera.radius,
      distance,
      BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );
  }
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
});
