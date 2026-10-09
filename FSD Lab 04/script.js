const LOTTIE_SUCCESS_URL = "https://assets10.lottiefiles.com/packages/lf20_touohxv0.json";
const LOTTIE_SHOWCASE_URL = "showcase.json";

const NORMAL_LIMIT = 20;
const EXTENDED_LIMIT = 40;

const FREE_COLORS = {
    Black: "#2b2b2b",
    Blue: "#1f5fbf",
    Red: "#c0392b",
    Green: "#2e8b57"
};

const VARIANTS = {
    standard: { label: "Standard 40mm", price: 120, scale: 1 },
    sport: { label: "Sport 44mm", price: 150, scale: 1.08 },
    lite: { label: "Lite 38mm", price: 99, scale: 0.92 }
};

const DISPLAY_COLORS = ["#4dd0e1", "#d4af37", "#ffffff", "#ff6b6b"];

let isPremium = false;
let currentColorName = "Black";
let displayColorIndex = 0;
let cart = [];
let messageTimer = null;
let successAnimation = null;
let showcaseAnimation = null;

const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");
const statusBadge = document.getElementById("statusBadge");
const cartCount = document.getElementById("cartCount");

const productCard = document.getElementById("productCard");
const preview = document.getElementById("preview");
const previewInner = document.getElementById("previewInner");
const glare = document.getElementById("glare");
const hoverInfo = document.getElementById("hoverInfo");
const watchSvg = document.getElementById("watchSvg");
const screenFace = document.getElementById("screenFace");
const crown = document.getElementById("crown");
const timeText = document.getElementById("timeText");
const engraveText = document.getElementById("engraveText");
const productName = document.getElementById("productName");
const productPrice = document.getElementById("productPrice");
const productDescription = document.getElementById("productDescription");

const customForm = document.getElementById("customForm");
const colorSelect = document.getElementById("colorSelect");
const variantSelect = document.getElementById("variantSelect");
const styleSelect = document.getElementById("styleSelect");
const nameInput = document.getElementById("nameInput");
const nameCounter = document.getElementById("nameCounter");
const nameError = document.getElementById("nameError");
const fieldTip = document.getElementById("fieldTip");
const addToCartBtn = document.getElementById("addToCartBtn");
const configSummary = document.getElementById("configSummary");

const cartDrop = document.getElementById("cartDrop");
const cartEmpty = document.getElementById("cartEmpty");
const cartMessage = document.getElementById("cartMessage");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const clearCartBtn = document.getElementById("clearCartBtn");

const adVideo = document.getElementById("adVideo");
const videoStatus = document.getElementById("videoStatus");
const showcaseBox = document.getElementById("showcaseAnimation");
const animPlay = document.getElementById("animPlay");
const animPause = document.getElementById("animPause");

const premiumControls = document.getElementById("premiumControls");
const premiumState = document.getElementById("premiumState");
const premiumBadge = document.getElementById("premiumBadge");
const swatches = document.querySelectorAll(".swatch");
const diamondToggle = document.getElementById("diamondToggle");
const glowToggle = document.getElementById("glowToggle");
const extendedToggle = document.getElementById("extendedToggle");
const fontButtons = document.querySelectorAll(".font-btn");

const upgradeBtn = document.getElementById("upgradeBtn");
const paymentForm = document.getElementById("paymentForm");
const cardName = document.getElementById("cardName");
const cardNumber = document.getElementById("cardNumber");
const expiry = document.getElementById("expiry");
const cvv = document.getElementById("cvv");
const payBtn = document.getElementById("payBtn");
const paymentMessage = document.getElementById("paymentMessage");

const message = document.getElementById("message");
const messageText = document.getElementById("messageText");
const messageUpgrade = document.getElementById("messageUpgrade");
const messageClose = document.getElementById("messageClose");
const successModal = document.getElementById("successModal");
const successBox = document.getElementById("successAnimation");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");

const resetAllBtn = document.getElementById("resetAllBtn");

