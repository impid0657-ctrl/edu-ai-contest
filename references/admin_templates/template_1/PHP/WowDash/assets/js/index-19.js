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
            height: 240,
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

    // ================================ Balance Statistics Chart Start ================================ 
    var options = {
        series: [{
            name: 'Net Profit',
            data: [6, 16, 14, 25, 45, 18, 28, 16, 26, 48, 18, 22]
        }, {
            name: 'Revenue',
            data: [15, 18, 19, 30, 35, 12, 18, 13, 18, 38, 14, 16]
        }],
        colors: ['#487FFF', '#FF9F29'],
        labels: ['Active', 'New', 'Total'],
        legend: {
            show: false
        },
        chart: {
            type: 'bar',
            height: 250,
            toolbar: {
                show: false
            },
        },
        grid: {
            show: true,
            borderColor: '#D1D5DB',
            strokeDashArray: 4, // Use a number for dashed style
            position: 'back',
        },
        plotOptions: {
            bar: {
                borderRadius: 4,
                columnWidth: 10,
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
        },
        yaxis: {
            categories: ['0', '5', '1', '2', '3', '5', '6', '6', '7', '8', '9', '10'],
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

    var chart = new ApexCharts(document.querySelector("#balanceStatistics"), options);
    chart.render();
    // ================================ Balance Statistics Chart End ================================ 

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
                height: 230,
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