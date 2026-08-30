// ==========================================
// 1. SISTEMA DE LOGIN Y PISTAS
// ==========================================
const btnIngresar = document.getElementById('btnIngresar');
const usuarioInput = document.getElementById('usuario');
const passwordInput = document.getElementById('password');
const mensajeError = document.getElementById('mensajeError');
const pantallaLogin = document.getElementById('pantalla-login');
const contenidoPrincipal = document.getElementById('contenido-principal');
const musicaFondo = document.getElementById('musicaFondo');
const btnMusica = document.getElementById('btnMusica');

// Mostrar las pistas cuando tocas los campos de texto
usuarioInput.addEventListener('focus', () => {
    document.getElementById('pistaUsuario').style.display = 'block';
});

passwordInput.addEventListener('focus', () => {
    document.getElementById('pistaPassword').style.display = 'block';
});

// Lógica al hacer clic en "Entrar"
btnIngresar.addEventListener('click', () => {
    const user = usuarioInput.value.trim();
    const pass = passwordInput.value.trim();

    // Verificamos el usuario y contraseña exactos que pediste
    if ((user === 'valulu' || user === 'Valulu') && pass === '03/09/09') {
        // Ocultar login con una animación suave
        pantallaLogin.style.opacity = '0';
        
        setTimeout(() => {
            pantallaLogin.style.display = 'none';
            contenidoPrincipal.classList.remove('hidden');
            
            // Iniciar la música de The Carpenters
            musicaFondo.play().catch(error => {
                console.log("El navegador bloqueó el autoplay. El usuario debe interactuar primero.");
            });
            btnMusica.classList.remove('hidden');
            document.getElementById('btnModoNoche').classList.remove('hidden');
            // Forzar un pequeño reflow para que las animaciones iniciales funcionen
            window.dispatchEvent(new Event('scroll'));
        }, 500);
    } else {
        mensajeError.textContent = "Esa no es la fecha correcta o el apodo, ¡intenta de nuevo! ❤️";
    }
});

// Control para pausar/reproducir la música con el botón flotante
btnMusica.addEventListener('click', () => {
    if (musicaFondo.paused) {
        musicaFondo.play();
        btnMusica.textContent = '🎵';
    } else {
        musicaFondo.pause();
        btnMusica.textContent = '🔇';
    }
});


// ==========================================
// 2. ANIMACIONES AL HACER SCROLL (Smooth)
// ==========================================
// Esto hace que los recuerdos aparezcan suavemente cuando vas bajando
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.bloque-recuerdo').forEach(bloque => {
    observer.observe(bloque);
});


// ==========================================
// 3. JUEGO DE MEMORIA (3x4 = 12 CARTAS)
// ==========================================
const emojis = ['🐶', '🐶', '🍕', '🍕', '✈️', '✈️', '📸', '📸', '🌻', '🌻', '🎮', '🎮'];
let cartasVolteadas = [];
let parejasEncontradas = 0;
const tablero = document.getElementById('tablero-memoria');

// Mezclar las cartas al azar
emojis.sort(() => 0.5 - Math.random());

// Generar el tablero HTML
emojis.forEach((emoji) => {
    const carta = document.createElement('div');
    carta.classList.add('carta-memoria');
    carta.dataset.valor = emoji;
    carta.innerHTML = `
        <div class="carta-inner">
            <div class="carta-frente">❓</div>
            <div class="carta-dorso">${emoji}</div>
        </div>
    `;
    carta.addEventListener('click', voltearCarta);
    tablero.appendChild(carta);
});

function voltearCarta() {
    // Si ya hay dos cartas volteadas o tocamos una que ya está volteada, no hacemos nada
    if (cartasVolteadas.length < 2 && !this.classList.contains('volteada')) {
        this.classList.add('volteada');
        cartasVolteadas.push(this);

        if (cartasVolteadas.length === 2) {
            setTimeout(verificarPareja, 1000); // Esperar 1 segundo para verlas
        }
    }
}

