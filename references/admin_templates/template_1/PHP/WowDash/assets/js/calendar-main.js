    // Flat pickr or date picker js 
    function getDatePicker (receiveID) {
        flatpickr(receiveID, {
            enableTime: true,
            dateFormat: "d/m/Y H:i",
        });
    }
    getDatePicker('#startDate'); 
    getDatePicker('#endDate');

    getDatePicker('#editstartDate'); 
    getDatePicker('#editendDate');