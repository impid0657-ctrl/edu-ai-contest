  // ================================ Client Payment Status chart End ================================ 
    var options = {
        series: [{
            name: 'Net Profit',
            data: [44, 100, 40, 56, 30, 58, 50, 44, 100, 40, 56, 30]
        }, {
            name: 'Revenue',
            data: [90, 140, 80, 125, 70, 140, 110, 90, 140, 80, 125, 70]
        }, {
            name: 'Free Cash',
            data: [60, 120, 60, 90, 50, 95, 90, 60, 120, 60, 90, 50]
        }],
        colors: ['#E4F1FF', '#E4F1FF', '#E4F1FF'],
        labels: ['Active', 'New', 'Total'] ,
        
        legend: {
            show: false 
        },
        chart: {
            type: 'bar',
            height: 300,
            toolbar: {
                show: false
            },
        },
        grid: {
            show: true,
            borderColor: '#00000000',
            strokeDashArray: 4, // Use a number for dashed style
            position: 'back',
        },
        plotOptions: {
            bar: {
                borderRadius: 2,
                columnWidth: '70%',
                borderRadiusApplication: 'end'
            },
        },
        dataLabels: {
            enabled: false
        },
        states: {
            hover: {
                filter: {
                    type: 'none'
                }
            }
        },
        stroke: {
          show: true,
          width: 4,
          colors: ['transparent']
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        },
        yaxis: {
            categories: ['0', '10,000', '20,000', '30,000', '50,000', '1,00,000', '1,00,000'],
            labels: {
                formatter: function (value) {
                    return "$" + value + "k";
                },
                style: {
                    fontSize: "14px"
                }
            },
        },
        fill: {
            opacity: 1,
            width: 18,
        },
    };

    var chart = new ApexCharts(document.querySelector("#paymentStatusChart"), options);
    chart.render();
  // ================================ Client Payment Status chart End ================================ 

    // ===================== Revenue Chart Start =============================== 
    function createChartTwo(chartId, color1, color2) {
        var options = {
            series: [{
                name: 'series1',
                data: [6, 20, 15, 48, 28, 55, 28, 52, 25, 32, 15, 25]
            }],
            legend: {
                show: false 
            },
            chart: {
                type: 'area',
                width: '100%',
                height: 200,
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
                width: 0,
                colors: [color1, color2], // Use two colors for the lines
                lineCap: 'round'
            },
            grid: {
                show: true,
                borderColor: '#D1D5DB',
                strokeDashArray: 1,
                position: 'back',
                xaxis: {
                    lines: {
                        show: false
                    }
                },
                yaxis: {
                    lines: {
                        show: true
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
                    top: -20,
                    right: 0,
                    bottom: -10,
                    left: 0
                },
            },
            colors: [color1, color2], // Set color for series
            fill: {
                type: 'gradient',
                colors: [color1, color2], // Use two colors for the gradient
                gradient: {
                    shade: 'light',
                    type: 'vertical',
                    shadeIntensity: 0.5,
                    gradientToColors: [undefined, `${color2}00`], // Apply transparency to both colors
                    inverseColors: false,
                    opacityFrom: [1, 0.6], // Starting opacity for both colors
                    opacityTo: [0.5, 0.4], // Ending opacity for both colors
                    stops: [0, 100],
                },
            },
            markers: {
                colors: [color1, color2],
                strokeWidth: 2,
                size: 0,
                hover: {
                    size: 8
                }
            },
            
            xaxis: {
                labels: {
                    show: false
                },
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                tooltip: {
                    enabled: false
                },
                labels: {
                    formatter: function (value) {
                        return value;
                    },
                    style: {
                        fontSize: "14px"
                    }
                }
            },
            yaxis: {
                labels: {
                    formatter: function (value) {
                        return "$" + value + "k";
                    },
                    style: {
                        fontSize: "14px"
                    }
                },
            },
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                }
            }
        };

        var chart = new ApexCharts(document.querySelector(`#${chartId}`), options);
        chart.render();
    }

    createChartTwo('revenueChart', '#98B6FF', '#6593FF');
    // ===================== Revenue Chart End =============================== 

    // ================================ J Vector Map Start ================================ 
    $('#world-map').vectorMap({
        map: 'world_mill_en',
        backgroundColor: 'transparent',
        borderColor: '#fff',
        borderOpacity: 0.25,
        borderWidth: 0,
        color: '#000000',
        regionStyle : {
            initial : {
            fill : '#D1D5DB'
            }
        },
        markerStyle: {
            initial: {
                    r: 5,
                    'fill': '#fff',
                    'fill-opacity':1,
                    'stroke': '#000',
                    'stroke-width' : 1,
                    'stroke-opacity': 0.4
                },
            },
        markers : [{
            latLng : [35.8617, 104.1954],
            name : 'China : 250'
            },

            {
            latLng : [25.2744, 133.7751],
            name : 'AustrCalia : 250'
            },

            {
            latLng : [36.77, -119.41],
            name : 'USA : 82%'
            },

            {
            latLng : [55.37, -3.41],
            name : 'UK   : 250'
            },

            {
            latLng : [25.20, 55.27],
            name : 'UAE : 250'
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

    
    // ================================ Follow Btn Start ================================ 
    let followBtns = document.querySelectorAll('.follow-btn');

    followBtns.forEach(followBtn => {
        followBtn.addEventListener("click", function () {
            if (this.innerHTML === "Follow") {
                this.innerHTML = "Following";
                this.classList.add('bg-success-600', 'text-white');
                this.classList.remove('bg-success-100', 'text-success-600');
            } else {
                this.innerHTML = "Follow";
                this.classList.remove('bg-success-600', 'text-white');
                this.classList.add('bg-success-100', 'text-success-600');
            }
        });
    });
    // ================================ Follow Btn End ================================ 
    
    // ================================ Users Overview Donut chart Start ================================ 
    var options = { 
        series: [40, 87, 87, 30, 50],
        colors: ['#FF9F29', '#487FFF', '#EF4A00', '#9935FE', '#45B369'],
        labels: ['Health', 'Business', 'Lifestyle', 'Entertainment', 'UI/UX Design'] ,
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