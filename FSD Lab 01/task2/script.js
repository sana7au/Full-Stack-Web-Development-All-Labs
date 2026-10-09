let queue = [];

function generateRandomNumber() {
    return Math.floor(Math.random() * 90) + 10;
}

function addRandomNumber() {

    let number = generateRandomNumber();

    $("#availableValues").append(
        '<div class="number">' + number + '</div>'
    );
}

function enqueueValue(value) {

    queue.push(value);

    updateQueue();

    $("#message").text(
        "Value " + value + " added to the queue."
    );
}

function dequeueValue(index) {

    if (index != 0) {

        $("#message").text(
            "Invalid DEQUEUE! Only the front value can be dequeued."
        );

        return;
    }

    let value = queue.shift();

    updateQueue();

    $("#message").text(
        "Value " + value + " removed from the queue."
    );

    if (queue.length == 0) {
        $("#message").text("Queue is empty.");
    }
}

function updateQueue() {

    $("#queue").empty();

    for (let i = 0; i < queue.length; i++) {

        $("#queue").append(
            '<div class="queueValue" data-index="' + i + '">' +
            queue[i] +
            '</div>'
        );
    }
}

$(document).on("click", ".number", function () {

    let value = $(this).text();

    enqueueValue(value);
    $(this).remove();
});

$(document).on("click", ".queueValue", function () {

    let index = parseInt($(this).attr("data-index"));
    dequeueValue(index);
});

$("#randomBtn").click(function () {

    addRandomNumber();

    $("#message").text("New random value generated.");
});

for (let i = 0; i < 6; i++) {
    addRandomNumber();
}