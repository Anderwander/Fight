const canvas = document.querySelector("canvas"); // Esto hace referencia al elemento canvas del HTML
const c = canvas.getContext("2d"); // Esto es para obtener el contexto del canvas, en este caso 2d

canvas.width = 1024; // Esto es para que el canvas ocupe todo el ancho de la pantalla (hay que orobar, sino serían 1024)(Podría ser innerWidth)
canvas.height = 576; // Esto es para que el canvas ocupe todo el alto de la pantalla (hay que orobar, sino serían 576)(Podría ser innerHeight)

c.fillRect(0, 0, canvas.width, canvas.height); // Esto es para rellenar el canvas de color negro

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});

const shop = new Sprite({
  position: {
    x: 620,
    y: 129,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: { x: 0, y: 0 },
  velocity: { x: 0, y: 10 },
  offset: { x: 0, y: 0 },
  imageSrc: "./img/samuraiMack/Idle.png",
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 155,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 65,
      y: 50,
    },
    width: 192,
    height: 50,
  },
});

const enemy = new Fighter({
  position: { x: 400, y: 100 },
  velocity: { x: 0, y: 0 },
  offset: { x: -50, y: 0 },
  imageSrc: "./img/kenji/Idle.png",
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 168,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take Hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -172,
      y: 50,
    },
    width: 172,
    height: 50,
  },
});

/* console.log(player);
 */
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

decreaseTimer();

function animate() {
  /*   if (gameOver) return;
   */ window.requestAnimationFrame(animate); // Esto es para que se ejecute la función animate cada vez que se refresque la pantalla
  c.fillStyle = "black"; // Esto es para que el canvas se rellene de color negro
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  shop.update();
  c.fillStyle = "rgba(255,255,255,0.18)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update(); // Esto es para que se ejecute la función update del objeto player

  player.velocity.x = 0; // Esto es para que el personaje no se mueva infinitamente
  enemy.velocity.x = 0;

  //Movimiento del jugador
  if (keys.a.pressed && player.lastkey === "a") {
    // Aquí dice que  si la tecla está presionada y la última tecla presionada fue a, entonces el personaje se mueva a la izquierda
    player.velocity.x = -5; // Esto es para que el personaje se mueva 5 px a la izquierda
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastkey === "d") {
    // Aquí dice que  si la tecla está presionada y la última tecla presionada fue d, entonces el personaje se mueva a la derecha
    player.velocity.x = 5; // Esto es para que el personaje se mueva 5 px a la derecha
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Movimiento del enemigo
  enemy.velocity.x = 0;
  if (keys.ArrowLeft.pressed && enemy.lastkey === "ArrowLeft") {
    enemy.velocity.x = -5;
    enemy.switchSprite("run");
  } else if (keys.ArrowRight.pressed && enemy.lastkey === "ArrowRight") {
    enemy.velocity.x = 5;
    enemy.switchSprite("run");
  } else {
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  //Colisiones
  //colisiones del jugador con el enemigo
  if (
    rectangularCollision({ rect1: player, rect2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    enemy.takeHit();
    player.isAttacking = false;

    gsap.to("#enemyHealthContainer", {
      // Esto es para que la barra de vida del enemigo se vaya reduciendo
      width: enemy.health + "%",
    });
  }

  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false;
  }

  //colisiones del enemigo con el jugador
  if (
    rectangularCollision({ rect1: enemy, rect2: player }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit();
    enemy.isAttacking = false;

    gsap.to("#playerHealthContainer", {
      width: player.health + "%",
    });
  }
  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false;
  }

  //Game over cuando la vida de un jugador llega a 0
  if (player.health <= 0 || enemy.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}

animate(); // Esto es para que se ejecute la función animate

window.addEventListener("keydown", (event) => {
  if (!player.dead) {
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

      case " ": // Esto es para que cuando se presione la barra espaciadora, se ejecute la función attack
        player.attack();
        break;
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
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

      case "ArrowDown":
        enemy.attack();
        break;
    }
  }

  /*   console.log(event.key);
   */
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
});