function verificarPareja() {
    const [carta1, carta2] = cartasVolteadas;
    
    if (carta1.dataset.valor === carta2.dataset.valor) {
        // Es un match
        carta1.classList.add('match');
        carta2.classList.add('match');
        parejasEncontradas++;
        
        if (parejasEncontradas === 6) {
            document.getElementById('mensajeMemoria').textContent = "¡Ganaste! Tu muy bien.";
        }
    } else {
        carta1.classList.remove('volteada');
        carta2.classList.remove('volteada');
    }
    cartasVolteadas = []; // Reiniciar para el siguiente turno
}


// ==========================================
// 4. TRIVIA DE LA RELACIÓN (5 PREGUNTAS)
// ==========================================
const preguntas = document.querySelectorAll('.pregunta-card');
let preguntaActual = 0;
let puntaje = 0;

preguntas.forEach((pregunta) => {
    const botones = pregunta.querySelectorAll('.btn-opcion');
    
    botones.forEach(boton => {
        boton.addEventListener('click', function() {
            botones.forEach(b => b.disabled = true);
            
            const correcta = this.dataset.correcta === 'true';
            
            if (correcta) {
                this.classList.add('btn-correcto');
                puntaje++;
            } else {
                this.classList.add('btn-incorrecto');
                pregunta.classList.add('shake-error');
            }

            setTimeout(() => {
                preguntas[preguntaActual].classList.remove('active');
                preguntaActual++;
                
                if (preguntaActual < preguntas.length) {
                    preguntas[preguntaActual].classList.add('active');
                } else {
                    mostrarResultadoQuiz();
                }
            }, 1500);
        });
    });
});

function mostrarResultadoQuiz() {
    document.getElementById('quiz-contenedor').style.display = 'none';
    const resultadoDiv = document.getElementById('resultadoQuiz');
    resultadoDiv.classList.remove('hidden');
    
    document.getElementById('puntajeFinal').textContent = `Tu puntaje final: ${puntaje} / 5`;
    
    const mensaje = document.getElementById('mensajeFinalQuiz');
    if (puntaje === 5) {
        mensaje.textContent = "¡Increíble! Sabes todo tu muy bien preciosa";
    } else if (puntaje >= 3) {
        mensaje.textContent = "Y bueno podes mejorar";
    } else {
        mensaje.textContent = "LOL, no sabes un choto tu muy mal";
    }
}
// ==========================================
// 5. CONTADOR DE TIEMPO EN VIVO
// ==========================================
const fechaInicio = new Date(2025, 10, 19);

function actualizarContador() {
    const ahora = new Date();
    const diferencia = ahora - fechaInicio;

    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / 1000 / 60) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    const reloj = document.getElementById('reloj-amor');
    if (reloj) {
        reloj.innerHTML = `${dias} días, ${horas} hrs, ${minutos} min y ${segundos} seg `;
    }
}
setInterval(actualizarContador, 1000);
actualizarContador();


// ==========================================
// 6. LLUVIA DE CORAZONES (EL BOTÓN MÁGICO)
// ==========================================
const btnLluvia = document.getElementById('btnLluvia');
if (btnLluvia) {
    btnLluvia.addEventListener('click', () => {
        crearLluvia();
        btnLluvia.textContent = "¡Te amo!";
        btnLluvia.style.border = "none";
    });
}

function crearLluvia() {
    const emojis = ['❤️', '💜', '❤️‍🩹', '🗿', '👨🏾‍🦲'];
    
    // Generar 60 corazones
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const corazon = document.createElement('div');
            corazon.classList.add('corazon-cayendo');
            corazon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
            
            corazon.style.left = Math.random() * 100 + 'vw';
            corazon.style.animationDuration = (Math.random() * 3 + 2) + 's';
            
            document.body.appendChild(corazon);
            
            setTimeout(() => {
                corazon.remove();
            }, 6000);
        }, i * 80); 
    }
}

