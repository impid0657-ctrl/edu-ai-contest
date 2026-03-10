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
                type: 'line',
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
            colors: [color1, color2],  // Set series colors explicitly
            // fill: {   // These will be applicable while chart is area chart
            //     type: 'gradient',
            //     colors: [color1, color2], // Use two colors for the gradient
            //     gradient: {
            //         shade: 'light',
            //         type: 'vertical',
            //         shadeIntensity: 0.5,
            //         gradientToColors: [undefined, `${color2}00`], // Apply transparency to both colors
            //         inverseColors: false,
            //         opacityFrom: [0.4, 0.6], // Starting opacity for both colors
            //         opacityTo: [0.3, 0.3], // Ending opacity for both colors
            //         stops: [0, 100],
            //     },
            // },
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
    
    // ================================ Client Payment Status chart End ================================ 
    var options = {
        series: [{
            name: 'Net Profit',
            data: [44, 100, 40, 56, 30, 58, 50]
        }, {
            name: 'Revenue',
            data: [90, 140, 80, 125, 70, 140, 110]
        }, {
            name: 'Free Cash',
            data: [60, 120, 60, 90, 50, 95, 90]
        }],
        colors: ['#45B369', '#FF9F29', '#9935FE'],
        labels: ['Active', 'New', 'Total'] ,
        
        legend: {
            show: false 
        },
        chart: {
            type: 'bar',
            height: 350,
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
            columnWidth: 8,
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
            width: 0,
            colors: ['transparent']
        },
        xaxis: {
            categories: ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'],
        },
        yaxis: {
            categories: ['0', '10,000', '20,000', '30,000', '50,000', '1,00,000', '1,00,000'],
        },
        fill: {
            opacity: 1,
            width: 18,
        },
    };

    var chart = new ApexCharts(document.querySelector("#projectAnalysisChart"), options);
    chart.render();
    // ================================ Client Payment Status chart End ================================ 
    
    // ================================ Users Overview Donut chart Start ================================ 
    var options = { 
        series: [40, 87, 87, 30],
        colors: ['#dc3545', '#ff9f29', '#8252e9', '#144bd6'],
        labels: ['Health', 'Business', 'Lifestyle', 'Entertainment'] ,
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
            width: 2,
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

    var chart = new ApexCharts(document.querySelector("#taskOverviewChart"), options);
    chart.render();
  // ================================ Users Overview Donut chart End ================================ 