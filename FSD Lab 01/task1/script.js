let stack = [];

function generateRandomNumber() {
    return Math.floor(Math.random() * 90) + 10;
}

function addRandomNumber() {

    let number = generateRandomNumber();

    $("#availableValues").append(
        '<div class="number">' + number + '</div>'
    );
}

function pushValue(value) {

    stack.push(value);

    updateStack();

    $("#message").text("Value " + value + " pushed into the stack.");
}

function popValue(index) {

    if (index != stack.length - 1) {

        $("#message").text(
            "Invalid POP! Only the top value can be popped."
        );

        return;
    }

    let value = stack.pop();

    updateStack();

    $("#message").text("Value " + value + " popped from the stack.");

    if (stack.length == 0) {
        $("#message").text("Stack is empty.");
    }
}

function updateStack() {

    $("#stack").empty();

    for (let i = stack.length - 1; i >= 0; i--) {

        $("#stack").append(
            '<div class="stackValue" data-index="' + i + '">' +
            stack[i] +
            '</div>'
        );
    }
}

$(document).on("click", ".number", function () {

    let value = $(this).text();

    pushValue(value);

    $(this).remove();
});

$(document).on("click", ".stackValue", function () {

    let index = parseInt($(this).attr("data-index"));

    popValue(index);
});

$("#randomBtn").click(function () {

    addRandomNumber();

    $("#message").text("New random value generated.");
});

for (let i = 0; i < 6; i++) {
    addRandomNumber();
}