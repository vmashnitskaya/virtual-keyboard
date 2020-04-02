export default class Keyboard {
  constructor() {
    this.elements = {
      main: null,
      keyContainer: null,
      keys: [],
    };
    this.properties = {
      value: '',
      capsLock: false,
      langEn: true,
    };
    this.eventsHandler = {
      oninput: null,
    };
    this.altphabets = {
      keyLayoutEn: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'Del', 'Caps lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter', 'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl'],
      keyLayoutRu: ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\', 'Del', 'Caps lock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter', 'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl'],
    };
  }

  init(wrapper, textarea) {
    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keyContainer = document.createElement('div');


    // Add classes
    this.elements.main.classList.add('keyboard');
    this.elements.keyContainer.classList.add('keyboard__keys');

    // Append to DOM
    this.elements.keyContainer.append(Keyboard.createKeys(this.altphabets.keyLayoutEn, 'en'));
    this.elements.keyContainer.append(Keyboard.createKeys(this.altphabets.keyLayoutRu, 'ru', 'hidden'));

    this.elements.main.append(this.elements.keyContainer);
    wrapper.append(this.elements.main);

    this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard__key');

    // Paste value into text area
    textarea.addEventListener('focus', () => {
      this.input(textarea.value, (currentValue) => {
        // eslint-disable-next-line no-param-reassign
        textarea.value = currentValue;
      });
    });

    // Add listeners to keytboard container
    this.elements.keyContainer.addEventListener('mousedown', this.handleMouseDown, true);
    this.elements.keyContainer.addEventListener('mouseup', this.handleMouseUp, true);
  }

  initAFterLangChange() {
    this.changeLanguage();

    document.querySelectorAll('.keyboard__key')
      .forEach((element) => (element.classList.contains('hidden') ? element.classList.remove('hidden') : element.classList.add('hidden')));

    document.querySelectorAll('br')
      .forEach((element) => (element.classList.contains('hidden') ? element.classList.remove('hidden') : element.classList.add('hidden')));
  }

  detectLanguage() {
    return this.properties.langEn ? 'en' : 'ru';
  }

  input(initialValue, oninput) {
    this.properties.value = initialValue || '';
    this.eventsHandler.oninput = oninput;
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
            key.classList.add('keyboard__key-medium', 'ShiftLeft', 'Shift');
          } else {
            key.classList.add('keyboard__key-shift_right', 'ShiftRight', 'Shift');
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
            key.classList.add('keyboard__key-small', 'AltLeft', 'Alt');
          } else {
            key.classList.add('keyboard__key-small', 'AltRight', 'Alt');
          }
          break;

        case element === 'Ctrl':
          if (!fragment.querySelector('.ControlLeft')) {
            key.classList.add('keyboard__key-small', 'ControlLeft', 'Control');
          } else {
            key.classList.add('keyboard__key-small', 'ControlRight', 'Control');
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

  changeLanguage() {
    this.properties.langEn = !this.properties.langEn;
  }

  triggerEvent(handlerName) {
    if (typeof this.eventsHandler[handlerName] === 'function') {
      this.eventsHandler[handlerName](this.properties.value);
    }
  }

  handleMouseDown = (event) => {
    if (event.target.classList.contains('keyboard__key')) {
      event.target.classList.add('animated');

      switch (event.target.textContent) {
        case 'Backspace':
        case 'Del':
          this.properties.value = this.properties.value
            .substring(0, this.properties.value.length - 1);
          this.triggerEvent('oninput');
          break;
        case 'Caps lock':
          this.toggleCapsLock();
          break;
        case 'Shift':
          // keyboard._toggleCapsLock();
          break;
        case 'Enter':
          this.properties.value += '\n';
          this.triggerEvent('oninput');
          break;
        case 'Space':
          this.properties.value += ' ';
          this.triggerEvent('oninput');
          break;
        case 'Tab':
          this.properties.value += '    ';
          this.triggerEvent('oninput');
          break;
        case 'Alt':
        case 'Ctrl':
          break;
        default:
          this.properties.value += this.properties.capsLock
            ? event.target.textContent.toUpperCase()
            : event.target.textContent.toLowerCase();
          this.triggerEvent('oninput');
          break;
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this
  handleMouseUp = (event) => {
    if (event.target.classList.contains('keyboard__key')) {
      event.target.classList.remove('animated');

      if (event.target.textContent === 'Shift') {
        // this.toggleCapsLock();
      }
    }
  }
}
