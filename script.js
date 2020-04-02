class Keyboard {
    constructor() {
        this.elements = {
                main: null,
                keyContainer: null,
                keys: [],
            },
            this.properties = {
                value: '',
                capsLock: false,
                langEn: true
            },
            this.eventsHandler = {
                'oninput': null
            },
            this.altphabets = {
                keyLayoutEn: ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', 'Del', 'Caps lock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'", 'Enter', 'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl'],
                keyLayoutRu: ['ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', 'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\', 'Del', 'Caps lock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', "э", 'Enter', 'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'Shift', 'Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Ctrl']

            }
    }

    init() {
        //Create main elements
        this.elements.main = document.createElement('div');
        this.elements.keyContainer = document.createElement('div');


        //Add classes
        this.elements.main.classList.add('keyboard');
        this.elements.keyContainer.classList.add('keyboard__keys');

        //Append to DOM
        this.elements.keyContainer.append(this._createKeys(this.altphabets.keyLayoutEn, 'en'));
        this.elements.keyContainer.append(this._createKeys(this.altphabets.keyLayoutRu, 'ru', 'hidden'));

        this.elements.main.append(this.elements.keyContainer);
        wrapper.append(this.elements.main);

        this.elements.keys = this.elements.keyContainer.querySelectorAll('.keyboard__key');

        //Paste value into text area
        textarea.addEventListener('focus', () => {
            this.input(textarea.value, currentValue => {
                textarea.value = currentValue;
            });
        });

        //Add listeners to keytboard container
        this.elements.keyContainer.addEventListener('mousedown', this._handleMouseDown, true);
        this.elements.keyContainer.addEventListener('mouseup', this._handleMouseUp, true);
    }

    initAFterLangChange() {
        this._changeLanguage();

        document.querySelectorAll('.keyboard__key')
            .forEach(element => {
                (element.classList.contains('hidden')) ? element.classList.remove('hidden'): element.classList.add('hidden');
            });

        document.querySelectorAll('br')
            .forEach(element => {
                (element.classList.contains('hidden')) ? element.classList.remove('hidden'): element.classList.add('hidden');
            });
    }

    detectLanguage() {
        return this.properties.langEn ? 'en' : 'ru';
    }

    input(initialValue, oninput) {
        this.properties.value = initialValue || '';
        this.eventsHandler.oninput = oninput;
    }

    _createKeys(althabet, ...classes) {
        const fragment = document.createDocumentFragment();
        althabet.forEach(element => {
            let key = document.createElement('button');
            key.setAttribute('type', 'button');
            key.classList.add('keyboard__key', ...classes);
            key.textContent = element;

            switch (true) {
                case element == 'Backspace':
                    key.classList.add('keyboard__key-wide', `${element}`);
                    break;

                case element == 'Del':
                    key.classList.add('keyboard__key-small', `Delete`);
                    break;

                case element == 'Caps lock':
                    key.classList.add('keyboard__key-medium', `CapsLock`);
                    break;

                case element == 'Shift':
                    (!fragment.querySelector('.ShiftLeft')) ? key.classList.add('keyboard__key-medium', 'ShiftLeft', 'Shift'): key.classList.add('keyboard__key-shift_right', 'ShiftRight', 'Shift');
                    break;

                case element == 'Enter':
                    key.classList.add('keyboard__key-enter', `${element}`);
                    break;

                case element == 'Space':
                    key.classList.add('keyboard__key-extra-wide', `${element}`);
                    break;

                case element == 'Tab':
                    key.classList.add('keyboard__key-small', `${element}`);
                    break;

                case element == 'Win':
                    (!fragment.querySelector('.MetaLeft')) ? key.classList.add('keyboard__key-small', 'MetaLeft'): key.classList.add('keyboard__key-small', 'MetaRight');
                    break;

                case element == 'Alt':
                    (!fragment.querySelector('.AltLeft')) ? key.classList.add('keyboard__key-small', 'AltLeft', 'Alt'): key.classList.add('keyboard__key-small', 'AltRight', 'Alt');
                    break;

                case element == 'Ctrl':
                    (!fragment.querySelector('.ControlLeft')) ? key.classList.add('keyboard__key-small', 'ControlLeft', 'Control'): key.classList.add('keyboard__key-small', 'ControlRight', 'Control');
                    break;

                default:
                    key.classList.add(`code${element.toUpperCase().charCodeAt(0)}`, `code${element.toLowerCase().charCodeAt(0)}`);
                    break;
            }
            fragment.append(key);

            if (element == 'Backspace' || element == 'Del' || element == 'Enter' || key.classList.contains('ShiftRight')) {
                let lineBreak = document.createElement('br');
                lineBreak.classList.add(...classes);
                fragment.append(lineBreak);
            }
        });
        return fragment;
    }

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (let key of this.elements.keys) {
            if (key.textContent.length == 1) {
                (this.properties.capsLock) ? key.textContent = key.textContent.toUpperCase(): key.textContent = key.textContent.toLowerCase();

            }
        }
    }

    _changeLanguage() {
        this.properties.langEn = !this.properties.langEn;
    }

    _triggerEvent(handlerName) {
        if (typeof this.eventsHandler[handlerName] == 'function') {
            this.eventsHandler[handlerName](this.properties.value);
        }
    }

    _handleMouseDown(event) {

        if (event.target.classList.contains('keyboard__key')) {
            event.target.classList.add('animated');

            switch (event.target.textContent) {
                case 'Backspace':
                case 'Del':
                    this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                    this._triggerEvent('oninput');
                    break;
                case 'Caps lock':
                    this._toggleCapsLock();
                    break;
                case 'Shift':
                    //keyboard._toggleCapsLock();
                    break;
                case 'Enter':
                    this.properties.value += '\n';
                    this._triggerEvent('oninput');
                    break;
                case 'Space':
                    this.properties.value += ' ';
                    this._triggerEvent('oninput');
                    break;
                case 'Tab':
                    this.properties.value += '    ';
                    this._triggerEvent('oninput');
                    break;
                case 'Alt':
                case 'Ctrl':
                    break;
                default:
                    this.properties.value += this.properties.capsLock ? event.target.textContent.toUpperCase() : event.target.textContent.toLowerCase();
                    this._triggerEvent('oninput');
                    break;
            }
        }

    }

    _handleMouseUp(event) {
        if (event.target.classList.contains('keyboard__key')) {

            event.target.classList.remove('animated');

            if (event.target.textContent == 'Shift') {
                //this._toggleCapsLock();
            }
        }
    }
}


