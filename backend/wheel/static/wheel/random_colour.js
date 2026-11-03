const wheel = document.querySelector('.color-wheel');
const wheelInner = wheel.querySelector('.wheel-inner');
const result = document.getElementById('colorResult');
const colorName = document.getElementById('colorName');
const status = document.getElementById('colorStatus');
const spinButton = document.getElementById('colorSpinBtn');
const paletteFieldset = document.querySelector('.color-palette');
const palette = document.querySelector('.color-options');
const customColorInput = document.getElementById('customColor');
const addColorButton = document.getElementById('addColorBtn');
const scriptConfig = document.currentScript.dataset;
const spinSound = new Audio(scriptConfig.spinSound);

let rotation = 0;
let spinning = false;

function getSelectedColors() {
    return Array.from(palette.querySelectorAll('input:checked')).map((input) => ({
        name: input.dataset.name,
        hex: input.dataset.color,
    }));
}

function updateWheel() {
    const colors = getSelectedColors();
    const hasColors = colors.length > 0;
    spinButton.disabled = spinning || !hasColors;
    paletteFieldset.disabled = spinning;
    wheel.style.background = hasColors
        ? `conic-gradient(${colors.map((color, index) => {
            const start = index * 360 / colors.length;
            const end = (index + 1) * 360 / colors.length;
            return `${color.hex} ${start}deg ${end}deg`;
        }).join(', ')})`
        : '#e8eef5';

    if (!hasColors) {
        status.textContent = 'Choose at least one colour to fill the wheel.';
    } else if (status.textContent === 'Choose at least one colour to fill the wheel.') {
        status.textContent = 'Press spin to get a random colour.';
    }
}

function addColorChoice(name, hex) {
    const label = document.createElement('label');
    label.className = 'color-choice';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.dataset.name = name;
    checkbox.dataset.color = hex;

    const swatch = document.createElement('span');
    swatch.className = 'color-swatch';
    swatch.style.setProperty('--swatch-color', hex);

    const text = document.createElement('span');
    text.textContent = name;

    label.append(checkbox, swatch, text);
    palette.append(label);
}

palette.addEventListener('change', updateWheel);

addColorButton.addEventListener('click', () => {
    const hex = customColorInput.value.toUpperCase();
    const existing = Array.from(palette.querySelectorAll('input'))
        .find((input) => input.dataset.color.toUpperCase() === hex);

    if (existing) {
        existing.checked = true;
        status.textContent = `${hex} is already in your palette. Selected it.`;
        updateWheel();
        return;
    }

    addColorChoice(hex, hex);
    status.textContent = `Added ${hex} to your palette.`;
    updateWheel();
});

spinButton.addEventListener('click', () => {
    if (spinning) return;

    const colors = getSelectedColors();
    if (!colors.length) {
        updateWheel();
        return;
    }

    const selectedIndex = Math.floor(Math.random() * colors.length);
    const selected = colors[selectedIndex];
    const sliceSize = 360 / colors.length;
    const angleWithinSelectedSlice = (selectedIndex + Math.random()) * sliceSize;
    const targetRotation = (360 - angleWithinSelectedSlice) % 360;
    const currentRotation = ((rotation % 360) + 360) % 360;
    const alignmentRotation = (targetRotation - currentRotation + 360) % 360;

    spinning = true;
    spinButton.disabled = true;
    paletteFieldset.disabled = true;
    wheel.classList.remove('is-error');
    status.classList.remove('is-error');
    status.textContent = 'Spinning…';
    rotation += 1440 + alignmentRotation;
    wheel.style.transform = `rotate(${rotation}deg)`;
    wheelInner.style.transform = `rotate(${-rotation}deg)`;

    spinSound.currentTime = 0;
    spinSound.play().catch((error) => console.error('Could not play spin sound:', error));

    window.setTimeout(() => {
        spinSound.pause();
        result.textContent = selected.name;
        colorName.textContent = selected.hex;
        colorName.style.color = selected.hex;
        status.textContent = `The wheel picked ${selected.name}.`;
        spinning = false;
        updateWheel();
    }, 3000);
});

updateWheel();