function showMessage(text, type, showUpgrade) {
    messageText.textContent = text;
    message.className = "toast " + (type || "info");
    messageUpgrade.classList.toggle("hidden", !showUpgrade);

    message.style.animation = "none";
    void message.offsetWidth;
    message.style.animation = "";

    clearTimeout(messageTimer);
    messageTimer = setTimeout(hideMessage, 6000);
}

function hideMessage() {
    message.classList.add("hidden");
}

function openModal(title, text) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    successModal.classList.remove("hidden");

    if (successAnimation) {
        successAnimation.destroy();
    }
    successAnimation = playLottie(successBox, LOTTIE_SUCCESS_URL, false, true);
    modalClose.focus();
}

function closeModal() {
    successModal.classList.add("hidden");

    if (successAnimation) {
        successAnimation.destroy();
        successAnimation = null;
    }
}

messageClose.addEventListener("click", hideMessage);
modalClose.addEventListener("click", closeModal);

successModal.addEventListener("click", function (event) {
    if (event.target === successModal) {
        closeModal();
    }
});

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeModal();
    }
});

messageUpgrade.addEventListener("click", goToPayment);

function goToPayment() {
    document.getElementById("payment").scrollIntoView({ behavior: "smooth" });
    setTimeout(function () {
        cardName.focus();
    }, 600);
}

function playLottie(container, path, loop, autoplay) {
    const fallbackHtml = '<div class="check-fallback">✓</div>';

    container.innerHTML = "";

    if (typeof lottie === "undefined") {
        container.innerHTML = fallbackHtml;
        return null;
    }

    const animation = lottie.loadAnimation({
        container: container,
        renderer: "svg",
        loop: loop,
        autoplay: autoplay,
        path: path
    });

    animation.addEventListener("data_failed", function () {
        animation.addEventListener("DOMLoaded", function () { console.log("Lottie loaded:", container.id); });
        animation.addEventListener("data_failed", function () { console.log("Lottie FAILED:", container.id); });

        container.innerHTML = fallbackHtml;
    });

    return animation;
}

["copy", "cut"].forEach(function (action) {
    productDescription.addEventListener(action, function (event) {
        event.preventDefault();

        if (action === "copy") {
            showMessage("Copying the product description is not allowed.", "error");
        } else {
            showMessage("Cutting the product description is not allowed.", "error");
        }
    });
});

function getEngravingLimit() {
    return extendedToggle.checked ? EXTENDED_LIMIT : NORMAL_LIMIT;
}

function setWatchColor(hex, name) {
    watchSvg.style.setProperty("--strap-color", hex);
    currentColorName = name;
    updateSummary();
}

function clearSwatches() {
    swatches.forEach(function (swatch) {
        swatch.classList.remove("active");
    });
}

function updateVariant() {
    const variant = VARIANTS[variantSelect.value];

    watchSvg.style.setProperty("--watch-scale", variant.scale);
    productPrice.textContent = "$" + variant.price;
    updateSummary();
}

function updateStrapStyle() {
    watchSvg.classList.remove("style-sport", "style-leather", "style-metal");
    watchSvg.classList.add("style-" + styleSelect.value);
    updateSummary();
}

function updateEngraving() {
    const limit = getEngravingLimit();
    const value = nameInput.value;
    const length = value.length;

    if (value.trim() === "") {
        engraveText.textContent = "Your Name";
        engraveText.classList.add("placeholder");
        productName.textContent = "None";
    } else {
        engraveText.textContent = value;
        engraveText.classList.remove("placeholder");
        productName.textContent = value;
    }

    const fontSize = Math.max(5, 13 - length * 0.25);
    engraveText.style.fontSize = fontSize + "px";

    nameCounter.classList.remove("warn", "full");

    if (length >= limit) {
        nameCounter.textContent = length + " / " + limit + " characters (limit reached)";
        nameCounter.classList.add("full");
    } else if (length >= limit * 0.8) {
        nameCounter.textContent = length + " / " + limit + " characters (almost full)";
        nameCounter.classList.add("warn");
    } else {
        nameCounter.textContent = length + " / " + limit + " characters";
    }

    updateSummary();
}

