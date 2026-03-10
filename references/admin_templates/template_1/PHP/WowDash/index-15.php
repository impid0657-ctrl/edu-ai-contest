<?php
    $title = 'Project Management';
    $subTitle = 'Project Management';
    $script='<script src="assets/js/index-15.js"></script>';
?>

<?php include './layouts/layout-top.php' ?>

    <div class="row gy-4">

        <div class="col-xxl-8">
            <div class="card h-100 radius-8 border-0">
                <div class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 class="text-lg fw-semibold mb-0">Average Earnings</h6>
                    <div class="">
                        <select class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
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
                            <span class="text-secondary-light text-sm fw-semibold">Income:
                                <span class="text-primary-light text-xl fw-bold line-height-1">$26,201</span>
                            </span>
                        </li>
                        <li class="d-flex align-items-center gap-2">
                            <span class="w-12-px h-8-px rounded-pill bg-warning-600"></span>
                            <span class="text-secondary-light text-sm fw-semibold">Expense:
                                <span class="text-primary-light text-xl fw-bold line-height-1"> $3,120</span>
                            </span>
                        </li>
                    </ul>
                    <div id="averageEarningChart" class="apexcharts-tooltip-style-1"></div>
                </div>
            </div>
        </div>

        <div class="col-xxl-4">
            <div class="card h-100 radius-8 border-0">
                <div class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 class="text-lg fw-semibold mb-0">Working Schedule</h6>
                    <div class="">
                        <select class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                            <option>Jan 2025</option>
                            <option>Feb 2025</option>
                            <option>March 2025</option>
                            <option>April 2025</option>
                            <option>May 2025</option>
                            <option>June 2025</option>
                            <option>July 2025</option>
                            <option>Aug 2025</option>
                            <option>Sep 2025</option>
                            <option>Oct 2025</option>
                            <option>Nov 2025</option>
                            <option>Dec 2025</option>
                        </select>
                    </div>
                </div>
                <div class="card-body p-24">
                    
                    <div class="d-flex align-items-center gap-16 justify-content-between flex-wrap">
                        <div class="week-item text-center">
                            <span class="text-sm text-neutral-400 fw-medium">Fr</span>
                            <h6 class="text-md mb-0">21</h6>
                        </div>
                        <div class="week-item text-center">
                            <span class="text-sm text-neutral-400 fw-medium">Sa</span>
                            <h6 class="text-md mb-0">22</h6>
                        </div>
                        <div class="week-item text-center">
                            <span class="text-sm text-neutral-400 fw-medium">Su</span>
                            <h6 class="text-md mb-0">23</h6>
                        </div>
                        <div class="week-item text-center">
                            <span class="text-sm text-neutral-400 fw-medium">Mo</span>
                            <h6 class="text-md mb-0">24</h6>
                        </div>
                        <div class="week-item text-center bg-purple rounded-pill py-12 px-16">
                            <span class="text-sm text-white fw-medium">Tu</span>
                            <h6 class="text-md mb-0 text-white">25</h6>
                        </div>
                        <div class="week-item text-center">
                            <span class="text-sm text-neutral-400 fw-medium">We</span>
                            <h6 class="text-md mb-0">26</h6>
                        </div>
                        <div class="week-item text-center">
                            <span class="text-sm text-neutral-400 fw-medium">Th</span>
                            <h6 class="text-md mb-0">27</h6>
                        </div>
                        <div class="text-center">
                            <span class="text-sm text-neutral-400 fw-medium">Fr</span>
                            <h6 class="text-md mb-0">28</h6>
                        </div>
                        <div class="text-center">
                            <span class="text-sm text-neutral-400 fw-medium">Sa</span>
                            <h6 class="text-md mb-0">29</h6>
                        </div>
                        <div class="text-center">
                            <span class="text-sm text-neutral-400 fw-medium">Su</span>
                            <h6 class="text-md mb-0">30</h6>
                        </div>
                    </div>
                    
                    <div class="mt-24 d-flex flex-column gap-20">
                        <div class="d-flex align-items-center justify-content-between gap-1 ps-10 border-inline-start border-start-width-3-px border-purple">
                            <div class="">
                                <div class="d-flex align-items-center gap-1">
                                    <h6 class="text-lg mb-0">10:20 - 11:00</h6>
                                    <span class="text-xs text-secondary-light fw-medium">AM</span>
                                </div>
                                <p class="text-sm text-secondary-light fw-medium mb-1">UI UX Dashboard Project Meeting</p>
                                <p class="text-xs text-neutral-400 fw-medium mb-0">Lead by <span class="text-success-600">Jane Cooper</span> </p>
                            </div>
                            <div class="">  
                                <a href="javascript:void(0)" class="btn btn-neutral-200 text-sm text-primary-light py-6 px-16">View </a>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-between gap-1 ps-10 border-inline-start border-start-width-3-px border-warning-600">
                            <div class="">
                                <div class="d-flex align-items-center gap-1">
                                    <h6 class="text-lg mb-0">10:20 - 11:00</h6>
                                    <span class="text-xs text-secondary-light fw-medium">AM</span>
                                </div>
                                <p class="text-sm text-secondary-light fw-medium mb-1">UI UX Dashboard Project Meeting</p>
                                <p class="text-xs text-neutral-400 fw-medium mb-0">Lead by <span class="text-success-600">Jane Cooper</span> </p>
                            </div>
                            <div class="">  
                                <a href="javascript:void(0)" class="btn btn-neutral-200 text-sm text-primary-light py-6 px-16">View </a>
                            </div>
                        </div>
                        <div class="d-flex align-items-center justify-content-between gap-1 ps-10 border-inline-start border-start-width-3-px border-info-600">
                            <div class="">
                                <div class="d-flex align-items-center gap-1">
                                    <h6 class="text-lg mb-0">10:20 - 11:00</h6>
                                    <span class="text-xs text-secondary-light fw-medium">AM</span>
                                </div>
                                <p class="text-sm text-secondary-light fw-medium mb-1">UI UX Dashboard Project Meeting</p>
                                <p class="text-xs text-neutral-400 fw-medium mb-0">Lead by <span class="text-success-600">Jane Cooper</span> </p>
                            </div>
                            <div class="">  
                                <a href="javascript:void(0)" class="btn btn-neutral-200 text-sm text-primary-light py-6 px-16">View </a>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
        
        <!-- Widgets start -->
        <div class="col-xxl-3 col-sm-6">
            <div class="bg-base p-16 radius-8 position-relative overflow-hidden">
                <span class="blur-gradient blur-gradient-1 position-absolute end-0 top-50"></span>

                <div class="d-flex align-items-center justify-content-between gap-1">
                    <div class="">
                        <span class="text-secondary-light text-sm fw-medium">Total Projects</span>
                        <h6 class="text-2xl mb-0">320</h6>
                    </div>
                    <span class="w-40-px h-40-px radius-8 bg-danger-600 text-white d-flex justify-content-center align-items-center text-xxl">
                        <i class="ri-file-text-fill"></i>
                    </span>
                </div>
                <a href="javascript:void(0)" class="btn btn-success-100 text-success-600 text-sm py-1 px-16 mt-10">View More</a>
            </div>
        </div>
        <div class="col-xxl-3 col-sm-6">
            <div class="bg-base p-16 radius-8 position-relative overflow-hidden">
                <span class="blur-gradient blur-gradient-2 position-absolute end-0 top-50"></span>

                <div class="d-flex align-items-center justify-content-between gap-1">
                    <div class="">
                        <span class="text-secondary-light text-sm fw-medium">Total Clients</span>
                        <h6 class="text-2xl mb-0">547</h6>
                    </div>
                    <span class="w-40-px h-40-px radius-8 bg-success-600 text-white d-flex justify-content-center align-items-center text-xxl">
                        <i class="ri-user-2-fill"></i>
                    </span>
                </div>
                <a href="javascript:void(0)" class="btn btn-success-100 text-success-600 text-sm py-1 px-16 mt-10">View More</a>
            </div>
        </div>
        <div class="col-xxl-3 col-sm-6">
            <div class="bg-base p-16 radius-8 position-relative overflow-hidden">
                <span class="blur-gradient blur-gradient-3 position-absolute end-0 top-50"></span>

                <div class="d-flex align-items-center justify-content-between gap-1">
                    <div class="">
                        <span class="text-secondary-light text-sm fw-medium">Team Members</span>
                        <h6 class="text-2xl mb-0">356</h6>
                    </div>
                    <span class="w-40-px h-40-px radius-8 bg-warning-600 text-white d-flex justify-content-center align-items-center text-xxl">
                        <i class="ri-group-fill"></i>
                    </span>
                </div>
                <a href="javascript:void(0)" class="btn btn-success-100 text-success-600 text-sm py-1 px-16 mt-10">View More</a>
            </div>
        </div>
        <div class="col-xxl-3 col-sm-6">
            <div class="bg-base p-16 radius-8 position-relative overflow-hidden">
                <span class="blur-gradient blur-gradient-4 position-absolute end-0 top-50"></span>

                <div class="d-flex align-items-center justify-content-between gap-1">
                    <div class="">
                        <span class="text-secondary-light text-sm fw-medium">Finished Projects</span>
                        <h6 class="text-2xl mb-0">435</h6>
                    </div>
                    <span class="w-40-px h-40-px radius-8 bg-info-600 text-white d-flex justify-content-center align-items-center text-xxl">
                        <i class="ri-file-list-3-fill"></i>
                    </span>
                </div>
                <a href="javascript:void(0)" class="btn btn-success-100 text-success-600 text-sm py-1 px-16 mt-10">View More</a>
            </div>
        </div>
        <!-- Widgets End -->
        
        <div class="col-xxl-4 col-sm-6">
            <div class="card h-100">
                <div class="card-body p-24">
                    <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 class="mb-2 fw-bold text-lg">My Tasks</h6>
                        <div class="">
                        <select class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                            <option>All Tasks</option>
                            <option>Pending</option>
                            <option>Completed</option>
                            <option>In Progress</option>
                            <option>Canceled</option>
                        </select>
                        </div>
                    </div>
                    
                    <div class="table-responsive scroll-sm">
                        <table class="table bordered-table mb-0 border-neutral-50">
                            <thead>
                                <tr>
                                <th scope="col" class="border-neutral-50">Project Name</th>
                                <th scope="col" class="border-neutral-50">Deadline</th>
                                <th scope="col" class="border-neutral-50">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="border-neutral-50">Web Development</td>
                                    <td class="border-neutral-50">10 Jan 2025</td>
                                    <td class="border-neutral-50 text-center"> 
                                        <span class="bg-warning-focus text-warning-main px-16 py-2 radius-4 fw-medium text-sm">Pending</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="border-neutral-50">UX/UI Design</td>
                                    <td class="border-neutral-50">10 Jan 2025</td>
                                    <td class="border-neutral-50 text-center"> 
                                        <span class="bg-success-focus text-success-main px-16 py-2 radius-4 fw-medium text-sm">Completed</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="border-neutral-50">React Development</td>
                                    <td class="border-neutral-50">10 Jan 2025</td>
                                    <td class="border-neutral-50 text-center"> 
                                        <span class="bg-purple-light text-purple px-16 py-2 radius-4 fw-medium text-sm">InProgress</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="border-neutral-50">Django Development</td>
                                    <td class="border-neutral-50">10 Jan 2025</td>
                                    <td class="border-neutral-50 text-center"> 
                                        <span class="bg-warning-focus text-warning-main px-16 py-2 radius-4 fw-medium text-sm">Pending</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="border-neutral-50">Web Development</td>
                                    <td class="border-neutral-50">10 Jan 2025</td>
                                    <td class="border-neutral-50 text-center"> 
                                        <span class="bg-danger-focus text-danger-main px-16 py-2 radius-4 fw-medium text-sm">Cancelled</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="border-neutral-50">Web Design</td>
                                    <td class="border-neutral-50">10 Jan 2025</td>
                                    <td class="border-neutral-50 text-center"> 
                                        <span class="bg-purple-light text-purple px-16 py-2 radius-4 fw-medium text-sm">InProgress</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>

        <div class="col-xxl-4 col-sm-6">
            <div class="card h-100 radius-8 border-0">
                <div class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 class="text-lg fw-semibold mb-0">Project Analysis</h6>
                    <div class="">
                        <select class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                            <option>Yearly</option>
                            <option>Monthly</option>
                            <option>Weekly</option>
                            <option>Today</option>
                        </select>
                    </div>
                </div>
            <div class="card-body p-24">
                <ul class="d-flex flex-wrap align-items-center justify-content-center">
                    <li class="d-flex align-items-center gap-2 me-28">
                    <span class="w-12-px h-12-px rounded-circle bg-success-main"></span>
                    <span class="text-secondary-light text-sm fw-medium">Revenue</span>
                    </li>
                    <li class="d-flex align-items-center gap-2 me-28">
                    <span class="w-12-px h-12-px rounded-circle bg-warning-main"></span>
                    <span class="text-secondary-light text-sm fw-medium">Expenses</span>
                    </li>
                    <li class="d-flex align-items-center gap-2">
                    <span class="w-12-px h-12-px rounded-circle bg-purple"></span>
                    <span class="text-secondary-light text-sm fw-medium">Budgets</span>
                    </li>
                </ul>
                <div class="mt-40">
                    <div id="projectAnalysisChart" class="margin-16-minus"></div>
                </div>
            </div>
            </div>
        </div>
        
        <div class="col-xxl-4 col-sm-6">
            <div class="card h-100">
                <div class="card-body p-24">
                    <div class="d-flex align-items-center flex-wrap gap-2 justify-content-between mb-20">
                        <h6 class="mb-2 fw-bold text-lg">Team Members</h6>
                        <a href="javascript:void(0)" class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                            View All
                            <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                        </a>
                    </div>
                    
                    <div class="table-responsive scroll-sm">
                        <table class="table bordered-table mb-0 border-neutral-100">
                            <thead> 
                                <tr>
                                <th scope="col" class="border-neutral-100">Customer</th>
                                <th scope="col" class="border-neutral-100">Task</th>
                                <th scope="col" class="border-neutral-100">Progress</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                <td class="border-neutral-100">
                                    <div class="d-flex align-items-center gap-12">
                                        <img src="assets/images/user-grid/user-grid-img5.png" alt="User" class="object-fit-cover rounded-circle w-40-px h-40-px radius-8 flex-shrink-0 overflow-hidden">
                                        <div class="flex-grow-1">
                                            <h6 class="text-md mb-0 fw-medium">Kristin Watson</h6>
                                            <span class="text-sm text-secondary-light fw-medium">ulfaha@mail.ru</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="border-neutral-100">15</td>
                                <td class="border-neutral-100"> 
                                    <div class="max-w-112 mx-auto">
                                    <div class="w-100">
                                        <div class="progress progress-sm rounded-pill" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar bg-purple rounded-start-pill" style="width: 80%;"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <td class="border-neutral-100">
                                    <div class="d-flex align-items-center gap-12">
                                        <img src="assets/images/user-grid/user-grid-img4.png" alt="User" class="object-fit-cover rounded-circle w-40-px h-40-px radius-8 flex-shrink-0 overflow-hidden">
                                        <div class="flex-grow-1">
                                            <h6 class="text-md mb-0 fw-medium">Theresa Webb</h6>
                                            <span class="text-sm text-secondary-light fw-medium">joie@gmail.com</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="border-neutral-100">20</td>
                                <td class="border-neutral-100"> 
                                    <div class="max-w-112 mx-auto">
                                    <div class="w-100">
                                        <div class="progress progress-sm rounded-pill" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar bg-warning-main rounded-start-pill" style="width: 50%;"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <td class="border-neutral-100">
                                    <div class="d-flex align-items-center gap-12">
                                        <img src="assets/images/user-grid/user-grid-img3.png" alt="User" class="object-fit-cover rounded-circle w-40-px h-40-px radius-8 flex-shrink-0 overflow-hidden">
                                        <div class="flex-grow-1">
                                            <h6 class="text-md mb-0 fw-medium">Brooklyn Simmons</h6>
                                            <span class="text-sm text-secondary-light fw-medium">warn@mail.ru</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="border-neutral-100">24</td>
                                <td class="border-neutral-100"> 
                                    <div class="max-w-112 mx-auto">
                                    <div class="w-100">
                                        <div class="progress progress-sm rounded-pill" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar bg-info-main rounded-start-pill" style="width: 60%;"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <td class="border-neutral-100">
                                    <div class="d-flex align-items-center gap-12">
                                        <img src="assets/images/user-grid/user-grid-img2.png" alt="User" class="object-fit-cover rounded-circle w-40-px h-40-px radius-8 flex-shrink-0 overflow-hidden">
                                        <div class="flex-grow-1">
                                            <h6 class="text-md mb-0 fw-medium">Robert Fox</h6>
                                            <span class="text-sm text-secondary-light fw-medium">fellora@mail.ru</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="border-neutral-100">26</td>
                                <td class="border-neutral-100"> 
                                    <div class="max-w-112 mx-auto">
                                    <div class="w-100">
                                        <div class="progress progress-sm rounded-pill" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar bg-success-main rounded-start-pill" style="width: 92%;"></div>
                                        </div>
                                    </div>
                                    </div>
                                </td>
                                </tr>
                                <tr>
                                <td class="border-neutral-100">
                                    <div class="d-flex align-items-center gap-12">
                                        <img src="assets/images/user-grid/user-grid-img1.png" alt="User" class="object-fit-cover rounded-circle w-40-px h-40-px radius-8 flex-shrink-0 overflow-hidden">
                                        <div class="flex-grow-1">
                                            <h6 class="text-md mb-0 fw-medium">Jane Cooper</h6>
                                            <span class="text-sm text-secondary-light fw-medium">zitka@mail.ru</span>
                                        </div>
                                    </div>
                                </td>
                                <td class="border-neutral-100">25</td>
                                <td class="border-neutral-100"> 
                                    <div class="max-w-112 mx-auto">
                                    <div class="w-100">
                                        <div class="progress progress-sm rounded-pill" role="progressbar" aria-label="Success example" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                                        <div class="progress-bar bg-red rounded-start-pill" style="width: 25%;"></div>
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

        <div class="col-xxl-4 col-sm-6">
            <div class="shadow-7 radius-12 bg-base h-100 overflow-hidden">
                <div class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 class="text-lg fw-semibold mb-0">Tasks Overview </h6>
                    <div class="">
                        <select class="form-select form-select-sm w-auto bg-base border text-secondary-light radius-8">
                            <option>Yearly</option>
                            <option>Monthly</option>
                            <option>Weekly</option>
                            <option>Today</option>
                        </select>
                    </div>
                </div>
                <div class="card-body p-32 mt-20">
                    <div class="position-relative text-center">
                        <div id="taskOverviewChart" class="margin-16-minus y-value-left apexcharts-tooltip-z-none"></div>

                        <div class="text-center position-absolute top-50 start-50 translate-middle">
                            <span class="text-secondary-light">Total Tasks</span>
                            <h6 class="mb-0 mt-1">46</h6>
                        </div>
                    </div>
                </div>

                <ul class="d-flex flex-wrap align-items-center justify-content-center pb-24 mt-24 gap-28">
                    <li class="d-flex align-items-center gap-2">
                        <span class="w-12-px h-12-px rounded-circle bg-warning-main"></span>
                        <span class="text-secondary-light text-sm fw-medium">Pending</span>
                    </li>
                    <li class="d-flex align-items-center gap-2">
                        <span class="w-12-px h-12-px rounded-circle bg-info-main"></span>
                        <span class="text-secondary-light text-sm fw-medium">In Progress</span>
                    </li>
                    <li class="d-flex align-items-center gap-2">
                        <span class="w-12-px h-12-px rounded-circle bg-purple"></span>
                        <span class="text-secondary-light text-sm fw-medium">Completed</span>
                    </li>
                    <li class="d-flex align-items-center gap-2">
                        <span class="w-12-px h-12-px rounded-circle bg-danger"></span>
                        <span class="text-secondary-light text-sm fw-medium">Cancelled</span>
                    </li>
                </ul>
            </div>
        </div>

        <div class="col-xxl-8">
            <div class="shadow-7 radius-12 bg-base h-100 overflow-hidden">
                <div class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center justify-content-between">
                    <h6 class="text-lg fw-semibold mb-0">Projects Status</h6>
                    <a href="javascript:void(0)" class="text-primary-600 hover-text-primary d-flex align-items-center gap-1">
                        View All
                        <iconify-icon icon="solar:alt-arrow-right-linear" class="icon"></iconify-icon>
                    </a>
                </div>
                <div class="card-body p-24">
                    <div class="table-responsive scroll-sm">
                        <table class="table bordered-table mb-0">
                            <thead>
                                <tr>
                                    <th scope="col" class="rounded-0">Project Name</th>
                                    <th scope="col" class="rounded-0">Clients</th>
                                    <th scope="col" class="rounded-0">Budget</th>
                                    <th scope="col" class="rounded-0">Duration</th>
                                    <th scope="col" class="rounded-0">Progress</th>
                                    <th scope="col" class="rounded-0 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-secondary-light"> UX/UI Design </td>
                                    <td class="text-secondary-light">Robert Fox</td>
                                    <td class="text-secondary-light">$24,000</td>
                                    <td class="text-secondary-light">24 Days</td>
                                    <td class="text-secondary-light">
                                        <span class="bg-success-focus text-success-main px-6 py-2 radius-4 fw-semibold text-sm d-inline-flex align-items-center gap-1">
                                            <i class="ri-arrow-right-up-line"></i>
                                            95%
                                        </span>
                                    </td>
                                    <td class="text-center"> 
                                        <span class="bg-warning-focus text-warning-main px-16 py-2 radius-4 fw-semibold text-sm">Pending</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-secondary-light"> HTML Developer</td>
                                    <td class="text-secondary-light">Leslie Alexander</td>
                                    <td class="text-secondary-light">$32,700</td>
                                    <td class="text-secondary-light">16 Days</td>
                                    <td class="text-secondary-light">
                                        <span class="bg-danger-focus text-danger-main px-6 py-2 radius-4 fw-semibold text-sm d-inline-flex align-items-center gap-1">
                                            <i class="ri-arrow-left-down-line"></i>
                                            95%
                                        </span>
                                    </td>
                                    <td class="text-center"> 
                                        <span class="bg-success-focus text-success-main px-16 py-2 radius-4 fw-semibold text-sm">Completed</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-secondary-light">React Development</td>
                                    <td class="text-secondary-light">Devon Lane</td>
                                    <td class="text-secondary-light">$7,250</td>
                                    <td class="text-secondary-light">7 Days</td>
                                    <td class="text-secondary-light">
                                        <span class="bg-success-focus text-success-main px-6 py-2 radius-4 fw-semibold text-sm d-inline-flex align-items-center gap-1">
                                            <i class="ri-arrow-right-up-line"></i>
                                            95%
                                        </span>
                                    </td>
                                    <td class="text-center"> 
                                        <span class="bg-purple-light text-purple px-16 py-2 radius-4 fw-semibold text-sm">InProgress</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-secondary-light">Python Research</td>
                                    <td class="text-secondary-light">Savannah Nguyen</td>
                                    <td class="text-secondary-light">$24,500</td>
                                    <td class="text-secondary-light">3 Days</td>
                                    <td class="text-secondary-light">
                                        <span class="bg-success-focus text-success-main px-6 py-2 radius-4 fw-semibold text-sm d-inline-flex align-items-center gap-1">
                                            <i class="ri-arrow-right-up-line"></i>
                                            95%
                                        </span>
                                    </td>
                                    <td class="text-center"> 
                                        <span class="bg-warning-focus text-warning-main px-16 py-2 radius-4 fw-semibold text-sm">Pending</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td class="text-secondary-light">Laravel Project</td>
                                    <td class="text-secondary-light">Esther Howard</td>
                                    <td class="text-secondary-light">$30,000</td>
                                    <td class="text-secondary-light">5 Days</td>
                                    <td class="text-secondary-light">
                                        <span class="bg-success-focus text-success-main px-6 py-2 radius-4 fw-semibold text-sm d-inline-flex align-items-center gap-1">
                                            <i class="ri-arrow-right-up-line"></i>
                                            95%
                                        </span>
                                    </td>
                                    <td class="text-center"> 
                                        <span class="bg-danger-focus text-danger-main px-16 py-2 radius-4 fw-semibold text-sm">Cancelled</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>

    </div>

<?php include './layouts/layout-bottom.php' ?>