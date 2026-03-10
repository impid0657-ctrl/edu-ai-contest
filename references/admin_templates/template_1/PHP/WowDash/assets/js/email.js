// Table Header Checkbox checked all js Start
    $('#selectAll').on('change', function () {
        $('.form-check .form-check-input').prop('checked', $(this).prop('checked')); 
        
        if ($(this).prop('checked')) {
            $('.email-item').addClass('active');
        } else {
            $('.email-item').removeClass('active');
        }
    }); 

    // Active Item with js
    $('.form-check .form-check-input').on('change', function () {
        if ($(this).is(':checked')) {
            $(this).closest('.email-item').addClass('active'); 
        } else {
            $(this).closest('.email-item').removeClass('active'); 
        }
    });

    // Selected Checkbox count amount js Start
    $('.email-card .form-check-input').on('change', function () {
        let selectedCount = $('.email-card .form-check-input:checked').length;

        if(selectedCount > 0) {
            $('.delete-button').removeClass('d-none'); 
        } else {
            $('.delete-button').addClass('d-none')
        }
    });
    // Selected Checkbox count amount js End

    $('.delete-button').on('click', function () {
        $('.email-item.active').addClass('d-none')
    }); 
    
    // Page Reload Js
    $(".reload-button").on("click", function() {
        history.go(0);
    });
    
    // Starred Button js
    $('.starred-button').on('click', function () {
        $(this).toggleClass('active')
    }); 