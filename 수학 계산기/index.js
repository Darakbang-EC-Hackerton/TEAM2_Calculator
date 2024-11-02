document.addEventListener("DOMContentLoaded", () => {
    const inputField = document.getElementById("inputField");
    const historyList = document.getElementById("historyList");
    let newInput = false;

    // 오디오 요소 생성
    const clickSound = new Audio('click.mp3'); // 클릭 소리 파일 경로
    const errorSound = new Audio('click.mp3'); // 오류 소리 파일 경로
    const resultSound = new Audio('click.mp3'); // 결과 소리 파일 경로
    
    function setInputValue(newValue) {
        inputField.value = newValue;
        newInput = false;
    }

    function appendNumber(number) {
        playSound(clickSound); // 클릭 소리 재생, 
    
        const parts = inputField.value.split(/[\+\-\*\/]/);
        const currentNumber = parts[parts.length - 1].replace(/\D/g, ''); 
    
        if (currentNumber.length >= 10) {
            alert("숫자는 최대 10자리까지만 입력할 수 있습니다.");
            clearAll();
            
            return;
        }
    
        if (newInput) {
            setInputValue(number);
        } else {
            setInputValue(inputField.value + number);
        }
        newInput = false;
    }
    function appendOperator(operator) {
        playSound(clickSound); // 클릭 소리 재생
    
        // 모든 산술 연산자에 대해 1회 이상 사용 시 경고
        const operators = ['+', '-', '*', '/', '%'];
        for (let op of operators) {
            const opCount = (inputField.value.match(new RegExp(`\\${op}`, 'g')) || []).length;
            if (operator === op && opCount >= 1) {
                alert(`산술 연산자 ${op}는 최대 1회만 사용할 수 있습니다.`);
                
                return; // 추가 연산자 입력을 막음
            }
        }
    
        if (newInput) {
            newInput = false;
        }
        setInputValue(inputField.value + ` ${operator} `);
    }
    
    function appendDecimal() {
        playSound(clickSound); // 클릭 소리 재생
        if (newInput) {
            setInputValue("0.");
        } else {
            setInputValue(inputField.value + '.');
        }
        newInput = false;
    }

    function clearAll() {
        playSound(clickSound); // 클릭 소리 재생
        setInputValue("");
    }

    function deleteLast() {
        playSound(clickSound); // 클릭 소리 재생
        setInputValue(inputField.value.slice(0, -1));
    }

    function toggleSign() {
        playSound(clickSound); // 클릭 소리 재생
        if (inputField.value.startsWith('-')) {
            setInputValue(inputField.value.substring(1));
        } else {
            setInputValue('-' + inputField.value);
        }
    }

    function calculate() {
        try {
            let result = eval(inputField.value.replace(/mod/g, '%').replace(/\^/g, '**'));
            if (!isFinite(result)) {
                throw new Error("Cannot divide by zero");
            }
            
            playSound(resultSound); // 결과 소리 재생
            addHistory(`${inputField.value} = ${result}`);
            animateResultChange(result);
            newInput = true;
        } catch (error) {
            playSound(errorSound);
            alert(error.message); // 오류 소리 재생
            setInputValue("");
        }
    }
    
    function addHistory(entry) {
        const listItem = document.createElement("li");
        listItem.classList.add("history-item");
        listItem.textContent = entry;
        historyList.appendChild(listItem);
    }

    function clearHistory() {
        historyList.innerHTML = "";
    }

    function calculateTrigFunction(func) {
        try {
            const value = parseFloat(inputField.value);
            if (isNaN(value)) {
                throw new Error("Invalid input for trigonometric function");
            }
            let result;
            switch (func) {
                case 'sin':
                    result = Math.sin(value);
                    break;
                case 'cos':
                    result = Math.cos(value);
                    break;
                case 'tan':
                    result = Math.tan(value);
                    break;
            }
            addHistory(`${func}(${value}) = ${result}`);
            animateResultChange(result);
            playSound(resultSound); // 결과 소리 재생
            newInput = true;
        } catch (error) {
            alert(error.message);
            setInputValue("");
        }
    }

    function calculateHyperbolicFunction(func) {
        try {
            const value = parseFloat(inputField.value);
            if (isNaN(value)) {
                throw new Error("Invalid input for hyperbolic function");
            }
            let result;
            switch (func) {
                case 'sinh':
                    result = Math.sinh(value);
                    break;
                case 'cosh':
                    result = Math.cosh(value);
                    break;
                case 'tanh':
                    result = Math.tanh(value);
                    break;
            }
            addHistory(`${func}(${value}) = ${result}`);
            animateResultChange(result);
            playSound(resultSound); // 결과 소리 재생
            newInput = true;
        } catch (error) {
            alert(error.message);
            setInputValue("");
        }
    }

    function calculateSquareRoot() {
        try {
            const value = parseFloat(inputField.value);
            if (value < 0) {
                throw new Error("Cannot calculate square root of a negative number");
            }
            let result = Math.sqrt(value);
            addHistory(`√(${value}) = ${result}`);
            animateResultChange(result);
            playSound(resultSound); // 결과 소리 재생
            newInput = true;
        } catch (error) {
            alert(error.message);
            setInputValue("");
        }
    }

    function calculateFactorial() {
        try {
            let value = parseInt(inputField.value);
            if (isNaN(value) || value < 0) {
                throw new Error("Invalid input for factorial");
            }
            let result = 1;
            for (let i = 2; i <= value; i++) {
                result *= i;
            }
            addHistory(`${value}! = ${result}`);
            animateResultChange(result);
            playSound(resultSound); // 결과 소리 재생
            newInput = true;
        } catch (error) {
            alert(error.message);
            setInputValue("");
        }
    }

    function animateResultChange(newValue) {
        inputField.classList.add("fade-out");
        setTimeout(() => {
            inputField.value = newValue;
            inputField.classList.remove("fade-out");
            inputField.classList.add("fade-in");
        }, 200);
        setTimeout(() => {
            inputField.classList.remove("fade-in");
        }, 400);
    }

    function handleKeyboardInput(event) {
        const key = event.key;
        if (!isNaN(key)) {
            appendNumber(key);
        } else if (key === '+') {
            appendOperator('+');
        } else if (key === '-') {
            appendOperator('-');
        } else if (key === '*') {
            appendOperator('*');
        } else if (key === '/') {
            appendOperator('/');
        } else if (key === '.') {
            appendDecimal();
        } else if (key === 'Enter') {
            event.preventDefault(); // 기본 동작 방지
            if (!newInput) {
                calculate();
            }
        } else if (key === 'Backspace') {
            deleteLast();
        } else if (key === 'Escape') {
            clearAll();
        }
    }

    function playSound(sound) {
        sound.currentTime = 0; // 시작으로 되감기
        sound.play(); // 소리 재생
    }

    window.appendNumber = appendNumber;
    window.appendOperator = appendOperator;
    window.appendDecimal = appendDecimal;
    window.clearAll = clearAll;
    window.deleteLast = deleteLast;
    window.toggleSign = toggleSign;
    window.calculate = calculate;
    window.calculateTrigFunction = calculateTrigFunction;
    window.calculateHyperbolicFunction = calculateHyperbolicFunction;
    window.calculateSquareRoot = calculateSquareRoot;
    window.calculateFactorial = calculateFactorial;
    window.clearHistory = clearHistory;

    document.addEventListener('keydown', handleKeyboardInput);
});

/* CSS Animations */
const style = document.createElement('style');
style.innerHTML = `
    body {
        background-color: #F8E0DC; /* 배경색 */
    }
    #inputField {
        background-color: transparent; /* 입력창 투명 */
        border: none;
        color: #647979; /* 입력 텍스트 색 */
    }
    .fade-out {
        opacity: 0;
        transition: opacity 0.2s ease-out;
    }
    .fade-in {
        opacity: 1;
        transition: opacity 0.2s ease-in;
    }
    button {
        background-color: #a4c9e5; /* 버튼 색 */
        color: #003366; /* 터치 시 버튼 색 */
        border: none;
        padding: 10px;
        font-size: 16px;
        margin: 5px;
        border-radius: 8px;
        transition: background-color 0.3s ease;
    }
    button.operator, button.trig, button.hyperbolic, button.misc {
        background-color: #800080; /* 보라색 */
        color: #FFFFFF; /* 흰색 글자 */
    }

    button:hover {
        background-color: #8fbcd4; /* Slightly darker shade on hover */
    }
`;
document.head.appendChild(style);
