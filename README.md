# Máquina de Estados con Canvas (Ejemplo Didáctico)

## Descripción

Este proyecto muestra cómo modelar un programa utilizando una Máquina de Estados Finita.

El ejemplo usa HTML5 Canvas para visualizar una nave espacial que:

- Se inicializa en una posición aleatoria.
- Se mueve automáticamente.
- Cambia de comportamiento según el estado del sistema.

El objetivo principal no es la animación, sino mostrar cómo un autómata controla el flujo de ejecución de un programa real.

---

## Objetivo didáctico

Este ejemplo permite relacionar conceptos formales de autómatas con programación:

- Estados
- Transicione
- Acciones asociadas a cada estado
- Condiciones de cambio de estado

El estudiante debe identificar:

- Dónde está el estado actual.
- Dónde ocurre la función de transición.
- Qué acción corresponde a cada estado.
- Cómo el ciclo recursivo simula la evolución temporal del autómata.

---

## Estados del sistema

El sistema define tres estados:

    CREACION  -> Definir recursos a cargar
    PRECARGA  -> Esperar a que las imágenes estén listas
    INICIO    -> Ejecutar el ciclo principal (actualizar + dibujar)

Formalmente:

    Q = {CREACION, PRECARGA, INICIO}

Transiciones principales:

    f(CREACION) -> PRECARGA
    f(PRECARGA, imagenes_listas) -> INICIO
    f(INICIO) -> INICIO

---

## Estructura del programa

### Clase NaveEspacial

Responsabilidades:

- Mantener posición y velocidad.
- Actualizar su movimiento.
- Dibujarse en el canvas.

Representa el modelo del sistema.

---

### Clase Animacion

Responsabilidades:

- Gestionar el estado actual.
- Ejecutar la máquina de estados.
- Cargar recursos.
- Controlar el ciclo principal.

Representa el controlador del autómata.

---

## Máquina de estados

El método clave es:

    ejecutarMaquinaDeEstados()

Este método:

1. Observa el estado actual.
2. Ejecuta la acción correspondiente.
3. Cambia el estado si se cumple una condición.
4. Programa el siguiente paso con setTimeout.

Este patrón simula la evolución temporal de un autómata.



---

## Requisitos

Archivo HTML mínimo:

    <canvas id="canvas"></canvas>
    <script src="script.js"></script>

Imagen requerida en:

    img/nave.png

Archivo CSS
Archivo JS
