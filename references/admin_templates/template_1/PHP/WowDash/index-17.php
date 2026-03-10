<?php
    $title='SaaS';
    $subTitle='SaaS';
    $script='<script src="assets/js/index-17.js"></script>';
?>

<?php include './layouts/layout-top.php' ?>

    <div class="row gy-4">
        <div class="col-xxl-6">
            <div class="card h-100 rounded-4 overflow-hidden">
                <div class="card-body p-20">
                    <div class="row g-3">
                        <div class="col-sm-6">
                            <div class="px-16 py-12 rounded-3 border border-neutral-200 sass-card-gradient-bg-1">
                                <div class="d-flex align-items-center gap-12">
                                    <span
                                        class="bg-primary w-48-px h-48-px text-xxl rounded-circle d-flex justify-content-center align-items-center text-white">
                                        <i class="ri-user-add-fill"></i>
                                    </span>
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h6 class="fw-semibold mb-0">750</h6>
                                            <span
                                                class="bg-success-100 text-success-600 fw-semibold border border-success-300 rounded-pill px-4 text-sm">+200</span>
                                        </div>
                                        <span class="text-secondary-light mt-1">Total Users</span>
                                    </div>
                                </div>
                                <div class="mt-16">
                                    <div id="total-users-chart"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="px-16 py-12 rounded-3 border border-neutral-200 sass-card-gradient-bg-2">
                                <div class="d-flex align-items-center gap-12">
                                    <span
                                        class="bg-yellow w-48-px h-48-px text-xxl rounded-circle d-flex justify-content-center align-items-center text-white">
                                        <i class="ri-discount-percent-line"></i>
                                    </span>
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h6 class="fw-semibold mb-0">240</h6>
                                            <span
                                                class="bg-danger-100 text-danger-600 fw-semibold border border-danger-300 rounded-pill px-4 text-sm">-200</span>
                                        </div>
                                        <span class="text-secondary-light mt-1">Total Orders</span>
                                    </div>
                                </div>
                                <div class="mt-16">
                                    <div id="total-order-chart"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="px-16 py-12 rounded-3 border border-neutral-200 sass-card-gradient-bg-3">
                                <div class="d-flex align-items-center gap-12">
                                    <span
                                        class="bg-purple w-48-px h-48-px text-xxl rounded-circle d-flex justify-content-center align-items-center text-white">
                                        <i class="ri-question-answer-line"></i>
                                    </span>
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h6 class="fw-semibold mb-0">47.5%</h6>
                                            <span
                                                class="bg-success-100 text-success-600 fw-semibold border border-success-300 rounded-pill px-4 text-sm">+3.6%</span>
                                        </div>
                                        <span class="text-secondary-light mt-1">Conversion Rate</span>
                                    </div>
                                </div>
                                <div class="mt-16">
                                    <div id="upDownBarchart"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="px-16 py-12 rounded-3 border border-neutral-200 sass-card-gradient-bg-4">
                                <div class="d-flex align-items-center gap-12">
                                    <span
                                        class="bg-success-500 w-48-px h-48-px text-xxl rounded-circle d-flex justify-content-center align-items-center text-white">
                                        <i class="ri-user-add-fill"></i>
                                    </span>
                                    <div class="flex-grow-1">
                                        <div class="d-flex justify-content-between align-items-center">
                                            <h6 class="fw-semibold mb-0">$2.7M</h6>
                                            <span
                                                class="bg-success-100 text-success-600 fw-semibold border border-success-300 rounded-pill px-4 text-sm">+3.6%</span>
                                        </div>
                                        <span class="text-secondary-light mt-1">Order Value</span>
                                    </div>
                                </div>
                                <div class="mt-16 pb-20">
                                    <div id="orderValue" class="margin-16-minus"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xxl-6">
            <div class="card h-100 rounded-4 overflow-hidden border-0">
                <div class="card-header">
                    <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 class="mb-2 fw-bold text-lg mb-0">Daily Earnings</h6>
                        <select
                            class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                            <option>Yearly</option>
                            <option>Monthly</option>
                            <option>Weekly</option>
                            <option>Today</option>
                        </select>
                    </div>
                </div>

                <div class="card-body p-24">
                    <ul class="d-flex flex-wrap align-items-center justify-content-center gap-3">
                        <li class="d-flex align-items-center gap-2">
                            <span class="w-12-px h-8-px rounded-pill bg-primary-600"></span>
                            <span class="text-secondary-light text-sm fw-semibold line-height-1">Earning:
                                <span class="text-primary-light fw-bold text-xl ms-1">$15.5k</span>
                            </span>
                        </li>
                    </ul>
                    <div id="barChart" class="barChart"></div>
                </div>
            </div>
        </div>

        <div class="col-xxl-8">
            <div class="card h-100 rounded-4 overflow-hidden border-0">
                <div class="card-header">
                    <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 class="mb-2 fw-bold text-lg mb-0">User Traffic</h6>
                        <select
                            class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                            <option>Yearly</option>
                            <option>Monthly</option>
                            <option>Weekly</option>
                            <option>Today</option>
                        </select>
                    </div>
                </div>

                <div class="card-body p-24">
                    <ul class="d-flex flex-wrap align-items-center justify-content-center gap-3">
                        <li class="d-flex align-items-center gap-2">
                            <span class="w-12-px h-8-px rounded-pill bg-purple"></span>
                            <span class="text-secondary-light text-sm fw-semibold line-height-1">Total Users:
                                <span class="text-primary-light fw-bold text-xl ms-1">10.5k</span>
                            </span>
                        </li>
                    </ul>
                    <div id="chart-timeline" class=""></div>
                </div>
            </div>
        </div>

        <div class="col-xxl-4">
            <div class="card h-100 rounded-4 overflow-hidden border-0">
                <div class="card-header">
                    <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 class="mb-2 fw-bold text-lg mb-0">Referral Sources</h6>
                        <select
                            class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                            <option>Yearly</option>
                            <option>Monthly</option>
                            <option>Weekly</option>
                            <option>Today</option>
                        </select>
                    </div>
                </div>

                <div class="card-body p-24">
                    <img src="assets/images/home-seventeen/referral-chart.png" alt="Image">
                </div>
            </div>
        </div>

        <div class="col-xxl-4">
            <div class="card h-100 rounded-4 overflow-hidden border-0">
                <div class="card-header">
                    <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                        <h6 class="mb-2 fw-bold text-lg mb-0">Transaction History</h6>
                        <a href="javascript:void(0)"
                            class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                            View All
                            <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                        </a>
                    </div>
                </div>

                <div class="card-body p-0">
                    <div class="table-responsive scroll-sm">
                        <table class="table bordered-table mb-0 rounded-0 border-0">
                            <thead>
                                <tr>
                                    <th scope="col" class="bg-transparent rounded-0">Customer</th>
                                    <th scope="col" class="bg-transparent rounded-0">Task</th>
                                    <th scope="col" class="bg-transparent rounded-0 text-center">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/user-grid/user-grid-img1.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Cameron Williamson</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">osgoodwy@gmail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>15</td>
                                    <td class="text-center">
                                        <div class="max-w-112 mx-auto">
                                            <div class="w-100">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-valuenow="30" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-purple rounded-pill"
                                                        style="width: 30%;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/user-grid/user-grid-img2.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Jenny Wilson</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">jennywilson@mail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>27</td>
                                    <td class="text-center">
                                        <div class="max-w-112 mx-auto">
                                            <div class="w-100">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-yellow rounded-pill"
                                                        style="width: 60%;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/user-grid/user-grid-img3.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Courtney Henry</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">courtneyh@mail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>42</td>
                                    <td class="text-center">
                                        <div class="max-w-112 mx-auto">
                                            <div class="w-100">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-valuenow="80" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-primary rounded-pill"
                                                        style="width: 80%;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/user-grid/user-grid-img4.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Darrell Steward</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">darrells@mail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>8</td>
                                    <td class="text-center">
                                        <div class="max-w-112 mx-auto">
                                            <div class="w-100">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-valuenow="20" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-success rounded-pill"
                                                        style="width: 20%;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/user-grid/user-grid-img5.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Kathryn Murphy</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">kathrynm@mail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>33</td>
                                    <td class="text-center">
                                        <div class="max-w-112 mx-auto">
                                            <div class="w-100">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-valuenow="50" aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-danger rounded-pill"
                                                        style="width: 50%;"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xxl-8">
            <div class="card h-100">
                <div
                    class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 class="text-lg fw-semibold mb-0">Recent Activity</h6>
                    <a href="javascript:void(0)"
                        class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                        View All
                        <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                    </a>
                </div>
                <div class="card-body p-0">
                    <div class="table-responsive scroll-sm">
                        <table class="table bordered-table mb-0 rounded-0 border-0">
                            <thead>
                                <tr>
                                    <th scope="col" class="bg-transparent rounded-0">Users</th>
                                    <th scope="col" class="bg-transparent rounded-0">Transaction ID</th>
                                    <th scope="col" class="bg-transparent rounded-0">Amount</th>
                                    <th scope="col" class="bg-transparent rounded-0">Payment </th>
                                    <th scope="col" class="bg-transparent rounded-0">Date</th>
                                    <th scope="col" class="bg-transparent rounded-0 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/users/user1.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Cameron Williamson</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">osgoodwy@gmail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>9562415412263</td>
                                    <td>$29.00</td>
                                    <td>Bank</td>
                                    <td>24 Jun 2024</td>
                                    <td class="text-center">
                                        <span
                                            class="bg-success-focus text-success-main px-32 py-4 rounded-pill fw-medium text-sm">Paid</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/users/user2.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Jenny Wilson</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">jennywilson@mail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>8745963214785</td>
                                    <td>$120.50</td>
                                    <td>PayPal</td>
                                    <td>05 Jul 2024</td>
                                    <td class="text-center">
                                        <span
                                            class="bg-warning-focus text-warning-main px-32 py-4 rounded-pill fw-medium text-sm">Pending</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/users/user3.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Courtney Henry</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">courtneyh@mail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>6321457896521</td>
                                    <td>$75.99</td>
                                    <td>Credit Card</td>
                                    <td>18 Jul 2024</td>
                                    <td class="text-center">
                                        <span
                                            class="bg-danger-focus text-danger-main px-32 py-4 rounded-pill fw-medium text-sm">Failed</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/users/user4.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Darrell Steward</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">darrells@mail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>4578963258741</td>
                                    <td>$210.00</td>
                                    <td>Stripe</td>
                                    <td>30 Jul 2024</td>
                                    <td class="text-center">
                                        <span
                                            class="bg-info-focus text-info-main px-32 py-4 rounded-pill fw-medium text-sm">In
                                            Progress</span>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img src="assets/images/users/user5.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                            <div class="flex-grow-1">
                                                <h6 class="text-md mb-0">Kathryn Murphy</h6>
                                                <span
                                                    class="text-sm text-secondary-light fw-medium">kathrynm@mail.com</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>7896541239874</td>
                                    <td>$340.75</td>
                                    <td>Bank Transfer</td>
                                    <td>12 Aug 2024</td>
                                    <td class="text-center">
                                        <span
                                            class="bg-success-focus text-success-main px-32 py-4 rounded-pill fw-medium text-sm">Paid</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

        <div class="col-xxl-6">
            <div class="row gy-4 h-100">
                <div class="col-md-4">
                    <div
                        class="trail-bg h-100 text-center d-flex flex-column justify-content-between align-items-center p-16 radius-8">
                        <h6 class="text-white text-xl">Upgrade Your Plan</h6>
                        <div class="">
                            <p class="text-white">Your free trial expired in 7 days</p>
                            <a href="#" class="btn py-8 rounded-pill w-100 bg-gradient-blue-warning text-sm">Upgrade
                                Now</a>
                        </div>
                    </div>
                </div>
                <div class="col-md-8">
                    <div class="card h-100 rounded-4 overflow-hidden border-0">
                        <div class="card-header">
                            <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                                <h6 class="mb-2 fw-bold text-lg mb-0">Statistics</h6>
                                <a href="javascript:void(0)"
                                    class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                                    View All
                                    <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                                </a>
                            </div>
                        </div>

                        <div class="card-body d-flex align-items-center gap-20 flex-sm-nowrap flex-wrap">
                            <div class="d-flex flex-column gap-12">
                                <div class="d-flex align-items-center gap-12">
                                    <div class="">
                                        <span
                                            class="w-20-px h-20-px bg-primary-600 rounded-circle position-relative">
                                            <span
                                                class="w-10-px h-10-px bg-primary-100 rounded-circle position-absolute top-50 start-50 translate-middle"></span>
                                        </span>
                                    </div>
                                    <div class="">
                                        <h6 class="mb-0">172</h6>
                                        <p class="text-secondary-light text-sm">Total Visitors</p>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center gap-12">
                                    <div class="">
                                        <span
                                            class="w-20-px h-20-px bg-warning-600 rounded-circle position-relative">
                                            <span
                                                class="w-10-px h-10-px bg-warning-100 rounded-circle position-absolute top-50 start-50 translate-middle"></span>
                                        </span>
                                    </div>
                                    <div class="">
                                        <h6 class="mb-0">300</h6>
                                        <p class="text-secondary-light text-sm">Total Page Views </p>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center gap-12">
                                    <div class="">
                                        <span class="w-20-px h-20-px bg-success rounded-circle position-relative">
                                            <span
                                                class="w-10-px h-10-px bg-green-light rounded-circle position-absolute top-50 start-50 translate-middle"></span>
                                        </span>
                                    </div>
                                    <div class="">
                                        <h6 class="mb-0">200</h6>
                                        <p class="text-secondary-light text-sm">Registrations</p>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center gap-12">
                                    <div class="">
                                        <span class="w-20-px h-20-px bg-purple rounded-circle position-relative">
                                            <span
                                                class="w-10-px h-10-px bg-purple-30 rounded-circle position-absolute top-50 start-50 translate-middle"></span>
                                        </span>
                                    </div>
                                    <div class="">
                                        <h6 class="mb-0">500</h6>
                                        <p class="text-secondary-light text-sm">Registrations</p>
                                    </div>
                                </div>
                            </div>
                            <div class="">
                                <div id="userOverviewDonutChart" class="apexcharts-tooltip-z-none"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="col-xxl-6">
            <div class="card h-100">
                <div class="card-body">
                    <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 class="mb-2 fw-bold text-lg mb-0">Sales by Countries</h6>
                        <select
                            class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                            <option>This Month</option>
                            <option>This Week</option>
                            <option>This Year</option>
                        </select>
                    </div>

                    <div class="row gy-4">
                        <div class="col-lg-6">
                            <div id="world-map" class="h-100 border radius-8"></div>
                        </div>

                        <div class="col-lg-6">
                            <div class="h-100 border p-16 pe-0 radius-8">
                                <div class="max-h-266-px overflow-y-auto scroll-sm pe-16">
                                    <div class="d-flex align-items-center justify-content-between gap-3 mb-12 pb-2">
                                        <div class="d-flex align-items-center w-100">
                                            <img src="assets/images/flags/flag1.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12">
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">USA</h6>
                                                <span class="text-xs text-secondary-light fw-medium">1,240
                                                    Users</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-label="Success example" aria-valuenow="25"
                                                    aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-primary-600 rounded-pill"
                                                        style="width: 80%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">80%</span>
                                        </div>
                                    </div>

                                    <div class="d-flex align-items-center justify-content-between gap-3 mb-12 pb-2">
                                        <div class="d-flex align-items-center w-100">
                                            <img src="assets/images/flags/flag2.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12">
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">Japan</h6>
                                                <span class="text-xs text-secondary-light fw-medium">1,240
                                                    Users</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-label="Success example" aria-valuenow="25"
                                                    aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-orange rounded-pill"
                                                        style="width: 60%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">60%</span>
                                        </div>
                                    </div>

                                    <div class="d-flex align-items-center justify-content-between gap-3 mb-12 pb-2">
                                        <div class="d-flex align-items-center w-100">
                                            <img src="assets/images/flags/flag3.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12">
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">France</h6>
                                                <span class="text-xs text-secondary-light fw-medium">1,240
                                                    Users</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-label="Success example" aria-valuenow="25"
                                                    aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-yellow rounded-pill"
                                                        style="width: 49%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">49%</span>
                                        </div>
                                    </div>

                                    <div class="d-flex align-items-center justify-content-between gap-3 mb-12 pb-2">
                                        <div class="d-flex align-items-center w-100">
                                            <img src="assets/images/flags/flag4.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12">
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">Germany</h6>
                                                <span class="text-xs text-secondary-light fw-medium">1,240
                                                    Users</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-label="Success example" aria-valuenow="25"
                                                    aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-success-main rounded-pill"
                                                        style="width: 100%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">100%</span>
                                        </div>
                                    </div>

                                    <div class="d-flex align-items-center justify-content-between gap-3 mb-12 pb-2">
                                        <div class="d-flex align-items-center w-100">
                                            <img src="assets/images/flags/flag5.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12">
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">South Korea</h6>
                                                <span class="text-xs text-secondary-light fw-medium">1,240
                                                    Users</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-label="Success example" aria-valuenow="25"
                                                    aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-info-main rounded-pill"
                                                        style="width: 30%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">30%</span>
                                        </div>
                                    </div>
                                    <div class="d-flex align-items-center justify-content-between gap-3">
                                        <div class="d-flex align-items-center w-100">
                                            <img src="assets/images/flags/flag1.png" alt="Image"
                                                class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12">
                                            <div class="flex-grow-1">
                                                <h6 class="text-sm mb-0">USA</h6>
                                                <span class="text-xs text-secondary-light fw-medium">1,240
                                                    Users</span>
                                            </div>
                                        </div>
                                        <div class="d-flex align-items-center gap-2 w-100">
                                            <div class="w-100 max-w-66 ms-auto">
                                                <div class="progress progress-sm rounded-pill" role="progressbar"
                                                    aria-label="Success example" aria-valuenow="25"
                                                    aria-valuemin="0" aria-valuemax="100">
                                                    <div class="progress-bar bg-primary-600 rounded-pill"
                                                        style="width: 80%;"></div>
                                                </div>
                                            </div>
                                            <span class="text-secondary-light font-xs fw-semibold">80%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>

<?php include './layouts/layout-bottom.php' ?>