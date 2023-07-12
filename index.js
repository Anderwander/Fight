const canvas = document.querySelector("canvas"); // Esto hace referencia al elemento canvas del HTML
const c = canvas.getContext("2d"); // Esto es para obtener el contexto del canvas, en este caso 2d

canvas.width = innerWidth; // Esto es para que el canvas ocupe todo el ancho de la pantalla (hay que orobar, sino serían 1024)
canvas.height = innerHeight; // Esto es para que el canvas ocupe todo el alto de la pantalla (hay que orobar, sino serían 576)

c.fillRect(0, 0, canvas.width, canvas.height); // Esto es para rellenar el canvas de color negro

const gravity = 0.2;

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }
}

const player = new Sprite({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
});

const enemy = new Sprite({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
});

console.log(player);

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();
}

animate();
