<?php
    $title = 'Call Center';
    $subTitle = 'Call Center';
    $script='<script src="assets/js/index-16.js"></script>';
?>

<?php include './layouts/layout-top.php' ?>

    <div class="bg-base radius-12 shadow-7 overflow-x-auto">
        <div class="d-flex min-w-max-content stats-card-wrapper">
            <div class="d-grid grid-cols-3 flex-grow-1">
                <div class="hover-gradient text-center py-24 px-16">
                    <span class="">
                        <img src="assets/images/home-sixteen/icon/phone-icon1.png" alt="Icon">
                    </span>
                    <h6 class="text-xl mt-12">Incoming Calls</h6>
                    <p class="text-secondary-light">Last 7 days</p>
                    <h5 class="mt-12">526</h5>
                    <p class="text-secondary-light mt-16">Vs 497 prev. 7 days</p>
                </div>
                <div class="hover-gradient text-center py-24 px-16">
                    <span class="">
                        <img src="assets/images/home-sixteen/icon/phone-icon2.png" alt="Icon">
                    </span>
                    <h6 class="text-xl mt-12">Answered Calls</h6>
                    <p class="text-secondary-light">Last 7 days</p>
                    <h5 class="mt-12">526</h5>
                    <p class="text-secondary-light mt-16">Vs 497 prev. 7 days</p>
                </div>
                <div class="hover-gradient text-center py-24 px-16">
                    <span class="">
                        <img src="assets/images/home-sixteen/icon/phone-icon3.png" alt="Icon">
                    </span>
                    <h6 class="text-xl mt-12">Abandoned Calls</h6>
                    <p class="text-secondary-light">Last 7 days</p>
                    <h5 class="mt-12">526</h5>
                    <p class="text-secondary-light mt-16">Vs 497 prev. 7 days</p>
                </div>
            </div>
            <div class="py-24 d-xxl-block d-none">
                <span class="w-2-px h-100 bg-neutral-200"></span>
            </div>
            <div class="d-flex align-items-center gap-50-px pe-90-px">
                <div class="position-relative">
                    <svg class="radial-progress" data-percentage="90" viewBox="0 0 80 80">
                        <circle class="incomplete" cx="40" cy="40" r="35"></circle>
                        <circle class="complete" cx="40" cy="40" r="35"></circle>
                        <text class="percentage" x="50%" y="57%" transform="matrix(0, 1, -1, 0, 80, 0)"></text>
                    </svg>
                    <div class="text-center position-absolute top-50 start-50 translate-middle">
                        <span class="fw-semibold text-primary-light">Service Level</span>
                        <h3 class="mb-0">85.7</h3>
                        <span class="text-secondary-light mt-12 mb-0">Target: 90%</span>
                    </div>
                </div>
                <div class="">
                    <h6 class="text-xl">Average CSAT</h6>
                    <span class="fw-medium text-secondary-light">All time</span>
                    <div class="mt-12 d-flex align-items-start gap-10">
                        <h4 class="mb-0">4.7</h4>
                        <span class="text-white bg-success-600 text-sm px-10 rounded-pill">of 5</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="mt-24">
        <div class="row gy-4">
            <div class="col-xxl-4">
                <div class="card h-100 radius-8 border-0">
                    <div class="card-header">
                        <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between">
                            <h6 class="mb-2 fw-bold text-lg mb-0">Agent Avg. Earnings</h6>
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
                        <div class="d-inline-flex align-items-center gap-12">
                            <span
                                class="bg-success-100 w-48-px h-48-px text-xxl rounded-circle d-flex justify-content-center align-items-center text-secondary-light">
                                <img src="assets/images/home-sixteen/icon/dollar-bag.png" alt="Icon">
                            </span>
                            <div>
                                <h6 class="fw-semibold mb-0">$50,000</h6>
                                <span class="text-secondary-light mt-1">Total Earning</span>
                            </div>
                        </div>
                        <div id="barChart" class="barChart"></div>
                    </div>
                </div>
            </div>
            <div class="col-xxl-8">
                <div class="card h-100 radius-8 border-0">
                    <div
                        class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 class="text-lg fw-semibold mb-0">Overall Calls Volume</h6>
                        <div class="">
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
                        <ul class="d-flex flex-wrap align-items-center justify-content-center my-3 gap-3">
                            <li class="d-flex align-items-center gap-2">
                                <span class="w-12-px h-8-px rounded-pill bg-primary-600"></span>
                                <span class="text-secondary-light text-sm">Incoming Calls
                                    <span class="text-primary-light text-xl fw-bold line-height-1 ms-4">15.5k</span>
                                </span>
                            </li>
                            <li class="d-flex align-items-center gap-2">
                                <span class="w-12-px h-8-px rounded-pill bg-warning-600"></span>
                                <span class="text-secondary-light text-sm">Answered Calls
                                    <span class="text-primary-light text-xl fw-bold line-height-1 ms-4">20.5k</span>
                                </span>
                            </li>
                        </ul>
                        <div id="averageEarningChart" class="apexcharts-tooltip-style-1"></div>
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
                                    <div class="max-h-372-px overflow-y-auto scroll-sm pe-16">
                                        <div
                                            class="d-flex align-items-center justify-content-between gap-3 mb-16 pb-2">
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
                                                    <div class="progress progress-sm rounded-pill"
                                                        role="progressbar" aria-label="Success example"
                                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                        <div class="progress-bar bg-primary-600 rounded-pill"
                                                            style="width: 80%;"></div>
                                                    </div>
                                                </div>
                                                <span class="text-secondary-light font-xs fw-semibold">80%</span>
                                            </div>
                                        </div>

                                        <div
                                            class="d-flex align-items-center justify-content-between gap-3 mb-16 pb-2">
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
                                                    <div class="progress progress-sm rounded-pill"
                                                        role="progressbar" aria-label="Success example"
                                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                        <div class="progress-bar bg-orange rounded-pill"
                                                            style="width: 60%;"></div>
                                                    </div>
                                                </div>
                                                <span class="text-secondary-light font-xs fw-semibold">60%</span>
                                            </div>
                                        </div>

                                        <div
                                            class="d-flex align-items-center justify-content-between gap-3 mb-16 pb-2">
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
                                                    <div class="progress progress-sm rounded-pill"
                                                        role="progressbar" aria-label="Success example"
                                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                        <div class="progress-bar bg-yellow rounded-pill"
                                                            style="width: 49%;"></div>
                                                    </div>
                                                </div>
                                                <span class="text-secondary-light font-xs fw-semibold">49%</span>
                                            </div>
                                        </div>

                                        <div
                                            class="d-flex align-items-center justify-content-between gap-3 mb-16 pb-2">
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
                                                    <div class="progress progress-sm rounded-pill"
                                                        role="progressbar" aria-label="Success example"
                                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                                        <div class="progress-bar bg-success-main rounded-pill"
                                                            style="width: 100%;"></div>
                                                    </div>
                                                </div>
                                                <span class="text-secondary-light font-xs fw-semibold">100%</span>
                                            </div>
                                        </div>

                                        <div
                                            class="d-flex align-items-center justify-content-between gap-3 mb-16 pb-2">
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
                                                    <div class="progress progress-sm rounded-pill"
                                                        role="progressbar" aria-label="Success example"
                                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
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
                                                    <div class="progress progress-sm rounded-pill"
                                                        role="progressbar" aria-label="Success example"
                                                        aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
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
            <div class="col-xxl-6">
                <div class="card h-100">
                    <div
                        class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 class="text-lg fw-semibold mb-0">Best Agents This Week</h6>
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
                                        <th scope="col" class="bg-neutral-100 rounded-0">User</th>
                                        <th scope="col" class="bg-neutral-100 rounded-0">Calls</th>
                                        <th scope="col" class="bg-neutral-100 rounded-0">Avg. Duration</th>
                                        <th scope="col" class="bg-neutral-100 rounded-0">FCR</th>
                                        <th scope="col" class="bg-neutral-100 rounded-0">CSAT</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img1.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Dianne Russell</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>380</td>
                                        <td>8 mins 10 secs</td>
                                        <td>70%</td>
                                        <td>90%</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img2.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Cody Fisher</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>65</td>
                                        <td>4 mins 16 secs</td>
                                        <td>80%</td>
                                        <td>85%</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img3.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Ronald Richards</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>280</td>
                                        <td>5 mins 30 secs</td>
                                        <td>90%</td>
                                        <td>80%</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img4.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Albert Flores</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>230 </td>
                                        <td>12 mins 45 secs</td>
                                        <td>95%</td>
                                        <td>75%</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img5.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Cameron Williamson</h6>
                                                </div>
                                            </div>
                                        </td>
                                        <td>150</td>
                                        <td>3 mins 25 secs</td>
                                        <td>100%</td>
                                        <td>70%</td>
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
                        <h6 class="text-lg fw-semibold mb-0">Recent Calls</h6>
                        <a href="javascript:void(0)"
                            class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                            View All
                            <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                        </a>
                    </div>
                    <div class="card-body p-0">
                        <div class="table-responsive scroll-sm">
                            <table class="table bordered-table mb-0 rounded-0 border-0 sm-table">
                                <thead>
                                    <tr>
                                        <th scope="col" class="bg-transparent rounded-0">Caller Name</th>
                                        <th scope="col" class="bg-transparent rounded-0">Type</th>
                                        <th scope="col" class="bg-transparent rounded-0">Duration</th>
                                        <th scope="col" class="bg-transparent rounded-0">Time</th>
                                        <th scope="col" class="bg-transparent rounded-0">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td class="py-1">
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img1.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Kristin Watson</h6>
                                                    <span
                                                        class="text-sm text-secondary-light fw-medium">219.555.0114</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="fw-semibold text-success-600">Inbound</span>
                                        </td>
                                        <td>5 mins</td>
                                        <td>10:30 PM</td>
                                        <td> <span
                                                class="bg-success-focus text-success-main px-10 py-4 radius-8 fw-medium text-sm">Resolved</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="py-1">
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img2.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Theresa Webb</h6>
                                                    <span
                                                        class="text-sm text-secondary-light fw-medium">406.555.0120</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="fw-semibold text-success-600">Inbound</span>
                                        </td>
                                        <td>12 mins</td>
                                        <td>10:40 PM</td>
                                        <td> <span
                                                class="bg-lilac-100 text-lilac-600 px-10 py-4 radius-8 fw-medium text-sm">Pending</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="py-1">
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img3.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Brooklyn Simmons</h6>
                                                    <span
                                                        class="text-sm text-secondary-light fw-medium">229.555.0109</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="fw-semibold text-warning-600">Outbound</span>
                                        </td>
                                        <td>15 mins</td>
                                        <td>11:30 PM</td>
                                        <td> <span
                                                class="bg-warning-focus text-warning-main px-10 py-4 radius-8 fw-medium text-sm">Dropped
                                            </span> </td>
                                    </tr>
                                    <tr>
                                        <td class="py-1">
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img4.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Robert Fox</h6>
                                                    <span
                                                        class="text-sm text-secondary-light fw-medium">262.555.0131</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="fw-semibold text-success-600">Inbound</span>
                                        </td>
                                        <td>17 mins</td>
                                        <td>09:15 AM</td>
                                        <td> <span
                                                class="bg-success-focus text-success-main px-10 py-4 radius-8 fw-medium text-sm">Resolved</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="py-1">
                                            <div class="d-flex align-items-center">
                                                <img src="assets/images/user-grid/user-grid-img5.png" alt="Image"
                                                    class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                                                <div class="flex-grow-1">
                                                    <h6 class="text-md mb-0 fw-medium">Jane Cooper</h6>
                                                    <span
                                                        class="text-sm text-secondary-light fw-medium">671.555.0110</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="fw-semibold text-success-600">Inbound</span>
                                        </td>
                                        <td>25 mins</td>
                                        <td>10:30 PM</td>
                                        <td> <span
                                                class="bg-lilac-focus text-lilac-main px-10 py-4 radius-8 fw-medium text-sm">Pending</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-xxl-4">
                <div class="card h-100">
                    <div
                        class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                        <h6 class="text-lg fw-semibold mb-0">Reason for calls</h6>
                    </div>
                    <div class="card-body p-0">
                        <div class="position-relative">
                            <div id="statisticBarChart" class="text-style ps-24"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

<?php include './layouts/layout-bottom.php' ?>