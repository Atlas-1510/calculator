// ***** STYLING *****
// Set up overall calculator layout 
const calculator = document.getElementById("calculator");
const calculatorSize = 480;
calculator.style.setProperty("width", calculatorSize + "px");
calculator.style.setProperty("height", calculatorSize + "px");

// Button highlight effect when clicked
const buttons = Array.from(document.querySelectorAll('.button'));
buttons.forEach(button => button.addEventListener("mousedown", (button) => {
    if (button.path[0].classList.contains("number")) {
        button.path[0].classList.toggle("numberHighlight");
    } else if (button.path[0].classList.contains("inputControl")) {
        button.path[0].classList.toggle("inputHighlight");
    } else if (button.path[0].classList.contains("orangeSquare")) {
        button.path[0].classList.toggle("orangeSquareHighlight");
    }
}));
buttons.forEach(button => button.addEventListener("mouseup", (button) => {
    if (button.path[0].classList.contains("number")) {
        button.path[0].classList.toggle("numberHighlight");
    } else if (button.path[0].classList.contains("inputControl")) {
        button.path[0].classList.toggle("inputHighlight");
    } else if (button.path[0].classList.contains("orangeSquare")) {
        button.path[0].classList.toggle("orangeSquareHighlight");
    }
}));

// Keyboard input
let isKeyDown = false
window.addEventListener('keydown', function (e) {
    if (!isKeyDown) {
        if (e.key == "Shift") return;
        const input = document.querySelector(`div[data-key="${e.key}"]`);
        if (!input) return;
        input.dispatchEvent(new Event('mousedown'));
        isKeyDown = true;
    }
})
window.addEventListener('keyup', function (e) {
    isKeyDown = false;
    if (e.key == "Shift") return;
    const input = document.querySelector(`div[data-key="${e.key}"]`);
    if (!input) return;
    input.click();
    input.dispatchEvent(new Event('mouseup'));
})


// ***** MATH FUNCTIONS *****

function add(first, second) {
    return first + second;
}

function subtract(first, second) {
    return first - second;
}

function multiply(first, second) {
    return first * second;
}

function divide(first, second) {
    return first / second;
}

// ***** FUNCTIONALITY *****

// alpha and beta are the two slots to hold number input from user,
// operator holds the (*,/,+,-) chosen by user
// Two versions, strings extracted from html, numbers used in calcs. 
let alphaNumber;
let betaNumber;
let operator = "";

let alphaString = "";
let betaString = "";

// These toggles determine which slot is being updated by the user,
// when true, that is the number that can be updated through user input
let alphaToggle = true;
let betaToggle = false;

// This variable keeps track of what the prior button press was
// Default is number, because that is the first thing you enter in a calculator
let priorButton = "number";

// This variable holds the result of a calculation
let result = 0;

const displayValue = document.getElementById("displayContent");
buttons.forEach((button) => {
    button.addEventListener('click', (buttonPress) => {
        let userInput = getInput(buttonPress);
        setMode(userInput);
    })
});

// Debugging Divs
if (false) {
    let container = document.getElementById("container");
    // Alpha Toggle
    let alphaToggleDiv = document.createElement("div");
    alphaToggleDiv.textContent = "Alpha Toggle";
    container.appendChild(alphaToggleDiv);
    // Beta Toggle
    let betaToggleDiv = document.createElement("div");
    betaToggleDiv.textContent = "Beta Toggle";
    container.appendChild(betaToggleDiv);
    // Alpha Value
    let alphaValueDiv = document.createElement("div");
    alphaValueDiv.textContent = "Alpha Value: ";
    container.appendChild(alphaValueDiv);
    // Beta Value
    let betaValueDiv = document.createElement("div");
    betaValueDiv.textContent = "Beta Value: ";
    container.appendChild(betaValueDiv);
    // Operator
    let operatorDiv = document.createElement("div");
    operatorDiv.textContent = "Operator: ";
    container.appendChild(operatorDiv);

    buttons.forEach((button) => {
        button.addEventListener('click', () => {
            if (alphaToggle) {
                alphaToggleDiv.style.setProperty("background-color", "lightgreen");
            }
            if (betaToggle) {
                betaToggleDiv.style.setProperty("background-color", "lightgreen");
            }
            if (!alphaToggle) {
                alphaToggleDiv.style.setProperty("background-color", "white");
            }
            if (!betaToggle) {
                betaToggleDiv.style.setProperty("background-color", "white");
            }
            alphaValueDiv.innerHTML = `Alpha Value: ${alphaNumber}`;
            betaValueDiv.innerHTML = `Beta Value: ${betaNumber}`;
            operatorDiv.innerHTML = `Operator: ${operator}`;
        })
    })
};

