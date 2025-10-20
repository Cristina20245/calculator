class Calculator {
    constructor(displayElement, operationElement) {
        this.displayElement = displayElement;
        this.operationElement = operationElement;
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForSecondNumber = false;
        this.lastOperation = ''; // Última operación mostrada arriba del display
        this.updateDisplay();
    }

    updateDisplay() {
        this.displayElement.textContent = this.formatNumber(this.currentValue);

        if (this.operator && this.previousValue !== null) {
            if (this.waitingForSecondNumber || this.currentValue === '0') {
                this.operationElement.textContent = `${this.previousValue} ${this.operator}`;
            } else {
                this.operationElement.textContent = `${this.previousValue} ${this.operator} ${this.currentValue}`;
            }
        } else if (this.lastOperation) {
            this.operationElement.textContent = this.lastOperation;
        } else {
            this.operationElement.textContent = '';
        }
    }

    inputDigit(digit) {
        if (this.waitingForSecondNumber) {
            this.currentValue = digit;
            this.waitingForSecondNumber = false;
        } else if (this.currentValue === Math.PI.toFixed(6)) {
            const result = (parseFloat(this.currentValue) * parseFloat(digit)).toFixed(6);
            this.currentValue = result;
        } else if (this.currentValue === '0') {
            this.currentValue = digit;
        } else {
            this.currentValue += digit;
        }

        this.updateDisplay();
    }

    calculate() {
        if (this.operator === null || this.previousValue === null) return;

        const a = parseFloat(this.previousValue);
        const b = parseFloat(this.currentValue);
        let result = 0;

        switch (this.operator) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case 'X':
            case '*': result = a * b; break;
            case '/':
            case '÷':
                if (b === 0) {
                    this.currentValue = 'error';
                    this.updateDisplay();
                    this.operator = null;
                    this.previousValue = null;
                    return;
                }
                result = a / b;
                break;
            default: return;
        }

        this.lastOperation = `${a} ${this.operator} ${b}`;
        this.currentValue = result.toString();
        this.operator = null;
        this.previousValue = null;
        this.waitingForSecondNumber = true;
        this.updateDisplay();
    }

    clear() {
        this.currentValue = '0';
        this.previousValue = null;
        this.operator = null;
        this.waitingForSecondNumber = false;
        this.lastOperation = '';
        this.updateDisplay();
    }

    inputDecimal() {
        if (this.waitingForSecondNumber) {
            this.currentValue = '0.';
            this.waitingForSecondNumber = false;
        } else if (!this.currentValue.includes('.')) {
            this.currentValue += '.';
        }

        this.updateDisplay();
    }

    setOperator(op) {
        if (this.operator && !this.waitingForSecondNumber) {
            this.calculate();
        }

        this.previousValue = this.currentValue;
        this.operator = op;
        this.currentValue = '0';
        this.updateDisplay();
    }

    toggleSign() {
        if (this.currentValue === '0' || this.currentValue === 'error') return;

        if (this.currentValue.startsWith('-')) {
            this.currentValue = this.currentValue.slice(1);
        } else {
            this.currentValue = '-' + this.currentValue;
        }

        this.updateDisplay();
    }

    insertPi() {
        const piValue = Math.PI.toFixed(6);

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

        if (this.operator && this.previousValue !== null) {
            const base = parseFloat(this.previousValue);
            this.currentValue = ((base * num) / 100).toString();
        } else {
            this.currentValue = (num / 100).toString();
        }

        this.updateDisplay();
    }

    // Redondea a 8 decimales y elimina ceros finales innecesarios
    formatNumber(value) {
        const num = parseFloat(value);
        if (isNaN(num)) return value;
        if (Number.isInteger(num)) return num.toString();
        return num.toFixed(8).replace(/\.?0+$/, '');
    }
}

// Inicialización del display al cargar la página
const displayEl = document.querySelector('.display .number');
const operationEl = document.querySelector('.display .operation');
const calculator = new Calculator(displayEl, operationEl);

// Delegación de clics
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
    } else if (['+', '-', 'X', '/'].includes(value)) {
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

// Soporte para teclado
document.addEventListener('keydown', (e) => {
    const key = e.key;

    if (!isNaN(key)) {
        calculator.inputDigit(key);
    } else if (key === '.' || key === ',') {
        calculator.inputDecimal();
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        calculator.setOperator(key === '*' ? 'X' : key);
    } else if (key === 'Enter' || key === '=') {
        calculator.calculate();
    } else if (key === '%') {
        calculator.percentage();
    } else if (key === 'Escape') {
        calculator.clear();
    } else if (key === 'p' || key === 'π') {
        calculator.insertPi();
    } else if (key === 'n') {
        calculator.toggleSign();
    }
});
