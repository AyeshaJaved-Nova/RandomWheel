const resultEl = document.getElementById('result');
const wheelEl = document.querySelector('.wheel');
const statusEl = document.getElementById('status');
const minInput = document.getElementById('minInput');
const maxInput = document.getElementById('maxInput');
const spinButton = document.getElementById('spinBtn');
const surpriseButton = document.getElementById('surpriseBtn');
const spinSound = new Audio('/static/wheel/spin.mp3');

let rotation = 0;
let spinning = false;

async function spinWheel(min, max) {
    if (spinning) return;

    spinning = true;
    spinButton.disabled = true;
    surpriseButton.disabled = true;
    statusEl.classList.remove('is-error');
    statusEl.textContent = 'Spinning…';
    rotation += 1080;
    wheelEl.style.transform = `rotate(${rotation}deg)`;

    spinSound.currentTime = 0;
    spinSound.play().catch(() => {});

    try {
        const query = new URLSearchParams({ min, max });
        const response = await fetch(`/random/?${query}`);
        const data = await response.json();

        if (!response.ok) {
            wheelEl.style.transform = `rotate(${rotation - 1080}deg)`;
            statusEl.classList.add('is-error');
            statusEl.textContent = data.error || 'Please check your range and try again.';
            spinSound.pause();
            spinning = false;
            spinButton.disabled = false;
            surpriseButton.disabled = false;
            return;
        }

        window.setTimeout(() => {
            spinSound.pause();
            resultEl.textContent = data.number;
            statusEl.textContent = `Landed on ${data.number} (range ${min}–${max})`;
            spinning = false;
            spinButton.disabled = false;
            surpriseButton.disabled = false;
        }, 3000);
    } catch (error) {
        spinSound.pause();
        statusEl.classList.add('is-error');
        statusEl.textContent = 'Could not reach the wheel. Please try again.';
        spinning = false;
        spinButton.disabled = false;
        surpriseButton.disabled = false;
        console.error(error);
    }
}

spinButton.addEventListener('click', () => spinWheel(minInput.value, maxInput.value));
surpriseButton.addEventListener('click', () => spinWheel(1, 200));
