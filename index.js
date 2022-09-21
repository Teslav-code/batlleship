let config = [
  {
    length: 4,
    count: 1
  },

  {
    length: 3,
    count: 2
  },

  {
    length: 2,
    count: 3
  },

  {
    length: 1,
    count: 4
  }
]

const startButton = document.querySelector(".buttonStart");


let build = (name) => {
  const field = document.createElement("div");
  field.id = name;
  root.append(field);
  for (let i = 0; i < 100; i++) {
    const div = document.createElement("div");
    div.className = "empty";
    div.dataset["coords"] = i;
    field.append(div);
  }
  return
}


let game = () => {
  build("user");
  build("computer");
  setMouseEvents();
  let userShips = buildShips("user")
  let computerShips = buildShips("computer");
  startButton.onclick = () => {
    startShoot(userShips, computerShips)
    startButton.remove();
  }
  return
}

let buildShips = (player) => {
  let ships = createShips(config);
  console.log(ships);
  layoutShips(ships);
  if (player === user) {
    let user = document.getElementById(player)
    ships.forEach((ship) => {
      ship.coords.forEach((coord) => {
        user.querySelector(`[data-coords="${coord}"]`).className = "ship";
      })
    });
  }
  return ships
}

let setMouseEvents = () => {
  const userCell = document.getElementById("user");
  const computerCell = document.getElementById("computer");
  userCell.onmouseover = computeMouseOver;
  computerCell.onmouseover = computeMouseOver;
  userCell.onmouseout = computeMouseOut
  computerCell.onmouseout = computeMouseOut
  return
}

let computeMouseOut = (event) => {
  if ((event.target.dataset["coords"] != undefined) && (event.target.classList.contains("available"))) {
    event.target.classList.remove("available")
    event.target.classList.add("empty")
  }
  return
}



let computeMouseOver = (event) => {
  if ((event.target.dataset["coords"] != undefined) && (event.target.classList.contains("empty"))) {
    event.target.classList.remove("empty")
    event.target.classList.add("available")
  }
  return
}


let createShips = (config) => {

  let ships = [];
  for (let i = 0; i < config.length; i++) {
    let storageData = config[i];
    for (let j = 0; j < storageData.count; j++) {
      let ship = {
        name: storageData.name,
        length: storageData.length,
        coords: [],
        isVertical: isVerticalDirection(),
        isSinked: false,
        coordsShoot: []
      };
      ships.push(ship);
    }
  }
  return ships;
}

let layoutShips = (ships) => {
  let arrayUsedCords = [];
  for (let i = 0; i < ships.length; i++) {
    const ship = ships[i];
    let isPossibleToFill = false;
    while (isPossibleToFill === false) {
      let coordinateStartShip = getRandomInt(0, 100);
      let coordObj = attrToCoord(coordinateStartShip);
      let isFitOnField = !ship.isVertical ? ship.length + coordObj.x <= 10 : ship.length + coordObj.y <= 10
      if (!isFitOnField) {
        continue
      }
      let tempCords = [];
      let counter = ship.isVertical ? 10 : 1;
      for (let i = 0, j = 0; i < ship.length; i++, j += counter) {
        let k = coordinateStartShip + j;
        tempCords.push(k);
      }

      isPossibleToFill = true;
      for (let i = 0; i < arrayUsedCords.length; i++) {
        for (let j = 0; j < tempCords.length; j++) {
          if (arrayUsedCords[i] === tempCords[j]) {
            isPossibleToFill = false;
            break;
          }
        }
        if (!isPossibleToFill) {
          break;
        }
      }
      if (isPossibleToFill) {
        ship.coords = tempCords
        for (let j = 0; j < tempCords.length; j++) {
          arrayUsedCords.push(tempCords[j]);
          //left margin
          arrayUsedCords.push(tempCords[j] - 1);
          //bottom margin
          arrayUsedCords.push(tempCords[j] + 10);
          //right margin
          arrayUsedCords.push(tempCords[j] + 1);
          //top margin
          arrayUsedCords.push(tempCords[j] - 10);
          //left,right top angles
          arrayUsedCords.push(tempCords[j] - 11);
          arrayUsedCords.push(tempCords[j] - 9);
          //left,right bottom angles
          arrayUsedCords.push(tempCords[j] + 9);
          arrayUsedCords.push(tempCords[j] + 11);
        }
      }
    }
  }
  return
}