// ==========================================
// 7. LÓGICA DEL TARRO DE LAS RAZONES
// ==========================================
// EDITAR AQUÍ: Agrega o cambia las frases que quieras
const razones = [
    "Por tu forma tan bonita de hacerme sonreír incluso en los días difíciles.",
    "La felipa.",
    "Por la paz que me das cuando estamos juntos.",
    "Por tu preciosa forma de hablar.",
    "Por ser lo mejor en mi mundo.",
    "La Daniela.",
    "Por la paciencia que me tenes",
    "Por como me hacer sentir seguro y amado.",
    "La Ricarda.",
    "Tu forma de actuar tan unica.",
    "Tu inigualable caracter que me encanra.",
    "La Lorena.",
    "Lo increiblemente bella que eres.",
    "Pondria mas pero el codigo ya es muy largo xd.",
    "La Ignacia."

];

let indiceRazon = 0;

const numeroRazon = document.getElementById('numeroRazon');
const textoRazon = document.getElementById('textoRazon');
const btnRazonAnt = document.getElementById('btnRazonAnt');
const btnRazonSig = document.getElementById('btnRazonSig');

function actualizarRazon() {
    if (!textoRazon) return;
    
    textoRazon.style.opacity = '0';
    textoRazon.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        numeroRazon.textContent = `Razón #${indiceRazon + 1}`;
        textoRazon.textContent = razones[indiceRazon];
        textoRazon.style.opacity = '1';
        textoRazon.style.transform = 'translateY(0)';
    }, 300);
}

if (btnRazonSig && btnRazonAnt) {
    btnRazonSig.addEventListener('click', () => {
        indiceRazon = (indiceRazon + 1) % razones.length;
        actualizarRazon();
    });

    btnRazonAnt.addEventListener('click', () => {
        indiceRazon = (indiceRazon - 1 + razones.length) % razones.length;
        actualizarRazon();
    });
}

// ==========================================
// 8. LÓGICA DEL MODO NOCHE
// ==========================================
const btnModoNoche = document.getElementById('btnModoNoche');

if (btnModoNoche) {
    btnModoNoche.addEventListener('click', () => {
        document.body.classList.toggle('modo-noche');
        
        // Cambiar el ícono según el modo activo
        if (document.body.classList.contains('modo-noche')) {
            btnModoNoche.textContent = '☀️';
        } else {
            btnModoNoche.textContent = '🌙';
        }
    });
}

// ==========================================
// 9. LÓGICA DE LA RASPADITA (LOTERÍA)
// ==========================================
const boletoContenedor = document.getElementById('boletoLoteria');
const contadorBoletos = document.getElementById('contadorBoletos');
const mensajePremio = document.getElementById('mensajePremio');
const mensajeLimite = document.getElementById('mensajeLimite');

// Control de intentos por día usando LocalStorage
const hoy = new Date().toLocaleDateString();
let datosLoteria = JSON.parse(localStorage.getItem('loteriaAmor')) || { fecha: hoy, intentosRestantes: 5 };

// Si es un nuevo día, reiniciar a 5
if (datosLoteria.fecha !== hoy) {
    datosLoteria = { fecha: hoy, intentosRestantes: 5};
}

let cuadrosRaspados = 0;
let esGanadorActual = false;

function actualizarContadorPantalla() {
    contadorBoletos.textContent = datosLoteria.intentosRestantes;
}

