const infoButton = document.getElementById("infoButton");
const infoPopup = document.getElementById("infoPopup");
const closePopup = document.getElementById("closePopup");

infoButton.addEventListener("click", function () {
  infoPopup.style.display = "block";
});

closePopup.addEventListener("click", function () {
  infoPopup.style.display = "none";
});

document.addEventListener("click", function (event) {
  if (!infoPopup.contains(event.target) && event.target !== infoButton) {
    infoPopup.style.display = "none";
  }
});

const planetPopup = document.getElementById("planetPopup");
const closePlanetPopup = document.getElementById("closePlanetPopup");
const planetPopupTitle = document.getElementById("planetPopupTitle");
const planetPopupInfo = document.getElementById("planetPopupInfo");
const planetInfoBtn = document.getElementById("planetInfoBtn");

closePlanetPopup.addEventListener("click", function () {
  planetPopup.style.display = "none";
});

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

var planets = []; // Define planets array in a broader scope
var planetNames = {}; // Define planetNames object in a broader scope

var createScene = function () {
  var scene = new BABYLON.Scene(engine);

  var background = new BABYLON.Layer(
    "background",
    "src/espace.jpg",
    scene,
    true
  );
  scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);

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
      camera.radius = 1500;

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

      var advancedTexture =
        BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

      var planetNameContainer = new BABYLON.GUI.Container();
      planetNameContainer.width = "100%";
      planetNameContainer.height = "60px";
      planetNameContainer.horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      planetNameContainer.verticalAlignment =
        BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
      advancedTexture.addControl(planetNameContainer);

      var planetNameText = new BABYLON.GUI.TextBlock();
      planetNameText.text = "Le système solaire";
      planetNameText.fontSize = 30;
      planetNameText.color = "white";
      planetNameText.horizontalAlignment =
        BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
      planetNameText.verticalAlignment =
        BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
      planetNameContainer.addControl(planetNameText);

      planetNames = {
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
      var planetInfos = {
        "Sphere_Material.001_0":
          "Le Soleil est l'étoile au centre de notre système solaire.\nIl représente 99,86 % de la masse du système solaire.\nSa température de surface est d'environ 5 500 °C.\nLa lumière du Soleil met environ 8 minutes et 20 secondes pour atteindre la Terre.",

        "Sphere.001_Material.002_0":
          "Mercure est la planète la plus proche du Soleil.\nC'est la plus petite planète du système solaire.\nElle n'a pas de satellite naturel.\nSa surface est fortement cratérisée.",

        "Sphere.002_Material.003_0":
          "Vénus est connue pour ses conditions atmosphériques extrêmes.\nSon atmosphère est composée principalement de dioxyde de carbone.\nC'est la planète la plus chaude du système solaire.\nElle tourne sur elle-même dans le sens inverse des autres planètes.",

        "Sphere.003_Material.004_0":
          "La Terre est la seule planète connue à abriter la vie.\nElle possède un satellite naturel, la Lune.\nSon atmosphère est composée principalement d'azote et d'oxygène.\nEnviron 71 % de sa surface est recouverte d'eau.",

        "Sphere.004_Material.005_0":
          "La Lune est le seul satellite naturel de la Terre.\nElle est en rotation synchrone avec la Terre, nous montrant toujours la même face.\nSa surface est marquée par de nombreux cratères.\nElle influence les marées terrestres.",

        "Sphere.005_Material.006_0":
          "Mars est surnommée la planète rouge en raison de sa couleur.\nElle possède deux petits satellites naturels, Phobos et Déimos.\nDes missions spatiales explorent actuellement sa surface à la recherche de traces de vie passée.\nSon atmosphère est très ténue.",

        "Sphere.006_Material.007_0":
          "Jupiter est la plus grande planète du système solaire.\nElle est composée principalement d'hydrogène et d'hélium.\nElle possède de nombreux satellites naturels, dont les quatre plus grands sont Io, Europe, Ganymède et Callisto.\nLa Grande Tache rouge est une tempête géante qui fait rage sur Jupiter depuis des siècles.",

        "Sphere.007_Material.008_0":
          "Saturne est célèbre pour ses anneaux spectaculaires.\nCes anneaux sont composés de milliards de particules de glace et de roche.\nElle possède de nombreux satellites naturels, dont Titan est le plus grand et le seul à posséder une atmosphère dense.\nSaturne est également une géante gazeuse.",

        "Sphere.008_Material.009_0":
          "Uranus a une inclinaison axiale unique parmi les planètes.\nSon axe de rotation est presque parallèle à son plan orbital.\nElle possède un système d'anneaux et de nombreux satellites naturels.\nSa couleur bleu-vert est due à la présence de méthane dans son atmosphère.",

        "Sphere.009_Material.011_0":
          "Neptune est connue pour ses vents violents.\nC'est la planète la plus éloignée du Soleil.\nElle possède un système d'anneaux et plusieurs satellites naturels, dont Triton est le plus grand.\nSa couleur bleue est due à la présence de méthane dans son atmosphère.",
      };
      planets = [
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

      var navigateToPlanet = function (index) {
        if (index >= 0 && index < planets.length) {
          currentPlanetIndex = index;
          zoomOnPlanet(planets[currentPlanetIndex]);
          displayPlanetName(planets[currentPlanetIndex]);
        }
      };

      document
        .getElementById("prevPlanet")
        .addEventListener("click", function () {
          navigateToPlanet(currentPlanetIndex - 1);
        });

      document
        .getElementById("nextPlanet")
        .addEventListener("click", function () {
          navigateToPlanet((currentPlanetIndex + 1) % planets.length);
        });

      var discoverButton = document.getElementById("discoverPlanets");
      discoverButton.addEventListener("click", function () {
        discoverButton.disabled = true;

        navigateToPlanet(0);

        var i = 1;
        var animationInterval = setInterval(function () {
          navigateToPlanet(i);
          i++;
          if (i >= planets.length) {
            clearInterval(animationInterval);
            discoverButton.disabled = false;
          }
        }, 3000);
      });

      scene.onPointerDown = function (evt, pickResult) {
        if (pickResult.hit && pickResult.pickedMesh) {
          var pickedPlanet = pickResult.pickedMesh;
          zoomOnPlanet(pickedPlanet);
          displayPlanetName(pickedPlanet);

          currentPlanetIndex = planets.indexOf(pickedPlanet);

          handlePlanetClick(pickedPlanet);
        }
      };

      let clickCount = 0;
      let clickTimer;

      function handlePlanetClick(planet) {
        clickCount++;

        if (clickCount === 1) {
          clickTimer = setTimeout(() => {
            clickCount = 0;
          }, 300);
        } else if (clickCount === 2) {
          clearTimeout(clickTimer);
          clickCount = 0;
          showPlanetInfo(planet);
        }
      }

      function showPlanetInfo(planet) {
        if (planetInfos[planet.name]) {
          planetPopupTitle.textContent = planetNames[planet.name];
          planetPopupInfo.textContent = planetInfos[planet.name];
          planetPopup.style.display = "block";
        }
      }

      function displayPlanetName(planet) {
        if (planetNames[planet.name]) {
          planetNameText.text = planetNames[planet.name];
        } else {
          planetNameText.text = "Planète inconnue";
        }
      }

      planetInfoBtn.addEventListener("click", function () {
        var currentPlanet = planets[currentPlanetIndex];
        if (planetInfos[currentPlanet.name]) {
          planetPopupTitle.textContent = planetNames[currentPlanet.name];
          planetPopupInfo.textContent = planetInfos[currentPlanet.name];
          planetPopup.style.display = "block";
        }
      });
    }
  );

  var zoomOnPlanet = function (planet) {
    var camera = scene.activeCamera;
    if (camera) {
      var targetPosition = planet.getAbsolutePosition().clone();

      var distance = Math.max(
        planet.getBoundingInfo().boundingSphere.radius * 2,
        300
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

  var compareButton = document.createElement("button");
  compareButton.id = "compareSizes";
  compareButton.textContent = "Comparer les tailles";
  document.getElementById("navigation").appendChild(compareButton);

  // Créer une div pour l'animation de comparaison
  var sizeComparisonContainer = document.createElement("div");
  sizeComparisonContainer.id = "sizeComparisonContainer";
  sizeComparisonContainer.style.display = "none";
  document.body.appendChild(sizeComparisonContainer);

  // Bouton pour fermer la comparaison
  var closeSizeComparison = document.createElement("button");
  closeSizeComparison.id = "closeSizeComparison";
  closeSizeComparison.textContent = "×";
  sizeComparisonContainer.appendChild(closeSizeComparison);

  // Titre de la comparaison
  var comparisonTitle = document.createElement("h3");
  comparisonTitle.textContent = "Comparaison des tailles des planètes";
  var comparisonTitle1 = document.createElement("h5");
  comparisonTitle1.textContent = "Cliquez sur une planète 🪐";

  sizeComparisonContainer.appendChild(comparisonTitle);
  sizeComparisonContainer.appendChild(comparisonTitle1);

  // Div pour l'animation
  var sizesAnimation = document.createElement("div");
  sizesAnimation.id = "sizesAnimation";
  sizeComparisonContainer.appendChild(sizesAnimation);

  // Définition des tailles relatives des planètes (à l'échelle)
  var planetSizes = {
    "Sphere_Material.001_0": 109.2, // Soleil (109.2 fois la Terre)
    "Sphere.001_Material.002_0": 0.38, // Mercure
    "Sphere.002_Material.003_0": 0.95, // Vénus
    "Sphere.003_Material.004_0": 1, // Terre (référence)
    "Sphere.004_Material.005_0": 0.27, // Lune
    "Sphere.005_Material.006_0": 0.53, // Mars
    "Sphere.006_Material.007_0": 11.2, // Jupiter
    "Sphere.007_Material.008_0": 9.45, // Saturne
    "Sphere.008_Material.009_0": 4, // Uranus
    "Sphere.009_Material.011_0": 3.88, // Neptune
  };

  // Fonction pour créer l'animation de comparaison
  // Modifications pour la fonction createSizeComparison

  function createSizeComparison() {
    sizesAnimation.innerHTML = "";

    // Créer une div pour les planètes à comparer
    var planetsDiv = document.createElement("div");
    planetsDiv.className = "planets-comparison";
    planetsDiv.id = "planets-comparison-container";
    sizesAnimation.appendChild(planetsDiv);

    // Créer une div pour les noms des planètes
    var namesDiv = document.createElement("div");
    namesDiv.className = "planet-names";
    sizesAnimation.appendChild(namesDiv);

    // Créer une div pour l'affichage détaillé d'une planète
    var detailView = document.createElement("div");
    detailView.id = "planet-detail-view";
    detailView.style.display = "none";
    sizesAnimation.appendChild(detailView);

    // Bouton pour revenir à la vue de comparaison
    var backButton = document.createElement("button");
    backButton.textContent = "Retour à la comparaison";
    backButton.className = "back-to-comparison";
    backButton.addEventListener("click", function () {
      detailView.style.display = "none";
      planetsDiv.style.display = "flex";
      namesDiv.style.display = "flex";
    });
    detailView.appendChild(backButton);

    // Déterminer la taille maximale qu'une planète peut avoir (en pixels)
    const maxSize = 300; // Pour le Soleil
    const baseSize = maxSize / planetSizes["Sphere_Material.001_0"];

    // Créer les représentations visuelles des planètes
    planets.forEach((planet) => {
      const planetName = planetNames[planet.name];
      const relativeSizeToEarth = planetSizes[planet.name];
      const displaySize = Math.max(relativeSizeToEarth * baseSize, 5); // Minimum 5px pour voir les petites planètes

      // Créer la représentation visuelle de la planète
      const planetElement = document.createElement("div");
      planetElement.className = "planet-circle";
      planetElement.style.width = displaySize + "px";
      planetElement.style.height = displaySize + "px";
      planetElement.dataset.planetName = planet.name;

      // Définir la couleur en fonction de la planète
      switch (planet.name) {
        case "Sphere_Material.001_0": // Soleil
          planetElement.style.backgroundColor = "#FDB813";
          break;
        case "Sphere.001_Material.002_0": // Mercure
          planetElement.style.backgroundColor = "#9F9F9F";
          break;
        case "Sphere.002_Material.003_0": // Vénus
          planetElement.style.backgroundColor = "#BEB768";
          break;
        case "Sphere.003_Material.004_0": // Terre
          planetElement.style.backgroundColor = "#0077BE";
          break;
        case "Sphere.004_Material.005_0": // Lune
          planetElement.style.backgroundColor = "#F0F0F0";
          break;
        case "Sphere.005_Material.006_0": // Mars
          planetElement.style.backgroundColor = "#E27B58";
          break;
        case "Sphere.006_Material.007_0": // Jupiter
          planetElement.style.backgroundColor = "#C88B3B";
          break;
        case "Sphere.007_Material.008_0": // Saturne
          planetElement.style.backgroundColor = "#E4CD9E";
          break;
        case "Sphere.008_Material.009_0": // Uranus
          planetElement.style.backgroundColor = "#B5E3E1";
          break;
        case "Sphere.009_Material.011_0": // Neptune
          planetElement.style.backgroundColor = "#3D6DE5";
          break;
        default:
          planetElement.style.backgroundColor = "#CCCCCC";
      }

      // Ajouter la taille relative sous le nom
      const sizeElement = document.createElement("div");
      sizeElement.className = "planet-relative-size";
      sizeElement.textContent =
        relativeSizeToEarth === 1
          ? "Taille de référence"
          : relativeSizeToEarth + " × Terre";

      // Ajouter les éléments au conteneur
      planetsDiv.appendChild(planetElement);

      // Ajouter un listener pour afficher la planète en détail au clic
      planetElement.addEventListener("click", function () {
        showPlanetDetail(
          planet,
          planetName,
          relativeSizeToEarth,
          planetElement.style.backgroundColor
        );
      });
    });

    // Fonction pour afficher une planète en détail
    // Modification de la fonction showPlanetDetail pour ajouter la fonctionnalité au bouton "Accéder à la planète"
    function showPlanetDetail(planet, planetName, relativeSizeToEarth, color) {
      // Masquer la vue de comparaison
      planetsDiv.style.display = "none";
      namesDiv.style.display = "none";
      comparisonTitle1.style.display = "none";

      // Préparer la vue détaillée
      detailView.innerHTML = "";
      detailView.style.display = "flex";

      // Créer un conteneur pour les boutons
      var buttonContainer = document.createElement("div");
      buttonContainer.style.display = "flex";
      buttonContainer.style.gap = "10px"; // Optionnel : ajouter un espace entre les boutons

      // Ajouter le bouton retour
      var backButton = document.createElement("button");
      backButton.textContent = "Retour à la comparaison";
      backButton.className = "back-to-comparison";
      backButton.style.display = "flex"; // Ajouter display flex

      var backButton1 = document.createElement("button");
      backButton1.textContent = "Accéder à la planète";
      backButton1.className = "back-to-comparison";
      backButton1.style.display = "flex"; // Ajouter display flex

      backButton.addEventListener("click", function () {
        detailView.style.display = "none";
        planetsDiv.style.display = "flex";
        namesDiv.style.display = "flex";
        comparisonTitle1.style.display = "block";
      });

      // Ajouter la fonctionnalité au bouton "Accéder à la planète"
      backButton1.addEventListener("click", function () {
        // Fermer la vue de comparaison de tailles
        sizeComparisonContainer.style.display = "none";

        // Trouver l'index de la planète dans le tableau planets
        let planetIndex = -1;
        for (let i = 0; i < planets.length; i++) {
          if (planets[i].name === planet.name) {
            planetIndex = i;
            break;
          }
        }

        // Si la planète est trouvée, naviguer vers elle
        if (planetIndex !== -1) {
          currentPlanetIndex = planetIndex;
          zoomOnPlanet(planets[currentPlanetIndex]);
          displayPlanetName(planets[currentPlanetIndex]);
        }
      });

      // Ajouter les boutons au conteneur
      buttonContainer.appendChild(backButton);
      buttonContainer.appendChild(backButton1);

      // Ajouter le conteneur de boutons à la vue détaillée
      detailView.appendChild(buttonContainer);

      // Créer un conteneur pour la planète et ses informations
      var detailContainer = document.createElement("div");
      detailContainer.className = "planet-detail-container";
      detailView.appendChild(detailContainer);

      // Créer la représentation visuelle de la planète en grand
      var planetDetailElement = document.createElement("div");
      planetDetailElement.className = "planet-circle-detail";
      planetDetailElement.style.backgroundColor = color;
      planetDetailElement.style.width = "200px";
      planetDetailElement.style.height = "200px";
      detailContainer.appendChild(planetDetailElement);

      // Créer un conteneur pour les informations
      var infoContainer = document.createElement("div");
      infoContainer.className = "planet-info-container";
      detailContainer.appendChild(infoContainer);

      // Ajouter le titre
      var titleElement = document.createElement("h2");
      titleElement.textContent = planetName;
      infoContainer.appendChild(titleElement);

      // Ajouter les informations de taille
      var sizeInfoElement = document.createElement("p");
      if (relativeSizeToEarth === 1) {
        sizeInfoElement.textContent = `${planetName} est la référence de taille dans notre système solaire.`;
      } else if (relativeSizeToEarth < 1) {
        sizeInfoElement.textContent = `${planetName} est ${(
          1 / relativeSizeToEarth
        ).toFixed(2)} fois plus petit(e) que la Terre.`;
      } else {
        sizeInfoElement.textContent = `${planetName} est ${relativeSizeToEarth.toFixed(
          2
        )} fois plus grand(e) que la Terre.`;
      }
      infoContainer.appendChild(sizeInfoElement);

      // Ajouter une comparaison visuelle avec la Terre
      if (planet.name !== "Sphere.003_Material.004_0") {
        // Si ce n'est pas la Terre
        var comparisonContainer = document.createElement("div");
        comparisonContainer.className = "planet-earth-comparison";
        infoContainer.appendChild(comparisonContainer);

        // Créer la représentation de la planète actuelle
        var currentPlanetElement = document.createElement("div");
        currentPlanetElement.className = "comparison-planet";
        currentPlanetElement.style.backgroundColor = color;

        // Taille proportionnelle à la Terre (max 150px)
        const maxComparisonSize = 150;
        const earthSize = 50; // Taille fixe pour la Terre
        const currentPlanetSize = relativeSizeToEarth * earthSize;

        // Limiter la taille pour les très grandes planètes
        currentPlanetElement.style.width =
          Math.min(currentPlanetSize, maxComparisonSize) + "px";
        currentPlanetElement.style.height =
          Math.min(currentPlanetSize, maxComparisonSize) + "px";

        // Créer la représentation de la Terre pour comparaison
        var earthElement = document.createElement("div");
        earthElement.className = "comparison-earth";
        earthElement.style.backgroundColor = "#0077BE";
        earthElement.style.width = earthSize + "px";
        earthElement.style.height = earthSize + "px";

        // Ajouter les étiquettes
        var currentPlanetLabel = document.createElement("div");
        currentPlanetLabel.textContent = planetName;
        currentPlanetLabel.className = "comparison-label";

        var earthLabel = document.createElement("div");
        earthLabel.textContent = "Terre";
        earthLabel.className = "comparison-label";

        // Ajouter tous les éléments au conteneur de comparaison
        comparisonContainer.appendChild(currentPlanetElement);
        comparisonContainer.appendChild(currentPlanetLabel);
        comparisonContainer.appendChild(earthElement);
        comparisonContainer.appendChild(earthLabel);
      }

      // Ajouter les détails de la planète
      var detailsElement = document.createElement("p");
      detailsElement.className = "planet-details";
      detailsElement.innerText = planetInfos[planet.name];
      infoContainer.appendChild(detailsElement);
    }
  }
  // Gestion des événements pour les boutons
  compareButton.addEventListener("click", function () {
    createSizeComparison();
    sizeComparisonContainer.style.display = "block";

    // Animation d'apparition progressive des planètes
    const planetCircles = document.querySelectorAll(".planet-circle");
    planetCircles.forEach((circle, index) => {
      setTimeout(() => {
        circle.style.opacity = "1";
        circle.style.transform = "scale(1)";
      }, index * 200);
    });
  });

  closeSizeComparison.addEventListener("click", function () {
    sizeComparisonContainer.style.display = "none";
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
});
