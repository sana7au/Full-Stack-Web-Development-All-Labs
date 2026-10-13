$(document).ready(function () {
    const API_URL = "http://localhost:3000/api/designs";
    const PAYMENTS_URL = "http://localhost:3000/api/payments";
    const NORMAL_LIMIT = 20;
    const EXTENDED_LIMIT = 40;
    const FREE_COLORS = { Black: "#2b2b2b", Blue: "#1f5fbf", Red: "#c0392b", Green: "#2e8b57" };
    const VARIANTS = {
        standard: { label: "Standard 40mm", price: 120 },
        sport: { label: "Sport 44mm", price: 150 },
        lite: { label: "Lite 38mm", price: 99 }
    };
    const STRAPS = { sport: "Sport Band", leather: "Leather Stitch", metal: "Metal Link" };
    let selectedImageData = "";
    let selectedImageType = "";
    let currentColorName = "Black";
    let isPremium = false;
    let editingDesignId = null;
    let messageTimer;

    const message = $("#message");
    function showMessage(text, type) {
        $("#messageText").text(text);
        message.attr("class", "toast " + (type || "info"));
        clearTimeout(messageTimer);
        messageTimer = setTimeout(function () { message.addClass("hidden"); }, 5000);
    }
    function setStatus(selector, text, type) {
        $(selector).text(text).attr("class", "api-status " + (type || ""));
    }
    function variantInfo() { return VARIANTS[$("#variantSelect").val()] || VARIANTS.standard; }
    function extras() {
        const result = [];
        if ($("#diamondToggle").is(":checked")) result.push("Diamond bezel");
        if ($("#glowToggle").is(":checked")) result.push("Glow effect");
        if ($("#extendedToggle").is(":checked")) result.push("Extended engraving");
        return result;
    }
    function updateSummary() {
        const variant = variantInfo();
        const engraving = $("#nameInput").val().trim() || "None";
        const strap = $("#styleSelect option:selected").text();
        $("#productTitle").text($("#productNameInput").val().trim() || "Chronos Smart Watch");
        $("#productName").text(engraving);
        $("#productPrice").text("$" + variant.price);
        $("#configSummary").text("Current design: " + currentColorName + ", " + variant.label + ", " + strap + ", engraving: " + engraving + (extras().length ? ", extras: " + extras().join(", ") : ""));
    }
    function setNameError(text) { $("#nameError").text(text); $("#nameInput").toggleClass("invalid", !!text); }
    function setPremiumLocked(locked) {
        $("#premiumControls").toggleClass("locked", locked);
        $(".lock-icon").text(locked ? "🔒" : "🔓");
        $("#premiumState").text(locked ? "🔒 Locked. Upgrade to unlock these features." : "✅ Premium active. All features are unlocked.");
    }
    function premiumGuard(event) {
        if (isPremium) return true;
        event.preventDefault();
        showMessage("Premium feature. Use the demo upgrade section to unlock it.", "error");
        return false;
    }
    function setEditingMode(id, name) {
        editingDesignId = id;
        if (id === null) {
            $("#saveDesignBtn").text("Add to Database");
            $("#cancelEditBtn").prop("hidden", true);
            setStatus("#saveStatus", "Ready to save a new design.", "");
        } else {
            $("#saveDesignBtn").text("Save Changes to Same Database Entry");
            $("#cancelEditBtn").prop("hidden", false);
            setStatus("#saveStatus", "Editing database entry ID " + id + ". Click Save Changes to update this same entry.", "success");
            showMessage("Edit mode: go to the upper Customize Watch card, make changes, then click Save Changes to update the same database entry.", "info");
        }
    }
    function setImagePreview(imageData, imageType) {
        selectedImageData = imageData || "";
        selectedImageType = imageType || "";
        if (selectedImageData) {
            $("#watchImagePreview").attr("src", selectedImageData).prop("hidden", false);
            $("#imagePlaceholder").hide();
        } else {
            $("#watchImagePreview").attr("src", "").prop("hidden", true);
            $("#imagePlaceholder").show();
        }
        // A saved image is already loaded in memory; clear the file input to avoid confusion.
        $("#watchImageInput").val("");
    }

    $("#watchImageInput").on("change", function () {
        const file = this.files[0];
        $("#imageError").text("");
        if (!file) return;
        if (!file.type.startsWith("image/")) {
            $("#imageError").text("Please choose an image file."); this.value = ""; return;
        }
        if (file.size > 2 * 1024 * 1024) {
            $("#imageError").text("Please choose an image smaller than 2 MB."); this.value = ""; return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            selectedImageData = event.target.result;
            selectedImageType = file.type;
            $("#watchImagePreview").attr("src", selectedImageData).prop("hidden", false);
            $("#imagePlaceholder").hide();
            $("#hoverInfo").text("Selected image: " + file.name);
        };
        reader.onerror = function () { $("#imageError").text("Could not read this image. Please select it again."); };
        reader.readAsDataURL(file);
    });

    $("#colorSelect").on("change", function () {
        currentColorName = $(this).val();
        $("#preview").css("border", "2px solid " + (FREE_COLORS[currentColorName] || "#d4af37"));
        $(".swatch").removeClass("active");
        updateSummary();
    });
    $("#variantSelect, #styleSelect, #productNameInput").on("change input", updateSummary);
    $("#nameInput").on("input", function () {
        const limit = $(this).attr("maxlength");
        $("#nameCounter").text(this.value.length + " / " + limit + " characters");
        setNameError(""); updateSummary();
    });
    $("#customForm").on("submit", function (event) {
        event.preventDefault();
        const name = $("#nameInput").val().trim();
        if (name && (name.length < 2 || !/^[A-Za-z0-9 .'-]+$/.test(name))) {
            setNameError("Use at least 2 letters/numbers and only . ' or - characters."); return;
        }
        setNameError(""); updateSummary(); showMessage("Customization applied.", "success");
    });
    $("#customForm").on("reset", function () {
        setTimeout(function () {
            selectedImageData = ""; selectedImageType = ""; editingDesignId = null;
            $("#watchImageInput").val(""); $("#watchImagePreview").attr("src", "").prop("hidden", true);
            $("#imagePlaceholder").show(); $("#imageError").text("");
            currentColorName = "Black"; $("#colorSelect").val("Black"); $("#preview").css("border", "2px solid " + FREE_COLORS.Black);
            $("#variantSelect").val("standard"); $("#styleSelect").val("sport");
            $("#productNameInput").val("Chronos Smart Watch"); $("#nameInput").val("").attr("maxlength", NORMAL_LIMIT);
            $("#nameCounter").text("0 / 20 characters"); $("#diamondToggle, #glowToggle, #extendedToggle").prop("checked", false);
            $(".font-btn").removeClass("active").filter('[data-font="classic"]').addClass("active");
            $("#watchImagePreview").css("font-family", ""); setNameError(""); setEditingMode(null); updateSummary();
        }, 0);
    });

    function collectDesign() {
        const productName = $("#productNameInput").val().trim();
        if (!selectedImageData) {
            setStatus("#saveStatus", "Please choose a watch image before saving.", "error");
            $("#imageError").text("Choose an image first."); return null;
        }
        if (!productName) {
            setStatus("#saveStatus", "Watch name is required.", "error"); $("#productNameInput").trigger("focus"); return null;
        }
        const variant = variantInfo();
        return {
            productName: productName,
            productType: "Smart Watch",
            color: currentColorName,
            variant: variant.label,
            strapStyle: $("#styleSelect option:selected").text(),
            engraving: $("#nameInput").val().trim() || "None",
            extras: extras(),
            price: variant.price,
            imageData: selectedImageData,
            imageType: selectedImageType
        };
    }
    $("#saveDesignBtn").on("click", function () {
        const design = collectDesign();
        if (!design) return;
        const isEditing = editingDesignId !== null;
        const button = $(this).prop("disabled", true);
        setStatus("#saveStatus", isEditing ? "Updating the existing database entry..." : "Saving design to MySQL database...", "");
        $.ajax({
            url: isEditing ? API_URL + "/" + editingDesignId : API_URL,
            method: isEditing ? "PUT" : "POST",
            contentType: "application/json", data: JSON.stringify(design), dataType: "json", timeout: 20000,
            success: function (response) {
                const savedId = response.design.id;
                setStatus("#saveStatus", (isEditing ? "Updated existing design" : "Saved new design") + " successfully. Design ID: " + savedId, "success");
                showMessage(isEditing ? "Changes saved to the same database entry (ID " + savedId + ")." : "Watch design saved to database.", "success");
                setEditingMode(null);
                $("#loadDesignsBtn").trigger("click");
            },
            error: function (xhr) {
                const reason = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : "Cannot connect to the database server. Check that Node.js and MySQL are running.";
                setStatus("#saveStatus", "Save failed: " + reason, "error");
            },
            complete: function () { button.prop("disabled", false); }
        });
    });
    $("#cancelEditBtn").on("click", function () { setEditingMode(null); showMessage("Edit cancelled. No database changes were made.", "info"); });

    function loadDesignIntoConfigurator(design) {
        setImagePreview(design.imageData, design.imageType);
        $("#productNameInput").val(design.productName);
        const basicColor = Object.prototype.hasOwnProperty.call(FREE_COLORS, design.color);
        $("#colorSelect").val(basicColor ? design.color : "Black");
        currentColorName = design.color;
        $("#preview").css("border", "2px solid " + (FREE_COLORS[design.color] || "#d4af37"));
        $(".swatch").removeClass("active").filter('[data-name="' + design.color.replace(/"/g, '\\"') + '"]').addClass("active");
        const variantKey = Object.keys(VARIANTS).find(function (key) { return VARIANTS[key].label === design.variant; });
        if (variantKey) $("#variantSelect").val(variantKey);
        const strapKey = Object.keys(STRAPS).find(function (key) { return STRAPS[key] === design.strapStyle; });
        if (strapKey) $("#styleSelect").val(strapKey);
        const engraving = design.engraving === "None" ? "" : (design.engraving || "");
        $("#nameInput").val(engraving);
        const extraList = Array.isArray(design.extras) ? design.extras : [];
        $("#diamondToggle").prop("checked", extraList.includes("Diamond bezel"));
        $("#glowToggle").prop("checked", extraList.includes("Glow effect"));
        $("#extendedToggle").prop("checked", extraList.includes("Extended engraving"));
        $("#nameInput").attr("maxlength", extraList.includes("Extended engraving") ? EXTENDED_LIMIT : NORMAL_LIMIT);
        $("#nameCounter").text(engraving.length + " / " + $("#nameInput").attr("maxlength") + " characters");
        $("#preview").toggleClass("glow", extraList.includes("Glow effect"));
        $(".font-btn").removeClass("active").filter('[data-font="classic"]').addClass("active");
        $("#imageError").text(""); setNameError(""); updateSummary();
    }

    function openSavedImage(design) {
        $("#largeSavedImage").attr("src", design.imageData).attr("alt", design.productName);
        $("#largeSavedTitle").text(design.productName);
        $("#largeSavedDetails").text(design.productType + " | " + design.color + " | " + design.variant + " | " + design.strapStyle + " | Engraving: " + design.engraving + " | $" + Number(design.price).toFixed(2));
        $("#imageModal").removeClass("hidden");
    }
    function renderDesigns(designs) {
        const grid = $("#designsGrid").empty();
        if (!designs.length) { setStatus("#designsStatus", "The database has no saved watch designs yet.", "success"); return; }
        $.each(designs, function (_, design) {
            const card = $("<article>").addClass("saved-design-card");
            const image = $("<img>").attr({ src: design.imageData, alt: design.productName, title: "Click to view image" }).on("click", function () { openSavedImage(design); });
            const title = $("<h3>").text(design.productName);
            const details = $("<p>").text(design.productType + " | " + design.color + " | " + design.variant);
            const strap = $("<p>").text("Strap: " + design.strapStyle + " | Engraving: " + design.engraving);
            const price = $("<p>").addClass("saved-price").text("$" + Number(design.price).toFixed(2));
            const id = $("<p>").text("Database ID: " + design.id);
            const actions = $("<div>").addClass("button-row");
            const choose = $("<button>").attr("type", "button").addClass("btn secondary").text("Select This Image").on("click", function () {
                loadDesignIntoConfigurator(design);
                setEditingMode(null);
                $("#product")[0].scrollIntoView({ behavior: "smooth" });
                showMessage("Saved watch loaded into the configurator for viewing. Use Edit on its card to update the database entry.", "success");
            });
            const edit = $("<button>").attr("type", "button").addClass("btn primary").text("Edit").on("click", function () {
                loadDesignIntoConfigurator(design);
                setEditingMode(Number(design.id), design.productName);
                $("#product")[0].scrollIntoView({ behavior: "smooth" });
            });
            const remove = $("<button>").attr("type", "button").addClass("btn ghost").text("Delete").on("click", function () {
                if (!window.confirm('Delete "' + design.productName + '" (database ID ' + design.id + ')? This cannot be undone.')) return;
                remove.prop("disabled", true);
                $.ajax({
                    url: API_URL + "/" + design.id, method: "DELETE", dataType: "json", timeout: 15000,
                    success: function () {
                        if (editingDesignId === Number(design.id)) setEditingMode(null);
                        showMessage("Design ID " + design.id + " deleted from the database.", "success");
                        $("#loadDesignsBtn").trigger("click");
                    },
                    error: function (xhr) {
                        const reason = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : "Could not connect to the server.";
                        showMessage("Delete failed: " + reason, "error"); remove.prop("disabled", false);
                    }
                });
            });
            actions.append(choose, edit, remove);
            card.append(image, title, details, strap, price, id, actions); grid.append(card);
        });
        setStatus("#designsStatus", designs.length + " saved design(s) loaded. Use Edit to update a row or Delete to remove it from MySQL.", "success");
    }
    $("#loadDesignsBtn").on("click", function () {
        const button = $(this).prop("disabled", true);
        setStatus("#designsStatus", "Loading saved designs from the database...", "");
        $.ajax({
            url: API_URL, method: "GET", dataType: "json", timeout: 15000,
            success: renderDesigns,
            error: function (xhr) {
                const reason = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : "Cannot connect to the database server. Check server.js and MySQL.";
                setStatus("#designsStatus", "Could not load designs: " + reason, "error");
            },
            complete: function () { button.prop("disabled", false); }
        });
    });

    $("#imageModalClose").on("click", function () { $("#imageModal").addClass("hidden"); $("#largeSavedImage").attr("src", ""); });
    $("#imageModal").on("click", function (event) { if (event.target === this) $(this).addClass("hidden"); });
    $("#messageClose").on("click", function () { message.addClass("hidden"); });

    // Premium remains a local demo feature; payment records do not represent real transactions.
    $("#upgradeBtn").on("click", function () { $("#payment")[0].scrollIntoView({ behavior: "smooth" }); });
    $("#premiumControls").on("click", "input, button", function (event) {
        if (!isPremium) { event.preventDefault(); showMessage("Premium feature is locked. Use the demo payment form below.", "error"); }
    });
    $(".swatch").on("click", function (event) {
        if (!premiumGuard(event)) return;
        currentColorName = $(this).data("name");
        if (Object.prototype.hasOwnProperty.call(FREE_COLORS, currentColorName)) $("#colorSelect").val(currentColorName);
        else $("#colorSelect").val("Black");
        $("#preview").css("border", "2px solid " + $(this).data("color"));
        $(".swatch").removeClass("active"); $(this).addClass("active"); updateSummary();
    });
    $("#diamondToggle, #glowToggle, #extendedToggle").on("change", function (event) {
        if (!isPremium) { $(this).prop("checked", false); premiumGuard(event); return; }
        if (this.id === "extendedToggle") $("#nameInput").attr("maxlength", this.checked ? EXTENDED_LIMIT : NORMAL_LIMIT);
        $("#preview").toggleClass("glow", $("#glowToggle").is(":checked")); updateSummary();
    });
    $(".font-btn").on("click", function (event) {
        if (!premiumGuard(event)) return;
        $(".font-btn").removeClass("active"); $(this).addClass("active"); $("#watchImagePreview").css("font-family", $(this).data("font"));
    });

    $("#paymentForm").on("submit", function (event) {
        event.preventDefault();
        const cardholderName = $("#cardName").val().trim();
        const digits = $("#cardNumber").val().replace(/\D/g, "");
        if (!cardholderName || digits.length < 4) {
            $("#paymentMessage").attr("class", "payment-message error").text("For this demo record, enter a cardholder name and at least four card-number digits. Do not enter real card details.");
            return;
        }
        const payButton = $("#payBtn").prop("disabled", true);
        $("#paymentMessage").attr("class", "payment-message processing").text("Saving demo payment record...");
        $.ajax({
            url: PAYMENTS_URL, method: "POST", contentType: "application/json",
            data: JSON.stringify({ cardholderName: cardholderName, cardLastFour: digits.slice(-4) }),
            dataType: "json", timeout: 15000,
            success: function (response) {
                isPremium = true; $("#statusBadge").text("★ Premium User").attr("class", "status-badge premium");
                $("#premiumBadge").addClass("active"); setPremiumLocked(false); $("#payBtn").text("Demo Activated ✓").prop("disabled", true);
                $("#paymentMessage").attr("class", "payment-message success").text(response.message + " Record ID: " + response.payment.id + ".");
                showMessage("Demo payment record saved. No real payment was processed.", "success");
                $("#loadPaymentsBtn").trigger("click");
            },
            error: function (xhr) {
                const reason = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : "Could not connect to the backend.";
                $("#paymentMessage").attr("class", "payment-message error").text("Payment record was not saved: " + reason);
            },
            complete: function () { if (!isPremium) payButton.prop("disabled", false); }
        });
    });
    $("#paymentForm").on("reset", function () { if (!isPremium) $("#paymentMessage").text(""); });
    $("#loadPaymentsBtn").on("click", function () {
        const button = $(this).prop("disabled", true);
        setStatus("#paymentsStatus", "Loading payment records...", "");
        $.ajax({
            url: PAYMENTS_URL, method: "GET", dataType: "json", timeout: 15000,
            success: function (payments) {
                const list = $("#paymentsList").empty();
                if (!payments.length) { setStatus("#paymentsStatus", "No payment records found.", "success"); return; }
                payments.forEach(function (payment) {
                    const item = $("<article>").addClass("saved-design-card");
                    item.append($("<h3>").text("Demo Payment #" + payment.id));
                    item.append($("<p>").text("Name: " + payment.cardholderName));
                    item.append($("<p>").text("Amount: " + payment.currency + " " + Number(payment.amount).toFixed(2)));
                    item.append($("<p>").text("Method: " + payment.paymentMethod + " • Card suffix: **** " + payment.cardLastFour));
                    item.append($("<p>").text("Status: " + payment.paymentStatus + " • " + new Date(payment.createdAt).toLocaleString()));
                    list.append(item);
                });
                setStatus("#paymentsStatus", payments.length + " demo payment record(s) loaded. Full card numbers, CVV and expiry are not stored.", "success");
            },
            error: function (xhr) {
                const reason = xhr.responseJSON && xhr.responseJSON.message ? xhr.responseJSON.message : "Could not connect to the backend.";
                setStatus("#paymentsStatus", "Could not load payments: " + reason, "error");
            },
            complete: function () { button.prop("disabled", false); }
        });
    });

    $("#menuToggle").on("click", function () { $("#mainNav").toggleClass("open"); });
    $("#mainNav").on("click", "a", function () { $("#mainNav").removeClass("open"); });
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) { if (entry.isIntersecting) { $(entry.target).addClass("visible"); observer.unobserve(entry.target); } });
        }, { threshold: 0.1 });
        $(".reveal").each(function () { observer.observe(this); });
    } else { $(".reveal").addClass("visible"); }
    setPremiumLocked(true);
    updateSummary();
});