function updateSummary() {
    const variant = VARIANTS[variantSelect.value];
    const styleName = styleSelect.options[styleSelect.selectedIndex].text;
    const engraving = nameInput.value.trim() === "" ? "none" : nameInput.value.trim();

    configSummary.textContent =
        "Current design: " + currentColorName + ", " + variant.label +
        ", " + styleName + ", engraving: " + engraving;
}

function setNameError(text) {
    nameError.textContent = text;
    nameInput.classList.toggle("invalid", text !== "");
}

colorSelect.addEventListener("change", function () {
    clearSwatches();
    setWatchColor(FREE_COLORS[colorSelect.value], colorSelect.value);
    showMessage("Color changed to " + colorSelect.value + ".", "info");
});

variantSelect.addEventListener("change", function () {
    updateVariant();
    showMessage("Variant changed to " + VARIANTS[variantSelect.value].label + ".", "info");
});

styleSelect.addEventListener("change", function () {
    updateStrapStyle();
    showMessage("Strap style updated.", "info");
});

nameInput.addEventListener("input", function () {
    setNameError("");
    updateEngraving();
});

nameInput.addEventListener("focus", function () {
    fieldTip.textContent = "Enter your custom name or engraving (max " + getEngravingLimit() + " characters).";
});

nameInput.addEventListener("blur", function () {
    if (nameInput.value.trim() === "") {
        fieldTip.textContent = "No engraving entered.";
    } else {
        fieldTip.textContent = "Engraving saved on the preview.";
    }
});

customForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = nameInput.value.trim();

    if (value === "") {
        setNameError("Please enter a name or engraving.");
        showMessage("Please enter a custom name before applying.", "error");
        nameInput.focus();
        return;
    }

    if (value.length < 2) {
        setNameError("Enter at least 2 characters.");
        nameInput.focus();
        return;
    }

    if (!/^[A-Za-z0-9 .'-]+$/.test(value)) {
        setNameError("Use only letters, numbers, spaces, . ' or -");
        nameInput.focus();
        return;
    }

    setNameError("");
    updateSummary();
    showMessage("✓ Customization applied successfully!", "success");
    openModal("Customization Saved!", "Your Chronos Smart Watch is ready: " + currentColorName + ", engraved with \"" + value + "\".");
});

const defaultHoverText = "Move your mouse over the watch";

preview.addEventListener("mouseenter", function () {
    preview.classList.add("active");
    hoverInfo.textContent = "Nice! Move around to tilt the watch.";
});

preview.addEventListener("mousemove", function (event) {
    const rect = preview.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 14;
    const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 14;

    previewInner.style.transform =
        "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)";

    glare.style.background =
        "radial-gradient(circle at " + x + "px " + y + "px, rgba(255,255,255,0.22), transparent 55%)";
});

preview.addEventListener("mouseleave", function () {
    preview.classList.remove("active");
    previewInner.style.transform = "";
    glare.style.background = "none";
    hoverInfo.textContent = defaultHoverText;
});

watchSvg.addEventListener("mouseover", function (event) {
    const part = event.target.closest("[data-hint]");

    if (part) {
        hoverInfo.textContent = part.dataset.hint;
    }
});

crown.addEventListener("click", function () {
    displayColorIndex = (displayColorIndex + 1) % DISPLAY_COLORS.length;
    timeText.style.fill = DISPLAY_COLORS[displayColorIndex];

    crown.classList.add("pressed");
    setTimeout(function () {
        crown.classList.remove("pressed");
    }, 200);
});

screenFace.addEventListener("click", function () {
    screenFace.classList.remove("pulse");
    void screenFace.getBoundingClientRect();
    screenFace.classList.add("pulse");
    hoverInfo.textContent = "Heart rate: 72 bpm";
});

function updateWatchTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }

    timeText.textContent = hours + ":" + minutes;
}

const defaultCartText = "Your cart is empty. Drag the product card here.";

