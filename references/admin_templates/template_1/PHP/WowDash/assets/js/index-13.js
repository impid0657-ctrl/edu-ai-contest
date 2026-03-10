    // ================================ Vertical bar chart js Start ================================ 
    var options = {
        series: [{
            name: 'Ticket',
            data: [6200, 5200, 4200, 3200]
        }],
        chart: {
            type: 'bar',
            height: 270,
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
            categories: ['High', 'Medium', 'Low', 'Urgent'],
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
                gradientToColors: ['#C98BFF', '#FFDC90', '#94FF9B', '#FFAC89'],
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
        ]
    };

    var chart = new ApexCharts(document.querySelector("#statisticBarChart"), options);
    chart.render();
    // ================================ Vertical bar chart js End ================================ 


    // ===================== Average Enrollment Rate Start =============================== 
    function createChartTwo(chartId, color1, color2) {
        var options = {
            series: [{
                name: 'series1',
                data: [48, 35, 55, 32, 48, 30, 55, 50, 57]
            }],
            legend: {
                show: false 
            },
            chart: {
                type: 'area',
                width: 466,
                height: 86,
                toolbar: {
                    show: false
                },
                dropShadow: {
                    enabled: false // Removes shadow
                }
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: 'smooth',
                width: 3,
                colors: [color1, color2] // Use solid colors for the lines
            },
            fill: {
                type: "solid", 
                opacity: 0 // No gradient or shadow fill
            },
            grid: {
                show: false
            },
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
                }
            },
            yaxis: {
                labels: {
                    show: false
                }
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

    createChartTwo('enrollmentChart', '#487FFF', '#FF9F29');
    // ===================== Average Enrollment Rate End ===============================


    // ============================ Multiple series Chart Start ==========================
    var options = {
        series: [20, 22, 28, 10],
        chart: {
          type: 'polarArea',
          height: 264,
        },
        labels: ['Product 1', 'Product 2', 'Product 3', 'Product 4'],
        colors: ['#487FFF', '#FF9F29', '#9935FE', '#EF4A00'], 
        stroke: {
            colors: ['#487FFF', '#FF9F29', '#9935FE', '#EF4A00'], 
        },
        fill: {
          opacity: 0.8
        },
        legend: {
            show: false, 
            position: 'bottom',
            horizontalAlign: 'center' // Align the legend horizontally
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
        }]
    };

    var chart = new ApexCharts(document.querySelector("#multipleSeriesChart"), options);
    chart.render();
    // ============================ Multiple series Chart End ==========================

    // ===================== Average Enrollment Rate Start =============================== 
    function createChartOne(chartId, color1, color2) {
        var options = {
            series: [{
                name: 'Pending',
                data: [480, 350, 550, 320, 480, 300, 550, 500, 570]
            }, {
                name: 'Solved',
                data: [120, 200, 150, 260, 220, 600, 400, 480, 250]
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
                    opacityFrom: [0.4, 0.6], // Starting opacity for both colors
                    opacityTo: [0.3, 0.3], // Ending opacity for both colors
                    stops: [0, 100],
                },
            },
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
            tooltip: {
                x: {
                    format: 'dd/MM/yy HH:mm'
                }
            }
        };

        var chart = new ApexCharts(document.querySelector(`#${chartId}`), options);
        chart.render();
    }

    createChartOne('pendingSolvedTicket', '#45B369', '#FF9F29');
    // ===================== Average Enrollment Rate End =============================== 
    
    
    



    // ================================ Semi Circle Gauge chart Start ================================ 
    var options = {
        series: [75],
        chart: {
            width: 400,
            height: 300,
            type: 'radialBar',
            sparkline: {
                enabled: true,
            },
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            radialBar: {
            offsetY: -24,
            offsetX: -14,
            startAngle: -90,
            endAngle: 90,
            track: {
                background: "#E3E6E9",
                strokeWidth: "70%", 
            },
            hollow: {
                size: "70%", 
            },
            dataLabels: {
                show: false,
                
                value: {
                    fontSize: '22px',
                    fontWeight: 600,
                    color: '#487FFF',
                    offsetY: 16,
                },
            },
            },
        },
        fill: {
            type: 'gradient',
            colors: ['#9DBAFF'],
            gradient: {
            shade: 'dark',
            type: 'horizontal',
            shadeIntensity: 0.5,
            gradientToColors: ['#487FFF'],
            inverseColors: true,
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100],
            },
        },
        stroke: {
            lineCap: 'round',
        },
    };

    var chart = new ApexCharts(document.querySelector("#semiCircleGaugeTwo"), options);
    chart.render();
    // ================================ Semi Circle Gauge chart End ================================ 