import Keyboard from './Keyboard';

// Create wrapper
const body = document.querySelector('body');
const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
body.append(wrapper);

// Create textarea
const textarea = document.createElement('textarea');
textarea.autofocus = true;
wrapper.append(textarea);


// Create Keyboard
const keyboard = new Keyboard();
keyboard.init(wrapper, textarea);

// Create Note
const note = document.createElement('div');
note.classList.add('note');
note.textContent = 'Keyboard created for Windows OS. \n Chnage language shorcuts: Shift(left)+Alt(left)';
wrapper.append(note);

// Create set for pressed buttons
const pressed = new Set();

body.addEventListener('keydown', (e) => {
  pressed.add(e.key);

  if (pressed.size === 1) {
    const element = (e.key.length === 1 && e.code !== 'Space') ? document.querySelector(`.code${e.key.charCodeAt(0)}.${keyboard.detectLanguage()}`) : document.querySelector(`.${e.code}.${keyboard.detectLanguage()}`);
    element.dispatchEvent(new Event('mousedown'));
  } else {
    pressed.forEach((element) => document.querySelector(`.${element}.${keyboard.detectLanguage()}`)
      .classList.add('animated'));
  }
  e.preventDefault();
});

body.addEventListener('keyup', (e) => {
  if (pressed.size === 1) {
    const element = (e.key.length === 1 && e.code !== 'Space') ? document.querySelector(`.code${e.key.charCodeAt(0)}.${keyboard.detectLanguage()}`) : document.querySelector(`.${e.code}.${keyboard.detectLanguage()}`);
    element.dispatchEvent(new Event('mouseup'));
  } else {
    if (pressed.has('ShiftLeft') && pressed.has('AltLeft') && pressed.size === 2) {
      keyboard.initAFterLangChange();
    }

    document.querySelectorAll('.animated')
      .forEach((element) => element.classList.remove('animated'));
  }
  pressed.delete(e.key);
});
