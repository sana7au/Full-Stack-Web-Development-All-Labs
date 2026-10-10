$(document).ready(function () {
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
    const menuToggle = $("#menuToggle");
    const mainNav = $("#mainNav");
    const statusBadge = $("#statusBadge");
    const cartCount = $("#cartCount");
    const productCard = $("#productCard");
    const preview = $("#preview");
    const previewInner = $("#previewInner");
    const glare = $("#glare");
    const hoverInfo = $("#hoverInfo");
    const watchSvg = $("#watchSvg");
    const screenFace = $("#screenFace");
    const crown = $("#crown");
    const timeText = $("#timeText");
    const engraveText = $("#engraveText");
    const productName = $("#productName");
    const productPrice = $("#productPrice");
    const productDescription = $("#productDescription");
    const customForm = $("#customForm");
    const colorSelect = $("#colorSelect");
    const variantSelect = $("#variantSelect");
    const styleSelect = $("#styleSelect");
    const nameInput = $("#nameInput");
    const nameCounter = $("#nameCounter");
    const nameError = $("#nameError");
    const fieldTip = $("#fieldTip");
    const addToCartBtn = $("#addToCartBtn");
    const configSummary = $("#configSummary");
    const cartDrop = $("#cartDrop");
    const cartEmpty = $("#cartEmpty");
    const cartMessage = $("#cartMessage");
    const cartList = $("#cartList");
    const cartTotal = $("#cartTotal");
    const clearCartBtn = $("#clearCartBtn");
    const adVideo = $("#adVideo");
    const videoStatus = $("#videoStatus");
    const showcaseBox = $("#showcaseAnimation");
    const animPlay = $("#animPlay");
    const animPause = $("#animPause");
    const premiumControls = $("#premiumControls");
    const premiumState = $("#premiumState");
    const premiumBadge = $("#premiumBadge");
    const swatches = $(".swatch");
    const diamondToggle = $("#diamondToggle");
    const glowToggle = $("#glowToggle");
    const extendedToggle = $("#extendedToggle");
    const fontButtons = $(".font-btn");
    const upgradeBtn = $("#upgradeBtn");
    const paymentForm = $("#paymentForm");
    const cardName = $("#cardName");
    const cardNumber = $("#cardNumber");
    const expiry = $("#expiry");
    const cvv = $("#cvv");
    const payBtn = $("#payBtn");
    const paymentMessage = $("#paymentMessage");
    const message = $("#message");
    const messageText = $("#messageText");
    const messageUpgrade = $("#messageUpgrade");
    const messageClose = $("#messageClose");
    const successModal = $("#successModal");
    const successBox = $("#successAnimation");
    const modalTitle = $("#modalTitle");
    const modalText = $("#modalText");
    const modalClose = $("#modalClose");
    const resetAllBtn = $("#resetAllBtn");
    function showMessage(text, type, showUpgrade) {
        messageText.text(text);
        message.attr("class", "toast " + (type || "info"));
        messageUpgrade.toggleClass("hidden", !showUpgrade);
        message.css("animation", "none");
        void message[0].offsetWidth;
        message.css("animation", "");
        clearTimeout(messageTimer);
        messageTimer = setTimeout(hideMessage, 6000);
    }
    function hideMessage() {
        message.addClass("hidden");
    }
    function openModal(title, text) {
        modalTitle.text(title);
        modalText.text(text);
        successModal.removeClass("hidden");
        if (successAnimation) {
            successAnimation.destroy();
        }
        successAnimation = playLottie(successBox, LOTTIE_SUCCESS_URL, false, true);
        modalClose.trigger("focus");
    }
    function closeModal() {
        successModal.addClass("hidden");
        if (successAnimation) {
            successAnimation.destroy();
            successAnimation = null;
        }
    }
    messageClose.click(hideMessage);
    modalClose.click(closeModal);
    successModal.on("click", function (event) {
        if (event.target === successModal[0]) {
            closeModal();
        }
    });
    $(document).on("keydown", function (event) {
        if (event.key === "Escape") {
            closeModal();
        }
    });
    messageUpgrade.click(goToPayment);
    function goToPayment() {
        $("#payment")[0].scrollIntoView({ behavior: "smooth" });
        setTimeout(function () {
            cardName.trigger("focus");
        }, 600);
    }
    function playLottie(container, path, loop, autoplay) {
        const fallbackHtml = '<div class="check-fallback">✓</div>';
        container.empty();
        if (typeof lottie === "undefined") {
            container.html(fallbackHtml);
            return null;
        }
        const animation = lottie.loadAnimation({
            container: container[0],
            renderer: "svg",
            loop: loop,
            autoplay: autoplay,
            path: path
        });
        animation.addEventListener("data_failed", function () {
            animation.addEventListener("DOMLoaded", function () { console.log("Lottie loaded:", container.attr("id")); });
            animation.addEventListener("data_failed", function () { console.log("Lottie FAILED:", container.attr("id")); });
            container.html(fallbackHtml);
        });
        return animation;
    }
    $.each(["copy", "cut"], function (index, action) {
        productDescription.on(action, function (event) {
            event.preventDefault();
            if (action === "copy") {
                showMessage("Copying the product description is not allowed.", "error");
            } else {
                showMessage("Cutting the product description is not allowed.", "error");
            }
        });
    });
    function getEngravingLimit() {
        return extendedToggle.is(":checked") ? EXTENDED_LIMIT : NORMAL_LIMIT;
    }
    function setWatchColor(hex, name) {
        watchSvg.css("--strap-color", hex);
        currentColorName = name;
        updateSummary();
    }
    function clearSwatches() {
        swatches.removeClass("active");
    }
    function updateVariant() {
        const variant = VARIANTS[variantSelect.val()];
        watchSvg.css("--watch-scale", String(variant.scale));
        productPrice.text("$" + variant.price);
        updateSummary();
    }
    function updateStrapStyle() {
        watchSvg.removeClass("style-sport style-leather style-metal");
        watchSvg.addClass("style-" + styleSelect.val());
        updateSummary();
    }
    function updateEngraving() {
        const limit = getEngravingLimit();
        const value = nameInput.val();
        const length = value.length;
        if (value.trim() === "") {
            engraveText.text("Your Name");
            engraveText.addClass("placeholder");
            productName.text("None");
        } else {
            engraveText.text(value);
            engraveText.removeClass("placeholder");
            productName.text(value);
        }
        const fontSize = Math.max(5, 13 - length * 0.25);
        engraveText.css("font-size", fontSize + "px");
        nameCounter.removeClass("warn full");
        if (length >= limit) {
            nameCounter.text(length + " / " + limit + " characters (limit reached)");
            nameCounter.addClass("full");
        } else if (length >= limit * 0.8) {
            nameCounter.text(length + " / " + limit + " characters (almost full)");
            nameCounter.addClass("warn");
        } else {
            nameCounter.text(length + " / " + limit + " characters");
        }
        updateSummary();
    }
    function updateSummary() {
        const variant = VARIANTS[variantSelect.val()];
        const styleName = styleSelect.find("option:selected").text();
        const engraving = nameInput.val().trim() === "" ? "none" : nameInput.val().trim();
        configSummary.text(
            "Current design: " + currentColorName + ", " + variant.label +
            ", " + styleName + ", engraving: " + engraving
        );
    }
    function setNameError(text) {
        nameError.text(text);
        nameInput.toggleClass("invalid", text !== "");
    }
    colorSelect.on("change", function () {
        clearSwatches();
        setWatchColor(FREE_COLORS[colorSelect.val()], colorSelect.val());
        showMessage("Color changed to " + colorSelect.val() + ".", "info");
    });
    variantSelect.on("change", function () {
        updateVariant();
        showMessage("Variant changed to " + VARIANTS[variantSelect.val()].label + ".", "info");
    });
    styleSelect.on("change", function () {
        updateStrapStyle();
        showMessage("Strap style updated.", "info");
    });
    nameInput.on("input", function () {
        setNameError("");
        updateEngraving();
    });
    nameInput.on("focus", function () {
        fieldTip.text("Enter your custom name or engraving (max " + getEngravingLimit() + " characters).");
    });
    nameInput.on("blur", function () {
        if (nameInput.val().trim() === "") {
            fieldTip.text("No engraving entered.");
        } else {
            fieldTip.text("Engraving saved on the preview.");
        }
    });
    customForm.on("submit", function (event) {
        event.preventDefault();
        const value = nameInput.val().trim();
        if (value === "") {
            setNameError("Please enter a name or engraving.");
            showMessage("Please enter a custom name before applying.", "error");
            nameInput.trigger("focus");
            return;
        }
        if (value.length < 2) {
            setNameError("Enter at least 2 characters.");
            nameInput.trigger("focus");
            return;
        }
        if (!/^[A-Za-z0-9 .'-]+$/.test(value)) {
            setNameError("Use only letters, numbers, spaces, . ' or -");
            nameInput.trigger("focus");
            return;
        }
        setNameError("");
        updateSummary();
        showMessage("✓ Customization applied successfully!", "success");
        openModal("Customization Saved!", "Your Chronos Smart Watch is ready: " + currentColorName + ", engraved with \"" + value + "\".");
    });
    const defaultHoverText = "Move your mouse over the watch";
    preview.on("mouseenter", function () {
        preview.addClass("active");
        hoverInfo.text("Nice! Move around to tilt the watch.");
    });
    preview.on("mousemove", function (event) {
        const rect = preview[0].getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const rotateY = ((x - rect.width / 2) / (rect.width / 2)) * 14;
        const rotateX = -((y - rect.height / 2) / (rect.height / 2)) * 14;
        previewInner.css("transform", "rotateX(" + rotateX + "deg) rotateY(" + rotateY + "deg)");
        glare.css("background",
            "radial-gradient(circle at " + x + "px " + y + "px, rgba(255,255,255,0.22), transparent 55%)");
    });
    preview.on("mouseleave", function () {
        preview.removeClass("active");
        previewInner.css("transform", "");
        glare.css("background", "none");
        hoverInfo.text(defaultHoverText);
    });
    watchSvg.on("mouseover", function (event) {
        const part = $(event.target).closest("[data-hint]");
        if (part.length > 0) {
            hoverInfo.text(part.attr("data-hint"));
        }
    });
    crown.click(function () {
        displayColorIndex = (displayColorIndex + 1) % DISPLAY_COLORS.length;
        timeText.css("fill", DISPLAY_COLORS[displayColorIndex]);
        crown.addClass("pressed");
        setTimeout(function () {
            crown.removeClass("pressed");
        }, 200);
    });
    screenFace.click(function () {
        screenFace.removeClass("pulse");
        void screenFace[0].getBoundingClientRect();
        screenFace.addClass("pulse");
        hoverInfo.text("Heart rate: 72 bpm");
    });
    function updateWatchTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        if (hours < 10) { hours = "0" + hours; }
        if (minutes < 10) { minutes = "0" + minutes; }
        timeText.text(hours + ":" + minutes);
    }
    const defaultCartText = "Your cart is empty. Drag the product card here.";
    function getActiveExtras() {
        const extras = [];
        if (diamondToggle.is(":checked")) { extras.push("Diamond bezel"); }
        if (glowToggle.is(":checked")) { extras.push("Glow effect"); }
        if (extendedToggle.is(":checked")) { extras.push("Extended engraving"); }
        return extras;
    }
    function addToCart() {
        const variant = VARIANTS[variantSelect.val()];
        const engraving = nameInput.val().trim();
        const item = {
            id: Date.now() + Math.random(),
            color: currentColorName,
            variant: variant.label,
            style: styleSelect.find("option:selected").text(),
            engraving: engraving === "" ? "None" : engraving,
            extras: getActiveExtras(),
            price: variant.price
        };
        cart.push(item);
        renderCart();
        cartDrop.addClass("added");
        setTimeout(function () {
            cartDrop.removeClass("added");
        }, 700);
        showMessage("✓ Smart Watch added to cart!", "success");
    }
    function renderCart() {
        cartList.empty();
        let total = 0;
        $.each(cart, function (index, item) {
            total += item.price;
            const li = $("<li>").addClass("cart-item");
            const info = $("<div>");
            const title = $("<strong>").text("Smart Watch - " + item.variant);
            const details = $("<small>").text(
                "Color: " + item.color +
                " | Strap: " + item.style +
                " | Engraving: " + item.engraving +
                (item.extras.length > 0 ? " | Extras: " + item.extras.join(", ") : "")
            );
            info.append(title, details);
            const price = $("<span>").addClass("item-price").text("$" + item.price);
            const removeBtn = $("<button>")
                .attr("type", "button")
                .addClass("remove-btn")
                .text("Remove")
                .click(function () {
                    cart = cart.filter(function (cartItem) {
                        return cartItem.id !== item.id;
                    });
                    renderCart();
                    showMessage("Item removed from cart.", "info");
                });
            li.append(info, price, removeBtn);
            cartList.append(li);
        });
        cartTotal.text("$" + total);
        cartCount.text(cart.length);
        cartEmpty.toggleClass("hidden", cart.length > 0);
        cartMessage.text(defaultCartText);
    }
    productCard.on("dragstart", function (event) {
        const dataTransfer = event.originalEvent.dataTransfer;
        dataTransfer.setData("text/plain", "smart-watch");
        dataTransfer.effectAllowed = "copy";
        productCard.addClass("dragging");
        showMessage("Dragging the product. Drop it in the cart!", "info");
    });
    productCard.on("dragend", function () {
        productCard.removeClass("dragging");
    });
    cartDrop.on("dragover", function (event) {
        event.preventDefault();
        cartDrop.addClass("drag-over");
        cartMessage.text("Drop the product here!");
        cartEmpty.removeClass("hidden");
    });
    cartDrop.on("dragleave", function (event) {
        if ($(event.relatedTarget).closest(cartDrop).length > 0) {
            return;
        }
        cartDrop.removeClass("drag-over");
        cartEmpty.toggleClass("hidden", cart.length > 0);
        cartMessage.text(defaultCartText);
    });
    cartDrop.on("drop", function (event) {
        event.preventDefault();
        cartDrop.removeClass("drag-over");
        addToCart();
    });
    addToCartBtn.click(addToCart);
    clearCartBtn.click(function () {
        cart = [];
        renderCart();
        showMessage("Cart cleared.", "info");
    });
    adVideo.on("play", function () {
        videoStatus.text("Advertisement is playing.");
    });
    adVideo.on("pause", function () {
        videoStatus.text("Advertisement paused.");
    });
    adVideo.on("ended", function () {
        videoStatus.text("Thanks for watching! Customize your watch above.");
    });
    animPlay.click(function () {
        if (showcaseAnimation) {
            showcaseAnimation.play();
        }
    });
    animPause.click(function () {
        if (showcaseAnimation) {
            showcaseAnimation.pause();
        }
    });
    function setLockedState(locked) {
        premiumControls.toggleClass("locked", locked);
        $(".lock-icon").text(locked ? "🔒" : "🔓");
        if (locked) {
            premiumState.text("🔒 Locked. Upgrade to unlock these features.");
        } else {
            premiumState.text("✅ Premium active. All features are unlocked.");
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
    swatches.click(function (event) {
        if (!guardPremium(event)) {
            return;
        }
        const swatch = $(this);
        clearSwatches();
        swatch.addClass("active");
        setWatchColor(swatch.data("color"), swatch.data("name"));
        showMessage("Premium color applied: " + swatch.data("name") + ".", "success");
    });
    diamondToggle.on("click", function (event) { guardPremium(event); });
    diamondToggle.on("change", function () {
        watchSvg.toggleClass("diamond", diamondToggle.is(":checked"));
        showMessage(diamondToggle.is(":checked") ? "Diamond bezel added." : "Diamond bezel removed.", "info");
    });
    glowToggle.on("click", function (event) { guardPremium(event); });
    glowToggle.on("change", function () {
        preview.toggleClass("glow", glowToggle.is(":checked"));
        showMessage(glowToggle.is(":checked") ? "Glow effect turned on." : "Glow effect turned off.", "info");
    });
    extendedToggle.on("click", function (event) { guardPremium(event); });
    extendedToggle.on("change", function () {
        const limit = getEngravingLimit();
        nameInput.prop("maxLength", limit);
        if (nameInput.val().length > limit) {
            nameInput.val(nameInput.val().substring(0, limit));
        }
        updateEngraving();
        showMessage("Engraving limit is now " + limit + " characters.", "info");
    });
    function setFont(fontName) {
        watchSvg.removeClass("font-classic font-elegant font-digital");
        watchSvg.addClass("font-" + fontName);
        fontButtons.each(function () {
            $(this).toggleClass("active", $(this).data("font") === fontName);
        });
    }
    fontButtons.click(function (event) {
        if (!guardPremium(event)) {
            return;
        }
        setFont($(this).data("font"));
        showMessage("Engraving font changed to " + $(this).text() + ".", "info");
    });
    function activatePremium() {
        isPremium = true;
        $("body").addClass("is-premium");
        statusBadge.text("★ Premium User");
        statusBadge.attr("class", "status-badge premium");
        premiumBadge.addClass("active");
        setLockedState(false);
        payBtn.text("Premium Active ✓");
        payBtn.prop("disabled", true);
        showMessage("🎉 Premium activated! All premium features are unlocked.", "success");
    }
    upgradeBtn.click(goToPayment);
    function setFieldError(input, text) {
        input.parent().find(".error").first().text(text);
        input.toggleClass("invalid", text !== "");
    }
    function clearPaymentErrors() {
        $.each([cardName, cardNumber, expiry, cvv], function (index, input) {
            setFieldError(input, "");
        });
    }
    function setPaymentMessage(text, type) {
        paymentMessage.text(text);
        paymentMessage.attr("class", "payment-message " + (type || ""));
    }
    cardName.on("input", function () {
        cardName.val(cardName.val().replace(/[^a-zA-Z ]/g, ""));
        setFieldError(cardName, "");
    });
    cardNumber.on("input", function () {
        const digits = cardNumber.val().replace(/\D/g, "").substring(0, 16);
        cardNumber.val(digits.replace(/(.{4})/g, "$1 ").trim());
        setFieldError(cardNumber, "");
    });
    expiry.on("input", function () {
        const digits = expiry.val().replace(/\D/g, "").substring(0, 4);
        if (digits.length > 2) {
            expiry.val(digits.substring(0, 2) + "/" + digits.substring(2));
        } else {
            expiry.val(digits);
        }
        setFieldError(expiry, "");
    });
    cvv.on("input", function () {
        cvv.val(cvv.val().replace(/\D/g, "").substring(0, 3));
        setFieldError(cvv, "");
    });
    function validatePayment() {
        let isValid = true;
        clearPaymentErrors();
        if (cardName.val().trim().length < 3) {
            setFieldError(cardName, "Enter the cardholder name (at least 3 letters).");
            isValid = false;
        }
        if (cardNumber.val().replace(/\s/g, "").length !== 16) {
            setFieldError(cardNumber, "Card number must contain 16 digits.");
            isValid = false;
        }
        if (!/^\d{2}\/\d{2}$/.test(expiry.val())) {
            setFieldError(expiry, "Enter the expiry date as MM/YY.");
            isValid = false;
        } else {
            const month = parseInt(expiry.val().substring(0, 2), 10);
            const year = parseInt(expiry.val().substring(3), 10);
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
        if (cvv.val().length !== 3) {
            setFieldError(cvv, "CVV must contain 3 digits.");
            isValid = false;
        }
        return isValid;
    }
    paymentForm.on("submit", function (event) {
        event.preventDefault();
        if (isPremium) {
            setPaymentMessage("You are already a Premium user.", "success");
            return;
        }
        if (!validatePayment()) {
            setPaymentMessage("Please fix the highlighted fields.", "error");
            return;
        }
        payBtn.prop("disabled", true);
        setPaymentMessage("Processing payment, please wait...", "processing");
        setTimeout(function () {
            paymentForm[0].reset();
            clearPaymentErrors();
            setPaymentMessage("✓ Payment successful! Premium is active.", "success");
            activatePremium();
            openModal("Payment Successful!", "Welcome to Chronos Premium. Your premium features are now unlocked.");
        }, 2000);
    });
    paymentForm.on("reset", function () {
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
        diamondToggle.prop("checked", false);
        watchSvg.removeClass("diamond");
        glowToggle.prop("checked", false);
        preview.removeClass("glow");
        extendedToggle.prop("checked", false);
        nameInput.prop("maxLength", NORMAL_LIMIT);
        setFont("classic");
        timeText.css("fill", "");
        displayColorIndex = 0;
        previewInner.css("transform", "");
        glare.css("background", "none");
        hoverInfo.text(defaultHoverText);
        setNameError("");
        fieldTip.text("Tip: your engraving appears on the watch while you type.");
        updateVariant();
        updateStrapStyle();
        updateEngraving();
        showMessage("Configurator has been reset.", "info");
    }
    customForm.on("reset", function () {
        setTimeout(resetCustomization, 10);
    });
    menuToggle.click(function () {
        mainNav.toggleClass("open");
    });
    mainNav.on("click", function (event) {
        if (event.target.tagName === "A") {
            mainNav.removeClass("open");
        }
    });
    function setupSectionAnimation() {
        const sections = $(".reveal");
        if (!("IntersectionObserver" in window)) {
            sections.addClass("visible");
            return;
        }
        const observer = new IntersectionObserver(function (entries) {
            $.each(entries, function (index, entry) {
                if (entry.isIntersecting) {
                    $(entry.target).addClass("visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        sections.each(function () {
            observer.observe(this);
        });
    }
    const API_URL = "https://dummyjson.com/products/";
    const apiLoadBtn = $("#apiLoadBtn");
    const apiStatus = $("#apiStatus");
    const apiGrid = $("#apiGrid");
    function setApiStatus(text, type) {
        apiStatus.text(text);
        apiStatus.attr("class", "api-status " + (type || ""));
    }
    function showApiProducts(products) {
        apiGrid.empty();
        $.each(products, function (index, product) {
            const card = $("<div>").addClass("api-card");
            const image = $("<img>").attr({ src: product.thumbnail, alt: product.title });
            image.on("error", function () {
                image.replaceWith($("<div>").addClass("api-no-image").text("Image not available"));
            });
            card.append(image);
            card.append($("<h3>").text(product.title));
            card.append($("<p>").addClass("api-category").text("Category: " + product.category));
            card.append($("<p>").addClass("api-price").text("$" + product.price));
            card.append($("<p>").addClass("api-description").text(product.description));
            apiGrid.append(card);
        });
    }
    function loadProducts() {
        const url = API_URL;
        console.log("Request: GET " + url);
        apiLoadBtn.prop("disabled", true);
        apiGrid.empty();
        setApiStatus("Sending GET request to " + url + " ...", "loading");
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            timeout: 10000,
            success: function (response) {
                console.log("Response (JSON):", response);
                if (!response.products || response.products.length === 0) {
                    setApiStatus("The API responded, but no products were found.", "error");
                    showMessage("No products found for this category.", "error");
                    return;
                }
                showApiProducts(response.products);
                setApiStatus("Success: " + response.products.length + " products received and displayed.", "success");
                showMessage("✓ Products loaded from the API.", "success");
            },
            error: function (xhr, status, error) {
                console.log("Request failed:", status, error, xhr.status);
                let reason = "Something went wrong while loading products.";
                if (status === "timeout") {
                    reason = "The request timed out. Please try again.";
                } else if (xhr.status === 0) {
                    reason = "Network error. Check your internet connection.";
                } else if (xhr.status === 404) {
                    reason = "Products not found (error 404).";
                } else if (xhr.status >= 500) {
                    reason = "The API server has a problem (error " + xhr.status + ").";
                } else if (status === "parsererror") {
                    reason = "The API returned invalid data.";
                }
                setApiStatus("Failed: " + reason, "error");
                showMessage("Could not load products. " + reason, "error");
            },
            complete: function () {
                apiLoadBtn.prop("disabled", false);
            }
        });
    }
    apiLoadBtn.click(loadProducts);
    const BACKEND_URL = "http://localhost:3000";
    const backendGetBtn = $("#backendGetBtn");
    const backendPostBtn = $("#backendPostBtn");
    const backendStatus = $("#backendStatus");
    const backendProduct = $("#backendProduct");
    const backendLog = $("#backendLog");
    function setBackendStatus(text, type) {
        backendStatus.text(text);
        backendStatus.attr("class", "api-status " + (type || ""));
    }
    function getBackendErrorReason(xhr, status) {
        if (status === "timeout") {
            return "The request timed out.";
        }
        if (xhr.status === 0) {
            return "Cannot reach the backend. Make sure it is running on " + BACKEND_URL + " (node server.js).";
        }
        if (xhr.responseJSON && xhr.responseJSON.message) {
            return xhr.responseJSON.message + " (error " + xhr.status + ")";
        }
        return "The backend returned error " + xhr.status + ".";
    }
    function showBackendProduct(product) {
        const variants = $.map(product.variants, function (variant) {
            return variant.label + " ($" + variant.price + ")";
        });
        backendProduct.empty();
        backendProduct.append($("<h3>").text(product.name));
        backendProduct.append($("<p>").addClass("price").text("From $" + product.basePrice));
        backendProduct.append($("<p>").addClass("description").text(product.description));
        backendProduct.append($("<p>").text("Colors: " + product.colors.join(", ")));
        backendProduct.append($("<p>").text("Variants: " + variants.join(", ")));
        backendProduct.append($("<p>").text("Strap styles: " + product.strapStyles.join(", ")));
        const list = $("<ul>");
        $.each(product.features, function (index, feature) {
            list.append($("<li>").text(feature));
        });
        backendProduct.append(list);
    }
    function loadBackendProduct() {
        const url = BACKEND_URL + "/api/products";
        console.log("Request: GET " + url);
        backendGetBtn.prop("disabled", true);
        setBackendStatus("Sending GET request to " + url + " ...", "loading");
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            timeout: 10000,
            success: function (response) {
                console.log("Response (JSON):", response);
                backendLog.text("GET " + url + "\n\nResponse:\n" + JSON.stringify(response, null, 2));
                if (!response || response.length === 0) {
                    setBackendStatus("The backend responded, but no products were found.", "error");
                    return;
                }
                showBackendProduct(response[0]);
                setBackendStatus("Success: product information received from the backend.", "success");
                showMessage("✓ Product info loaded from the backend.", "success");
            },
            error: function (xhr, status, error) {
                console.log("GET request failed:", status, error, xhr.status);
                const reason = getBackendErrorReason(xhr, status);
                backendLog.text("GET " + url + "\n\nFailed: " + reason);
                setBackendStatus("Failed: " + reason, "error");
                showMessage("Could not load product info. " + reason, "error");
            },
            complete: function () {
                backendGetBtn.prop("disabled", false);
            }
        });
    }
    function getCurrentConfiguration() {
        const variant = VARIANTS[variantSelect.val()];
        const engraving = nameInput.val().trim();
        return {
            productName: $("#productTitle").text(),
            color: currentColorName,
            variant: variant.label,
            strapStyle: styleSelect.find("option:selected").text(),
            engraving: engraving === "" ? "None" : engraving,
            extras: getActiveExtras(),
            price: variant.price
        };
    }
    function submitConfiguration() {
        const url = BACKEND_URL + "/api/configurations";
        const configuration = getCurrentConfiguration();
        const jsonData = JSON.stringify(configuration);
        console.log("Request: POST " + url);
        console.log("JavaScript object:", configuration);
        console.log("JSON string sent in the request body:", jsonData);
        backendPostBtn.prop("disabled", true);
        setBackendStatus("Sending POST request to " + url + " ...", "loading");
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/json",
            data: jsonData,
            dataType: "json",
            timeout: 10000,
            success: function (response) {
                console.log("Response (JSON):", response);
                backendLog.text(
                    "POST " + url + "\n\nRequest body:\n" + JSON.stringify(configuration, null, 2) +
                    "\n\nResponse:\n" + JSON.stringify(response, null, 2)
                );
                setBackendStatus(response.message + " (ID: " + response.configuration.id + ")", "success");
                showMessage("✓ " + response.message, "success");
            },
            error: function (xhr, status, error) {
                console.log("POST request failed:", status, error, xhr.status);
                const reason = getBackendErrorReason(xhr, status);
                backendLog.text("POST " + url + "\n\nRequest body:\n" + JSON.stringify(configuration, null, 2) + "\n\nFailed: " + reason);
                setBackendStatus("Failed: " + reason, "error");
                showMessage("Could not submit configuration. " + reason, "error");
            },
            complete: function () {
                backendPostBtn.prop("disabled", false);
            }
        });
    }
    backendGetBtn.click(loadBackendProduct);
    backendPostBtn.click(submitConfiguration);
    function startApp() {
        $("html").addClass("js");
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
});