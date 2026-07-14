function init() {
    let elementC = document.createElement("div")
    let elementB = document.createElement("div")
    let elementDivision = document.createElement("div")
    let elementMultiplier = document.createElement("div")
    let elementSubstraction = document.createElement("div")
    let elementAddition = document.createElement("div")
    let elementDot = document.createElement("div")
    let elementEqual = document.createElement("div")
    let elementDisplay = document.createElement("div")
    let elementZero = document.createElement("div")

    elementC.innerHTML = "C"
    elementB.innerHTML = "\u232B"
    elementDivision.innerHTML = "\u00F7"
    elementMultiplier.innerHTML = "x"
    elementSubstraction.innerHTML = "\u2212"
    elementAddition.innerHTML = "\u002B"
    elementDot.innerHTML = "."
    elementEqual.innerHTML = "\u003D"
    elementDisplay.innerHTML = "0"
    elementZero.innerHTML = "0"

    elementC.setAttribute("id", "f_C")
    elementB.setAttribute("id", "f_B")
    elementDivision.setAttribute("id", "f_Division")
    elementMultiplier.setAttribute("id", "f_Multiplier")
    elementSubstraction.setAttribute("id", "f_Substraction")
    elementAddition.setAttribute("id", "f_Addition")
    elementDot.setAttribute("id", "f_Dot")
    elementEqual.setAttribute("id", "f_Equal")
    elementDisplay.setAttribute("id", "f_Display")
    elementZero.setAttribute("id", "f_0")

    elementC.setAttribute("class", "large_field")
    elementB.setAttribute("class", "large_field")
    elementDivision.setAttribute("class", "field")
    elementMultiplier.setAttribute("class", "field")
    elementSubstraction.setAttribute("class", "field")
    elementAddition.setAttribute("class", "field")
    elementDot.setAttribute("class", "field")
    elementEqual.setAttribute("class", "field")
    elementDisplay.setAttribute("class", "display")
    elementZero.setAttribute("class", "field")

    elementC.setAttribute("onclick", "user_input('f_C')")
    elementB.setAttribute("onclick", "user_input('f_B')")
    elementDivision.setAttribute("onclick", "user_input('f_Division')")
    elementMultiplier.setAttribute("onclick", "user_input('f_Multiplier')")
    elementSubstraction.setAttribute("onclick", "user_input('f_Substraction')")
    elementAddition.setAttribute("onclick", "user_input('f_Addition')")
    elementDot.setAttribute("onclick", "user_input('f_Dot')")
    elementEqual.setAttribute("onclick", "user_input('f_Equal')")
    elementDisplay.setAttribute("onclick", "user_input('f_Display')")
    elementZero.setAttribute("onclick", "user_input('f_0')")

    elementC.setAttribute("data-key", "c")
    elementB.setAttribute("data-key", "Backspace")
    elementDivision.setAttribute("data-key", "/")
    elementMultiplier.setAttribute("data-key", "*")
    elementSubstraction.setAttribute("data-key", "-")
    elementAddition.setAttribute("data-key", "+")
    elementDot.setAttribute("data-key", ".")
    elementEqual.setAttribute("data-key", "Enter")
    elementZero.setAttribute("data-key", "0")

    document.getElementById("kontener").appendChild(elementDisplay)
    document.getElementById("kontener").appendChild(elementC)
    document.getElementById("kontener").appendChild(elementB)

    // Dodanie cyfr
    for (let j = 7; j >= 1; j -= 3) {
        for (let k = j; k < j + 3; k++) {
            let element = document.createElement("div")
            element.innerHTML = k;
            element.setAttribute("id", "f_" + k)
            element.setAttribute("class", "field")
            element.setAttribute("onclick", "user_input('f_" + k + "')")
            element.setAttribute("data-key", k.toString())
            document.getElementById("kontener").appendChild(element)
        }
        if (j === 1) {
            document.getElementById("kontener").appendChild(elementSubstraction)
            document.getElementById("kontener").appendChild(elementDot)
            document.getElementById("kontener").appendChild(elementZero)
        }

        if (j === 7) {
            document.getElementById("kontener").appendChild(elementDivision)
        }

        if (j === 4) {
            document.getElementById("kontener").appendChild(elementMultiplier)
        }
    }
    document.getElementById("kontener").appendChild(elementEqual)
    document.getElementById("kontener").appendChild(elementAddition)

    document.addEventListener("keydown", function (event) {
        const key = document.querySelector(`div[data-key="${event.key}"]`)
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