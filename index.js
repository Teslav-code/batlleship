let config = [
  {
    name: "4-deck",
    length: 4,
    count: 1
  },

  {
    name: "3-deck",
    length: 3,
    count: 2
  },

  {
    name: "2-deck",
    length: 2,
    count: 3
  },

  {
    name: "1-deck",
    length: 1,
    count: 4
  }
]

const startButton = document.createElement('button');
startButton.innerHTML = 'START GAME';

document.body.append(startButton);

function build(name) {
  const field = document.createElement("div");
  field.id = name;
  root.append(field);
  for (let i = 0; i < 100; i++) {
    const div = document.createElement("div");
    div.className = "empty";
    div.dataset["coords"] = i;
    field.append(div);
  }
}

function game() {
  build('user');
  build('computer');
  setMouseEvents();
  var userShips = buildShips('user')
  var computerShips = buildShips('computer');
  startButton.onclick = () => {
    startShoot(userShips, computerShips)
    startButton.remove();
  }
}

function buildShips(player) {
  let ships = createShips(config);
  console.log(ships);
  layoutShips(ships);
  //if(player == 'user'){
  let user = document.getElementById(player)
  ships.forEach((ship) => {
    ship.coords.forEach((coord) => {
      user.querySelector(`[data-coords="${coord}"]`).className = 'ship';
    })
  });
  //}
  return ships
}

function setMouseEvents() {
  const userCell = document.getElementById("user");
  const computerCell = document.getElementById("computer");
  userCell.onmouseover = computeMouseOver;
  computerCell.onmouseover = computeMouseOver;
  userCell.onmouseout = computeMouseOut
  computerCell.onmouseout = computeMouseOut
}

function computeMouseOut(event) {
  if (event.target.dataset["coords"] != undefined) {
    if (event.target.classList.contains("available")) {
      event.target.classList.remove("available")
      event.target.classList.add("empty")
    }
  }
}
function computeMouseOver(event) {
  if (event.target.dataset["coords"] != undefined) {
    if (event.target.classList.contains("empty")) {
      event.target.classList.remove("empty")
      event.target.classList.add("available")
    }
  }
}

