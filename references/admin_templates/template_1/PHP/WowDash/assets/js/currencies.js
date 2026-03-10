    // Remove Tr when click on delete button js
    $('.remove-item-button').on('click', function () {
        $(this).closest('tr').addClass('d-none'); 
    }); 