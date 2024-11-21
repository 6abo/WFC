const celdas = [];
const RETICULA = 8;
let ancho;
let alto;

const azulejos = [];
const numA = 11; // número de azulejos

const reglas = [
    // Reglas de los bordes de cada azulejo
    { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 },  //Azulejo 0
    { UP: 1, RIGHT: 1, DOWN: 1, LEFT: 0 },  //Azulejo 1
    { UP: 0, RIGHT: 1, DOWN: 1, LEFT: 1 },  //Azulejo 2
    { UP: 1, RIGHT: 1, DOWN: 0, LEFT: 1 },  //Azulejo 3
    { UP: 1, RIGHT: 0, DOWN: 1, LEFT: 1 },  //Azulejo 4
    { UP: 1, RIGHT: 0, DOWN: 0, LEFT: 1 },  //Azulejo 5
    { UP: 1, RIGHT: 1, DOWN: 0, LEFT: 0 },  //Azulejo 6
    { UP: 0, RIGHT: 0, DOWN: 1, LEFT: 1 },  //Azulejo 7
    { UP: 0, RIGHT: 1, DOWN: 1, LEFT: 0 },  //Azulejo 8
    { UP: 1, RIGHT: 1, DOWN: 1, LEFT: 1 },  //Azulejo 9
    { UP: 0, RIGHT: 0, DOWN: 0, LEFT: 0 },  //Azulejo 10
];

function preload() {
    for (let i = 0; i < numA; i++) {
        azulejos[i] = loadImage("tiles/Azulejos_Azulejo " + i + ".png");
    }
}

function setup() {
    createCanvas(1080, 1080);

    ancho = width / RETICULA;
    alto = height / RETICULA;

    let opcionesInit = [];
    for (let i = 0; i < azulejos.length; i++) {
        opcionesInit.push(i);
    }

    for (let i = 0; i < RETICULA * RETICULA; i++) {
        celdas[i] = {
            colapsada: false,
            opciones: opcionesInit,
        };
    }
}

function draw() {
    const celdaDis = celdas.filter((celda) => !celda.colapsada);

    if (celdaDis.length > 0) {
        celdaDis.sort((a, b) => a.opciones.length - b.opciones.length);

        const celdasXColapsar = celdaDis.filter(
            (celda) => celda.opciones.length === celdaDis[0].opciones.length
        );

        const celdaSelec = random(celdasXColapsar);
        celdaSelec.colapsada = true;

        const opcionSelec = random(celdaSelec.opciones);
        celdaSelec.opciones = [opcionSelec];

        for (let x = 0; x < RETICULA; x++) {
            for (let y = 0; y < RETICULA; y++) {
                const celdaIndex = x + y * RETICULA;
                const celdaActual = celdas[celdaIndex];
                if (celdaActual.colapsada) {
                    const indiceAzulejo = celdaActual.opciones[0];
                    image(azulejos[indiceAzulejo], x * ancho, y * alto, ancho, alto);
                } else {
                    strokeWeight(4);
                    rect(x * ancho, y * alto, ancho, alto);
                }
            }
        }

        // Actualizar las opciones de las celdas vecinas
        actualizarVecinos();
    } else {
        noLoop();
    }
}

function actualizarVecinos() {
    for (let x = 0; x < RETICULA; x++) {
        for (let y = 0; y < RETICULA; y++) {
            const celdaIndex = x + y * RETICULA;
            const celdaActual = celdas[celdaIndex];

            if (celdaActual.colapsada) {
                const indiceAzulejo = celdaActual.opciones[0];
                const reglasActuales = reglas[indiceAzulejo];

                // Monitorear UP
                if (y > 0) {
                    const indiceUP = x + (y - 1) * RETICULA;
                    cambiarDireccion(celdas[indiceUP], reglasActuales["UP"], "DOWN");
                }

                // Monitorear RIGHT
                if (x < RETICULA - 1) {
                    const indiceRight = x + 1 + y * RETICULA;
                    cambiarDireccion(celdas[indiceRight], reglasActuales["RIGHT"], "LEFT");
                }

                // Monitorear DOWN
                if (y < RETICULA - 1) {
                    const indiceDown = x + (y + 1) * RETICULA;
                    cambiarDireccion(celdas[indiceDown], reglasActuales["DOWN"], "UP");
                }

                // Monitorear LEFT
                if (x > 0) {
                    const indiceLeft = x - 1 + y * RETICULA;
                    cambiarDireccion(celdas[indiceLeft], reglasActuales["LEFT"], "RIGHT");
                }
            }
        }
    }
}

function cambiarDireccion(_celda, _regla, _opuesto) {
    if (!_celda || _celda.colapsada) return;

    const nuevasOpciones = _celda.opciones.filter(
        (opcion) => _regla === reglas[opcion][_opuesto]
    );

    _celda.opciones = nuevasOpciones;
}
