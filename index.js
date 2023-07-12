const canvas = document.querySelector("canvas"); // Esto hace referencia al elemento canvas del HTML
const c = canvas.getContext("2d"); // Esto es para obtener el contexto del canvas, en este caso 2d

canvas.width = innerWidth; // Esto es para que el canvas ocupe todo el ancho de la pantalla (hay que orobar, sino serían 1024)
canvas.height = innerHeight; // Esto es para que el canvas ocupe todo el alto de la pantalla (hay que orobar, sino serían 576)

c.fillRect(0, 0, canvas.width, canvas.height); // Esto es para rellenar el canvas de color negro

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.lastkey;
    this.isJumping = false; // Nuevo estado para el salto
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();

    this, (this.position.x += this.velocity.x);
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
      this.isJumping = false; // Actualizar el estado del salto al tocar el suelo
    } else {
      this.velocity.y += gravity;
    }
  }

  jump() {
    if (!this.isJumping) {
      this.velocity.y = -20;
      this.isJumping = true;
    }
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

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate); // Esto es para que se ejecute la función animate cada vez que se refresque la pantalla
  c.fillStyle = "black"; // Esto es para que el canvas se rellene de color negro
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update(); // Esto es para que se ejecute la función update del objeto player

  player.velocity.x = 0; // Esto es para que el personaje no se mueva infinitamente
  enemy.velocity.x = 0;

  //Movimiento del jugador
  if (keys.a.pressed && player.lastkey === "a") {
    // Aquí dice que  si la tecla está presionada y la última tecla presionada fue a, entonces el personaje se mueva a la izquierda
    player.velocity.x = -5; // Esto es para que el personaje se mueva 5 px a la izquierda
  } else if (keys.d.pressed && player.lastkey === "d") {
    // Aquí dice que  si la tecla está presionada y la última tecla presionada fue d, entonces el personaje se mueva a la derecha
    player.velocity.x = 5; // Esto es para que el personaje se mueva 5 px a la derecha
  }

  //Movimiento del enemigo
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5;
  }
}

animate(); // Esto es para que se ejecute la función animate

window.addEventListener("keydown", (event) => {
  //Aquí se le dice al programa que cuando se presione una tecla, se ejecute la función que está dentro del paréntesis
  switch (
    event.key // Esto es para que el programa sepa qué tecla se presionó
  ) {
    case "d": // Aquí en el caso de que la tecla presionada sea d, se ejecuta lo siguiente
      keys.d.pressed = true; // Aquí cambia el valor de la tecla d a true, lo que hace que la función animate sepa que la tecla d está presionada
      player.lastkey = "d"; // Esto es para que el programa sepa que la última tecla presionada fue d
      break; // Esto es para que el programa sepa que ya terminó de ejecutar lo que está dentro del case

    case "a":
      keys.a.pressed = true;
      player.lastkey = "a";
      break;

    case "w":
      player.jump();
      break;

    //Keys del enemigo

    case "ArrowRight": // Aquí en el caso de wque la tecla presionada sea ArrowRight, se ejecuta lo siguiente
      keys.ArrowRight.pressed = true; // Aquí cambia el valor de la tecla ArrowRight a true, lo que hace que la función animate sepa que la tecla ArrowRight está presionada
      enemy.lastkey = "ArrowRight"; // Esto es para que el programa sepa que la última tecla presionada fue d
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastkey = "ArrowLeft";
      break;

    case "ArrowUp":
      enemy.jump();
      break;
  }
  console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  // Esto es para que cuando se suelte una tecla, se ejecute la función que está dentro del paréntesis
  switch (
    event.key // Esto es para que el programa sepa qué tecla se soltó
  ) {
    case "d": // Aquí en el caso de que la tecla soltada sea d, se ejecuta lo siguiente
      keys.d.pressed = false; // Aquí cambia el valor de la tecla d a false, lo que hace que la función animate sepa que la tecla d no está presionada
      break;
    case "a":
      keys.a.pressed = false;
      break;
  }

  //Keys del enemigo
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }

  console.log(event.key);
});
