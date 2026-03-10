<?php
    $title = 'Finance & Banking';
    $subTitle = 'Finance & Banking';
    $script='<script src="assets/js/index-11.js"></script>';
?>

<?php include './layouts/layout-top.php' ?>

    <!-- Widgets start -->
    <div class="row gy-4">
        <div class="col-xxl-3 col-sm-6">
            <div class="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-1 border border-white">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                        <div class="d-flex align-items-center gap-10">
                            <span class="mb-0 w-48-px h-48-px bg-cyan-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                                <img src="assets/images/home-eleven/icons/home-eleven-icon1.svg" alt="Image">
                            </span>
                            <div>
                                <span class="fw-medium text-secondary-light text-md">Total Period Income</span>
                                <h6 class="fw-semibold mt-2">$50,000</h6>
                            </div>
                        </div>
                    </div>
                    <p class="text-sm mb-0 d-flex align-items-center flex-wrap gap-12 mt-12 text-secondary-light">
                        <span class="bg-success-focus px-6 py-2 rounded-2 fw-medium text-success-main text-sm d-flex align-items-center gap-1">
                            <i class="ri-arrow-right-up-line"></i> 95%
                        </span> Last month $24,000.00
                    </p>
                </div>
            </div>
        </div>
        <div class="col-xxl-3 col-sm-6">
            <div class="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-2 border border-white">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                        <div class="d-flex align-items-center gap-10">
                            <span class="mb-0 w-48-px h-48-px bg-warning-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                                <img src="assets/images/home-eleven/icons/home-eleven-icon2.svg" alt="Image">
                            </span>
                            <div>
                                <span class="fw-medium text-secondary-light text-md">Total Period Expenses</span>
                                <h6 class="fw-semibold mt-2">$35,000</h6>
                            </div>
                        </div>
                    </div>
                    <p class="text-sm mb-0 d-flex align-items-center flex-wrap gap-12 mt-12 text-secondary-light">
                        <span class="bg-success-focus px-6 py-2 rounded-2 fw-medium text-success-main text-sm d-flex align-items-center gap-1">
                            <i class="ri-arrow-right-up-line"></i> 95%
                        </span> Last month $1,600.00
                    </p>
                </div>
            </div>
        </div>
        <div class="col-xxl-3 col-sm-6">
            <div class="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-3 border border-white">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                        <div class="d-flex align-items-center gap-10">
                            <span class="mb-0 w-48-px h-48-px bg-lilac-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                                <img src="assets/images/home-eleven/icons/home-eleven-icon3.svg" alt="Image">
                            </span>
                            <div>
                                <span class="fw-medium text-secondary-light text-md">Net Profit</span>
                                <h6 class="fw-semibold mt-2">$50,000</h6>
                            </div>
                        </div>
                    </div>
                    <p class="text-sm mb-0 d-flex align-items-center flex-wrap gap-12 mt-12 text-secondary-light">
                        <span class="bg-danger-focus px-6 py-2 rounded-2 fw-medium text-danger-main text-sm d-flex align-items-center gap-1">
                            <i class="ri-arrow-right-down-line"></i> 70%
                        </span> Last month $24,000.00
                    </p>
                </div>
            </div>
        </div>
        <div class="col-xxl-3 col-sm-6">
            <div class="card p-3 shadow-2 radius-8 h-100 gradient-deep-two-4 border border-white">
                <div class="card-body p-0">
                    <div class="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-8">
                        <div class="d-flex align-items-center gap-10">
                            <span class="mb-0 w-48-px h-48-px bg-success-600 flex-shrink-0 text-white d-flex justify-content-center align-items-center rounded-circle h6 mb-0">
                                <img src="assets/images/home-eleven/icons/home-eleven-icon4.svg" alt="Image">
                            </span>
                            <div>
                                <span class="fw-medium text-secondary-light text-md">Total Saving</span>
                                <h6 class="fw-semibold mt-2">$50,000</h6>
                            </div>
                        </div>
                    </div>
                    <p class="text-sm mb-0 d-flex align-items-center flex-wrap gap-12 mt-12 text-secondary-light">
                        <span class="bg-success-focus px-6 py-2 rounded-2 fw-medium text-success-main text-sm d-flex align-items-center gap-1">
                            <i class="ri-arrow-right-up-line"></i> 95%
                        </span> Last month $2,500.00
                    </p>
                </div>
            </div>
        </div>
    </div>
    <!-- Widgets end -->
    
    <div class="mt-24">
        <div class="row gy-4">
            <div class="col-xl-8">
                <div class="row gy-4">
    
                    <div class="col-12">
                        <div class="card h-100">
                            <div class="card-body">
                            <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                <h6 class="mb-2 fw-bold text-lg mb-0">Balance Statistic</h6>
                                <select class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                                <option>Today</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                                <option>Yearly</option>
                                </select>
                            </div>
                
                            <ul class="d-flex flex-wrap align-items-center justify-content-center mt-3 gap-3">
                                <li class="d-flex align-items-center gap-2">
                                    <span class="w-12-px h-12-px rounded-circle bg-primary-600"></span>
                                    <span class="text-secondary-light text-sm fw-semibold">Word: 
                                        <span class="text-primary-light fw-bold">500</span>
                                    </span>
                                </li>
                                <li class="d-flex align-items-center gap-2">
                                    <span class="w-12-px h-12-px rounded-circle bg-yellow"></span>
                                    <span class="text-secondary-light text-sm fw-semibold">Image:  
                                        <span class="text-primary-light fw-bold">300</span>
                                    </span>
                                </li>
                            </ul>
                
                            <div class="mt-40">
                                <div id="balanceStatistics" class=""></div>
                            </div>
                            
                            </div>
                        </div>
                    </div>
    
                    <div class="col-md-6">
                        <div class="card radius-16 h-100">
                            <div class="card-header">
                                <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                    <h6 class="mb-2 fw-bold text-lg mb-0">Earning Categories</h6>
                                    <a href="javascript:void(0)" class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                                        View All
                                        <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                                    </a>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="d-flex flex-column gap-20">
                                    <div class="d-flex align-items-center justify-content-between gap-3">
                                        <div class="d-flex align-items-center w-100 gap-12">
                                            <span class="w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-primary-100">
                                                <img src="assets/images/home-eleven/icons/earn-cat-icon1.svg" alt="Image" class="">
                                            </span>
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">Digital Assets</h6>
                                                <span class="text-xs text-secondary-light fw-medium">$50 / from $1000</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-primary-600 rounded-pill" style="width: 80%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">80%</span>
                                        </div>
                                    </div>
                                    
                                    <div class="d-flex align-items-center justify-content-between gap-3">
                                        <div class="d-flex align-items-center w-100 gap-12">
                                            <span class="w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-danger-100">
                                                <img src="assets/images/home-eleven/icons/earn-cat-icon2.svg" alt="Image" class="">
                                            </span>
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">Side Project</h6>
                                                <span class="text-xs text-secondary-light fw-medium">$50 / from $1000</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-orange rounded-pill" style="width: 60%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">60%</span>
                                        </div>
                                    </div>
                    
                                    <div class="d-flex align-items-center justify-content-between gap-3">
                                        <div class="d-flex align-items-center w-100 gap-12">
                                            <span class="w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-warning-200">
                                                <img src="assets/images/home-eleven/icons/earn-cat-icon3.svg" alt="Image" class="">
                                            </span>
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">Investment</h6>
                                                <span class="text-xs text-secondary-light fw-medium">$50 / from $1000</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-yellow rounded-pill" style="width: 49%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">49%</span>
                                        </div>
                                    </div>
                    
                                    <div class="d-flex align-items-center justify-content-between gap-3">
                                        <div class="d-flex align-items-center w-100 gap-12">
                                            <span class="w-40-px h-40-px rounded-circle d-flex justify-content-center align-items-center bg-success-200">
                                                <img src="assets/images/home-eleven/icons/earn-cat-icon4.svg" alt="Image" class="">
                                            </span>
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">Working Hard</h6>
                                                <span class="text-xs text-secondary-light fw-medium">$50 / from $1000</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-success-main rounded-pill" style="width: 100%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">100%</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div class="col-md-6">
                        <div class="card radius-16 h-100">
                            <div class="card-header">
                                <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                    <h6 class="mb-2 fw-bold text-lg mb-0">Expense Statistics</h6>
                                    <select class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                                        <option>Today</option>
                                        <option>Weekly</option>
                                        <option>Monthly</option>
                                        <option>Yearly</option>
                                    </select>
                                </div>
                            </div>
                            <div class="card-body">
                                <div id="expenseStatistics" class="apexcharts-tooltip-z-none d-flex justify-content-center"> </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card radius-16">
                            <div class="card-header">
                                <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                    <h6 class="mb-2 fw-bold text-lg mb-0">Payment History</h6>
                                    <a href="javascript:void(0)" class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                                        View All
                                        <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                                    </a>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="d-flex align-items-center justify-content-between pb-10 mb-10 border-bottom border-neutral-200">
                                    <div class="">
                                        <h6 class="text-md mb-0">Digital Assets</h6>
                                        <span class="text-xs text-secondary-light fw-medium">18 Nov 2024</span>
                                    </div>
                                    <div class="">
                                        <h6 class="text-sm mb-1">$450.00</h6>
                                        <span class="text-xs fw-medium text-success-600 bg-success-100 rounded-pill px-3">Paid</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between pb-10 mb-10 border-bottom border-neutral-200">
                                    <div class="">
                                        <h6 class="text-md mb-0">Electricity</h6>
                                        <span class="text-xs text-secondary-light fw-medium">18 Nov 2024</span>
                                    </div>
                                    <div class="">
                                        <h6 class="text-sm mb-1">$150.00</h6>
                                        <span class="text-xs fw-medium text-warning-600 bg-warning-100 rounded-pill px-3">Due</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between pb-10 mb-10 border-bottom border-neutral-200">
                                    <div class="">
                                        <h6 class="text-md mb-0">Internet Bill</h6>
                                        <span class="text-xs text-secondary-light fw-medium">18 Nov 2024</span>
                                    </div>
                                    <div class="">
                                        <h6 class="text-sm mb-1">$450.00</h6>
                                        <span class="text-xs fw-medium text-danger-600 bg-danger-100 rounded-pill px-3">Cancel</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between pb-10 mb-10 border-bottom border-neutral-200">
                                    <div class="">
                                        <h6 class="text-md mb-0">House rent </h6>
                                        <span class="text-xs text-secondary-light fw-medium">18 Nov 2024</span>
                                    </div>
                                    <div class="">
                                        <h6 class="text-sm mb-1">$450.00</h6>
                                        <span class="text-xs fw-medium text-success-600 bg-success-100 rounded-pill px-3">Paid</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between">
                                    <div class="">
                                        <h6 class="text-md mb-0">Office rent</h6>
                                        <span class="text-xs text-secondary-light fw-medium">18 Nov 2024</span>
                                    </div>
                                    <div class="">
                                        <h6 class="text-sm mb-1">$450.00</h6>
                                        <span class="text-xs fw-medium text-success-600 bg-success-100 rounded-pill px-3">Paid</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="col-md-6">
                        <div class="card radius-16">
                            <div class="card-header">
                                <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                    <h6 class="mb-2 fw-bold text-lg mb-0">Monthly Expense Breakdown</h6>
                                </div>
                            </div>
                            <div class="card-body">
                                <div class="mb-3 d-flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="464" height="12" viewBox="0 0 464 12" fill="none">
                                        <g clip-path="url(#clip0_6886_52892)">
                                            <rect width="464" height="12" rx="6" fill="#6B7280"/>
                                            <rect width="464" height="12" rx="6" fill="#06B6D4"/>
                                            <rect width="418" height="12" rx="6" fill="#22C55E"/>
                                            <rect width="365" height="12" rx="6" fill="#84CC16"/>
                                            <rect width="295" height="12" rx="6" fill="#EAB308"/>
                                            <rect width="210" height="12" rx="6" fill="#F59E0B"/>
                                            <rect width="111" height="12" rx="6" fill="#F97316"/>
                                        </g>
                                        <defs>
                                            <clipPath id="clip0_6886_52892">
                                            <rect width="464" height="12" rx="6" fill="white"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                                <div class="d-flex align-items-center justify-content-between p-12 bg-neutral-100">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="w-12-px h-8-px bg-orange rounded-pill"></span>
                                        <span class="text-secondary-light">Healthcare</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="text-secondary-light">$1500</span>
                                        <span class="text-primary-light fw-semibold">40%</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between p-12 bg-base">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="w-12-px h-8-px bg-warning-600 rounded-pill"></span>
                                        <span class="text-secondary-light">Education</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="text-secondary-light">$1500</span>
                                        <span class="text-primary-light fw-semibold">40%</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between p-12 bg-neutral-100">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="w-12-px h-8-px bg-warning-600 rounded-pill"></span>
                                        <span class="text-secondary-light">Clothes</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="text-secondary-light">$1500</span>
                                        <span class="text-primary-light fw-semibold">40%</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between p-12 bg-base">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="w-12-px h-8-px bg-success-600 rounded-pill"></span>
                                        <span class="text-secondary-light">Food</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="text-secondary-light">$1500</span>
                                        <span class="text-primary-light fw-semibold">30%</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between p-12 bg-neutral-100">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="w-12-px h-8-px bg-success-600 rounded-pill"></span>
                                        <span class="text-secondary-light">Transport</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="text-secondary-light">$1500</span>
                                        <span class="text-primary-light fw-semibold">20%</span>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center justify-content-between p-12 bg-base">
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="w-12-px h-8-px bg-cyan-600 rounded-pill"></span>
                                        <span class="text-secondary-light">Pets</span>
                                    </div>
                                    <div class="d-flex align-items-center gap-2">
                                        <span class="text-secondary-light">$1500</span>
                                        <span class="text-primary-light fw-semibold">20%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
    
                </div>
            </div>
    
            <!-- Sidebar start -->
            <div class="col-xl-4">
                <div class="card radius-16">
                    <div class="card-header">
                        <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                            <h6 class="mb-2 fw-bold text-lg mb-0">Quick Transfer</h6>
                        </div>
                    </div>
                    <div class="card-body p-0">
                        <div class="p-20">
                            <div class="position-relative z-1 py-32 text-center px-3">
                                <img src="assets/images/home-eleven/bg/bg-orange-gradient.png" alt="Image" class="position-absolute top-0 start-0 w-100 h-100 z-n1">
                                <h3 class="text-white">$500.00</h3>
                                <span class="text-white">Your Balance</span>
                            </div>
                        </div>

                        <div class="px-24 bg-neutral-100 border-bottom-0 py-20 dark-bg-neutral-200">
                            <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                <h6 class="mb-2 fw-bold text-lg mb-0">Contacts</h6>
                                <a href="javascript:void(0)" class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                                    View All
                                    <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                                </a>
                            </div>
                        </div>

                        <div class="py-16 px-24">
                            <div class="officer-slider">
                                <div class="officer-slider__item d-flex flex-column text-center align-items-center justify-content-center">
                                    <div class="officer-slider__thumb w-56-px h-56-px rounded-circle overflow-hidden flex-shrink-0 mx-8">
                                        <img src="assets/images/home-eleven/officer-img1.png" alt="Image" class="w-100 h-100 object-fit-cover">
                                    </div>
                                    <div class="officer-slider__content mt-24 min-w-max-content">
                                        <h6 class="mb-0 text-xl">Mr. Bin</h6>
                                        <span class="text-sm text-secondary-light">Insurance officer</span>
                                    </div>
                                </div>
                                <div class="officer-slider__item d-flex flex-column text-center align-items-center justify-content-center">
                                    <div class="officer-slider__thumb w-56-px h-56-px rounded-circle overflow-hidden flex-shrink-0 mx-8">
                                        <img src="assets/images/home-eleven/officer-img2.png" alt="Image" class="w-100 h-100 object-fit-cover">
                                    </div>
                                    <div class="officer-slider__content mt-24 min-w-max-content">
                                        <h6 class="mb-0 text-xl">Mr. Robiul</h6>
                                        <span class="text-sm text-secondary-light">Insurance officer</span>
                                    </div>
                                </div>
                                <div class="officer-slider__item d-flex flex-column text-center align-items-center justify-content-center">
                                    <div class="officer-slider__thumb w-56-px h-56-px rounded-circle overflow-hidden flex-shrink-0 mx-8">
                                        <img src="assets/images/home-eleven/officer-img3.png" alt="Image" class="w-100 h-100 object-fit-cover">
                                    </div>
                                    <div class="officer-slider__content mt-24 min-w-max-content">
                                        <h6 class="mb-0 text-xl">Mr. Deo</h6>
                                        <span class="text-sm text-secondary-light">Insurance officer</span>
                                    </div>
                                </div>
                                <div class="officer-slider__item d-flex flex-column text-center align-items-center justify-content-center">
                                    <div class="officer-slider__thumb w-56-px h-56-px rounded-circle overflow-hidden flex-shrink-0 mx-8">
                                        <img src="assets/images/home-eleven/officer-img4.png" alt="Image" class="w-100 h-100 object-fit-cover">
                                    </div>
                                    <div class="officer-slider__content mt-24 min-w-max-content">
                                        <h6 class="mb-0 text-xl">Mr. Riad</h6>
                                        <span class="text-sm text-secondary-light">Insurance officer</span>
                                    </div>
                                </div>
                                <div class="officer-slider__item d-flex flex-column text-center align-items-center justify-content-center">
                                    <div class="officer-slider__thumb w-56-px h-56-px rounded-circle overflow-hidden flex-shrink-0 mx-8">
                                        <img src="assets/images/home-eleven/officer-img5.png" alt="Image" class="w-100 h-100 object-fit-cover">
                                    </div>
                                    <div class="officer-slider__content mt-24 min-w-max-content">
                                        <h6 class="mb-0 text-xl">Mr. Alex</h6>
                                        <span class="text-sm text-secondary-light">Insurance officer</span>
                                    </div>
                                </div>
                                <div class="officer-slider__item d-flex flex-column text-center align-items-center justify-content-center">
                                    <div class="officer-slider__thumb w-56-px h-56-px rounded-circle overflow-hidden flex-shrink-0 mx-8">
                                        <img src="assets/images/home-eleven/officer-img2.png" alt="Image" class="w-100 h-100 object-fit-cover">
                                    </div>
                                    <div class="officer-slider__content mt-24 min-w-max-content">
                                        <h6 class="mb-0 text-xl">Mr. John</h6>
                                        <span class="text-sm text-secondary-light">Insurance officer</span>
                                    </div>
                                </div>
                            </div>

                            <form action="#">
                                <div class="">
                                    <label for="message" class="d-block fw-semibold text-primary-light mb-8">Write Short Description </label>
                                    <textarea class="form-control" id="message" rows="4" cols="50" placeholder="Enter a description..."></textarea>
                                </div>
                                <div class="mt-16">
                                    <label for="Amount" class="d-block fw-semibold text-primary-light mb-8">Amount</label>
                                    <div class="d-flex gap-16">
                                        <input type="text" id="Amount" class="form-control form-control-lg" placeholder="Ex: $200">
                                        <button class="btn btn-primary-600 flex-shrink-0 d-flex align-items-center gap-2 px-32" type="submit">Send <i class="ri-send-plane-fill"></i> </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <div class="card radius-16 mt-24">
                    <div class="card-header">
                        <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                            <h6 class="mb-2 fw-bold text-lg mb-0">Investment</h6>
                            <select class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                                <option>Today</option>
                                <option>Weekly</option>
                                <option>Monthly</option>
                                <option>Yearly</option>
                            </select>
                        </div>
                    </div>
                    <div class="card-body py-20">
                        <p class="text-center text-secondary-light d-flex align-items-center gap-8 justify-content-center">Total Investment: <span class="fw-semibold text-primary-light">$500</span> </p>

                        <div class="mt-40 mb-24 text-center pe-110 position-relative max-w-288-px mx-auto">
                            <div class="w-170-px h-170-px rounded-circle z-1 position-relative d-inline-flex justify-content-center align-items-center border border-white border-width-2-px">
                                <img src="assets/images/home-eleven/bg/radial-bg1.png" alt="Image" class="position-absolute top-0 start-0 z-n1 w-100 h-100 object-fit-cover">
                                <h5 class="text-white"> 60% </h5>
                            </div>
                            <div class="w-144-px h-144-px rounded-circle z-1 position-relative d-inline-flex justify-content-center align-items-center border border-white border-width-3-px position-absolute top-0 end-0 mt--36">
                                <img src="assets/images/home-eleven/bg/radial-bg2.png" alt="Image" class="position-absolute top-0 start-0 z-n1 w-100 h-100 object-fit-cover">
                                <h5 class="text-white"> 30% </h5>
                            </div>
                            <div class="w-110-px h-110-px rounded-circle z-1 position-relative d-inline-flex justify-content-center align-items-center border border-white border-width-3-px position-absolute bottom-0 start-50 translate-middle-x ms-48">
                                <img src="assets/images/home-eleven/bg/radial-bg3.png" alt="Image" class="position-absolute top-0 start-0 z-n1 w-100 h-100 object-fit-cover">
                                <h5 class="text-white"> 10% </h5>
                            </div>
                        </div>
                        
                        <div class="d-flex align-items-center flex-wrap gap-24 justify-content-between">
                            <div class="d-flex flex-column align-items-start">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="w-12-px h-12-px rounded-pill bg-primary-600"></span>
                                    <span class="text-secondary-light text-sm fw-normal">Net Income</span>
                                </div>
                                <h6 class="text-primary-light fw-semibold mb-0 mt-4 text-lg">$50,000</h6>
                            </div>
                            <div class="d-flex flex-column align-items-start">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="w-12-px h-12-px rounded-pill bg-purple"></span>
                                    <span class="text-secondary-light text-sm fw-normal">Real State</span>
                                </div>
                                <h6 class="text-primary-light fw-semibold mb-0 mt-4 text-lg">$150</h6>
                            </div>
                            <div class="d-flex flex-column align-items-start">
                                <div class="d-flex align-items-center gap-2">
                                    <span class="w-12-px h-12-px rounded-pill bg-success-600"></span>
                                    <span class="text-secondary-light text-sm fw-normal">Business</span>
                                </div>
                                <h6 class="text-primary-light fw-semibold mb-0 mt-4 text-lg">$100</h6>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <!-- Sidebar end -->
    
        </div>
    </div>

    <!-- Table Start -->
    <div class="card radius-16 mt-24">
        <div class="card-header">
            <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                <h6 class="mb-2 fw-bold text-lg mb-0">Payment History</h6>
                <a href="javascript:void(0)" class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                    View All
                    <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                </a>
            </div>
        </div>
        <div class="card-body">
            <div class="table-responsive scroll-sm">
                <table class="table bordered-table sm-table mb-0">
                <thead>
                    <tr>
                    <th scope="col">Users </th>
                    <th scope="col" class="text-center">Email</th>
                    <th scope="col" class="text-center">Transaction ID</th>
                    <th scope="col" class="text-center">Amount</th>
                    <th scope="col" class="text-center">Payment Method</th>
                    <th scope="col" class="text-center">Date</th>
                    <th scope="col" class="text-center">Status</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td class="">
                        <div class="d-flex align-items-center">
                        <img src="assets/images/users/user1.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                        <div class="flex-grow-1">
                            <h6 class="text-md mb-0 fw-medium">Dianne Russell</h6>
                        </div>
                        </div>
                    </td>
                    <td class="text-center">osgoodwy@gmail.com</td>
                    <td class="text-center">9562415412263</td>
                    <td class="text-center">$29.00</td>
                    <td class="text-center">Bank</td>
                    <td class="text-center">24 Jun 2024</td>
                    <td class="text-center"> 
                        <span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">Active</span> 
                    </td>
                    </tr>
                    <tr>
                    <td class="">
                        <div class="d-flex align-items-center">
                        <img src="assets/images/users/user2.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                        <div class="flex-grow-1">
                            <h6 class="text-md mb-0 fw-medium">Wade Warren</h6>
                        </div>
                        </div>
                    </td>
                    <td class="text-center">redaniel@gmail.com</td>
                    <td class="text-center">9562415412263</td>
                    <td class="text-center">$29.00</td>
                    <td class="text-center">Bank</td>
                    <td class="text-center">24 Jun 2024</td>
                    <td class="text-center"> 
                        <span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">Active</span> 
                    </td>
                    </tr>
                    <tr>
                    <td class="">
                        <div class="d-flex align-items-center">
                        <img src="assets/images/users/user3.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                        <div class="flex-grow-1">
                            <h6 class="text-md mb-0 fw-medium">Albert Flores</h6>
                        </div>
                        </div>
                    </td>
                    <td class="text-center">seema@gmail.com</td>
                    <td class="text-center">9562415412263</td>
                    <td class="text-center">$29.00</td>
                    <td class="text-center">Bank</td>
                    <td class="text-center">24 Jun 2024</td>
                    <td class="text-center"> 
                        <span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">Active</span> 
                    </td>
                    </tr>
                    <tr>
                    <td class="">
                        <div class="d-flex align-items-center">
                        <img src="assets/images/users/user4.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                        <div class="flex-grow-1">
                            <h6 class="text-md mb-0 fw-medium">Bessie Cooper </h6>
                        </div>
                        </div>
                    </td>
                    <td class="text-center">hamli@gmail.com</td>
                    <td class="text-center">9562415412263</td>
                    <td class="text-center">$29.00</td>
                    <td class="text-center">Bank</td>
                    <td class="text-center">24 Jun 2024</td>
                    <td class="text-center"> 
                        <span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">Active</span> 
                    </td>
                    </tr>
                    <tr>
                    <td class="">
                        <div class="d-flex align-items-center">
                        <img src="assets/images/users/user5.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                        <div class="flex-grow-1">
                            <h6 class="text-md mb-0 fw-medium">Arlene McCoy</h6>
                        </div>
                        </div>
                    </td>
                    <td class="text-center">zitka@mail.ru</td>
                    <td class="text-center">9562415412263</td>
                    <td class="text-center">$29.00</td>
                    <td class="text-center">Bank</td>
                    <td class="text-center">24 Jun 2024</td>
                    <td class="text-center"> 
                        <span class="bg-success-focus text-success-main px-24 py-4 rounded-pill fw-medium text-sm">Active</span> 
                    </td>
                    </tr>
                </tbody>
                </table>
            </div>
        </div>
    </div>
    <!-- Table End -->

<?php include './layouts/layout-bottom.php' ?>