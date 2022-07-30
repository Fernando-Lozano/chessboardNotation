/* -------------------- document api and canvas ------------------- */
const navLinks = document.querySelectorAll(".nav-link");
const main = document.querySelector(".main");
const second = document.querySelector(".second");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext('2d');
// Get the DPR and size of the canvas
const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();

function fixHighRes() {
  // Set the "actual" size of the canvas
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  
  // Scale the context to ensure correct drawing operations
  // ctx.scale(dpr, dpr);
  
  // Set the "drawn" size of the canvas
  canvas.style.width = `${rect.width}px`;
  canvas.style.height = `${rect.height}px`;
}
fixHighRes();

/* -------------------- variables ------------------- */
let lastActive = navLinks[0]; // main nav links on the top screen
const padding = 20; // padding around the chess board
let target = 90; // temporary: used to rotate the chessboard

/* -------------------- main ------------------- */
navLinks.forEach(function(link) {
  link.addEventListener("click", function(e) {
    e.preventDefault();

    // toggles active
    lastActive.classList.toggle("active");
    lastActive.classList.toggle("text-secondary");
    this.classList.toggle("active");
    this.classList.toggle("text-secondary");
    lastActive = this;

    if (link.childNodes[0].textContent === "ABOUT") {
      main.classList.add("d-none");
      second.classList.remove("d-none");
    } else {      
      main.classList.remove("d-none");
      second.classList.add("d-none");
    }
  });
});

class Chessboard {
  constructor({
    img,
    width,
    height,
    rotate = 0,
    xRotate,
    yRotate,
    scale = 1
  }) {
    this.img = img,
    this.width = width;
    this.height = height;
    this.rotate = rotate;
    this.xRotate = xRotate;
    this.yRotate = yRotate;
    this.scale = scale;
  }
}
const chessboard = new Chessboard({
  img: new Image(),
  width: canvas.width - padding * 2,
  height: canvas.height - padding * 2,
  xRotate: canvas.width / 2,
  yRotate: canvas.height / 2
});
chessboard.img.addEventListener('load', function() {
  window.requestAnimationFrame(render);
  console.log(chessboard.xRotate, chessboard.yRotate);
}, false);
chessboard.img.src = './images/chessboard.png'; // Set source path

function render(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  movement(chessboard);
  scale(chessboard, target);
  ctx.save();
  ctx.translate(chessboard.xRotate, chessboard.yRotate);
  ctx.rotate(chessboard.rotate * Math.PI / 180);
  ctx.scale(chessboard.scale, chessboard.scale);
  ctx.translate(-chessboard.xRotate, -chessboard.yRotate);
  ctx.drawImage(chessboard.img, padding, padding, chessboard.width, chessboard.height);
  ctx.restore();
  if (!(chessboard.rotate === target)) {
    window.requestAnimationFrame(render);
  }
}

function movement(shape) {
  shape.rotate += 1;
  // shape.xPosition += 0.1;
}

// add ease in and out functions to smoothen this out... research time
function scale(shape, target) {
  if (shape.rotate <= target / 2) {
    // shrink
    shape.scale -= 0.01;
  } else {
    // grow
    shape.scale += 0.01;
  }
}