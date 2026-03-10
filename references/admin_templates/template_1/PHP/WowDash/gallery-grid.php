<?php
$title    = 'Gallery Grid';
$subTitle = 'Gallery Grid';
$script = '
            <script>
            $(".popup-img").magnificPopup({
                type: "image",
                gallery: {
                    enabled: true
                }
            });
            </script>
            ';
?>

<?php include './layouts/layout-top.php' ?>

    <div class="card h-100 p-0 radius-12 overflow-hidden gallery-scale">
        <div class="card-body p-24">
            <div class="row gy-4">
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img1.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img1.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img2.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img2.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img3.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img3.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img4.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img4.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img5.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img5.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img6.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img6.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img7.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img7.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img8.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img8.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img9.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img9.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img10.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img10.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img11.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img11.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
                <div class="col-xxl-3 col-md-4 col-sm-6">
                    <div class="hover-scale-img border radius-16 overflow-hidden p-8">
                        <a href="assets/images/gallery/gallery-img12.png" class="popup-img w-100 h-100 d-flex radius-12 overflow-hidden">
                            <img src="assets/images/gallery/gallery-img12.png" alt="Image" class="hover-scale-img__img w-100 h-100 object-fit-cover">
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php include './layouts/layout-bottom.php' ?>