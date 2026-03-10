    // ================== Image Upload Js Start ===========================
    function readURL(input, previewElementId) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                $('#' + previewElementId).css('background-image', 'url(' + e.target.result + ')');
                $('#' + previewElementId).hide();
                $('#' + previewElementId).fadeIn(650);
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    $("#imageUpload").change(function() {
        readURL(this, 'previewImage1');
    });

    $("#imageUploadTwo").change(function() {
        readURL(this, 'previewImage2');
    });
// ================== Image Upload Js End ===========================