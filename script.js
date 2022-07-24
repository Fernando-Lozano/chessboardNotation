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

let lastActive = navLinks[0];



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

const padding = 20;
const img = new Image();   // Create new img element
img.addEventListener('load', function() {
  ctx.drawImage(img, padding, padding, canvas.width - padding*2, canvas.height - padding*2)
  console.log(canvas.width, canvas.height);
}, false);
img.src = './images/chessboard.png'; // Set source path