//Create wrapper
const body = document.querySelector('body');
const wrapper = document.createElement('div');
wrapper.classList.add('wrapper');
body.append(wrapper);

//Create textarea
const textarea = document.createElement('textarea');
textarea.autofocus = true;
wrapper.append(textarea);

//Create Keyboard
let keyboard = new Keyboard();
keyboard.init();

//Add event listeners to keayboard
let keyboardKeys = document.querySelector('.keyboard__keys');


//Create Note
let note = document.createElement('div');
note.classList.add('note');
note.textContent = 'Keyboard created for Windows OS. \n Chnage language shorcuts: Shift(left)+Alt(left)'
wrapper.append(note);

//Create set for pressed buttons
let pressed = new Set();

body.addEventListener('keydown', function(e) {
    pressed.add(e.key);

    if (pressed.size === 1) {
        let element = (e.key.length === 1 && e.code !== 'Space') ? document.querySelector(`.code${e.key.charCodeAt(0)}.${keyboard.detectLanguage()}`) : document.querySelector(`.${e.code}.${keyboard.detectLanguage()}`);
        element.dispatchEvent(new Event("mousedown"));
    } else {
        pressed.forEach(element => document.querySelector(`.${element}.${keyboard.detectLanguage()}`)
            .classList.add('animated'));
    }
    e.preventDefault();
})

body.addEventListener('keyup', function(e) {

    if (pressed.size === 1) {
        let element = (e.key.length === 1 && e.code !== 'Space') ? document.querySelector(`.code${e.key.charCodeAt(0)}.${keyboard.detectLanguage()}`) : document.querySelector(`.${e.code}.${keyboard.detectLanguage()}`);
        element.dispatchEvent(new Event("mouseup"));
    } else {
        if (pressed.has('ShiftLeft') && pressed.has('AltLeft') && pressed.size == 2) {
            keyboard.initAFterLangChange();
        }

        document.querySelectorAll('.animated')
            .forEach(element => element.classList.remove('animated'));
    }
    pressed.delete(e.key);
})