class CalcController {

//Método construtor
    constructor() {

        this._audio = new Audio('click.mp3');
        this._audioOnOff = false;
        this._lastOperator = '';
        this._lastNumber = '';

        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();

    }

    //Método que cola da área de tranferência para a calculadora
    pasteFromClipboard() {

        document.addEventListener('paste', e => {

            let text = e.clipboardData.getData('Text');

            this.displayCalc = parseFloat(text);

//            console.log(text);

        });

    }

    //Método que copia para a área de transferência
    copyToClipboard() {

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

//Método de inicialização para manipulação do DOM
    initialize() {

        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

        this.setLastNumberToDisplay();
        this.pasteFromClipboard();

        document.querySelectorAll('.btn-ac').forEach(btn => {

            btn.addEventListener('dblclick', e => {

                this.toggleAudio();

            });

        });

    }

    //Método que verifica se o audio da calculadora está ligado ou desligado
    toggleAudio() {

        this._audioOnOff = !this._audioOnOff;

    }

    //Método que faz tocar o som
    playAudio() {

        if (this._audioOnOff) {

            this._audio.currentTime = 0;
            this._audio.play();

        }

    }

    //Método para inicilizar os eventos de teclado da calculadora
    initKeyBoard() {

        document.addEventListener('keyup', e => {
//            console.log(e.key);

            this.playAudio();

            switch (e.key) {
                case 'Escape':
                    this.clearAll();
                    break;
                case 'Backspace':
                    this.clearEntry();
                    break;
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;
                case 'Enter':
                case '=':
                    this.calc();
                    break;
                case '.':
                case ',':
                    this.addDot();
                    break;
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if (e.ctrlKey) {
                        this.copyToClipboard();
                    }
                    break;
            }
        });

    }

//Método de criação de eventos
    addEventListenerAll(element, events, fn) {

        events.split(" ").forEach(event => {
            element.addEventListener(event, fn, false);
        });
    }

//Método para limpar todos os campos
    clearAll() {

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';

        this.setLastNumberToDisplay();

    }

//Método para limpar o ultimo campo
    clearEntry() {

        this._operation.pop();

        this.setLastNumberToDisplay();

    }

//Método que pega a ultima operação
    getLastOperation() {
        return this._operation[this._operation.length - 1];
    }

//Método para pegar a ultima posição do array e substituir
    setLastOperation(value) {
        this._operation[this._operation.length - 1] = value;
    }

//Método que verifica se é um operador
    isOperator(value) {
        return (['+', '-', '*', '/', '%'].indexOf(value) > -1);
    }

//Método que faz um push no elemento e soma ele antes de colocar outro sinal matematico
    pushOperation(value) {
        this._operation.push(value);
        if (this._operation.length > 3) {

            this.calc();
        }
    }

    //Método para mostrar o resultado da operação
    getResult() {

        return eval(this._operation.join(""));

    }

//Método feito para calcular os dados
    calc() {

        let last = '';

        this._lastOperator = this.getLastItem();

        if (this._operation.length < 3) {

            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }

        if (this._operation.length > 3) {

            last = this._operation.pop();
            this._lastNumber = this.getResult();

        } else if (this._operation.length === 3) {

            this._lastNumber = this.getLastOperation(false);

        }

//        console.log('_lastOperator', this._lastOperator);
//        console.log('_lastNumber', this._lastNumber);

        let result = this.getResult();

        if (last === '%') {

            result /= 100;

            this._operation = [result];

        } else {

            this._operation = [result];

            if (last)
                this._operation.push(last);

        }

        this.setLastNumberToDisplay();
    }

    //metodo para percorrer o array e trazer o ultimo numero
    getLastItem(isOperator = true) {

        let lastItem;

        for (let i = this._operation.length - 1; i >= 0; i--) {

            if (this.isOperator(this._operation[i]) === isOperator) {
                lastItem = this._operation[i];
                break;
            }
        }

        if (!lastItem) {

            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;

        }

        return lastItem;
    }
//Método para mostrar os numeros no display
    setLastNumberToDisplay() {

        let lastNumber = this.getLastItem(false);

        if (!lastNumber)
            lastNumber = 0;

//Mostrando o resultado na tela
        this.displayCalc = lastNumber;
    }

//Método para incluir um dado no array
    addOperation(value)
    {

        if (isNaN(this.getLastOperation())) {

            if (this.isOperator(value)) {

                this.setLastOperation(value);
            } else {

                this.pushOperation(value);
                this.setLastNumberToDisplay();
            }

        } else {

            if (this.isOperator(value)) {

                this.pushOperation(value);
            } else {

                let newValue = this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                //Atualizar Display
                this.setLastNumberToDisplay();
            }
        }

    }

// Método para mostrar o error
    setError()
    {
        this.displayCalc = "Error";
    }

// Método para colocar o ponto e fazer os calculos com numeros FLOAT
    addDot() {

        let lastOperation = this.getLastOperation();

        if (typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) {
            return;
        }
        if (this.isOperator(lastOperation) || !lastOperation) {

            this.pushOperation('0.');

        } else {

            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay();

    }

//Método para identificar cada tecla e retornar uma ação de acordo com o nome da class
    execBtn(value) {

        this.playAudio();

        switch (value) {
            case 'ac':
                this.clearAll();
                break;
            case 'ce':
                this.clearEntry();
                break;
            case 'soma':
                this.addOperation('+');
                break;
            case 'subtracao':
                this.addOperation('-');
                break;
            case 'divisao':
                this.addOperation('/');
                break;
            case 'multiplicacao':
                this.addOperation('*');
                break;
            case 'porcento':
                this.addOperation('%');
                break;
            case 'igual':
                this.calc();
                break;
            case 'ponto':
                this.addDot();
                break;
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
                this.addOperation(parseInt(value));
                break;
            default:
                this.setError();
                break;
        }
    }

//Método para selecionar os botões para chamar o valor deles
    initButtonsEvents()
    {
        let buttons = document.querySelectorAll("#buttons > g, #parts > g");
        buttons.forEach((btn, index) => {
            this.addEventListenerAll(btn, 'click drag', e => {
                let textBtn = btn.className.baseVal.replace("btn-", "");
                this.execBtn(textBtn);
            });
            this.addEventListenerAll(btn, "mouseover mouseup mousedown", e => {
                btn.style.cursor = "pointer";
            });
        });
    }

//Método para pegar a hora dinamicamente
    setDisplayDateTime()
    {

        this.displayDate = this.currentDate.toLocaleDateString(this._locale, {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }

//Métodos get/set
    get displayTime() {
        return this._timeEl.innerHTML;
    }

    set displayTime(value) {
        this._timeEl.innerHTML = value;
    }

    get displayDate() {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) {
        this._dateEl.innerHTML = value;
    }

    get displayCalc() {
        return this._displayCalcEl.innerHTML;
    }

    set displayCalc(value) {
        this._displayCalcEl.innerHTML = value;
    }

    get currentDate() {
        return new Date();
    }

    set currentDate(value) {
        this._currentDate = value;
    }
}