function getActiveExtras() {
    const extras = [];

    if (diamondToggle.checked) { extras.push("Diamond bezel"); }
    if (glowToggle.checked) { extras.push("Glow effect"); }
    if (extendedToggle.checked) { extras.push("Extended engraving"); }

    return extras;
}

function addToCart() {
    const variant = VARIANTS[variantSelect.value];
    const engraving = nameInput.value.trim();

    const item = {
        id: Date.now() + Math.random(),
        color: currentColorName,
        variant: variant.label,
        style: styleSelect.options[styleSelect.selectedIndex].text,
        engraving: engraving === "" ? "None" : engraving,
        extras: getActiveExtras(),
        price: variant.price
    };

    cart.push(item);
    renderCart();

    cartDrop.classList.add("added");
    setTimeout(function () {
        cartDrop.classList.remove("added");
    }, 700);

    showMessage("✓ Smart Watch added to cart!", "success");
}

function renderCart() {
    cartList.innerHTML = "";
    let total = 0;

    cart.forEach(function (item) {
        total += item.price;

        const li = document.createElement("li");
        li.className = "cart-item";

        const info = document.createElement("div");
        const title = document.createElement("strong");
        const details = document.createElement("small");

        title.textContent = "Smart Watch - " + item.variant;
        details.textContent =
            "Color: " + item.color +
            " | Strap: " + item.style +
            " | Engraving: " + item.engraving +
            (item.extras.length > 0 ? " | Extras: " + item.extras.join(", ") : "");

        info.appendChild(title);
        info.appendChild(details);

        const price = document.createElement("span");
        price.className = "item-price";
        price.textContent = "$" + item.price;

        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "Remove";
        removeBtn.addEventListener("click", function () {
            cart = cart.filter(function (cartItem) {
                return cartItem.id !== item.id;
            });
            renderCart();
            showMessage("Item removed from cart.", "info");
        });

        li.appendChild(info);
        li.appendChild(price);
        li.appendChild(removeBtn);
        cartList.appendChild(li);
    });

    cartTotal.textContent = "$" + total;
    cartCount.textContent = cart.length;

    cartEmpty.classList.toggle("hidden", cart.length > 0);
    cartMessage.textContent = defaultCartText;
}

productCard.addEventListener("dragstart", function (event) {
    event.dataTransfer.setData("text/plain", "smart-watch");
    event.dataTransfer.effectAllowed = "copy";

    productCard.classList.add("dragging");
    showMessage("Dragging the product. Drop it in the cart!", "info");
});

productCard.addEventListener("dragend", function () {
    productCard.classList.remove("dragging");
});

cartDrop.addEventListener("dragover", function (event) {
    event.preventDefault();
    cartDrop.classList.add("drag-over");
    cartMessage.textContent = "Drop the product here!";
    cartEmpty.classList.remove("hidden");
});

cartDrop.addEventListener("dragleave", function (event) {
    if (cartDrop.contains(event.relatedTarget)) {
        return;
    }
    cartDrop.classList.remove("drag-over");
    cartEmpty.classList.toggle("hidden", cart.length > 0);
    cartMessage.textContent = defaultCartText;
});

cartDrop.addEventListener("drop", function (event) {
    event.preventDefault();
    cartDrop.classList.remove("drag-over");
    addToCart();
});

addToCartBtn.addEventListener("click", addToCart);

clearCartBtn.addEventListener("click", function () {
    cart = [];
    renderCart();
    showMessage("Cart cleared.", "info");
});

adVideo.addEventListener("play", function () {
    videoStatus.textContent = "Advertisement is playing.";
});

adVideo.addEventListener("pause", function () {
    videoStatus.textContent = "Advertisement paused.";
});

adVideo.addEventListener("ended", function () {
    videoStatus.textContent = "Thanks for watching! Customize your watch above.";
});

animPlay.addEventListener("click", function () {
    if (showcaseAnimation) {
        showcaseAnimation.play();
    }
});

animPause.addEventListener("click", function () {
    if (showcaseAnimation) {
        showcaseAnimation.pause();
    }
});

