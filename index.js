function init() {
    document.addEventListener("keydown", function (event) {
        const key = document.querySelector(`button[data-key="${event.key}"]`)
        key.click()
    })
}

function tokenize (expression) {
    let tokens = []
    let character
    let currentNum = ''

    for (let i = 0; i < expression.length; i++) {
        character = expression[i]
        if (character >= '0' && character <= '9' || character === '.') {
            currentNum += character
        } else if (character === '-' && (i === 0 || '+-*/'.includes(expression[i-1]))) {
            currentNum += character
        } else if ('+-*/'.includes(character)) {
            tokens.push(parseFloat(currentNum))
            currentNum = ''
            tokens.push(character)
        }
    }

    if (currentNum !== '') {
        tokens.push(parseFloat(currentNum))
    }
    return tokens
}

function calculate () {
    let display = document.getElementById("f_Display")
    let expression = display.innerHTML

    expression = expression.replaceAll("\u00F7", "/")
    expression = expression.replaceAll("\u2212", "-")
    expression = expression.replaceAll("x", "*")
    expression = expression.replaceAll("\u002B", "+")

    const tokens = tokenize(expression);

    let i = 0;
    while (i < tokens.length) {
        if (tokens[i] === '*') {
            let left = tokens[i - 1]
            let right = tokens[i + 1]
            let result = left * right

            tokens.splice(i - 1, 3, result)
            i--
        } else if (tokens[i] === '/') {
            let left = tokens[i - 1]
            let right = tokens[i + 1]

            if (right === 0) {
                return "Nie można dzielić przez zero"
            }

            let result = left / right



            tokens.splice(i - 1, 3, result)
            i--
        }
        i++
    }

    i = 0
    while (i < tokens.length) {
        if (tokens[i] === '+') {
            let left = tokens[i - 1]
            let right = tokens[i + 1]
            let result = left + right

            tokens.splice(i - 1, 3, result)
            i--
        } else if (tokens[i] === '-') {
            let left = tokens[i - 1]
            let right = tokens[i + 1]
            let result = left - right

            tokens.splice(i - 1, 3, result)
            i--
        }
        i++
    }

    let finalResult = tokens[0].toString()
    finalResult = finalResult.replace("-", "\u2212")
    return finalResult
}

function user_input(id) {
    const operators = ["\u2212", "\u00F7", "\u002B", "x"]
    let display = document.getElementById("f_Display")
    let value = document.getElementById(id).innerHTML

    if (id === "f_C") {
        display.innerHTML = 0
    } else if (id === "f_B") {
        display.innerHTML = display.innerHTML.slice(0, -1) || "0"
    } else if (id === "f_Addition") {
        if(operators.includes(display.innerHTML.slice(-1)) ) {
            display.innerHTML = display.innerHTML.slice(0, -1) + "\u002B"
        } else if (display.innerHTML !== "0" && !display.innerHTML.slice(-1).includes(".")) {
            display.innerHTML += "\u002B"
        }
    } else if (id === "f_Substraction") {
        if(operators.includes(display.innerHTML.slice(-1)) ) {
            if(display.innerHTML.slice(-1) !== "\u2212") {
                display.innerHTML += "\u2212"
            }
        } else if (display.innerHTML !== "0" && !display.innerHTML.slice(-1).includes(".")) {
            display.innerHTML += "\u2212"
        } else if (display.innerHTML === "0") {
            display.innerHTML = "\u2212"
        }
    } else if (id === "f_Multiplier") {
        if(operators.includes(display.innerHTML.slice(-1)) ) {
            display.innerHTML = display.innerHTML.slice(0, -1) + "x"
        } else if (display.innerHTML !== "0" && !display.innerHTML.slice(-1).includes(".")) {
            display.innerHTML += "x"
        }
    } else if (id === "f_Division") {
        if(operators.includes(display.innerHTML.slice(-1)) ) {
            display.innerHTML = display.innerHTML.slice(0, -1) + "\u00F7"
        } else if (display.innerHTML !== "0" && !display.innerHTML.slice(-1).includes(".")) {
            display.innerHTML += "\u00F7"
        }
    } else if (id === "f_Dot") {
        const regex = new RegExp('[' + operators.join('') + ']')
        const nums = display.innerHTML.split(regex)
        if(display.innerHTML === "0") {
          display.innerHTML = "0."
        } else if (!(nums[nums.length - 1].includes(".")) && !operators.includes(display.innerHTML.slice(-1))) {
            display.innerHTML += "."
        }
    } else if (id === "f_Equal") {
        if(!operators.includes(display.innerHTML.slice(-1)) ) {
            let lastExpression = display.innerHTML
            let result = calculate()
            display.innerHTML = result.toString();

            let history = document.getElementById("historia-lista")
            let record = document.createElement("p")
            record.innerHTML = lastExpression + " = " + result
            history.prepend(record)

            if (history.children.length > 10) {
                history.removeChild(history.lastChild)
            }
        }
    }

    if (!isNaN(value) && display.innerHTML === "0" ) {
        display.innerHTML = value
    } else if (!isNaN(value)) {
        display.innerHTML += value
    }
}

function clearHistory() {
    let history = document.getElementById("historia-lista")
    history.replaceChildren()
}