    // ========================= Animated Radial Progress Js Start ===================
    function animateProgress() {
        $("svg.radial-progress").each(function () {
            // Check if the element is within the viewport
            const elementTop = $(this).offset().top;
            const elementBottom = elementTop + $(this).outerHeight();
            const viewportTop = $(window).scrollTop();
            const viewportBottom = viewportTop + $(window).height();

            if (elementBottom > viewportTop && elementTop < viewportBottom) {
                const percent = $(this).data("percentage");
                const radius = $(this).find("circle.complete").attr("r");
                const circumference = 2 * Math.PI * radius;
                const strokeDashOffset =
                    circumference - (percent / 100) * circumference;

                // Animate the circle
                $(this)
                    .find("circle.complete")
                    .css("stroke-dashoffset", strokeDashOffset);
            }
        });
    }

    // Trigger animation on scroll and page load
    $(window).on("scroll", animateProgress);
    animateProgress(); // Run on page load
    // ========================= Animated Radial Progress Js End ===================

    // ================================ Earning Statistics bar chart Start ================================ 
    var options = {
        series: [{
            name: "Sales",
            data: [{
                x: 'Sun',
                y: 85000,
            }, {
                x: 'Mon',
                y: 70000,
            }, {
                x: 'Tue',
                y: 40000,
            }, {
                x: 'Wed',
                y: 50000,
            }, {
                x: 'Thu',
                y: 60000,
            }, {
                x: 'Fri',
                y: 50000,
            }, {
                x: 'Sat',
                y: 40000,
            }]
        }],
        chart: {
            type: 'bar',
            height: 310,
            toolbar: {
                show: false
            }
        },
        plotOptions: {
            bar: {
                borderRadius: 8,
                horizontal: false,
                columnWidth: '30%',
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
            categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
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

    // ===================== Average Enrollment Rate Start =============================== 
    function createChartTwo(chartId, color1, color2) {
        var options = {
            series: [{
                name: 'Income',
                data: [48, 35, 55, 32, 48, 30, 55, 50, 57]
            }, {
                name: 'Expense',
                data: [12, 20, 15, 26, 22, 60, 40, 48, 25]
            }],
            legend: {
                show: false
            },
            chart: {
                type: 'area',
                width: '100%',
                height: 270,
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
                width: 3,
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
            colors: [color1, color2],
            markers: {
                colors: [color1, color2], // Use two colors for the markers
                strokeWidth: 3,
                size: 0,
                hover: {
                    size: 10
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

    createChartTwo('averageEarningChart', '#487FFF', '#FF9F29');
    // ===================== Average Enrollment Rate End =============================== 

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

    // ================================ Vertical bar chart js Start ================================
    var options = {
        series: [{
            name: 'Ticket',
            data: [6200, 5200, 4200, 3200, 1500]
        }],
        chart: {
            type: 'bar',
            height: 360,
            toolbar: {
                show: false
            },
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                horizontal: true,
                distributed: true, // Enables individual bar styling
                barHeight: '22px'
            }
        },
        dataLabels: {
            enabled: false
        },
        grid: {
            show: true,
            borderColor: '#ddd',
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
        },
        xaxis: {
            categories: ['Service Problems', 'Technical Issues', 'Payment Issue', 'New Customer', 'Product Problems'],
            labels: {
                formatter: function (value) {
                    return (value / 1000).toFixed(0) + 'k';
                }
            }
        },
        legend: {
            show: false
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: "horizontal",
                shadeIntensity: 0.5,
                gradientToColors: ['#C98BFF', '#FFDC90', '#94FF9B', '#FFAC89', '#89C0FF'],
                inverseColors: false,
                opacityFrom: 1,
                opacityTo: 1,
                stops: [0, 100]
            }
        },
        colors: [
            '#8501F8',
            '#FF9F29',
            '#00D40E',
            '#F84B01',
            '#1101F8'
        ]
    };

    var chart = new ApexCharts(document.querySelector("#statisticBarChart"), options);
    chart.render();
    // ================================ Vertical bar chart js End ================================ 