// Takes user input array from getInput, determines which function to run based on button types
// i.e if an operator following a number, run numberOperator() 
function setMode(input) {
    let newButton = input[0];
    let value = input[1];
    if (value == "." && displayValue.textContent.includes(".")) {
        return;
    }
    if (newButton == "backspace") {
        backspace();
    }
    // If prior button is a number
    if (priorButton == "number") {
        if (newButton == "number") {
            // console.log("number following number");
            priorButton = "number";
            numberNumber(value);
        } else if (newButton == "operator") {
            // console.log("operator following number");
            priorButton = "operator";
            numberOperator(value);
        } else if (newButton == "equality") {
            // console.log("equality following number");
            priorButton = "equality";
            numberEquality();
        }
    }
    // If prior button is an operator
    else if (priorButton == "operator") {
        if (newButton == "number") {
            // console.log("number following operator");
            priorButton = "number";
            operatorNumber(value);
        } else if (newButton == "operator") {
            // console.log("operator following operator");
            priorButton = "operator";
            operatorOperator(value);
        } else if (newButton == "equality") {
            // console.log("equality following operator");
            priorButton = "equality";
            operatorEquality();
        }
    }
    // If prior button is an equality
    else if (priorButton == "equality") {
        if (newButton == "number") {
            // console.log("number following equality");
            priorButton = "number";
            equalityNumber(value);
        } else if (newButton == "operator") {
            // console.log("operator following equality");
            priorButton = "operator";
            equalityOperator(value);
        } else if (newButton == "equality") {
            // console.log("equality following equality");
            priorButton = "equality";
            equalityEquality();
        }
    }
    // If NEW button is an input control
    if (newButton == "inputControl") {
        if (value == "clearButton") {
            alphaNumber = 0;
            alphaString = "";
            betaNumber = 0;
            betaString = "";
            result = 0;
            operator = "";
            priorButton = "number";
            alphaToggle = true;
            betaToggle = false;
            displayValue.textContent = 0;
        }
        if (value == "negativeToggle") {
            let number = Number(displayValue.textContent) * -1;
            if (alphaToggle) {
                alphaNumber = number;
                alphaString = number.toString();
            }
            if (betaToggle) {
                betaNumber = number;
                betaString = number.toString();
            }
            updateDisplayInput();
        }
        if (value == "percentageToggle") {
            let number = Number(displayValue.textContent) / 100;
            if (alphaToggle) {
                alphaNumber = number;
                alphaString = number.toString();
            }
            if (betaToggle) {
                betaNumber = number;
                betaString = number.toString();
            }
            updateDisplayInput();
        }
    }
}

function backspace() {
    let str = displayValue.textContent;
    str = str.substring(0, str.length - 1);
    displayValue.textContent = str;
    if (betaToggle) {
        betaNumber = Number(str);
    } else if (alphaToggle) {
        alphaNumber = Number(str);
    }
}

// getInput takes a mouse click, and returns an array with [buttonType, buttonValue]
function getInput(event) {
    let type = "";
    let value = "";
    let buttonClass = event.target.classList;
    if (buttonClass.contains("number")) {
        let buttonValueString = event.path[0].textContent;
        type = "number";
        value = buttonValueString;
    } else if (buttonClass.contains("operator")) {
        type = "operator";
        value = event.target.id;
    } else if (buttonClass.contains("equality")) {
        type = "equality";
        value = event.target.id;
    } else if (buttonClass.contains("inputControl")) {
        type = "inputControl";
        value = event.target.id;
    } else if (buttonClass.contains("backspace")) {
        type = "backspace";
        value = event.target.id;
    }
    let returnArray = [type, value];
    return returnArray;
}

// Updates display with user input
function updateDisplayInput() {
    if (alphaToggle) displayValue.textContent = alphaString;
    else if (betaToggle) displayValue.textContent = betaString;
}

// Updates display with calculation output
function updateDisplayOutput() {
    displayValue.textContent = result;
}

// ****** PRIOR = NUMBER ******

// Number following number
function numberNumber(input) {
    if (alphaToggle) {
        alphaString += input;
        alphaNumber = Number(alphaString);
    }
    else if (betaToggle) {
        betaString += input;
        betaNumber = Number(betaString);
    }
    updateDisplayInput();
}

// Operator following number
function numberOperator(input) {
    if (alphaToggle) {
        operator = input;
        alphaToggle = false;
        betaToggle = true;
    }
    else if (betaToggle) {
        numberEquality();
        betaString = "";
        betaNumber = undefined;
        operator = input;
    }
}

// Equality following number
function numberEquality() {
    if (betaNumber == 0 && operator == "divide") {
        displayValue.textContent = "Divide by zero error";
    }
    else if (alphaNumber && betaNumber && operator) {
        let numberInputs = [alphaNumber, betaNumber];
        result = window[operator].apply(null, numberInputs);
        updateDisplayOutput();
        alphaString = result.toString();
        alphaNumber = Number(alphaString);
        alphaToggle = false;
    }
}

// ****** PRIOR = OPERATOR ******

// Number following operator
function operatorNumber(input) {
    if (betaToggle) {
        betaString += input;
        betaNumber = Number(betaString);
        updateDisplayInput();
    }
}

// Operator following operator
function operatorOperator(input) {
    updateDisplayOutput();
    operator = input;
}

// Equality following operator
function operatorEquality() {
    let numberInputs = [result, result];
    result = window[operator].apply(null, numberInputs);
    updateDisplayOutput();
}

// ****** PRIOR = EQUALITY ******

// Number following equality
function equalityNumber(input) {
    alphaString = input;
    alphaNumber = Number(alphaString);
    alphaToggle = !alphaToggle;
    betaToggle = !betaToggle;
    updateDisplayInput();
}

// Operator following equality
function equalityOperator(input) {
    alphaString = displayValue.textContent;
    alphaNumber = Number(alphaString);
    betaString = "";
    operator = input;
    alphaToggle = false;
    betaToggle = true;
}

// Equality following equality
function equalityEquality() {
    if (result && betaNumber) {
        let numberInputs = [result, betaNumber];
        result = window[operator].apply(null, numberInputs);
        console.log(result);
        updateDisplayOutput();
    }

}