const display = document.getElementById('display');
const buttons = document.querySelectorAll('.button-grid button, .scientific-grid button');
const equals = document.getElementById('equals');
const clear = document.getElementById('clear');
const back = document.getElementById('back');
const themeToggle = document.getElementById('themeToggle');
const calculator = document.getElementById('calculator');

let expression = '';
let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
let themeIndex = 0;
const themes = ['light-theme', 'dark-theme', 'blue-theme', 'green-theme'];

// background cloud images for 
// each theme
// const cloudBackgrounds = [
//   'url("apple-touch-icon") center/cover fixed no-repeat',
//   'url("apple-touch-icon") center/cover fixed no-repeat',
//   'url("apple-touch-icon") center/cover fixed no-repeat',
//   'url("apple-touch-icon") center/cover fixed no-repeat'
// ];

function updateDisplay() {
  display.value = expression;
}

// Theme toggle
themeToggle.addEventListener('click', () => {
  calculator.classList.remove(...themes);
  themeIndex = (themeIndex + 1) % themes.length;
  calculator.classList.add(themes[themeIndex]);

  // background overlay tone
  const overlay = document.querySelector('.overlay');
  switch (themes[themeIndex]) {
    case 'light-theme': overlay.style.backgroundColor = 'rgba(255,255,255,0.3)'; break;
    case 'dark-theme': overlay.style.backgroundColor = 'rgba(0,0,0,0.4)'; break;
    case 'blue-theme': overlay.style.backgroundColor = 'rgba(0,60,120,0.4)'; break;
    case 'green-theme': overlay.style.backgroundColor = 'rgba(15,80,40,0.4)'; break;
  }
});


// Button clicks
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.textContent;

    switch (val) {
      case 'sin': expression += 'Math.sin('; break;
      case 'cos': expression += 'Math.cos('; break;
      case 'tan': expression += 'Math.tan('; break;
      case 'log': expression += 'Math.log10('; break;
      case 'ln':  expression += 'Math.log('; break;
      case '√':   expression += 'Math.sqrt('; break;
      case 'x²':  expression += '**2'; break;
      case 'x³':  expression += '**3'; break;
      case 'π':   expression += 'Math.PI'; break;
      case 'e':   expression += 'Math.E'; break;
      default:
        if (!['=', 'C', 'Back'].includes(val)) expression += val;
    }
    updateDisplay();
  });
});

// Evaluate expression
equals.addEventListener('click', () => {
  try {
    // auto-close any open '('
    const openParens = (expression.match(/\(/g) || []).length;
    const closeParens = (expression.match(/\)/g) || []).length;
    const diff = openParens - closeParens;
    expression += ')'.repeat(Math.max(0, diff));

    // Calculator stores past 10 results in local storage
    const result = eval(expression);
    display.value = result;
    history.unshift(result);
    if (history.length > 10) history.pop();
    localStorage.setItem('calcHistory', JSON.stringify(history));
    expression = result.toString();
  } catch {
    display.value = 'Error';
    expression = '';
  }
});

// Clear button
clear.addEventListener('click', () => {
  expression = '';
  updateDisplay();
});

// Back button for past 10 results and show message on 10th result
let backIndex = 0;
back.addEventListener('click', () => {
  if (backIndex < history.length) {
    display.value = history[backIndex++];
  } else {
    display.value = 'No more results stored!';
    backIndex = 0;
  }
});
