    // ================================ Revenue Growth Area Chart Start ================================ 
    function createChartTwo(chartId, chartColor) {

        var options = {
            series: [
                {
                    name: 'This Day',
                    data: [4, 18, 13, 40, 30, 50, 30, 60, 40, 75, 45, 90],
                },
            ],
            chart: {
                type: 'area',
                width: '100%',
                height: 64,
                sparkline: {
                    enabled: true // Remove whitespace
                },
                toolbar: {
                    show: false
                },
                padding: {
                    left: 0,
                    right: 0,
                    top: 0,
                    bottom: 0
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 2,
                colors: [chartColor],
                lineCap: 'round'
            },
            grid: {
                show: true,
                borderColor: 'red',
                strokeDashArray: 0,
                position: 'back',
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: false
                    }
                },
                row: {
                    colors: undefined,
                    opacity: 0.5
                },
                column: {
                    colors: undefined,
                    opacity: 0.5
                },
                padding: {
                    top: -4,
                    right: 0,
                    bottom: -6,
                    left: 0
                },
            },
            colors: [chartColor], // Set color for series
            fill: {
                type: 'gradient',
                colors: [chartColor], // Set the starting color (top color) here
                gradient: {
                    shade: 'light', // Gradient shading type
                    type: 'vertical',  // Gradient direction (vertical)
                    shadeIntensity: 0.5, // Intensity of the gradient shading
                    gradientToColors: [`${chartColor}00`], // Bottom gradient color (with transparency)
                    inverseColors: false, // Do not invert colors
                    opacityFrom: .6, // Starting opacity
                    opacityTo: 0.3,  // Ending opacity
                    stops: [0, 100],
                },
            },
            // Customize the circle marker color on hover
            markers: {
                colors: [chartColor],
                strokeWidth: 3,
                size: 0,
                hover: {
                    size: 10
                }
            },
            xaxis: {
                labels: { show: false },
                axisBorder: { show: false },
                axisTicks: { show: false },
                categories: [
                    `Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`,
                    `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`
                ]
            },
            yaxis: {
                labels: {
                    show: false
                },
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                },
            },
        };

        var chart = new ApexCharts(document.querySelector(`#${chartId}`), options);
        chart.render();
    }
    createChartTwo('total-users-chart', '#487FFF');
    createChartTwo('total-order-chart', '#FF9F29');
    // ================================ Revenue Growth Area Chart End ================================ 

    // ================================ Bars Up Down (Earning Statistics) chart Start ================================ 
    var options = {
        series: [
            {
                name: "Income",
                data: [44, 42, 57, 86, 58, 55, 70, 44, 42, 57, 86, 58, 55, 70],
            },
            {
                name: "Expenses",
                data: [-34, -22, -37, -56, -21, -35, -60, -34, -22, -37, -56, -21, -35, -60],
            },
        ],
        chart: {
            stacked: true,
            type: "bar",
            height: 64,
            fontFamily: "Poppins, sans-serif",
            toolbar: {
                show: false,
            },
            sparkline: {
                enabled: true // Remove whitespace
            },
        },
        colors: ["#9935fe26", "#9935FE"],
        plotOptions: {
            bar: {
                columnWidth: "8",
                borderRadius: [2],
                borderRadiusWhenStacked: "all",
            },
        },
        stroke: {
            width: [5, 5]
        },
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
            position: "top",
        },
        yaxis: {
            show: false,
            title: {
                text: undefined,
            },
            labels: {
                formatter: function (y) {
                    return y.toFixed(0) + "";
                },
            },
        },
        xaxis: {
            categories: [
                "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
                "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"
            ],
            show: false,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
                style: {
                    colors: "#d4d7d9",
                    fontSize: "10px",
                    fontWeight: 500,
                },
            },
        },
        tooltip: {
            enabled: true,
            shared: true,
            intersect: false,
            theme: "dark",
            x: {
                show: false,
            },
        },
    };
    var chart = new ApexCharts(document.querySelector("#upDownBarchart"), options);
    chart.render();
    // ================================ Bars Up Down (Earning Statistics) chart End ================================ 

    // ================================ Revenue Report Chart Start ================================ 
    var options = {
        series: [{
            name: 'Net Profit',
            data: [20000, 16000, 14000, 25000, 45000, 18000, 28000, 11000, 26000, 48000, 18000, 22000]
        }],
        colors: ['#22c55e'],
        labels: ['Active', 'New', 'Total'],
        legend: {
            show: false
        },
        chart: {
            type: 'bar',
            height: 74,
            toolbar: {
                show: false
            },
            sparkline: {
                enabled: true // Remove whitespace
            },
        },
        grid: {
            show: true,
            borderColor: '#ff000000',
            strokeDashArray: 4, // Use a number for dashed style
            position: 'back',
        },
        plotOptions: {
            bar: {
                borderRadius: 6,
                columnWidth: 16,
            },
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 2,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            show: false,
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
            },
        },
        yaxis: {
            categories: ['0', '5000', '10,000', '20,000', '30,000', '50,000', '60,000', '60,000', '70,000', '80,000', '90,000', '100,000'],
            axisBorder: {
                show: false,
            },
            axisTicks: {
                show: false,
            },
            labels: {
                show: false,
            },
        },
        fill: {
            opacity: 1,
            width: 18,
        },
    };

    var chart = new ApexCharts(document.querySelector("#orderValue"), options);
    chart.render();
    // ================================ Revenue Report Chart End ================================ 

    // ================================ Earning Statistics bar chart Start ================================ 
    var options = {
        series: [{
            name: "Sales",
            data: [{
                x: 'Jan',
                y: 85000,
            }, {
                x: 'Feb',
                y: 70000,
            }, {
                x: 'Mar',
                y: 40000,
            }, {
                x: 'Apr',
                y: 50000,
            }, {
                x: 'May',
                y: 60000,
            }, {
                x: 'Jun',
                y: 50000,
            }, {
                x: 'Jul',
                y: 40000,
            }, {
                x: 'Aug',
                y: 50000,
            }, {
                x: 'Sep',
                y: 40000,
            }, {
                x: 'Oct',
                y: 60000,
            }, {
                x: 'Nov',
                y: 30000,
            }, {
                x: 'Dec',
                y: 50000,
            }]
        }],
        chart: {
            type: 'bar',
            height: 240,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: false,
                columnWidth: '23%',
                endingShape: 'rounded',
            }
        },
        dataLabels: {
            enabled: false
        },
        fill: {
            type: 'gradient',
            colors: ['#487FFF'], // Set the starting color (top color) here
            gradient: {
                shade: 'light', // Gradient shading type
                type: 'vertical',  // Gradient direction (vertical)
                shadeIntensity: 0.5, // Intensity of the gradient shading
                gradientToColors: ['#487FFF'], // Bottom gradient color (with transparency)
                inverseColors: false, // Do not invert colors
                opacityFrom: 1, // Starting opacity
                opacityTo: 1,  // Ending opacity
                stops: [0, 100],
            },
        },
        grid: {
            show: true,
            borderColor: '#D1D5DB',
            strokeDashArray: 4, // Use a number for dashed style
            position: 'back',
        },
        xaxis: {
            type: 'category',
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    return (value / 1000).toFixed(0) + 'k';
                }
            }
        },
        tooltip: {
            y: {
                formatter: function (value) {
                    return value / 1000 + 'k';
                }
            }
        }
    };

    var chart = new ApexCharts(document.querySelector("#barChart"), options);
    chart.render();
    // ================================ Earning Statistics bar chart End ================================ 


    // ================================ J Vector Map Start ================================ 
    $('#world-map').vectorMap(
        {
            map: 'world_mill_en',
            backgroundColor: 'transparent',
            borderColor: '#fff',
            borderOpacity: 0.25,
            borderWidth: 0,
            color: '#000000',
            regionStyle: {
                initial: {
                    fill: '#D1D5DB'
                }
            },
            markerStyle: {
                initial: {
                    r: 5,
                    'fill': '#fff',
                    'fill-opacity': 1,
                    'stroke': '#000',
                    'stroke-width': 1,
                    'stroke-opacity': 0.4
                },
            },
            markers: [{
                latLng: [35.8617, 104.1954],
                name: 'China : 250'
            },

            {
                latLng: [25.2744, 133.7751],
                name: 'AustrCalia : 250'
            },

            {
                latLng: [36.77, -119.41],
                name: 'USA : 82%'
            },

            {
                latLng: [55.37, -3.41],
                name: 'UK   : 250'
            },

            {
                latLng: [25.20, 55.27],
                name: 'UAE : 250'
            }],

            series: {
                regions: [{
                    values: {
                        "US": '#487FFF ',
                        "SA": '#487FFF',
                        "AU": '#487FFF',
                        "CN": '#487FFF',
                        "GB": '#487FFF',
                    },
                    attribute: 'fill'
                }]
            },
            hoverOpacity: null,
            normalizeFunction: 'linear',
            zoomOnScroll: false,
            scaleColors: ['#000000', '#000000'],
            selectedColor: '#000000',
            selectedRegions: [],
            enableZoom: false,
            hoverColor: '#fff',
        });
    // ================================ J Vector Map End ================================ 



    // ================================ Users Overview Donut chart Start ================================ 
    var options = {
        series: [300, 200, 500, 172],
        colors: ['#487FFF', '#9935FE', '#FF9F29', "#45B369"],
        labels: ['Total Visitors', 'Registrations', 'Total Page Views', 'Registrations'],
        legend: {
            show: false
        },
        chart: {
            type: 'donut',
            height: 270,
            sparkline: {
                enabled: true // Remove whitespace
            },
            margin: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },
        stroke: {
            width: 0,
        },
        dataLabels: {
            enabled: false
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: 200
                },
                legend: {
                    position: 'bottom'
                }
            }
        }],
    };

    var chart = new ApexCharts(document.querySelector("#userOverviewDonutChart"), options);
    chart.render();
    // ================================ Users Overview Donut chart End ================================ 


    // ================================ User Traffic chart Start ================================ 
    var options = {
        series: [{
            data: [
                [1327359600000, 30.95],
                [1327446000000, 31.34],
                [1327532400000, 31.18],
                [1327618800000, 31.05],
                [1327878000000, 31.00],
                [1327964400000, 30.95],
                [1328050800000, 31.24],
                [1328137200000, 31.29],
                [1328223600000, 31.85],
                [1328482800000, 31.86],
                [1328569200000, 32.28],
                [1328655600000, 32.10],
                [1328742000000, 32.65],
                [1328828400000, 32.21],
                [1329087600000, 32.35],
                [1329174000000, 32.44],
                [1329260400000, 32.46],
                [1329346800000, 32.86],
                [1329433200000, 32.75],
                [1329778800000, 32.54],
                [1329865200000, 32.33],
                [1329951600000, 32.97],
                [1330038000000, 33.41],
                [1330297200000, 33.27],
                [1330383600000, 33.27],
                [1330470000000, 32.89],
                [1330556400000, 33.10],
                [1330642800000, 33.73],
                [1330902000000, 33.22],
                [1330988400000, 31.99],
                [1331074800000, 32.41],
                [1331161200000, 33.05],
                [1331247600000, 33.64],
                [1331506800000, 33.56],
                [1331593200000, 34.22],
                [1331679600000, 33.77],
                [1331766000000, 34.17],
                [1331852400000, 33.82],
                [1332111600000, 34.51],
                [1332198000000, 33.16],
                [1332284400000, 33.56],
                [1332370800000, 33.71],
                [1332457200000, 33.81],
                [1332712800000, 34.40],
                [1332799200000, 34.63],
                [1332885600000, 34.46],
                [1332972000000, 34.48],
                [1333058400000, 34.31],
                [1333317600000, 34.70],
                [1333404000000, 34.31],
                [1333490400000, 33.46],
                [1333576800000, 33.59],
                [1333922400000, 33.22],
                [1334008800000, 32.61],
                [1334095200000, 33.01],
                [1334181600000, 33.55],
                [1334268000000, 33.18],
                [1334527200000, 32.84],
                [1334613600000, 33.84],
                [1334700000000, 33.39],
                [1334786400000, 32.91],
                [1334872800000, 33.06],
                [1335132000000, 32.62],
                [1335218400000, 32.40],
                [1335304800000, 33.13],
                [1335391200000, 33.26],
                [1335477600000, 33.58],
                [1335736800000, 33.55],
                [1335823200000, 33.77],
                [1335909600000, 33.76],
                [1335996000000, 33.32],
                [1336082400000, 32.61],
                [1336341600000, 32.52],
                [1336428000000, 32.67],
                [1336514400000, 32.52],
                [1336600800000, 31.92],
                [1336687200000, 32.20],
                [1336946400000, 32.23],
                [1337032800000, 32.33],
                [1337119200000, 32.36],
                [1337205600000, 32.01],
                [1337292000000, 31.31],
                [1337551200000, 32.01],
                [1337637600000, 32.01],
                [1337724000000, 32.18],
                [1337810400000, 31.54],
                [1337896800000, 31.60],
                [1338242400000, 32.05],
                [1338328800000, 31.29],
                [1338415200000, 31.05],
                [1338501600000, 29.82],
                [1338760800000, 30.31],
                [1338847200000, 30.70],
                [1338933600000, 31.69],
                [1339020000000, 31.32],
                [1339106400000, 31.65],
                [1339365600000, 31.13],
                [1339452000000, 31.77],
                [1339538400000, 31.79],
                [1339624800000, 31.67],
                [1339711200000, 32.39],
                [1339970400000, 32.63],
                [1340056800000, 32.89],
                [1340143200000, 31.99],
                [1340229600000, 31.23],
                [1340316000000, 31.57],
                [1340575200000, 30.84],
                [1340661600000, 31.07],
                [1340748000000, 31.41],
                [1340834400000, 31.17],
                [1340920800000, 32.37],
                [1341180000000, 32.19],
                [1341266400000, 32.51],
                [1341439200000, 32.53],
                [1341525600000, 31.37],
                [1341784800000, 30.43],
                [1341871200000, 30.44],
                [1341957600000, 30.20],
                [1342044000000, 30.14],
                [1342130400000, 30.65],
                [1342389600000, 30.40],
                [1342476000000, 30.65],
                [1342562400000, 31.43],
                [1342648800000, 31.89],
                [1342735200000, 31.38],
                [1342994400000, 30.64],
                [1343080800000, 30.02],
                [1343167200000, 30.33],
                [1343253600000, 30.95],
                [1343340000000, 31.89],
                [1343599200000, 31.01],
                [1343685600000, 30.88],
                [1343772000000, 30.69],
                [1343858400000, 30.58],
                [1343944800000, 32.02],
                [1344204000000, 32.14],
                [1344290400000, 32.37],
                [1344376800000, 32.51],
                [1344463200000, 32.65],
                [1344549600000, 32.64],
                [1344808800000, 32.27],
                [1344895200000, 32.10],
                [1344981600000, 32.91],
                [1345068000000, 33.65],
                [1345154400000, 33.80],
                [1345413600000, 33.92],
                [1345500000000, 33.75],
                [1345586400000, 33.84],
                [1345672800000, 33.50],
                [1345759200000, 32.26],
                [1346018400000, 32.32],
                [1346104800000, 32.06],
                [1346191200000, 31.96],
                [1346277600000, 31.46],
                [1346364000000, 31.27],
                [1346709600000, 31.43],
                [1346796000000, 32.26],
                [1346882400000, 32.79],
                [1346968800000, 32.46],
                [1347228000000, 32.13],
                [1347314400000, 32.43],
                [1347400800000, 32.42],
                [1347487200000, 32.81],
                [1347573600000, 33.34],
                [1347832800000, 33.41],
                [1347919200000, 32.57],
                [1348005600000, 33.12],
                [1348092000000, 34.53],
                [1348178400000, 33.83],
                [1348437600000, 33.41],
                [1348524000000, 32.90],
                [1348610400000, 32.53],
                [1348696800000, 32.80],
                [1348783200000, 32.44],
                [1349042400000, 32.62],
                [1349128800000, 32.57],
                [1349215200000, 32.60],
                [1349301600000, 32.68],
                [1349388000000, 32.47],
                [1349647200000, 32.23],
                [1349733600000, 31.68],
                [1349820000000, 31.51],
                [1349906400000, 31.78],
                [1349992800000, 31.94],
                [1350252000000, 32.33],
                [1350338400000, 33.24],
                [1350424800000, 33.44],
                [1350511200000, 33.48],
                [1350597600000, 33.24],
                [1350856800000, 33.49],
                [1350943200000, 33.31],
                [1351029600000, 33.36],
                [1351116000000, 33.40],
                [1351202400000, 34.01],
                [1351638000000, 34.02],
                [1351724400000, 34.36],
                [1351810800000, 34.39],
                [1352070000000, 34.24],
                [1352156400000, 34.39],
                [1352242800000, 33.47],
                [1352329200000, 32.98],
                [1352415600000, 32.90],
                [1352674800000, 32.70],
                [1352761200000, 32.54],
                [1352847600000, 32.23],
                [1352934000000, 32.64],
                [1353020400000, 32.65],
                [1353279600000, 32.92],
                [1353366000000, 32.64],
                [1353452400000, 32.84],
                [1353625200000, 33.40],
                [1353884400000, 33.30],
                [1353970800000, 33.18],
                [1354057200000, 33.88],
                [1354143600000, 34.09],
                [1354230000000, 34.61],
                [1354489200000, 34.70],
                [1354575600000, 35.30],
                [1354662000000, 35.40],
                [1354748400000, 35.14],
                [1354834800000, 35.48],
                [1355094000000, 35.75],
                [1355180400000, 35.54],
                [1355266800000, 35.96],
                [1355353200000, 35.53],
                [1355439600000, 37.56],
                [1355698800000, 37.42],
                [1355785200000, 37.49],
                [1355871600000, 38.09],
                [1355958000000, 37.87],
                [1356044400000, 37.71],
                [1356303600000, 37.53],
                [1356476400000, 37.55],
                [1356562800000, 37.30],
                [1356649200000, 36.90],
                [1356908400000, 37.68],
                [1357081200000, 38.34],
                [1357167600000, 37.75],
                [1357254000000, 38.13],
                [1357513200000, 37.94],
                [1357599600000, 38.14],
                [1357686000000, 38.66],
                [1357772400000, 38.62],
                [1357858800000, 38.09],
                [1358118000000, 38.16],
                [1358204400000, 38.15],
                [1358290800000, 37.88],
                [1358377200000, 37.73],
                [1358463600000, 37.98],
                [1358809200000, 37.95],
                [1358895600000, 38.25],
                [1358982000000, 38.10],
                [1359068400000, 38.32],
                [1359327600000, 38.24],
                [1359414000000, 38.52],
                [1359500400000, 37.94],
                [1359586800000, 37.83],
                [1359673200000, 38.34],
                [1359932400000, 38.10],
                [1360018800000, 38.51],
                [1360105200000, 38.40],
                [1360191600000, 38.07],
                [1360278000000, 39.12],
                [1360537200000, 38.64],
                [1360623600000, 38.89],
                [1360710000000, 38.81],
                [1360796400000, 38.61],
                [1360882800000, 38.63],
                [1361228400000, 38.99],
                [1361314800000, 38.77],
                [1361401200000, 38.34],
                [1361487600000, 38.55],
                [1361746800000, 38.11],
                [1361833200000, 38.59],
                [1361919600000, 39.60],
            ]
        }],
        chart: {
            id: 'area-datetime',
            type: 'area',
            height: 250,
            zoom: {
                autoScaleYaxis: true
            },
            toolbar: {
                show: false,
            },
        },
        annotations: {
            yaxis: [{
                y: 30,
                borderColor: '#999',
                label: {
                    show: true,
                    text: 'Support',
                    style: {
                        color: "#fff",
                        background: '#00E396'
                    }
                }
            }],
            xaxis: [{
                x: new Date('14 Nov 2012').getTime(),
                borderColor: '#999',
                yAxisIndex: 0,
                label: {
                    show: true,
                    text: 'Rally',
                    style: {
                        color: "#fff",
                        background: '#775DD0'
                    }
                }
            }]
        },
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0,
            style: 'hollow',
        },
        xaxis: {
            type: 'datetime',
            min: new Date('01 Mar 2012').getTime(),
            tickAmount: 6,
        },
        tooltip: {
            x: {
                format: 'dd MMM yyyy'
            }
        },
        // 🔹 Gradient background fill
        fill: {
            type: "gradient",
            gradient: {
                shade: "light",
                type: "vertical", // can be "horizontal" or "vertical"
                shadeIntensity: 1,
                gradientToColors: ["#9935FE"], // target color
                inverseColors: false,
                opacityFrom: 0.9,
                opacityTo: 0.0,
                stops: [0, 100],
            }
        },
        // 🔹 Remove border/line
        stroke: {
            curve: 'straight',
            width: 0,   // no line border
            colors: ["transparent"]
        }
    };

    var chart = new ApexCharts(document.querySelector("#chart-timeline"), options);
    chart.render();
    // ================================ User Traffic chart End ================================ 