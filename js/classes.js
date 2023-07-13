class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    //Esta linea es la que se encarga de crear el sprite
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 8;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.framesMax),
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }

  animateFrames() {
    this.framesElapsed++;

    if (this.framesElapsed % this.framesHold === 0) {
      if (this.frameCurrent < this.framesMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  // Esta clase hereda de Sprite y añade nuevos atributos
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
    sprites,
    attackBox = {
      offset: {},
      width: undefined,
      height: undefined,
    },
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
    });

    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastkey;
    this.isJumping = false; // Nuevo estado para el salto
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.frameCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 3;
    this.sprites = sprites;
    this.dead = false;

    for (const sprite in this.sprites) {
      sprites[sprite].image = new Image();
      sprites[sprite].image.src = sprites[sprite].imageSrc;
    }

    /*     console.log(this.sprites);
     */
  }

  update() {
    this.draw();
    if (!this.dead) this.animateFrames();

    this.attackBox.position.x = this.position.x + this.attackBox.offset.x; // la explicacion de esta linea es que la posicion de la caja de ataque es la posicion del personaje en el eje x mas el offset
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y; // la explicacion de esta linea es que la posicion de la caja de ataque es la posicion del personaje en el eje y mas el offset
    /*  c.fillRect(
      // Dibujar el rectángulo de ataque
      this.attackBox.position.x, // Posición x
      this.attackBox.position.y, // Posición y
      this.attackBox.width, // Ancho
      this.attackBox.height // Alto
    ); */

    this, (this.position.x += this.velocity.x);
    this.position.y += this.velocity.y;

    //funcion de la gravedad y que no se salga del canvas
    if (this.position.y + this.height + this.velocity.y >= canvas.height - 96) {
      this.velocity.y = 0;
      this.position.y = 330;
      this.isJumping = false; // Actualizar el estado del salto al tocar el suelo
    } else {
      this.velocity.y += gravity;
    }
    /*     console.log(this.position.y);
     */
  }

  jump() {
    if (!this.isJumping) {
      this.velocity.y = -20;
      this.isJumping = true;
    }
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
  }

  //funcion para recibir daño que el personaje recibe -10 de vida y el enemy recibe -20 de vida
  takeHit() {
    this.health -= 10;
    //si la vida es menor o igual a 0, cambia de sprite a death, si no, cambia de sprite a takeHit
    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.frameCurrent === this.sprites.death.framesMax - 1)
        this.dead = true;
      return;
    }

    if (
      this.image === this.sprites.attack1.image && // la explicación de esta linea es que si el sprite es igual al sprite de attack1, no cambie de sprite
      this.frameCurrent < this.sprites.attack1.framesMax - 1 // la explicación de esta linea es que si el frame actual es menor que el frame maximo de attack1, no cambie de sprite
    )
      return;

    //overrride when taking hit
    if (
      this.image === this.sprites.takeHit.image &&
      this.frameCurrent < this.sprites.takeHit.framesMax - 1
    )
      return;

    switch (sprite) {
      case "idle":
        if (this.image !== this.sprites.idle.image) {
          this.image = this.sprites.idle.image;
          this.framesMax = this.sprites.idle.framesMax;
          this.frameCurrent = 0;
        }
        break;

      case "run":
        if (this.image !== this.sprites.run.image) {
          this.image = this.sprites.run.image;
          this.framesMax = this.sprites.run.framesMax;
          this.frameCurrent = 0;
        }
        break;

      case "jump":
        if (this.image !== this.sprites.jump.image) {
          this.image = this.sprites.jump.image;
          this.framesMax = this.sprites.jump.framesMax;
          this.frameCurrent = 0;
        }
        break;

      case "fall":
        if (this.image !== this.sprites.fall.image) {
          this.image = this.sprites.fall.image;
          this.framesMax = this.sprites.fall.framesMax;
          this.frameCurrent = 0;
        }
        break;

      case "attack1":
        if (this.image !== this.sprites.attack1.image) {
          this.image = this.sprites.attack1.image;
          this.framesMax = this.sprites.attack1.framesMax;
          this.frameCurrent = 0;
        }
        break;

      case "takeHit":
        if (this.image !== this.sprites.takeHit.image) {
          this.image = this.sprites.takeHit.image;
          this.framesMax = this.sprites.takeHit.framesMax;
          this.frameCurrent = 0;
        }
        break;

      case "death":
        if (this.image !== this.sprites.death.image) {
          this.image = this.sprites.death.image;
          this.framesMax = this.sprites.death.framesMax;
          this.frameCurrent = 0;
        }
        break;
    }
  }
}
