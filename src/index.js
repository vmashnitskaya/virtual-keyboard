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
const keyboard = new Keyboard(wrapper);
keyboard.setTextarea(textarea);

// Create Note
const note = document.createElement('div');
note.classList.add('note');
note.innerHTML = 'Keyboard created for Windows OS. <br> Change language shorcut: Shift(left)+Alt(left)';
wrapper.append(note);
