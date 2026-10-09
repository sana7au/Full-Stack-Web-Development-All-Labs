const productImage = document.querySelector(".product-image");
const productName = document.querySelector(".product-name");
const colorSelect = document.querySelector("select");
const nameInput = document.querySelector("input");
const form = document.querySelector("form");
const cartBox = document.querySelector(".cart-box");
const cartMessage = document.querySelector(".cart-message");
const message = document.querySelector(".message");
const productCard = document.querySelector(".product-card");

colorSelect.addEventListener("change", function () {

    if (colorSelect.value === "Black") {
        productImage.style.backgroundColor = "#222222";
    }
    else if (colorSelect.value === "Blue") {
        productImage.style.backgroundColor = "blue";
    }
    else if (colorSelect.value === "Red") {
        productImage.style.backgroundColor = "red";
    }
    else if (colorSelect.value === "Green") {
        productImage.style.backgroundColor = "green";
    }

    message.innerHTML = "Product color changed to " + colorSelect.value;
});

nameInput.addEventListener("input", function () {

    if (nameInput.value === "") {
        productName.innerHTML = "Product Name";
    }
    else {
        productName.innerHTML = nameInput.value;
    }

    message.innerHTML = "Engraving updated: " + nameInput.value;
});

nameInput.addEventListener("focus", function () {

    message.innerHTML = "Enter your custom name or engraving.";

});

nameInput.addEventListener("blur", function () {

    if (nameInput.value === "") {
        message.innerHTML = "No engraving entered.";
    }
    else {
        message.innerHTML = "Engraving saved.";
    }

});

productCard.addEventListener("mouseover", function () {

    productCard.style.transform = "scale(1.03)";
    productCard.style.transition = "0.3s";

    message.innerHTML = "Mouse is over the product.";

});

productCard.addEventListener("mouseout", function () {

    productCard.style.transform = "scale(1)";

    message.innerHTML = "Mouse left the product.";

});

productImage.addEventListener("mousemove", function (event) {

    const rect = productImage.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 10;
    const rotateY = (centerX - x) / 10;

    productImage.style.transform =
        "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";

});

productImage.addEventListener("mouseleave", function () {

    productImage.style.transform = "rotateX(0deg) rotateY(0deg)";

});

productCard.setAttribute("draggable", "true");

productCard.addEventListener("dragstart", function () {

    message.innerHTML = "Dragging product to cart...";

    productCard.style.opacity = "0.5";

});

productCard.addEventListener("dragend", function () {

    productCard.style.opacity = "1";

});

cartBox.addEventListener("dragover", function (event) {

    event.preventDefault();

    cartBox.style.backgroundColor = "#e0f7f4";
    cartMessage.innerHTML = "Drop product here";

});

cartBox.addEventListener("dragleave", function () {

    cartBox.style.backgroundColor = "white";
    cartMessage.innerHTML = "Your cart is empty";

});

cartBox.addEventListener("drop", function (event) {

    event.preventDefault();

    cartBox.style.backgroundColor = "white";

    cartMessage.innerHTML = "Smart Watch added to cart!";

    message.innerHTML = "✓ Product successfully added to cart.";

});

form.addEventListener("submit", function (event) {

    event.preventDefault();

    if (nameInput.value === "") {

        message.innerHTML = "Please enter a custom name before submitting.";

    }
    else {

        message.innerHTML =
            "✓ Configuration submitted successfully!";

        cartMessage.innerHTML =
            "Smart Watch - " + nameInput.value;
    }

});

form.addEventListener("reset", function () {
    setTimeout(function () {

        productImage.style.backgroundColor = "#222222";

        productName.innerHTML = "Product Name";

        productImage.style.transform =
            "rotateX(0deg) rotateY(0deg)";

        cartBox.style.backgroundColor = "white";

        cartMessage.innerHTML = "Your cart is empty";

        message.innerHTML =
            "Configurator has been reset.";

    }, 10);

});

const description = document.querySelector(".product-card p");

description.addEventListener("copy", function (event) {

    event.preventDefault();

    message.innerHTML =
        "Copying the product description is not allowed.";

});

description.addEventListener("cut", function (event) {

    event.preventDefault();

    message.innerHTML =
        "Cutting the product description is not allowed.";

});

window.addEventListener("scroll", function () {

    message.innerHTML =
        "You are scrolling through the product configurator.";

});