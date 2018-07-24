class CalcController {

    //Método construtor
    constructor() {

        this._operation = [];
        this._locale = "pt-BR";
        this._displayCalcEl = document.querySelector("#display");
        this._dateEl = document.querySelector("#data");
        this._timeEl = document.querySelector("#hora");
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();

    }

    //Método de inicialização para manipulação do DOM
    initialize() {
        this.setDisplayDateTime();
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);

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
    }

    //Método para limpar o ultimo campo
    clearEntry() {
        this._operation.pop();
    }

    //Método para incluir um dado no array
    addOperation(value) {
        this._operation.push(value);
    }

    // Método para mostrar o error
    setError() {
        this.displayCalc = "Error";
    }

    //Método para identificar cada tecla e retornar uma ação de acordo com o nome da class
    execBtn(value) {
        switch (value) {
            case 'ac':
                this.clearAll();
                break;

            case 'ce':
                this.clearEntry();
                break;

            case 'soma':
                break;

            case 'subtracao':
                break;

            case 'divisao':
                break;

            case 'multiplicacao':
                break;

            case 'porcento':
                break;

            case 'igual':
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
    initButtonsEvents() {
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
    setDisplayDateTime() {

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