function generarBoleto() {
    boletoContenedor.innerHTML = '';
    cuadrosRaspados = 0;
    
    // Probabilidad del 5% de ganar
    esGanadorActual = Math.random() < 0.05; 
    
    // Generar el contenido de los 4 cuadros
    let simbolos = [];
    if (esGanadorActual) {
        simbolos = ['⭐', '⭐', '⭐', '⭐'];
    } else {
        // Generar perdedor (mezcla, pero nunca 4 estrellas)
        const opciones = ['⭐', '👨🏾‍🦲', '🗿', '❤️', '👻'];
        for(let i=0; i<4; i++) {
            simbolos.push(opciones[Math.floor(Math.random() * opciones.length)]);
        }
        // Asegurar que no gane por accidente
        if(simbolos.every(s => s === '⭐')) simbolos[0] = '💖'; 
    }

    // Crear los 4 cuadros con Canvas
    simbolos.forEach(simbolo => {
        const cuadro = document.createElement('div');
        cuadro.classList.add('raspadita-cuadro');
        
        const emoji = document.createElement('span');
        emoji.textContent = simbolo;
        cuadro.appendChild(emoji);
        
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        cuadro.appendChild(canvas);
        boletoContenedor.appendChild(cuadro);

        iniciarCanvas(canvas);
    });
}

function iniciarCanvas(canvas) {
    const ctx = canvas.getContext('2d');
    // Pintar la capa gris para raspar
    ctx.fillStyle = '#C4B5B5'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Texto "RASPAR"
    ctx.font = "18px Montserrat";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.fillText("RASPAR", canvas.width/2, canvas.height/2 + 6);

    let isDrawing = false;
    let raspadoCompletado = false;

    function raspar(x, y) {
        if (raspadoCompletado) return;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(x, y, 15, 0, Math.PI * 2); // Grosor de la moneda que raspa
        ctx.fill();
        verificarRaspado(ctx, canvas);
    }

    // Eventos Mouse
    canvas.addEventListener('mousedown', () => isDrawing = true);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mousemove', (e) => {
        if (isDrawing) raspar(e.offsetX, e.offsetY);
    });

    // Eventos Táctiles (Teléfono)
    canvas.addEventListener('touchstart', (e) => {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        raspar(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
    });
    canvas.addEventListener('touchmove', (e) => {
        if (isDrawing) {
            e.preventDefault(); // Evita que la pantalla haga scroll al raspar
            const rect = canvas.getBoundingClientRect();
            raspar(e.touches[0].clientX - rect.left, e.touches[0].clientY - rect.top);
        }
    });
    canvas.addEventListener('touchend', () => isDrawing = false);

    function verificarRaspado(ctx, canvas) {
        if (raspadoCompletado) return;
        
        const pixeles = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
        let transparentes = 0;
        for (let i = 3; i < pixeles.length; i += 4) {
            if (pixeles[i] === 0) transparentes++;
        }
        
        // Si raspó más del 50%, revela el recuadro entero
        if (transparentes > (pixeles.length / 4) * 0.5) {
            raspadoCompletado = true;
            canvas.style.transition = 'opacity 0.3s';
            canvas.style.opacity = '0';
            setTimeout(() => canvas.remove(), 300);
            
            cuadrosRaspados++;
            if (cuadrosRaspados === 4) {
                finalizarBoleto();
            }
        }
    }
}

function finalizarBoleto() {
    datosLoteria.intentosRestantes--;
    localStorage.setItem('loteriaAmor', JSON.stringify(datosLoteria));
    actualizarContadorPantalla();

    setTimeout(() => {
        if (esGanadorActual) {
            mensajePremio.classList.remove('hidden');
        } else {
            if (datosLoteria.intentosRestantes > 0) {
                // Animación de cambio de boleto
                boletoContenedor.classList.add('slide-out-right');
                setTimeout(() => {
                    generarBoleto();
                    boletoContenedor.classList.remove('slide-out-right');
                    boletoContenedor.classList.add('slide-in-left');
                    
                    setTimeout(() => {
                        boletoContenedor.classList.remove('slide-in-left');
                    }, 600);
                }, 500);
            } else {
                mensajeLimite.classList.remove('hidden');
            }
        }
    }, 800); // Esperar un poco para que vea el resultado
}

// Iniciar el juego si hay intentos
actualizarContadorPantalla();
if (datosLoteria.intentosRestantes > 0) {
    generarBoleto();
} else {
    mensajeLimite.classList.remove('hidden');
    boletoContenedor.innerHTML = '<div style="padding: 20px; text-align:center;">Vuelve mañana</div>';
}