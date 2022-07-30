/* -------------------- variables ------------------- */
const navLinks = document.querySelectorAll(".nav-link");
const main = document.querySelector(".main");
const second = document.querySelector(".second");
const rotateBtn = document.querySelector(".rotate");
const answerDisplays = document.querySelectorAll("span");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
// Get the DPR and size of the canvas
const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();

let lastActive = navLinks[0]; // main nav links on the top screen
const padding = 20; // padding around the chess board
let rotate = 0;
let practiceMode = "ROW";
let answerList = [];
let answer;

/* -------------------- fix for high res displays ------------------- */
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

/* -------------------- helpers ------------------- */
function getAnswers(practiceMode) {
  let answers = [];
  for (let i = 0; i < 4; i++) {
    if (practiceMode === "ROW") {
      answers.push((Math.floor(Math.random() * 8) + 1).toString());
    } else if (practiceMode === "COLUMN") {
      answers.push(String.fromCharCode(Math.floor(Math.random() * 8) + 65));
    } else {
      answers.push(
        String.fromCharCode(Math.floor(Math.random() * 8) + 65) +
          (Math.floor(Math.random() * 8) + 1).toString()
      );
    }
  }
  return answers;
}
function nextRound() {
  answerList = getAnswers(practiceMode);
  answer = answerList[Math.floor(Math.random() * 4) + 1];
  answerDisplays.forEach((display, index) => {
    display.textContent = answerList[index];
  });
}

/* -------------------- main ------------------- */
class Chessboard {
  constructor({ img, width, height, rotate = 0 }) {
    this.img = img;
    this.width = width;
    this.height = height;
    this.rotate = rotate;
  }
  render(rotate = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Matriz de transformación
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    ctx.translate(-(canvas.width / 2), -(canvas.height / 2));
    ctx.drawImage(this.img, padding, padding, this.width, this.height);
  }
}
const chessboard = new Chessboard({
  img: new Image(),
  width: canvas.width - padding * 2,
  height: canvas.height - padding * 2,
});
chessboard.img.addEventListener(
  "load",
  function () {
    chessboard.render(rotate);
  },
  false
);
chessboard.img.src = "./images/chessboard.png"; // Set source path

rotateBtn.addEventListener("click", () => {
  chessboard.render(90);
});

// initializes
nextRound();
// add functionality to highlight chess board

navLinks.forEach(function (link) {
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

    practiceMode = this.textContent;
    nextRound();
    // add functionality to highlight chessboard
  });
});

// section for when user clicks a possible answer
// display right or wrong on canvas for when user answers
answerDisplays.forEach(display => {
  display.addEventListener("click", function() {
    // if correct do this
    if (this.textContent === answer) {
      // display something for being correct
      alert("correct");
      nextRound();
    } else {
      // display something for being wrong
      alert("incorrect");
      nextRound();
    }
  });
});