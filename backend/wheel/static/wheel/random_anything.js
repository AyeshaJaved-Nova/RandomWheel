const form = document.getElementById('choiceForm');
const input = document.getElementById('choiceInput');
const wheel = document.querySelector('.anything-wheel');
const wheelInner = wheel.querySelector('.wheel-inner');
const wheelChoices = document.getElementById('wheelChoices');
const result = document.getElementById('anythingResult');
const choiceCount = document.getElementById('anythingCount');
const status = document.getElementById('anythingStatus');
const spinButton = document.getElementById('anythingSpinBtn');
const scriptConfig = document.currentScript.dataset;
const spinSound = new Audio(scriptConfig.spinSound);

const wheelColors = ['#79c8b8', '#f1b878', '#ef927e', '#a4d8cf', '#eed98c', '#91c8ba', '#eaa18f', '#b9ded5'];
const choices = [];
let rotation = 0;
let spinning = false;

function updateWheel() {
    spinButton.disabled = spinning || choices.length === 0;
    input.disabled = spinning;
    form.querySelector('button[type="submit"]').disabled = spinning;
    choiceCount.textContent = choices.length
        ? `${choices.length} ${choices.length === 1 ? 'CHOICE' : 'CHOICES'}`
        : 'TO START';

    if (!choices.length) {
        wheelChoices.replaceChildren();
        wheel.style.background = '#f5f8fb';
        wheel.style.borderStyle = 'dashed';
        result.textContent = 'Add choices';
        status.textContent = 'Fill your wheel with your choices.';
        return;
    }

    wheel.style.borderStyle = 'solid';
    const sliceSize = 360 / choices.length;
    const stops = choices.map((_, index) => {
        const start = index * sliceSize;
        const end = (index + 1) * sliceSize;
        const shade = wheelColors[index % wheelColors.length];
        const gap = Math.min(1.5, sliceSize / 8);
        return `${shade} ${start}deg ${end - gap}deg, #ffffff ${end - gap}deg ${end}deg`;
    });
    wheel.style.background = `conic-gradient(${stops.join(', ')})`;
    wheelChoices.replaceChildren();

    choices.forEach((choice, index) => {
        const angle = (index + 0.5) * sliceSize;
        const radians = angle * Math.PI / 180;
        const radius = 75;
        const label = document.createElement('div');
        label.className = 'wheel-choice';
        label.setAttribute('role', 'listitem');
        label.style.left = `${50 + (Math.sin(radians) * radius / 105) * 50}%`;
        label.style.top = `${50 - (Math.cos(radians) * radius / 105) * 50}%`;
        const arcWidth = 2 * radius * Math.sin(Math.min(Math.PI / 2, sliceSize * Math.PI / 360)) * 0.82;
        label.style.maxWidth = `${Math.max(26, Math.min(choices.length >= 3 ? 60 : 120, arcWidth))}px`;
        label.style.transform = `translate(-50%, -50%) rotate(${angle > 90 && angle < 270 ? angle - 180 : angle}deg)`;

        const choiceButton = document.createElement('button');
        choiceButton.className = 'wheel-choice-button';
        choiceButton.type = 'button';
        choiceButton.dataset.index = index;
        choiceButton.setAttribute('aria-label', `Remove ${choice} from the wheel`);
        choiceButton.title = `Click to remove ${choice}`;
        choiceButton.textContent = choice;
        choiceButton.disabled = spinning;

        label.append(choiceButton);
        wheelChoices.append(label);
    });

    if (status.textContent === 'Fill your wheel with your choices.') {
        status.textContent = 'Your wheel is ready to spin.';
    }
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (spinning) return;
    const choice = input.value.trim();

    if (!choice) {
        status.textContent = 'Type a choice before adding it.';
        input.focus();
        return;
    }

    choices.push(choice);
    input.value = '';
    result.textContent = 'Ready';
    status.textContent = 'Your wheel is ready to spin.';
    updateWheel();
    input.focus();
});

wheelChoices.addEventListener('click', (event) => {
    if (spinning) return;
    const button = event.target.closest('.wheel-choice-button');
    if (!button) return;

    choices.splice(Number(button.dataset.index), 1);
    result.textContent = 'Ready';
    status.textContent = 'Your wheel is ready to spin.';
    updateWheel();
});

spinButton.addEventListener('click', () => {
    if (spinning || !choices.length) return;

    const selectedIndex = Math.floor(Math.random() * choices.length);
    const selected = choices[selectedIndex];
    const sliceSize = 360 / choices.length;
    const angleWithinSelectedSlice = (selectedIndex + 0.1 + Math.random() * 0.8) * sliceSize;
    const targetRotation = (360 - angleWithinSelectedSlice) % 360;
    const currentRotation = ((rotation % 360) + 360) % 360;
    const alignmentRotation = (targetRotation - currentRotation + 360) % 360;

    spinning = true;
    spinButton.disabled = true;
    status.classList.remove('is-error');
    status.textContent = 'Spinning…';
    rotation += 1440 + alignmentRotation;
    updateWheel();
    wheel.style.transform = `rotate(${rotation}deg)`;
    wheelInner.style.transform = `rotate(${-rotation}deg)`;
    spinSound.currentTime = 0;
    spinSound.play().catch(() => {});

    window.setTimeout(() => {
        spinSound.pause();
        result.textContent = selected;
        status.textContent = `The wheel picked: ${selected}`;
        spinning = false;
        updateWheel();
    }, 3000);
});

updateWheel();
