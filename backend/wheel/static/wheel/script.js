const resultEl = document.getElementById('result');
const wheelEl = document.querySelector('.wheel');
const statusEl = document.getElementById('status');
const minInput = document.getElementById('minInput');
const maxInput = document.getElementById('maxInput');
const spinSound = new Audio('/static/wheel/spin.mp3');

let rotation = 0;

async function spinWheel(min, max) {
    statusEl.textContent = 'Spinning .....';
    rotation += 1080;
    wheelEl.style.transform = `rotate(${rotation}deg)`;

    spinSound.currentTime = 0;
    spinSound.play();

    try {
        const response = await fetch(`/random/?min=${min}&max=${max}`);
        const data = await response.json();

        if (!response.ok) {
            statusEl.textContent = data.error;
            wheelEl.style.transform = `rotate(${rotation - 1080}deg)`;
            spinSound.pause();
            return;
        }

        setTimeout(() => {
            spinSound.pause();
            resultEl.textContent = data.number;
            statusEl.textContent = `Landed on ${data.number} (range ${min}-${max})`;
        }, 3000);

    } catch (error) {
        statusEl.textContent = 'Something went wrong. Is the Django server running?';
        console.error(error);
    }
}

document.getElementById('spinBtn').addEventListener('click', () => {
    const min = minInput.value;
    const max = maxInput.value;
    spinWheel(min, max);
});

document.getElementById('surpriseBtn').addEventListener('click', () => {
    spinWheel(1, 200);
});
function playTone(frequency, duration) {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(0.15, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + duration);
}