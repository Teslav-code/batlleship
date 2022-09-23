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
  let userShips = buildShipsUser("user")
  let computerShips = buildShipsComputer("computer");
  startButton.onclick = () => {
    startShoot(userShips, computerShips)
    startButton.remove();
  }
  return
}

let buildShipsUser = (player) => {
  let ships = createShips(config);
  console.log(ships);
  layoutShips(ships);
  let user = document.getElementById(player)
  ships.forEach((ship) => {
    ship.coords.forEach((coord) => {
      user.querySelector(`[data-coords="${coord}"]`).className = "ship";
    })
  });
  return ships
}

let buildShipsComputer = (player) => {
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
      let position = ship.coords[i];
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
          if (position === 0) {
            let margin = [position + 1, position + 10, position + 11];
            for (let i = 0; i < margin.length; i++) {
              let cord = margin[i];
              let element = area.querySelector(`[data-coords="${cord}"]`);
              console.log(element)
              if ((element.classList.contains("empty"))) {
                element.className = "shoot";
              }
            }
          } else if (position === 90) {
            let margin = [position - 10, position - 9, position + 1];
            for (let i = 0; i < margin.length; i++) {
              let cord = margin[i];
              let element = area.querySelector(`[data-coords="${cord}"]`);
              console.log(element)
              if ((element.classList.contains("empty"))) {
                element.className = "shoot";
              }
            }
          } else if (position === 9) {
            let margin = [position - 1, position + 9, position + 10];
            for (let i = 0; i < margin.length; i++) {
              let cord = margin[i];
              let element = area.querySelector(`[data-coords="${cord}"]`);
              console.log(element)
              if ((element.classList.contains("empty"))) {
                element.className = "shoot";
              }
            }
          } else if (position === 99) {
            let margin = [position - 11, position - 10, position - 1,];
            for (let i = 0; i < margin.length; i++) {
              let cord = margin[i];
              let element = area.querySelector(`[data-coords="${cord}"]`);
              console.log(element)
              if ((element.classList.contains("empty"))) {
                element.className = "shoot";
              }
            }
          } else {
            let arr1 = [10, 20, 30, 40, 50, 60, 70, 80]
            for (let i = 0; i < arr1.length; i++) {
              if (position === arr1[i]) {
                let margin = [position + 10, position + 1, position - 10, position - 9, position + 11];
                for (let i = 0; i < margin.length; i++) {
                  let cord = margin[i];
                  let element = area.querySelector(`[data-coords="${cord}"]`);
                  console.log(element)
                  if ((element.classList.contains("empty"))) {
                    element.className = "shoot";
                  }
                }
              }
            }

            let arr2 = [19, 29, 39, 49, 59, 69, 79, 89, 99]
            for (let i = 0; i < arr2.length; i++) {
              if (position === arr2[i]) {
                let margin = [position - 11, position - 10, position - 1, position + 9, position + 10];
                for (let i = 0; i < margin.length; i++) {
                  const cord = margin[i];
                  let element = area.querySelector(`[data-coords="${cord}"]`);
                  console.log(element)
                  if ((element.classList.contains("empty"))) {
                    element.className = "shoot";
                  }
                }
              }
            }

            let arr3 = [1, 2, 3, 4, 5, 6, 7, 8];
            for (let i = 0; i < arr3.length; i++) {
              if (position == arr3[i]) {
                let margin = [position - 1, position + 1, position + 9, position + 10, position + 11];
                for (let i = 0; i < margin.length; i++) {
                  let cord = margin[i];
                  let element = area.querySelector(`[data-coords="${cord}"]`);
                  console.log(element)
                  if ((element.classList.contains("empty"))) {
                    element.className = "shoot";
                  }
                }
              }
            }

            let arr4 = [91, 92, 93, 94, 95, 96, 97];
            for (let i = 0; i < arr4.length; i++) {
              if (position == arr4[i]) {
                let margin = [position - 11, position - 10, position - 9, position - 1, position + 1];
                console.log(position)
                for (let i = 0; i < margin.length; i++) {
                  let cord = margin[i];
                  let element = area.querySelector(`[data-coords="${cord}"]`);
                  console.log(element)
                  debugger
                  if ((element.classList.contains("empty"))) {
                    element.className = "shoot";
                    debugger
                  }
                }
              }
            }

            let arr5 = [11, 18, 21, 28, 31, 38, 41, 48, 51, 58, 61, 68, 71, 78, 81, 88, 98];
            for (let i = 0; i < arr5.length; i++) {
              if (position == arr5[i]) {
                let coord = arr5[i]
                let margin = [coord - 1, coord + 10, coord + 1, coord - 10,
                coord - 11, coord - 9, coord + 9, coord + 11];
                console.log(position)
                for (let i = 0; i < margin.length; i++) {
                  let cord = margin[i];
                  let element = area.querySelector(`[data-coords="${cord}"]`);
                  console.log(element)
                  if ((element.classList.contains("empty"))) {
                    element.className = "shoot";
                  }
                }
              }
            }

            let arr6 = [11, 12, 13, 14, 15, 16, 17,
              22, 23, 24, 25, 26, 27, 32, 33, 34, 35, 36, 37,
              42, 43, 44, 45, 46, 47, 52, 53, 54, 55, 56, 57, 62,
              63, 64, 65, 66, 67, 72, 73, 74, 75, 76, 77, 82, 83,
              84, 85, 86, 87, 93, 94, 95, 96, 97];
            for (let i = 0; i < arr6.length; i++) {
              if (position == arr6[i]) {
                debugger
                console.log(position)
                let margin = [position - 11, position - 10, position - 9, position - 1, position + 1,
                position + 9, position + 10, position + 11];
                for (let i = 0; i < margin.length; i++) {
                  let cord = margin[i];
                  debugger
                  let element = area.querySelector(`[data-coords="${cord}"]`);
                  debugger
                  console.log(element)
                  if ((element.classList.contains("empty"))) {
                    element.className = "shoot";
                  }
                }
              }
            }
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



// else if ((ship.coords.length === 4) && (ship.isVertical === true)) {
//   console.log(ship.coords.length)
//   let margin = [position - 11, position - 10, position - 9, position - 1, position + 1,
//   position + 9, position + 10, position + 11, position + 19, position + 29, position + 21, position + 31, position + 39, position + 40, position + 41];
//   for (let i = 0; i < margin.length; i++) {
//     let cord = margin[i];
//     debugger
//     let element = area.querySelector(`[data-coords="${cord}"]`);
//     debugger
//     console.log(element)
//     if ((element.classList.contains("empty"))) {
//       element.className = "shoot";
//     }
//   }
// } else if ((ship.coords.length === 4) && (ship.isVertical === false)) {
//   let margin = [position - 11, position - 10, position - 9, position - 1, position + 1,
//   position + 9, position + 10, position + 11, position - 8, position - 7, position - 6, position + 12, position + 13, position + 14, position + 4];
//   for (let i = 0; i < margin.length; i++) {
//     let cord = margin[i];
//     debugger
//     let element = area.querySelector(`[data-coords="${cord}"]`);
//     debugger
//     console.log(element)
//     if ((element.classList.contains("empty"))) {
//       element.className = "shoot";
//     }
//   }
// } else if ((ship.coords.length === 3) && (ship.isVertical === false)) {
//   console.log(ship.coords.length)
//   let margin = [position - 11, position - 10, position - 9, position - 8, position -7, position -1,  position  + 3,
//   position  + 9, position + 10, position + 11, position + 12, position + 13 ];
//   for (let i = 0; i < margin.length; i++) {
//     let cord = margin[i];
//     debugger
//     let element = area.querySelector(`[data-coords="${cord}"]`);
//     debugger
//     console.log(element)
//     if ((element.classList.contains("empty"))) {
//       element.className = "shoot";
//     }
//   }
// }