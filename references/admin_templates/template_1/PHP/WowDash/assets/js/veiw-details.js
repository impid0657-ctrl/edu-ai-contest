    // ========================= Adjust Textarea Height depending of text lines(default height 40px) Js Start ===========================
    function adjustHeight(textarea) {
        // Calculate the scroll height of the content
        let scrollHeight = textarea.scrollHeight;

        // Set the textarea height to the scroll height, but not exceeding the maximum height
        if (scrollHeight > 44 && scrollHeight <= 60) {
            textarea.style.height = scrollHeight + 'px';
        } else if (scrollHeight > 60) {
            // textarea.style.height = '60px !important';
            textarea.setAttribute('style', 'height: 60px !important;');
        }
    }
// ========================= Adjust Textarea Height depending of text lines(default height 40px) Js End ===========================