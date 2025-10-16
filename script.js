class Calculator {
    constructor(displayElement, operationElement) {
        this.displayElement = displayElement; // Guarda el elemento que representa el display
        this.operationElement = operationElement; // Guarda el elemento que representa el display
        this.currentValue ='0'; // Guarda el valor actual del display
        this.previousValue = null; // Guarda el valor anterior del display
        this.operator = null; // Guarda el operador actual
        this.waitingForSecondNumber = false; // Indica si se espera el segundo número para realizar la operación
        this.updateDisplay(); // Mostramos el valor inicial del display (0)
    }

    // Métodos para manipular el display
    updateDisplay() {
        // Mostrar valor principal en el display
        this.displayElement.textContent = this.currentValue;

        // Mostrar operación arriba si existe
        if (this.operator && this.previousValue !== null) {
            // Si aún no se ha escrito el segundo número, no mostrarlo
            if (this.waitingForSecondNumber || this.currentValue === '0') {
                this.operationElement.textContent = `${this.previousValue} ${this.operator}`;
            } else {
                this.operationElement.textContent = `${this.previousValue} ${this.operator} ${this.currentValue}`;
            }
        } else {
            // Si no hay operador, mostrar solo el número actual arriba
            this.operationElement.textContent = '';
        }
    }



    // Metodo que se ejecuta cuando se pulsa el botón numérico (0-9)
    inputDigit(digit) {
        // si estamos esperando for el segundo numero, se agrega el digito pulsado al valor actual
        if (this.waitingForSecondNumber) {
            this.currentValue = digit;
            this.waitingForSecondNumber = false;
        }

        // Si currentValue es pi (o resultado de pi), interpretamos pi * digit
        else if (this.currentValue === Math.PI.toFixed(6)) {
            const result = (parseFloat(this.currentValue) * parseFloat(digit)).toFixed(6);
            this.currentValue = result;
        }

        else if (this.currentValue === '0') { // Si el valor actual es 0, se reemplaza por el digito pulsado
            this.currentValue = digit;
        }
        else { // Si el valor actual no es 0, se agrega el digito pulsado al valor actual
            this.currentValue += digit;
        }

        // Se actualiza el display con el valor actual
        this.updateDisplay();
    }

    calculate() {
        if (this.operator === null || this.previousValue === null) return;

        const a = parseFloat(this.previousValue);
        const b = parseFloat(this.currentValue);
        let result = 0;

        switch (this.operator) {
            case '+':
                result = a + b;
                break;
            case '-':
                result = a - b;
                break;
            case 'X':
            case '*':
                result = a * b;
                break;
            case '/':
            case '÷':
                if ( b === 0 ) {
                    this.currentValue = 'error';
                    this.updateDisplay();
                    this.operator = null;
                    this.previousValue = null;
                    return;
                }
                result = a / b;
                break;
            default:
                return;
        }

        // Si el resultado es un número, se actualiza el display con el resultado
        this.currentValue = result.toString();
        this.operator = null;
        this.previousValue = null;
        this.waitingForSecondNumber = true;
        this.updateDisplay();

    }

    // Método que borra el contenido del display
    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForSecondNumber = false;
        this.updateDisplay();
    }

    // Método que agrega el punto decimal si no hay uno ya
    inputDecimal() {
        if (this.waitingForSecondNumber) {
            this.currentValue = '0.';
            this.waitingForSecondNumber = false;
        }
        // Añadir el decimal solo si no existe
        else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }

        this.updateDisplay();
    }

    setOperator(op) {
        if (this.operator && !this.waitingForSecondNumber) {
    this.calculate();
    } // Si ya hay una operación en curso, se ejecuta la operación

        this.previousValue = this.currentValue; // Guarda el valor anterior del display
        this.operator = op; // Guarda el operador actual
        this.currentValue = '0'; // Resetea el display para ingresas el segundo número
        this.updateDisplay(); // Actualiza el display con el valor anterior
    }

    toggleSign() {
        // No hacemos nada si el valor es 0 o error
        if (this.currentValue === '0' || this.currentValue === 'error') return;

        // Si empieza con "-", se quita el signo
        if (this.currentValue.startsWith('-')) {
            this.currentValue = this.currentValue.slice(1);
        } else {
            this.currentValue = '-' + this.currentValue;
        }
        this.updateDisplay();
    }

    insertPi() {
        const piValue = Math.PI.toFixed(6); // Resultado: 3,141593

        if (this.waitingForSecondNumber) {
            this.currentValue = piValue;
            this.waitingForSecondNumber = false;
        } else if (this.currentValue === '0') {
            this.currentValue = piValue;
        } else {
            const num = parseFloat(this.currentValue);
            const result = (num * Math.PI).toFixed(6);
            this.currentValue = result;
        }
        this.updateDisplay();
    }

    percentage() {
        const num = parseFloat(this.currentValue);

        if (isNaN(num)) return;

        const result = (num / 100).toString();
        this.currentValue = result;
        this.updateDisplay();
    }

}
    // Inicialización del display al cargar la página
const displayEl = document.querySelector('.display .number');
const operationEl = document.querySelector('.display .operation');
const calculator = new Calculator(displayEl, operationEl);

// Delegación de clics en los botones
document.querySelector('.buttons').addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const value = btn.textContent.trim();

    if (/^\d$/.test(value)) {
        calculator.inputDigit(value);
    } else if (btn.classList.contains('clear')) {
        calculator.clear();
    } else if (value === '.') {
        calculator.inputDecimal();
    } else if (['+', '-', 'X', '/', '%'].includes(value)) {
        calculator.setOperator(value);
    } else if (value === '+/-') {
        calculator.toggleSign();
    } else if (value === 'π') {
        calculator.insertPi();
    } else if (value === '%') {
        calculator.percentage();
    } else if (value === '=') {
        calculator.calculate();
    }


});

