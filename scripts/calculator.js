document.addEventListener('DOMContentLoaded', function() {
 
  let displayText = "";
  let input = {};
  let constants = ["<em>e</em>", "π"];
  let ops = {
    "^": {"precedence": 4, "assoc": "right"},
    "x": {"precedence": 3, "assoc": "left"},
    "/": {"precedence": 3, "assoc": "left"},
    "+": {"precedence": 2, "assoc": "left"},
    "-": {"precedence": 2, "assoc": "left"}
  }
  let fns = [
    "&radic;",
    "√",
    "sqrt",
    "sin",
    "cos",
    "tan"
  ]
  let log = "";
  $('#log').hide();
  // NUMBERS

  $('#decimal, #zero, #one, #two, #three, #four, #five, #six, #seven, #eight, #nine').on('click', function() {
    let value = $(this).html();
    $('#display').html(displayText += value);
  });
  
    $('#pi, #euler').on('click', function() {
    let value = $(this).html();
    $('#display').html(displayText += value);
  });

  // OPERATORS

  $('#add, #subtract, #multiply, #divide, #exponent, #parenL, #parenR').on('click', function() {
    let operator = $(this).html();
    $('#display').html(displayText += " " + operator + " ");
  });
  
  $('#sqrt, #sin, #cos, #tan').on('click', function() {
    let operator = $(this).html();
    $('#display').html(displayText += " " + operator + " ");
  });
  
  $('#equals').on('click', function() {
    let infixArr = inputToArray(displayText);
    let postfixArr = toPostfix(infixArr);
    let result = evalPostfix(postfixArr);
    $('#display').html(displayText += " = " + result);
    $('#output').html(postfixArr.toString().replace(/,/g, " ") + " = " + result);
    displayText = result;
  });

  $('#delete').on('click', function() {
    let x = displayText[displayText.length - 1] == " " ? 2 : 1;  
    $('#display').html(displayText = displayText.substr(0, displayText.length - x));
  });
  
  $('#clear').on('click', function() {
    $('#output').html(displayText = "");
    $('#display').html(displayText = "");
  });

  // LOG
  
  $('#logview').on('click', function() {
    $(this).toggleClass("active");
    $(this).attr('aria-pressed', $(this).attr("aria-pressed") == "true" ? "false" : "true");
    $(this).text($(this).text() == "Show Log" ? "Hide Log" : "Show Log");
    $('#log').toggle();
  });
  
  $('#logclear').on('click', function() {
    log = "";
    $('#log').text(log);
  });
  
  // FUNCTIONS

  function inputToArray(string) {
    return string.split(" ").filter((value) => value != "").map((value) => inputFilter(value));
  }

  function inputFilter(n) {
    return isNumber(n) ? parseFloat(n) : n;
  }

  function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
  }

  function toPostfix(infix) {
    let postfix = []; 
    let stack = [];
    let top;
    $("#log").html(log += "input: " + displayText + " = <br/>" + infix.length + ": " + infix);
    while (infix.length != 0) {
      let token = infix.shift();
      $("#log").html(log += "<br/>" + infix.length + ": " + token + " [ " + stack + " ]");
      // number
      if (isNumber(token) || constants.includes(token)) {
        postfix.push(token);
      // function
      } else if (fns.includes(token)) {
        stack.push(token);
      // operator
      } else if (ops.hasOwnProperty(token)) {
        top = stack[stack.length-1];    
        while (stack.length != 0 && top != "(" && (fns.includes(top) || ops[top].precedence > ops[token].precedence || (ops[top].precedence == ops[token].precedence && ops[top].assoc == "left"))) {
          postfix.push(stack.pop());
          top = stack[stack.length-1];
        }
        stack.push(token);
      // left bracket
      } else if (token == "(") {
        stack.push(token);
      // right bracket
      } else if (token == ")") {
        //$("#log").html(log += "<br /> - pre" + " [ " + stack + " ]");
        top = stack[stack.length-1];       
        while (stack.length > 0 && top != "(") {
          postfix.push(stack.pop());
          top = stack[stack.length-1]; 
        }
        stack.pop();
        //$("#log").html(log += "<br /> - post" + " [ " + stack + " ]");
      }
    }
    // pop off remaining stack operators
    $("#log").html(log += "<br/>&nbsp;= " + postfix + "[" + stack + "]");
    while (stack.length != 0) {
      postfix.push(stack.pop());
    }
    $("#log").html(log += "<br/>&nbsp;= " + postfix + "<br/>");
    return postfix;    
  }
  
  function evalPostfix(input) {
    let postfix = [...input];
    let stack = []
    while (postfix.length != 0) {
      let n = postfix.shift();
      switch (n) {
        case "+":
          stack.push(stack.pop() + stack.pop());
          break;
        case "-":
          stack.push(-stack.pop() + stack.pop())   
          break;
        case "x":
        case "*":
          stack.push(stack.pop() * stack.pop());
          break;
        case "/":
          stack.push(1 / stack.pop() * stack.pop());
          break;
        case "^":
          let exponent = stack.pop();
          stack.push(Math.pow(stack.pop(), exponent));
          break;
        case "π":
          stack.push(Math.PI);
          break;
        case "<em>e</em>":
          stack.push(Math.E);
          break;
        case "√":
          stack.push(Math.sqrt(stack.pop()));
          break;
        case "sin":
          stack.push(Math.sin(stack.pop()));
          break;
        case "cos":
          stack.push(Math.cos(stack.pop()));
          break;
        case "tan":
          stack.push(Math.tan(stack.pop()));
          break;
        default:
          stack.push(n);
          break;
      }
    }
    return stack.pop();
  }
  
});