function setLockedState(locked) {
    premiumControls.classList.toggle("locked", locked);

    document.querySelectorAll(".lock-icon").forEach(function (icon) {
        icon.textContent = locked ? "🔒" : "🔓";
    });

    if (locked) {
        premiumState.textContent = "🔒 Locked. Upgrade to unlock these features.";
    } else {
        premiumState.textContent = "✅ Premium active. All features are unlocked.";
    }
}

function guardPremium(event) {
    if (isPremium) {
        return true;
    }

    event.preventDefault();
    showMessage("🔒 This is a Premium feature. Upgrade to unlock it.", "error", true);
    return false;
}

swatches.forEach(function (swatch) {
    swatch.addEventListener("click", function (event) {
        if (!guardPremium(event)) {
            return;
        }

        clearSwatches();
        swatch.classList.add("active");
        setWatchColor(swatch.dataset.color, swatch.dataset.name);
        showMessage("Premium color applied: " + swatch.dataset.name + ".", "success");
    });
});

diamondToggle.addEventListener("click", guardPremium);
diamondToggle.addEventListener("change", function () {
    watchSvg.classList.toggle("diamond", diamondToggle.checked);
    showMessage(diamondToggle.checked ? "Diamond bezel added." : "Diamond bezel removed.", "info");
});

glowToggle.addEventListener("click", guardPremium);
glowToggle.addEventListener("change", function () {
    preview.classList.toggle("glow", glowToggle.checked);
    showMessage(glowToggle.checked ? "Glow effect turned on." : "Glow effect turned off.", "info");
});

extendedToggle.addEventListener("click", guardPremium);
extendedToggle.addEventListener("change", function () {
    const limit = getEngravingLimit();

    nameInput.maxLength = limit;

    if (nameInput.value.length > limit) {
        nameInput.value = nameInput.value.substring(0, limit);
    }

    updateEngraving();
    showMessage("Engraving limit is now " + limit + " characters.", "info");
});

function setFont(fontName) {
    watchSvg.classList.remove("font-classic", "font-elegant", "font-digital");
    watchSvg.classList.add("font-" + fontName);

    fontButtons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.font === fontName);
    });
}

fontButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
        if (!guardPremium(event)) {
            return;
        }

        setFont(button.dataset.font);
        showMessage("Engraving font changed to " + button.textContent + ".", "info");
    });
});

function activatePremium() {
    isPremium = true;

    document.body.classList.add("is-premium");
    statusBadge.textContent = "★ Premium User";
    statusBadge.className = "status-badge premium";
    premiumBadge.classList.add("active");

    setLockedState(false);

    payBtn.textContent = "Premium Active ✓";
    payBtn.disabled = true;

    showMessage("🎉 Premium activated! All premium features are unlocked.", "success");
}

upgradeBtn.addEventListener("click", goToPayment);

function setFieldError(input, text) {
    const errorBox = input.parentElement.querySelector(".error");

    errorBox.textContent = text;
    input.classList.toggle("invalid", text !== "");
}

function clearPaymentErrors() {
    [cardName, cardNumber, expiry, cvv].forEach(function (input) {
        setFieldError(input, "");
    });
}

function setPaymentMessage(text, type) {
    paymentMessage.textContent = text;
    paymentMessage.className = "payment-message " + (type || "");
}

cardName.addEventListener("input", function () {
    cardName.value = cardName.value.replace(/[^a-zA-Z ]/g, "");
    setFieldError(cardName, "");
});

cardNumber.addEventListener("input", function () {
    const digits = cardNumber.value.replace(/\D/g, "").substring(0, 16);

    cardNumber.value = digits.replace(/(.{4})/g, "$1 ").trim();
    setFieldError(cardNumber, "");
});

expiry.addEventListener("input", function () {
    const digits = expiry.value.replace(/\D/g, "").substring(0, 4);

    if (digits.length > 2) {
        expiry.value = digits.substring(0, 2) + "/" + digits.substring(2);
    } else {
        expiry.value = digits;
    }
    setFieldError(expiry, "");
});

