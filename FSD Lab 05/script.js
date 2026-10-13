/* =====================================================================
   Interactive Product Configurator - jQuery version
   ---------------------------------------------------------------------
   Question 1: product controls, customization inputs, messages and other
   interface elements are handled with jQuery (Lab Manual Parts 1-7):

     $("#id")            -> element selection (ID / class / element)
     .val()              -> reading and setting form values
     .text() / .html()   -> changing content
     .click() / .on()    -> event handling
     .addClass() ...     -> DOM manipulation
     $.each() / .append()-> looping and building elements

   The application logic is unchanged; only the way the DOM is selected,
   read, modified and listened to has moved from plain JavaScript to jQuery.
   ===================================================================== */

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

    /* ---------- jQuery element selection (ID selectors) ---------- */

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
    const swatches = $(".swatch");                 // class selector
    const diamondToggle = $("#diamondToggle");
    const glowToggle = $("#glowToggle");
    const extendedToggle = $("#extendedToggle");
    const fontButtons = $(".font-btn");            // class selector

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

    /* ---------- Messages and modal ---------- */

    function showMessage(text, type, showUpgrade) {
        messageText.text(text);
        message.attr("class", "toast " + (type || "info"));
        messageUpgrade.toggleClass("hidden", !showUpgrade);

        // restart the toast animation
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

    /* ---------- Lottie animations ---------- */

    // container is a jQuery object; Lottie needs the raw DOM element ([0])
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

    /* ---------- Copy / cut protection on the description ---------- */

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

    /* ---------- Real-time product preview updates ---------- */

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

    /* ---------- Customization controls ---------- */

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

    /* ---------- Interactive preview (hover, tilt, crown, screen) ---------- */

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

    /* ---------- Shopping cart ---------- */

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

    /* ---------- Drag and drop ---------- */

    // jQuery wraps the browser event, so dataTransfer lives on originalEvent
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
        // ignore the event while the pointer is still inside the drop area
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

    /* ---------- Video and animation controls ---------- */

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

    /* ---------- Premium features ---------- */

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

    // guardPremium is wrapped so its return value never reaches jQuery
    // (a handler returning false would also stop propagation in jQuery)
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

    /* ---------- Payment form ---------- */

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

    /* ---------- Reset customization ---------- */

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

    /* ---------- Navigation ---------- */

    menuToggle.click(function () {
        mainNav.toggleClass("open");
    });

    mainNav.on("click", function (event) {
        if (event.target.tagName === "A") {
            mainNav.removeClass("open");
        }
    });

    /* ---------- Section reveal animation ---------- */

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

    /* ---------- Start ---------- */

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