function createShips(config) {

  let ships = [];
  for (let i = 0; i < config.length; i++) {
    let c = config[i];
    for (let j = 0; j < c.count; j++) {
      let ship = {
        name: c.name,
        length: c.length,
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

function layoutShips(ships) {
  let arrayUsedCords = [];
  var ok = 0
  for (let m = 0; m < ships.length; m++) {
    const ship = ships[m];
    var isPossibleToFill = false;
    while (isPossibleToFill == false) {
      let coordinateStartShip = getRandomInt(0, 100);
      let coordObj = attrToCoord(coordinateStartShip);
      let isFitOnField = !ship.isVertical ? ship.length + coordObj.x <= 10 : ship.length + coordObj.y <= 10
      if (!isFitOnField) {
        continue
      }
      let tempCords = [];
      var counter = ship.isVertical ? 10 : 1;
      for (let i = 0, j = 0; i < ship.length; i++, j += counter) {
        var k = coordinateStartShip + j;
        tempCords.push(k);
      }

      isPossibleToFill = true;
      for (let i = 0; i < arrayUsedCords.length; i++) {
        for (let j = 0; j < tempCords.length; j++) {
          if (arrayUsedCords[i] == tempCords[j]) {
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
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function attrToCoord(position) {
  var normalize = normalizeCoordinates(position)
  const y = normalize[0];
  const x = normalize[1];
  return { x: +x, y: +y };
}

function normalizeCoordinates(coordinates) {
  coordinates = `${coordinates}`
  return coordinates.length < 2 ? `0${coordinates}` : `${coordinates}`;
}

function isVerticalDirection() {
  const direction = Math.random() >= 0.5 ? true : false;
  return direction;
}

var isUserShoot = true
var computerShoots = []

function startShoot(userShips, computerShips) {
  shoot('user', userShips, computerShips)
  userShoot()
  //userShoot(computerShips)
}



function checkShoot(ships, target, coord, area) {
  var isShootInTarget = false
  var isAllSinked = false
  ships.forEach((ship) => {
    for (let i = 0; i < ship.coords.length; i++) {
      const position = ship.coords[i];
      if (position == coord) {
        ship.coordsShoot.push(position)
        target.className = "killed"
        isShootInTarget = true;
        if (ship.coords.length == ship.coordsShoot.length) {
          ship.coords.forEach((position) => {
            //target.classList.clear()
            let element = area.querySelector(`[data-coords="${position}"]`);
            element.className = 'kill';
          })
          ship.isSinked = true;
          var countSinked = 0
          ships.forEach((ship) => {
            if (ship.isSinked) {
              countSinked++;
            }
          })
          isAllSinked = ships.length == countSinked
        }
      }
    }
  });
  if (isShootInTarget == false) {
    target.className = "shoted"
  }
  return isAllSinked
}

function userShoot(computerShips, userShips) {
  var ships = computerShips;
  isUserShoot = true;
  var computerArea = document.getElementById("computer");
  computerArea.addEventListener("click", function (event) {
    if (isUserShoot == false) {
      return;
    }
    var coord = event.target.dataset["coords"];
    if (coord != undefined) {
      if (event.target.classList.contains("available") || event.target.classList.contains("ship")) {
        var isAllSinked = checkShoot(ships, event.target, parseInt(coord), computerArea);
        if (isAllSinked) {
          finishGame('user');
        } else {
          isUserShoot = false;
          shoot('computer', userShips, computerShips);
        }
      }
      computerArea.removeEventListener("click", this);
    }
  });
}

function computerShoot(userShips, computerShips) {
  isPossibleToShoot = false;
  while (isPossibleToShoot == false) {
    var random = getRandomInt(0, 100);
    if (computerShoots.includes(random)) {
      continue;
    }
    isPossibleToShoot = true;
    computerShoots.push(random);
    var userArea = document.getElementById("user");
    var isAllSinked = checkShoot(userShips, userArea.querySelector(`[data-coords="${random}"]`), random, userArea);
    if (isAllSinked) {
      finishGame('computer');
    } else {
      shoot('user', userShips, computerShips, userArea);
    }
  }
}

function shoot(player, userShips, computerShips) {
  if (player == 'user') {
    userShoot(computerShips, userShips);
  } else {
    setTimeout(() => {
      computerShoot(userShips, computerShips);
    }, 300);
  }
}

function finishGame(winnerName) {
  const message = document.createElement('h3');
  message.innerHTML = `${winnerName} WIN! ! !`;
  const newGameBtn = document.createElement('button');
  newGameBtn.innerHTML = 'START NEW GAME';
  document.body.append(message);
  document.body.append(newGameBtn);
  newGameBtn.onclick = () => document.location.reload();
}


// function userShoot(computerShips) {
//   var ships = computerShips;
//   var computerArea = document.getElementById("computer");
//   computerArea.addEventListener("click", function (event) {
//     var coord = event.target.dataset["coords"];
//     if (coord != undefined) {
//       if (event.target.classList.contains("available") || event.target.classList.contains("ship")) {
//         checkShoot(ships, event.target, parseInt(coord), computerArea);
//       }
//     }
//   });
// }

// function checkShoot(ships, target, coord, area){
//   var isShootInTarget = false
//   ships.forEach((ship) => {
//     for (let i = 0; i < ship.coords.length; i++) {
//       const position = ship.coords[i];
//       if(position == coord){
//         ship.coordsShoot.push(position)
//         target.className = "killed"
//         isShootInTarget = true;
//         if(ship.coords.length == ship.coordsShoot.length){
//           ship.coords.forEach((position)=> {
//             //target.classList.clear()
//             let element = area.querySelector(`[data-coords="${position}"]`);
//             element.className = 'kill';
//           })
//           ship.isSinked = true;
//           var countSinked = 0
//           ships.forEach((ship)=>{
//               if(ship.isSinked){
//                 countSinked++;
//               }
//           })
//           isAllSinked = ships.length == countSinked
//         }
//       }
//     }
//   });
//   if(isShootInTarget == false){
//     target.className = "shoted"
//   }
// }

game()