cvv.addEventListener("input", function () {
    cvv.value = cvv.value.replace(/\D/g, "").substring(0, 3);
    setFieldError(cvv, "");
});

function validatePayment() {
    let isValid = true;

    clearPaymentErrors();

    if (cardName.value.trim().length < 3) {
        setFieldError(cardName, "Enter the cardholder name (at least 3 letters).");
        isValid = false;
    }

    if (cardNumber.value.replace(/\s/g, "").length !== 16) {
        setFieldError(cardNumber, "Card number must contain 16 digits.");
        isValid = false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiry.value)) {
        setFieldError(expiry, "Enter the expiry date as MM/YY.");
        isValid = false;
    } else {
        const month = parseInt(expiry.value.substring(0, 2), 10);
        const year = parseInt(expiry.value.substring(3), 10);
        const today = new Date();
        const currentYear = today.getFullYear() % 100;
        const currentMonth = today.getMonth() + 1;

        if (month < 1 || month > 12) {
            setFieldError(expiry, "Month must be between 01 and 12.");
            isValid = false;
        } else if (year < currentYear || (year === currentYear && month < currentMonth)) {
            setFieldError(expiry, "This card has expired.");
            isValid = false;
        }
    }

    if (cvv.value.length !== 3) {
        setFieldError(cvv, "CVV must contain 3 digits.");
        isValid = false;
    }

    return isValid;
}

paymentForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (isPremium) {
        setPaymentMessage("You are already a Premium user.", "success");
        return;
    }

    if (!validatePayment()) {
        setPaymentMessage("Please fix the highlighted fields.", "error");
        return;
    }

    payBtn.disabled = true;
    setPaymentMessage("Processing payment, please wait...", "processing");

    setTimeout(function () {
        paymentForm.reset();
        clearPaymentErrors();

        setPaymentMessage("✓ Payment successful! Premium is active.", "success");
        activatePremium();
        openModal("Payment Successful!", "Welcome to Chronos Premium. Your premium features are now unlocked.");

    }, 2000);
});

paymentForm.addEventListener("reset", function () {
    setTimeout(function () {
        clearPaymentErrors();

        if (!isPremium) {
            setPaymentMessage("", "");
        }
    }, 10);
});

function resetCustomization() {
    clearSwatches();
    setWatchColor(FREE_COLORS.Black, "Black");

    diamondToggle.checked = false;
    watchSvg.classList.remove("diamond");

    glowToggle.checked = false;
    preview.classList.remove("glow");

    extendedToggle.checked = false;
    nameInput.maxLength = NORMAL_LIMIT;

    setFont("classic");

    timeText.style.fill = "";
    displayColorIndex = 0;
    previewInner.style.transform = "";
    glare.style.background = "none";
    hoverInfo.textContent = defaultHoverText;

    setNameError("");
    fieldTip.textContent = "Tip: your engraving appears on the watch while you type.";

    updateVariant();
    updateStrapStyle();
    updateEngraving();

    showMessage("Configurator has been reset.", "info");
}

customForm.addEventListener("reset", function () {
    setTimeout(resetCustomization, 10);
});

menuToggle.addEventListener("click", function () {
    mainNav.classList.toggle("open");
});

mainNav.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
        mainNav.classList.remove("open");
    }
});

function setupSectionAnimation() {
    const sections = document.querySelectorAll(".reveal");

    if (!("IntersectionObserver" in window)) {
        sections.forEach(function (section) {
            section.classList.add("visible");
        });
        return;
    }

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(function (section) {
        observer.observe(section);
    });
}

function startApp() {
    document.documentElement.classList.add("js");

    setupSectionAnimation();

    updateWatchTime();
    setInterval(updateWatchTime, 1000);

    setWatchColor(FREE_COLORS.Black, "Black");
    updateVariant();
    updateStrapStyle();
    updateEngraving();
    renderCart();
    setLockedState(true);

    showcaseAnimation = playLottie(showcaseBox, LOTTIE_SHOWCASE_URL, true, true);

    showMessage("Customize your product and add it to the cart.", "info");
}

startApp();