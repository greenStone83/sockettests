let cookieNumber = 22;

let spacing = 40;
let cookieSize = 20;
let margin = 2 / 3;
let limit = 1.75;

let trays = [];

function getDimensions(inputNum) {
  let factors = [];
  for (let i = 1; i <= sqrt(inputNum); i++) {
    if (inputNum % i === 0) {
      if (i !== 1 || inputNum < 3) {
        factors.push({
          x: inputNum / i, 
          y: i
        });
      }
    }
  }
  return factors;
}

function addToTrays(inputNum, pattern) {
  let dimensions = getDimensions(inputNum);
  for (let i = 0; i < dimensions.length; i++) {
    let d = dimensions[i];
    trays.push({
      width: d.x,
      height: d.y,
      pattern: pattern,
      angle: 30,
      width2: (d.x - 1) * cos(30),
      height2: (d.y - 1) * sin(30),
    });
    trays.push({
      width: d.x,
      height: d.y,
      pattern: pattern,
      angle: 45,
      width2: (d.x - 1) * cos(45),
      height2: (d.y - 1) * sin(45),
    });
    if (d.x !== d.y) {
      trays.push({
      width: d.x,
      height: d.y,
        pattern: pattern,
        angle: 60,
        width2: (d.x - 1) * cos(60),
        height2: (d.y - 1) * sin(60),
      });
    }
  }
}

function makeTrayList() {
  let squares = getDimensions(cookieNumber);
  for (let i = 0; i < squares.length; i++) {
    let s = squares[i];
    trays.push({
      width: s.x,
      height: s.y,
      pattern: "square",
      width2: s.x - 1,
      height2: s.y - 1,
    });
  }
  addToTrays(2 * cookieNumber - 1, "corner");
  addToTrays(2 * cookieNumber, "corner");
  addToTrays(2 * cookieNumber + 1, "side");
}

function flipLengthwise() {
  for (let i = 0; i < trays.length; i++) {
    let t = trays[i];
    if (t.height2 > t.width2) {
      let temp = t.height;
      t.height = t.width;
      t.width = temp;
      t.angle = 90 - t.angle;
      temp = t.height2;
      t.height2 = t.width2;
      t.width2 = temp;
    }
    if ((t.width2 + margin * 2) / (t.height2 + margin * 2) > limit) {
      trays.splice(i, 1);
      i--;
    }
  }
}

function orderTrays() {
  trays.sort(function (a, b) {
    return a.width2 - b.width2;
  });
}

function getCoordinates() {
  for (let i = 0; i < trays.length; i++) {
    let t = trays[i];
    t.coordinates = [];
    if (t.pattern === "square") {
      for (let i = 0; i < t.width; i++) {
        for (let j = 0; j < t.height; j++) {
          t.coordinates.push({
            x: i,
            y: j,
          });
        }
      }
    } else {
      let show1 = t.pattern === "corner";
      for (let i = 0; i < t.width; i++) {
        let show2 = show1;
        for (let j = 0; j < t.height; j++) {
          if (show2) {
            t.coordinates.push({
              x: i * cos(t.angle),
              y: j * sin(t.angle),
            });
          }
          show2 = !show2;
        }
        show1 = !show1;
      }
    }
  }
}

function drawTrays() {
  translate(80, 80);
  for (let i = 0; i < trays.length; i++) {
    let t = trays[i];
    let s = spacing;
    let m = margin;
    fill(127);
    rect(-s * m, -s * m, (t.width2 + m * 2) * s, (t.height2 + m * 2) * s, s / 2);
    fill(191, 127, 63);
    for (let j = 0; j < t.coordinates.length; j++) {
      let c = t.coordinates[j];
      circle(c.x * s, c.y * s, cookieSize);
    }
    translate(0, (t.height2 + 2) * s);
  }
}

/*
function setup() {
  angleMode(DEGREES);
  for (let k = 2; k < 50; k++) {
    cookieNumber = k;
    trays = [];
    makeTrayList();
    flipLengthwise();
    orderTrays();
    getCoordinates();
    if (trays.length === 0) {
      print(k);
    }
  }
}
*/

function setup() {
  angleMode(DEGREES);
  strokeWeight(2);
  
  createCanvas(windowWidth, windowHeight);
  makeTrayList();
  flipLengthwise();
  orderTrays();
  getCoordinates();
}

function draw() {
  background(255);
  drawTrays();
}
