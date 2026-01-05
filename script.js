document.addEventListener('DOMContentLoaded', () => {
    // --- Manual Interactive Envelope Logic (REDISEÑADO A TAP) ---
    const envelope = document.getElementById('envelope-wrapper');
    const topPart = envelope.querySelector('.envelope-part.top');
    const bottomPart = envelope.querySelector('.envelope-part.bottom');
    const scrollHint = envelope.querySelector('.scroll-hint');

    // Music Elements
    const musicBtn = document.getElementById('music-control');
    const bgMusic = document.getElementById('bgMusic');
    const musicIcon = musicBtn.querySelector('.music-icon');
    let isPlaying = false;
    let audioActivated = false;

    function playMusic() {
        if (!audioActivated && bgMusic) {
            bgMusic.play()
                .then(() => {
                    isPlaying = true;
                    audioActivated = true;
                    musicIcon.textContent = '🎵';
                    musicBtn.classList.add('playing');
                })
                .catch(e => {
                    console.log("Audio play fallido, reintentando...");
                });
        }
    }

    // Función principal de apertura
    function openEnvelope() {
        if (!envelope.classList.contains('open')) {
            envelope.classList.add('open');
            document.body.classList.add('envelope-opened');
            window.scrollTo(0, 0);
            playMusic();

            // Reintento de seguridad a los 500ms y 1s para asegurar el audio
            setTimeout(playMusic, 500);
            setTimeout(playMusic, 1000);
        }
    }

    // Eventos de Apertura (ELIMINADO SCROLL)
    envelope.addEventListener('click', openEnvelope);

    // Control Manual de Música
    musicBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.textContent = '🔇';
            musicBtn.classList.remove('playing');
            isPlaying = false;
        } else {
            bgMusic.play();
            musicIcon.textContent = '🎵';
            musicBtn.classList.add('playing');
            isPlaying = true;
            audioActivated = true;
        }
    });

    // --- Countdown Logic ---
    const targetDate = new Date("January 24, 2026 17:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (difference > 0) {
            document.getElementById("days").innerText = days < 10 ? '0' + days : days;
            document.getElementById("hours").innerText = hours < 10 ? '0' + hours : hours;
            document.getElementById("minutes").innerText = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById("seconds").innerText = seconds < 10 ? '0' + seconds : seconds;
        } else {
            const titleEl = document.querySelector(".countdown-section h2");
            if (titleEl) titleEl.innerText = "¡Llegó el gran día!";
            const countEl = document.getElementById("countdown");
            if (countEl) countEl.style.display = "none";
        }
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();

    // --- Calendar Link Logic ---
    const eventDetails = {
        title: "Nuestra Boda - J y E",
        location: "Villa Elizabeth, Zacapa",
        details: "¡Acompáñanos a celebrar nuestro amor! Te esperamos.",
        start: "20260124T170000",
        end: "20260125T040000"
    };

    const googleCalBtn = document.getElementById('googleCal');
    if (googleCalBtn) {
        googleCalBtn.href = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start}/${eventDetails.end}&details=${encodeURIComponent(eventDetails.details)}&location=${encodeURIComponent(eventDetails.location)}`;
    }

    // --- Reveal Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
        observer.observe(el);
    });

    // --- Modal Logic (RSVP) ---
    const modal = document.getElementById('rsvpModal');
    const rsvpBtn = document.getElementById('rsvpBtn');
    const closeSpan = document.querySelector('.modal .close');
    const confirmBtn = document.getElementById('confirmBtn');
    const declineBtn = document.getElementById('declineBtn');

    if (rsvpBtn) {
        rsvpBtn.onclick = () => modal.classList.add('show');
    }

    if (closeSpan) {
        closeSpan.onclick = () => closeModal();
    }

    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    }

    function closeModal() {
        modal.classList.remove('show');
    }

    confirmBtn.onclick = () => {
        closeModal();
        rsvpBtn.textContent = "¡Asistencia Confirmada! 🎉";
        rsvpBtn.style.background = "#4CAF50";
        rsvpBtn.style.color = "white";

        // Revelar detalles de ubicación en toda la página
        document.body.classList.add('confirmed');

        // Scroll automático suave a la ubicación revelada
        setTimeout(() => {
            const locationSection = document.getElementById('location-section');
            if (locationSection) {
                locationSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }, 300);

        startConfetti();

        // Redirección a WhatsApp
        const phoneNumber = "50256155387"; // Número de Guatemala actualizado
        const message = encodeURIComponent("¡Hola! Confirmo mi asistencia a la boda. ¡Nos vemos pronto! 🎉💍");
        setTimeout(() => {
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        }, 1500); // Esperamos un poco para que vea el confeti
    }

    declineBtn.onclick = () => {
        closeModal();
        rsvpBtn.textContent = "Te extrañaremos 😢";
        rsvpBtn.style.background = "#666";
        rsvpBtn.disabled = true;
    }

    // --- Confetti Animation ---
    const canvas = document.getElementById('confettiCanvas');
    const ctx = canvas.getContext('2d');

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let particles = [];
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = -10;
            this.velocity = { x: (Math.random() - 0.5) * 5, y: Math.random() * 5 + 2 };
            this.color = `hsl(${Math.random() * 50 + 40}, 70%, 70%)`;
            this.radius = Math.random() * 5 + 2;
            this.gravity = 0.1;
            this.opacity = 1;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
        update() {
            this.y += this.velocity.y;
            this.x += this.velocity.x;
            this.velocity.y += this.gravity;
            this.opacity -= 0.005;
        }
    }

    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            p.update();
            p.draw();
            if (p.opacity <= 0 || p.y > canvas.height) particles.splice(i, 1);
        });
        if (particles.length > 0) requestAnimationFrame(animateConfetti);
    }

    function startConfetti() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                for (let j = 0; j < 100; j++) particles.push(new Particle());
                if (i === 0) animateConfetti();
            }, i * 200);
        }
    }

    // --- Falling Petals Effect ---
    function createPetal() {
        const petal = document.createElement('img');
        petal.src = 'assets/flower-petal.svg';
        petal.classList.add('petal');
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 3 + 5 + 's';
        petal.style.opacity = Math.random();
        petal.style.width = Math.random() * 20 + 10 + 'px';
        document.body.appendChild(petal);
        setTimeout(() => petal.remove(), 8000);
    }
    setInterval(createPetal, 300);
});