let getRandomInt = (minimum, maximum) => {
  min = Math.ceil(minimum);
  max = Math.floor(maximum);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

let attrToCoord = (position) => {
  let normalize = normalizeCoordinates(position)
  const y = normalize[0];
  const x = normalize[1];
  return { x: +x, y: +y };
}

let normalizeCoordinates = (coordinates) => {
  coordinates = `${coordinates}`
  return coordinates.length < 2 ? `0${coordinates}` : `${coordinates}`;
}

let isVerticalDirection = () => {
  const direction = Math.random() >= 0.5;
  return direction;
}

let isUserShoot = true
let computerShoots = []

let startShoot = (userShips, computerShips) => {
  shoot("user", userShips, computerShips)
  userShoot()
  //userShoot(computerShips)
  return
}


let checkShoot = (ships, target, coord, area) => {
  isShootInTarget = false;
  let isAllSinked = false;
  ships.forEach((ship) => {
    for (let i = 0; i < ship.coords.length; i++) {
      const position = ship.coords[i];
      if (position === coord) {
        ship.coordsShoot.push(position)
        target.className = "wounded"
        isShootInTarget = true;
        if (ship.coords.length === ship.coordsShoot.length) {
          ship.coords.forEach((position) => {
            //target.classList.clear()
            let element = area.querySelector(`[data-coords="${position}"]`);
            element.className = "killed";
          })

          ship.isSinked = true;
          let countSinked = 0
          ships.forEach((ship) => {
            if (ship.isSinked) {
              countSinked++;
            }
          })
          isAllSinked = ships.length === countSinked
        }
      }
    }
  });
  if (!isShootInTarget) {
    target.className = "shoted"
  }
  return { isAllSinked: isAllSinked, isShootInTarget: isShootInTarget }
}

let userShoot = (computerShips, userShips) => {
  const ships = computerShips;
  isUserShoot = true;
  let computerArea = document.getElementById("computer");
  computerArea.addEventListener("click", function (event) {
    if ((isUserShoot === false)) {
      return;
    }
    let coord = event.target.dataset["coords"];
    if (coord != undefined) {
      if (event.target.classList.contains("available") || event.target.classList.contains("ship")) {
        let shootResult = checkShoot(ships, event.target, parseInt(coord), computerArea);
        if (shootResult.isAllSinked) {
          finishGame("user");
        } else {
          isUserShoot = false;
          if (shootResult.isShootInTarget) {
            shoot("user", userShips, computerShips);
          } else {
            shoot("computer", userShips, computerShips)
          }
        }
      }
      computerArea.removeEventListener("click", this);
    }
  });
  return
}

let computerShoot = (userShips, computerShips) => {
  isPossibleToShoot = false;
  while (isPossibleToShoot === false) {
    let random = getRandomInt(0, 100);
    if ((computerShoots.includes(random))) {
      continue;
    }
    isPossibleToShoot = true;
    computerShoots.push(random);
    let userArea = document.getElementById("user");
    let shootResult = checkShoot(userShips, userArea.querySelector(`[data-coords="${random}"]`), random, userArea);
    if (shootResult.isAllSinked) {
      finishGame("computer");
    } else {
      if (shootResult.isShootInTarget) {
        shoot("computer", userShips, computerShips);
      } else {
        shoot('user', userShips, computerShips);
      }
    }
    return
  }
}

let shoot = (player, userShips, computerShips) => {
  if (player === "user") {
    userShoot(computerShips, userShips);
  } else {
    setTimeout(() => {
      computerShoot(userShips, computerShips);
    }, 300);
  }
  return
}


let paintedField = () => {
  if (div.className === killed) {

  }
}


function finishGame(winnerName) {
  const message = document.createElement("h3");
  message.classList.add("message")
  message.innerHTML = `${winnerName} WIN! ! !`;
  const newGameBtn = document.createElement("button");
  newGameBtn.innerHTML = "START NEW GAME";
  document.body.append(message);
  document.body.append(newGameBtn);
  newGameBtn.classList.add("buttonStart")
  newGameBtn.onclick = () => document.location.reload();

}


game()