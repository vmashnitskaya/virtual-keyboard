export default class Keyboard {
  constructor(wrapper) {
    this.properties = {
      capsLock: false,
      lang: window.localStorage.getItem('lang') ? window.localStorage.getItem('lang') : 'en',
    };
    this.altphabets = {
      keyLayoutEn: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'Del', 'Caps lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter', 'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl'],
      keyLayoutRu: ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\', 'Del', 'Caps lock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter', 'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl'],
    };
    this.elements = {
      main: null,
      keyContainer: null,
      keys: [],
    };
    // Create set for pressed buttons
    this.pressed = new Set();
    this.createKeyboard(wrapper);
  }

  createKeyboard(wrapper) {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keyContainer = document.createElement('div');


    // Add classes
    this.elements.main.classList.add('keyboard');
    this.elements.keyContainer.classList.add('keyboard__keys');

    // Append to DOM
    if (this.properties.lang === 'en') {
      this.elements.keyContainer.append(Keyboard.createKeys(this.altphabets.keyLayoutEn, 'en'));
      this.elements.keyContainer.append(Keyboard.createKeys(this.altphabets.keyLayoutRu, 'ru', 'hidden'));
    } else {
      this.elements.keyContainer.append(Keyboard.createKeys(this.altphabets.keyLayoutEn, 'en', 'hidden'));
      this.elements.keyContainer.append(Keyboard.createKeys(this.altphabets.keyLayoutRu, 'ru'));
    }


    // Add listeners to keytboard container
    this.elements.keyContainer.addEventListener('mousedown', this.handleMouseDown, true);
    this.elements.keyContainer.addEventListener('mouseup', this.handleMouseUp, true);

    this.elements.main.append(this.elements.keyContainer);
    wrapper.append(this.elements.main);

    this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard__key');

    const body = document.querySelector('body');
    body.addEventListener('keydown', this.handleKeyDown);
    body.addEventListener('keyup', this.handleKeyUp);
  }

  setTextarea(textarea) {
    // Paste value into text area
    this.textarea = textarea;
  }

  changeLanguage() {
    this.properties.lang = (this.properties.lang === 'en') ? 'ru' : 'en';

    window.localStorage.setItem('lang', this.properties.lang);
  }

  initAFterLangChange() {
    this.changeLanguage();

    const language = this.properties.lang === 'en' ? ['en', 'ru'] : ['ru', 'en'];
    document.querySelectorAll(`.${language[0]}`)
      .forEach((element) => element.classList.remove('hidden'));

    document.querySelectorAll(`.${language[1]}`)
      .forEach((element) => element.classList.add('hidden'));
  }

  static createKeys(althabet, ...classes) {
    const fragment = document.createDocumentFragment();
    althabet.forEach((element) => {
      const key = document.createElement('button');
      key.setAttribute('type', 'button');
      key.classList.add('keyboard__key', ...classes);
      key.textContent = element;

      switch (true) {
        case element === 'Backspace':
          key.classList.add('keyboard__key-wide', `${element}`);
          break;

        case element === 'Del':
          key.classList.add('keyboard__key-small', 'Delete');
          break;

        case element === 'Caps lock':
          key.classList.add('keyboard__key-medium', 'CapsLock');
          break;

        case element === 'Shift':
          if (!fragment.querySelector('.ShiftLeft')) {
            key.classList.add('keyboard__key-medium', 'ShiftLeft');
          } else {
            key.classList.add('keyboard__key-shift_right', 'ShiftRight');
          }
          break;

        case element === 'Enter':
          key.classList.add('keyboard__key-enter', `${element}`);
          break;

        case element === 'Space':
          key.classList.add('keyboard__key-extra-wide', `${element}`);
          break;

        case element === 'Tab':
          key.classList.add('keyboard__key-small', `${element}`);
          break;

        case element === 'Win':
          if (!fragment.querySelector('.MetaLeft')) {
            key.classList.add('keyboard__key-small', 'MetaLeft');
          } else {
            key.classList.add('keyboard__key-small', 'MetaRight');
          }
          break;

        case element === 'Alt':
          if (!fragment.querySelector('.AltLeft')) {
            key.classList.add('keyboard__key-small', 'AltLeft');
          } else {
            key.classList.add('keyboard__key-small', 'AltRight');
          }
          break;

        case element === 'Ctrl':
          if (!fragment.querySelector('.ControlLeft')) {
            key.classList.add('keyboard__key-small', 'ControlLeft');
          } else {
            key.classList.add('keyboard__key-small', 'ControlRight');
          }
          break;

        default:
          key.classList.add(`code${element.toUpperCase().charCodeAt(0)}`, `code${element.toLowerCase().charCodeAt(0)}`);
          break;
      }
      fragment.append(key);

      if (element === 'Backspace' || element === 'Del' || element === 'Enter' || key.classList.contains('ShiftRight')) {
        const lineBreak = document.createElement('br');
        lineBreak.classList.add(...classes);
        fragment.append(lineBreak);
      }
    });
    return fragment;
  }

  toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;

    for (let i = 0; i < this.elements.keys.length; i += 1) {
      const key = this.elements.keys[i];
      if (key.textContent.length === 1) {
        key.textContent = this.properties.capsLock
          ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  }


  handleMouseDown = (event) => {
    if (event.target.classList.contains('keyboard__key')) {
      event.target.classList.add('animated');

      switch (event.target.textContent) {
        case 'Backspace':
        case 'Del':
          this.textarea.value = this.textarea.value
            .substring(0, this.textarea.value.length - 1);
          break;
        case 'Caps lock':
          this.toggleCapsLock();
          break;
        case 'Shift':
          this.toggleCapsLock();
          break;
        case 'Enter':
          this.textarea.value += '\n';
          break;
        case 'Space':
          this.textarea.value += ' ';
          break;
        case 'Tab':
          this.textarea.value += '    ';
          break;
        case 'Alt':
        case 'Ctrl':
          break;
        default:
          this.textarea.value += this.properties.capsLock
            ? event.target.textContent.toUpperCase()
            : event.target.textContent.toLowerCase();
          break;
      }
    }
  }

  handleMouseUp = (event) => {
    if (event.target.classList.contains('animated')) {
      event.target.classList.remove('animated');

      if (event.target.textContent === 'Shift') {
        this.toggleCapsLock();
      }
    }
  }

  handleKeyDown = (event) => {
    /* if (/[a-zA-Z]/.test(event.key) && event.key.length === 1 && event.code !== 'Space'
    && this.properties.lang === 'ru') {
      this.initAFterLangChange();
    } else if (/[а-яА-Я]/i.test(event.key) && event.key.length === 1 && event.code !== 'Space'
    && this.properties.lang === 'en') {
      this.initAFterLangChange();
    } */

    this.pressed.add(event.code);

    document.querySelectorAll(event.key.length === 1 && event.code !== 'Space' ? `.code${event.key.charCodeAt(0)}` : `.${event.code}`)
      .forEach((element) => element.classList.add('animated'));
    /* if ((this.pressed.size === 1 && this.pressed.has('ShiftLeft'))) {
      this.properties.capsLock = !this.properties.capsLock;
    } */
    if (this.pressed.has('CapsLock')) {
      this.toggleCapsLock();
    }
  }

  handleKeyUp = (event) => {
    document.querySelectorAll(event.key.length === 1 && event.code !== 'Space' ? `.code${event.key.charCodeAt(0)}` : `.${event.code}`)
      .forEach((element) => element.classList.remove('animated'));
    if ((this.pressed.size === 1 && this.pressed.has('ShiftLeft'))) {
      this.initAFterLangChange();
    }
    if (this.pressed.size === 2 && this.pressed.has('ShiftLeft') && this.pressed.has('AltLeft')) {
      this.initAFterLangChange();
    }
    if (this.pressed.has('Tab')) {
      this.textarea.value += '    ';
      this.textarea.focus();
    }
    this.pressed.clear();
  }
}
