/**
 * Ejemplo didáctico (muy simple): Canvas + Máquina de Estados (FSM)
 * -----------------------------------------------------------------
 * Objetivo en clase:
 * - Mostrar cómo un programa puede modelarse como un autómata.
 * - Identificar claramente estados, acciones y transiciones.
 *
 * Estados:
 *   CREACION  -> definir qué recursos se cargarán
 *   PRECARGA  -> esperar a que las imágenes estén listas
 *   INICIO    -> ciclo principal (actualizar + dibujar)
 *
 * Restricciones solicitadas:
 * - Código sencillo.
 * - Sin funciones lambda (=>).
 * - Sin Promesas.
 * - Sin manejo de eventos de teclado.
 * - Nave inicia en posición aleatoria.
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
   */
  constructor(x, y, imagen) {
    this.x = x;
    this.y = y;
    this.velocidad = 5;
    this.imagen = imagen;

    this.spriteW = 100;
    this.spriteH = 50;

    // Movimiento automático horizontal (simple)
    this.dx = 1;
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
   */
  dibujar(ctx) {
    ctx.drawImage(
      this.imagen,
      0, 0, this.spriteW, this.spriteH,
      this.x, this.y, this.spriteW, this.spriteH
    );
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

    this.nave = null;
  }

  /**
   * Crea objetos Image y asigna src.
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
   * Inicializa la nave en posición aleatoria.
   */
  inicializarEscena() {
    var spriteW = 100;
    var spriteH = 50;

    var x0 = randInt(0, Math.max(0, this.canvas.width - spriteW));
    var y0 = randInt(0, Math.max(0, this.canvas.height - spriteH));

    this.nave = new NaveEspacial(x0, y0, this.imagenes.nave);
  }

  /**
   * Acción del estado INICIO.
   */
  actualizarYdibujar() {
    this.nave.mover(this.canvas.width);

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.nave.dibujar(this.ctx);
  }  /**
   * Máquina de Estados Finita (FSM)
   * --------------------------------
   * Esta función representa el "controlador" del autómata.
   *
   * En cada llamada ocurre lo siguiente:
   * 1) Se observa el estado actual (this.estado).
   * 2) Se ejecuta la acción asociada a ese estado.
   * 3) Si se cumple una condición, se realiza una TRANSICIÓN
   *    cambiando el valor de this.estado.
   * 4) Se programa el siguiente "tick" del autómata con setTimeout.
   *
   * Observación importante para clase:
   * - this.estado  ≙  estado actual del autómata (q ∈ Q)
   * - Las condiciones (imagenesListas) ≙ símbolos/condiciones de transición
   * - this.estado = ...  ≙  función de transición δ
   */
  ejecutarMaquinaDeEstados() {

    // ==================================================
    // ESTADO 1: CREACION
    // Acción: definir qué recursos deben cargarse.
    // Transición: pasa inmediatamente a PRECARGA.
    // ==================================================
    if (this.estado === CREACION) {

      // Acción asociada al estado
      this.cargarImagenes();

      // Transición explícita del autómata:
      // δ(CREACION) -> PRECARGA
      this.estado = PRECARGA;

      // Próximo paso del autómata
      setTimeout(this.ejecutarMaquinaDeEstados.bind(this), 100);
      return;
    }

    // ==================================================
    // ESTADO 2: PRECARGA
    // Acción: verificar si los recursos ya están listos.
    // Transición: si imágenes listas -> INICIO
    // ==================================================
    if (this.estado === PRECARGA) {

      // Condición de transición
      if (this.imagenesListas()) {

        // Acción antes de cambiar de estado
        this.inicializarEscena();

        // δ(PRECARGA, imagenes_listas) -> INICIO
        this.estado = INICIO;
      }

      setTimeout(this.ejecutarMaquinaDeEstados.bind(this), 100);
      return;
    }

    // ==================================================
    // ESTADO 3: INICIO
    // Acción: ejecutar el ciclo principal del sistema.
    // No hay transición adicional (permanece en INICIO).
    // ==================================================
    if (this.estado === INICIO) {

      // Acción asociada al estado
      this.actualizarYdibujar();

      // El autómata permanece en INICIO
      // δ(INICIO) -> INICIO
      setTimeout(this.ejecutarMaquinaDeEstados.bind(this), 100);
    }
  }
}


// ===========================
// 4) Arranque
// ===========================
var animacion = new Animacion();
animacion.ejecutarMaquinaDeEstados();

