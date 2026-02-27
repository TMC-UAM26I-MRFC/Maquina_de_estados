/**
 * Ejemplo didáctico (muy simple): Canvas + Máquina de Estados (FSM)
 * -----------------------------------------------------------------
 * Estados:
 *   CREACION  -> definir qué recursos se cargarán
 *   PRECARGA  -> esperar a que las imágenes estén listas
 *   INICIO    -> ciclo principal (actualizar + dibujar)
 */

// ===========================
// 1) Estados
// ===========================
var CREACION = 100;
var PRECARGA = 200;
var INICIO   = 300;

/**
 * Entero aleatorio en [min, max].
 */
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ===========================
// 2) Clase NaveEspacial
// ===========================
class NaveEspacial {
  /**
   * @param {number} x
   * @param {number} y
   * @param {HTMLImageElement} imagen
   * @param {number} dx  Dirección inicial: 1 = derecha, -1 = izquierda
   */
  constructor(x, y, imagen, dx = 1) {
    this.x = x;
    this.y = y;
    this.velocidad = 5;
    this.imagen = imagen;

    this.spriteW = 100;
    this.spriteH = 50;

    // Dirección horizontal inicial (parámetro configurable)
    this.dx = dx;
  }

  /**
   * Actualiza posición.
   * Rebota cuando llega a los límites horizontales.
   */
  mover(canvasW) {
    this.x += this.dx * this.velocidad;

    var maxX = Math.max(0, canvasW - this.spriteW);

    if (this.x <= 0) {
      this.x = 0;
      this.dx = 1;
    }

    if (this.x >= maxX) {
      this.x = maxX;
      this.dx = -1;
    }
  }

  /**
   * Dibuja la nave.
   * Si dx es negativo (va hacia la izquierda), la voltea horizontalmente.
   */
  dibujar(ctx) {
    if (this.dx === -1) {
      // Voltear horizontalmente para que "mire" hacia la izquierda
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.imagen,
        0, 0, this.spriteW, this.spriteH,
        -(this.x + this.spriteW), this.y, this.spriteW, this.spriteH
      );
      ctx.restore();
    } else {
      ctx.drawImage(
        this.imagen,
        0, 0, this.spriteW, this.spriteH,
        this.x, this.y, this.spriteW, this.spriteH
      );
    }
  }
}

// ===========================
// 3) Animación con FSM
// ===========================
class Animacion {
  constructor() {
    this.estado = CREACION;

    this.imagenes = {};

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;

    this.nave       = null;  // Nave original  → empieza moviéndose a la DERECHA
    this.naveEnemiga = null; // Nave enemiga   → empieza moviéndose a la IZQUIERDA
  }

  /**
   * Crea objetos Image y asigna src.
   * Ambas naves usan la misma imagen; se puede cambiar por una diferente.
   */
  cargarImagenes() {
    this.imagenes.nave = new Image();
    this.imagenes.nave.src = "img/nave.png";
  }

  /**
   * Verifica si las imágenes están cargadas.
   */
  imagenesListas() {
    var k;
    for (k in this.imagenes) {
      if (!this.imagenes[k].complete) {
        return false;
      }
    }
    return true;
  }

  /**
   * Inicializa las naves en posiciones aleatorias.
   */
  inicializarEscena() {
    var spriteW = 100;
    var spriteH = 50;

    // Nave original: empieza en posición aleatoria, dirección → derecha (dx=1)
    var x0 = randInt(0, Math.max(0, this.canvas.width - spriteW));
    var y0 = randInt(0, Math.max(0, this.canvas.height - spriteH));
    this.nave = new NaveEspacial(x0, y0, this.imagenes.nave, 1);

    // Nave enemiga: empieza en posición aleatoria distinta, dirección → izquierda (dx=-1)
    var x1 = randInt(0, Math.max(0, this.canvas.width - spriteW));
    var y1 = randInt(0, Math.max(0, this.canvas.height - spriteH));
    this.naveEnemiga = new NaveEspacial(x1, y1, this.imagenes.nave, -1);
  }

  /**
   * Acción del estado INICIO: actualiza y dibuja ambas naves.
   */
  actualizarYdibujar() {
    this.nave.mover(this.canvas.width);
    this.naveEnemiga.mover(this.canvas.width);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.nave.dibujar(this.ctx);
    this.naveEnemiga.dibujar(this.ctx);
  }

  /**
   * Máquina de Estados Finita (FSM)
   */
  ejecutarMaquinaDeEstados() {

    // ESTADO 1: CREACION
    if (this.estado === CREACION) {
      this.cargarImagenes();
      this.estado = PRECARGA;
      setTimeout(this.ejecutarMaquinaDeEstados.bind(this), 100);
      return;
    }

    // ESTADO 2: PRECARGA
    if (this.estado === PRECARGA) {
      if (this.imagenesListas()) {
        this.inicializarEscena();
        this.estado = INICIO;
      }
      setTimeout(this.ejecutarMaquinaDeEstados.bind(this), 100);
      return;
    }

    // ESTADO 3: INICIO
    if (this.estado === INICIO) {
      this.actualizarYdibujar();
      setTimeout(this.ejecutarMaquinaDeEstados.bind(this), 100);
    }
  }
}

// ===========================
// 4) Arranque
// ===========================
var animacion = new Animacion();
animacion.ejecutarMaquinaDeEstados();
