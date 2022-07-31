/* -------------------- variables ------------------- */
const navLinks = document.querySelectorAll(".nav-link");
const main = document.querySelector(".main");
const about = document.querySelector(".about");
const rotateBtn = document.querySelector("#rotateBtn");
const answerBtns = document.querySelectorAll(".answerBtns");

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
// Get the DPR and size of the canvas
const dpr = window.devicePixelRatio;
const rect = canvas.getBoundingClientRect();

let lastActive = navLinks[0]; // main nav links on the top screen
const padding = 20; // padding around the chess board
let practiceMode = "COLUMNS"; // mode that the web page starts off with
let answerList = [];
let answer;
const timeout = 500; // length of time the correct and incorrect answer are indicated

// sound effects
const sound1 = {
  oldParams: true,
  wave_type: 0,
  p_env_attack: 0,
  p_env_sustain: 0.15258270255533674,
  p_env_punch: 0,
  p_env_decay: 0.2066640701097686,
  p_base_freq: 0.37169226164182423,
  p_freq_limit: 0,
  p_freq_ramp: 0.29973785758091787,
  p_freq_dramp: 0,
  p_vib_strength: 0,
  p_vib_speed: 0,
  p_arp_mod: 0,
  p_arp_speed: 0,
  p_duty: 0.1164756967535637,
  p_duty_ramp: 0,
  p_repeat_speed: 0,
  p_pha_offset: 0,
  p_pha_ramp: 0,
  p_lpf_freq: 0.5645768163216369,
  p_lpf_ramp: 0,
  p_lpf_resonance: 0,
  p_hpf_freq: 0.06245799728151066,
  p_hpf_ramp: 0,
  sound_vol: 0.2,
  sample_rate: 44100,
  sample_size: 8,
};
const sound2 = {
  oldParams: true,
  wave_type: 0,
  p_env_attack: -0.07067758327726817,
  p_env_sustain: 0.04105834812641501,
  p_env_punch: 0.09196609040619239,
  p_env_decay: 0.396001905479614,
  p_base_freq: 0.4886364723354581,
  p_freq_limit: 0,
  p_freq_ramp: -0.031600722583409305,
  p_freq_dramp: -0.34520172589752873,
  p_vib_strength: -0.0027870172520410184,
  p_vib_speed: -0.5298498189877496,
  p_arp_mod: -0.7863718903491055,
  p_arp_speed: -0.9138353334107414,
  p_duty: -0.72637695548441,
  p_duty_ramp: 0.0076506405684823725,
  p_repeat_speed: -0.6542218318021327,
  p_pha_offset: -0.9030752044425391,
  p_pha_ramp: 0.5521189383351843,
  p_lpf_freq: 0.9991988025072697,
  p_lpf_ramp: 0.367470462961586,
  p_lpf_resonance: 0.5869348278285376,
  p_hpf_freq: 0.5717756955427559,
  p_hpf_ramp: -0.4092666360294952,
  sound_vol: 0.2,
  sample_rate: 44100,
  sample_size: 8,
};
const correctSound = sfxr.toAudio(sound1);
const incorrectSound = sfxr.toAudio(sound2);

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
    if (practiceMode === "ROWS") {
      answers.push((Math.floor(Math.random() * 8) + 1).toString());
    } else if (practiceMode === "COLUMNS") {
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
  answer = answerList[Math.floor(Math.random() * 4)];
  answerBtns.forEach((display, index) => {
    display.textContent = answerList[index];
  });
}
function highlightAnswer(answer, practiceMode) {
  let squareSize = chessboard.width / 8;
  let x, y, width, height;
  if (practiceMode === "ROWS") {
    x = 0;
    y = chessboard.height - squareSize * Number(answer);
    width = chessboard.width;
    height = squareSize;
  } else if (practiceMode === "COLUMNS") {
    x = squareSize * Number(answer.charCodeAt(0) - 65);
    y = 0;
    width = squareSize;
    height = chessboard.width;
  } else {
    x = squareSize * Number(answer.charCodeAt(0) - 65);
    y = chessboard.height - squareSize * Number(answer[1]);
    width = squareSize;
    height = squareSize;
  }
  ctx.fillStyle = "rgba(121, 30, 148, 0.8)";
  ctx.fillRect(x + padding, y + padding, width, height);
}
function delay(timeout) {
  return new Promise((res) => {
    setTimeout(() => {
      res();
    }, timeout);
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
    chessboard.render();
    highlightAnswer(answer, practiceMode);
  },
  false
);
chessboard.img.src = "./chessboard.png"; // Set source path

rotateBtn.addEventListener("click", () => {
  chessboard.render(90);
  highlightAnswer(answer, practiceMode);
});

// initializes
nextRound();

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
      about.classList.remove("d-none");
    } else {
      main.classList.remove("d-none");
      about.classList.add("d-none");
    }

    practiceMode = this.textContent;
    nextRound();
    chessboard.render();
    highlightAnswer(answer, practiceMode);
  });
});

answerBtns.forEach(display => {
  display.addEventListener("click", async function() {
    if (this.textContent === answer) { // if correct answer
      correctSound.play();
      this.classList.add("correct");
      await delay(timeout);
      this.classList.remove("correct")
      nextRound();
      chessboard.render();
      highlightAnswer(answer, practiceMode);
    } else { // if incorrect answer
      incorrectSound.play();
      this.classList.add("incorrect");
      await delay(timeout);
      this.classList.remove("incorrect");
      nextRound();
      chessboard.render();
      highlightAnswer(answer, practiceMode);
    }
  });
});