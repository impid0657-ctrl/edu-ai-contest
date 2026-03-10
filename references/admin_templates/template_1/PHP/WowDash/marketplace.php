<?php
    $title='Marketplace';
    $subTitle='Marketplace';
    $script='<script src="assets/js/marketplace.js"></script>';
?>

<?php include './layouts/layout-top.php' ?>

    <div class="card h-100 p-0 radius-12">
        <div class="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
            <div class="d-flex align-items-center flex-wrap gap-3">
                <span class="text-md fw-medium text-secondary-light mb-0">Show</span>
                <select class="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px">
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                    <option>6</option>
                    <option>7</option>
                    <option>8</option>
                    <option>9</option>
                    <option>10</option>
                </select>
                <form class="navbar-search">
                    <input type="text" class="bg-base h-40-px w-auto" name="search" placeholder="Search">
                    <iconify-icon icon="ion:search-outline" class="icon"></iconify-icon>
                </form>
                <button type="button" class="btn border py-8 text-secondary-light fw-medium bg-hover-neutral-50 radius-8">Watchlist</button>
            </div>
            <a href="portfolio.php" class="btn btn-primary text-sm btn-sm px-24 py-10 radius-8"> 
                Portfolios
            </a>
        </div>
        <div class="card-body p-24">
            <div class="table-responsive scroll-sm">
                <table class="table bordered-table sm-table mb-0">
                <thead>
                    <tr>
                    <th scope="col">
                        <div class="d-flex align-items-center gap-10">
                            <div class="form-check style-check d-flex align-items-center">
                                <input class="form-check-input radius-4 border input-form-dark" type="checkbox" name="checkbox" id="selectAll">
                            </div>
                            S.L
                        </div>
                    </th>
                    <th scope="col">Aset</th>
                    <th scope="col">Circulating Supply</th>
                    <th scope="col">Price</th>
                    <th scope="col">Market Cap</th>
                    <th scope="col">Change %</th>
                    <th scope="col">Last (24H)</th>
                    <th scope="col" class="text-center">Watchlist</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="01">
                                </div>
                                01
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img1.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Bitcoin</span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">BTC</span>
                            </span>
                            </a>
                        </td>
                        <td>0.3464 BTC</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-success-focus text-success-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-up-s-fill"></i>
                                1.37%
                            </span> 
                        </td>
                        <td>
                            <div id="timeSeriesChart1" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="02">
                                </div>
                                02
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img2.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Ethereum</span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">ETH</span>
                            </span>
                            </a>
                        </td>
                        <td>0.5464 ETH</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-success-focus text-success-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-up-s-fill"></i>
                                1.37%
                            </span> 
                        </td>
                        <td>
                            <div id="timeSeriesChart2" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="03">
                                </div>
                                03
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img3.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Litecoin</span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">LTC</span>
                            </span>
                            </a>
                        </td>
                        <td>0.5464 LTC</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-success-focus text-success-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-up-s-fill"></i>
                                1.37%
                            </span> 
                        </td>
                        <td>
                            <div id="timeSeriesChart3" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="04">
                                </div>
                                04
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img4.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Binance</span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">BNB</span>
                            </span>
                            </a>
                        </td>
                        <td>0.5464 BNB</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-success-focus text-success-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-up-s-fill"></i>
                                1.37%
                            </span> 
                        </td>
                        <td>
                            <div id="timeSeriesChart4" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="05">
                                </div>
                                05
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img6.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Dogecoin</span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">DOGE</span>
                            </span>
                            </a>
                        </td>
                        <td>0.5464 DOGE</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-danger-focus text-danger-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-down-s-fill"></i>
                                1.37%
                            </span> 
                        </td>
                        <td>
                            <div id="timeSeriesChart5" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="06">
                                </div>
                                06
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img5.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Polygon </span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">MATIC</span>
                            </span>
                            </a>
                        </td>
                        <td>0.5464 MATIC</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-danger-focus text-danger-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-down-s-fill"></i>
                                1.37%
                            </span>  
                        </td>
                        <td>
                            <div id="timeSeriesChart6" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="066">
                                </div>
                                06
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img5.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Polygon </span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">MATIC</span>
                            </span>
                            </a>
                        </td>
                        <td>0.5464 MATIC</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-danger-focus text-danger-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-down-s-fill"></i>
                                1.37%
                            </span>  
                        </td>
                        <td>
                            <div id="timeSeriesChart7" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="016">
                                </div>
                                06
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img5.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Polygon </span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">MATIC</span>
                            </span>
                            </a>
                        </td>
                        <td>0.5464 MATIC</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-danger-focus text-danger-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-down-s-fill"></i>
                                1.37%
                            </span>  
                        </td>
                        <td>
                            <div id="timeSeriesChart8" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="026">
                                </div>
                                06
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img5.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Polygon </span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">MATIC</span>
                            </span>
                            </a>
                        </td>
                        <td>0.5464 MATIC</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-danger-focus text-danger-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-down-s-fill"></i>
                                1.37%
                            </span>  
                        </td>
                        <td>
                            <div id="timeSeriesChart9" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <div class="d-flex align-items-center gap-10">
                                <div class="form-check style-check d-flex align-items-center">
                                    <input class="form-check-input radius-4 border border-neutral-400" type="checkbox" name="checkbox" id="061">
                                </div>
                                06
                            </div>
                        </td>
                        <td>
                            <a href="marketplace-details.php" class="d-flex align-items-center">
                            <img src="assets/images/crypto/crypto-img5.png" alt="Image" class="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden">
                            <span class="flex-grow-1 d-flex flex-column">
                                <span class="text-md mb-0 fw-medium text-primary-light d-block">Polygon </span>
                                <span class="text-xs mb-0 fw-normal text-secondary-light">MATIC</span>
                            </span>
                            </a>
                        </td>
                        <td>0.5464 MATIC</td>
                        <td>$2,753.00</td>
                        <td>$361.32B</td>
                        <td>
                            <span class="bg-danger-focus text-danger-600 px-16 py-6 rounded-pill fw-semibold text-xs">
                                <i class="ri-arrow-down-s-fill"></i>
                                1.37%
                            </span>  
                        </td>
                        <td>
                            <div id="timeSeriesChart10" class="remove-tooltip-title rounded-tooltip-value"></div>
                        </td>
                        <td class="text-center">
                            <button type="button" class="star-btn text-2xl text-neutral-400 text-hover-primary-600 line-height-1"><i class="ri-star-line"></i></button>
                        </td>
                    </tr>
                </tbody>
                </table>
            </div>

            <div class="d-flex align-items-center justify-content-between flex-wrap gap-2 mt-24">
                <span>Showing 1 to 10 of 12 entries</span>
                <ul class="pagination d-flex flex-wrap align-items-center gap-2 justify-content-center">
                    <li class="page-item">
                        <a class="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md" href="javascript:void(0)"><iconify-icon icon="ep:d-arrow-left" class=""></iconify-icon></a>
                    </li>
                    <li class="page-item">
                        <a class="page-link text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md bg-primary-600 text-white" href="javascript:void(0)">1</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px" href="javascript:void(0)">2</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md" href="javascript:void(0)">3</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md" href="javascript:void(0)">4</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md" href="javascript:void(0)">5</a>
                    </li>
                    <li class="page-item">
                        <a class="page-link bg-neutral-200 text-secondary-light fw-semibold radius-8 border-0 d-flex align-items-center justify-content-center h-32-px w-32-px text-md" href="javascript:void(0)"> <iconify-icon icon="ep:d-arrow-right" class=""></iconify-icon> </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

<?php include './layouts/layout-bottom.php' ?>