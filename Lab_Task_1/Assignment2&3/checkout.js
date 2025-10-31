$(document).ready(function() {
    // Show address form when "Add New Address" is clicked
    $('#showAddressForm').on('click', function() {
        $('#addressForm').slideDown();
        $('.address-cards .address-card').removeClass('selected');
        $('.btn-select-address').text('Select');
        $(this).hide();
    });

    // Select address card
    $('.address-card').on('click', function() {
        $('.address-card').removeClass('selected');
        $(this).addClass('selected');
        $('.btn-select-address').text('Select');
        $(this).find('.btn-select-address').text('Selected');
        $('#addressForm').slideUp();
        $('#showAddressForm').show();
    });

    // Select payment method
    $('.payment-method').on('click', function() {
        $('.payment-method').removeClass('selected');
        $(this).addClass('selected');
        $(this).find('input[type="radio"]').prop('checked', true);
        
        // Show/hide card fields based on selection
        if ($(this).data('method') === 'card') {
            $('#cardFields').slideDown();
        } else {
            $('#cardFields').slideUp();
        }
    });

    // Form validation
    $('#placeOrderBtn').on('click', function(e) {
        e.preventDefault();
        let isValid = true;
        let firstErrorField = null;

        // Reset validation states
        $('.form-control').removeClass('is-invalid is-valid');
        $('.form-check-input').removeClass('is-invalid is-valid');
        $('.invalid-feedback').hide();

        // Check if address form is visible (new address being added)
        if ($('#addressForm').is(':visible')) {
            // Validate Full Name
            const fullName = $('#fullName').val().trim();
            if (fullName.length < 3) {
                $('#fullName').addClass('is-invalid');
                $('#fullName').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#fullName');
            } else {
                $('#fullName').addClass('is-valid');
            }

            // Validate Email
            const email = $('#email').val().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                $('#email').addClass('is-invalid');
                $('#email').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#email');
            } else {
                $('#email').addClass('is-valid');
            }

            // Validate Phone
            const phone = $('#phone').val().trim();
            const phoneRegex = /^\d+$/;
            if (!phoneRegex.test(phone) || phone.length < 10) {
                $('#phone').addClass('is-invalid');
                $('#phone').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#phone');
            } else {
                $('#phone').addClass('is-valid');
            }

            // Validate Address
            const address = $('#address').val().trim();
            if (address === '') {
                $('#address').addClass('is-invalid');
                $('#address').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#address');
            } else {
                $('#address').addClass('is-valid');
            }

            // Validate City
            const city = $('#city').val().trim();
            if (city === '') {
                $('#city').addClass('is-invalid');
                $('#city').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#city');
            } else {
                $('#city').addClass('is-valid');
            }

            // Validate Postal Code
            const postalCode = $('#postalCode').val().trim();
            const postalRegex = /^\d+$/;
            if (!postalRegex.test(postalCode) || postalCode.length < 4 || postalCode.length > 6) {
                $('#postalCode').addClass('is-invalid');
                $('#postalCode').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#postalCode');
            } else {
                $('#postalCode').addClass('is-valid');
            }

            // Validate Country
            const country = $('#country').val();
            if (country === '') {
                $('#country').addClass('is-invalid');
                $('#country').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#country');
            } else {
                $('#country').addClass('is-valid');
            }

            // Validate Terms
            if (!$('#terms').is(':checked')) {
                $('#terms').addClass('is-invalid');
                $('#terms').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#terms');
            } else {
                $('#terms').addClass('is-valid');
            }
        } else {
            // Check if an address is selected
            if (!$('.address-card').hasClass('selected')) {
                isValid = false;
                alert('Please select a delivery address or add a new one.');
                if (!firstErrorField) firstErrorField = $('#showAddressForm');
            }
        }

        // Validate Payment Method
        const paymentMethod = $('input[name="payment"]:checked').attr('id');
        if (!paymentMethod) {
            isValid = false;
            alert('Please select a payment method.');
            if (!firstErrorField) firstErrorField = $('.payment-methods');
        }

        // Validate Card Fields if Card is selected
        if (paymentMethod === 'card') {
            const cardNumber = $('#cardNumber').val().trim();
            if (cardNumber === '') {
                $('#cardNumber').addClass('is-invalid');
                $('#cardNumber').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#cardNumber');
            } else {
                $('#cardNumber').addClass('is-valid');
            }

            const expiryDate = $('#expiryDate').val().trim();
            if (expiryDate === '') {
                $('#expiryDate').addClass('is-invalid');
                $('#expiryDate').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#expiryDate');
            } else {
                $('#expiryDate').addClass('is-valid');
            }

            const cvv = $('#cvv').val().trim();
            if (cvv === '') {
                $('#cvv').addClass('is-invalid');
                $('#cvv').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#cvv');
            } else {
                $('#cvv').addClass('is-valid');
            }

            const cardName = $('#cardName').val().trim();
            if (cardName === '') {
                $('#cardName').addClass('is-invalid');
                $('#cardName').siblings('.invalid-feedback').show();
                isValid = false;
                if (!firstErrorField) firstErrorField = $('#cardName');
            } else {
                $('#cardName').addClass('is-valid');
            }
        }

        // If form is valid, proceed to thank you page
        if (isValid) {
            window.location.href = 'thankyou.html';
        } else {
            // Scroll to the first error field
            if (firstErrorField) {
                $('html, body').animate({
                    scrollTop: firstErrorField.offset().top - 100
                }, 500);
            }
        }
    });

    // Real-time validation for fields
    $('.form-control').on('input', function() {
        const field = $(this);
        const value = field.val().trim();
        
        // Remove validation classes
        field.removeClass('is-invalid is-valid');
        field.siblings('.invalid-feedback').hide();
        
        // Validate based on field type
        if (field.attr('id') === 'fullName') {
            if (value.length >= 3) {
                field.addClass('is-valid');
            }
        } else if (field.attr('id') === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(value)) {
                field.addClass('is-valid');
            }
        } else if (field.attr('id') === 'phone') {
            const phoneRegex = /^\d+$/;
            if (phoneRegex.test(value) && value.length >= 10) {
                field.addClass('is-valid');
            }
        } else if (field.attr('id') === 'postalCode') {
            const postalRegex = /^\d+$/;
            if (postalRegex.test(value) && value.length >= 4 && value.length <= 6) {
                field.addClass('is-valid');
            }
        } else if (field.attr('id') === 'country') {
            if (value !== '') {
                field.addClass('is-valid');
            }
        } else if (field.attr('id') === 'address' || field.attr('id') === 'city') {
            if (value !== '') {
                field.addClass('is-valid');
            }
        }
    });

    // Real-time validation for card fields
    $('#cardNumber, #expiryDate, #cvv, #cardName').on('input', function() {
        const field = $(this);
        const value = field.val().trim();
        
        field.removeClass('is-invalid is-valid');
        field.siblings('.invalid-feedback').hide();
        
        if (value !== '') {
            field.addClass('is-valid');
        }
    });

    // Real-time validation for terms checkbox
    $('#terms').on('change', function() {
        $(this).removeClass('is-invalid is-valid');
        if ($(this).is(':checked')) {
            $(this).addClass('is-valid');
        }
    });
});