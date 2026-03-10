    // ================================ Balance Statistics Chart Start ================================ 
    var options = {
      series: [{
        name: 'Net Profit',
        data: [20000, 16000, 14000, 25000, 45000, 18000, 28000, 11000, 26000, 48000, 18000, 22000]
      },{
        name: 'Revenue',
        data: [15000, 18000, 19000, 20000, 35000, 20000, 18000, 13000, 18000, 38000, 14000, 16000]
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
        categories: ['0', '5000', '10,000', '20,000', '30,000', '50,000', '60,000', '60,000', '70,000', '80,000', '90,000', '100,000'],
      },
      fill: {
        opacity: 1,
        width: 18,
      },
    };

    var chart = new ApexCharts(document.querySelector("#balanceStatistics"), options);
    chart.render();
  // ================================ Balance Statistics Chart End ================================ 

  // ================================ Expense Statistics Chart start ================================ 
    var options = {
        series: [30, 30, 30, 30],
          chart: {
          height: 240,
          type: 'pie',
        },
        labels: ['Entertainment', 'Bill Expense', 'Others', 'Investment'],
        colors: ['#02BCAF', '#F0437D', '#1C52F6', '#43DCFF'],
        legend: {
            show: true
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

    var chart = new ApexCharts(document.querySelector("#expenseStatistics"), options);
    chart.render();
  // ================================ Expense Statistics Chart End ================================ 

  // ================================ Expense Statistics Chart start ================================ 
    $('.officer-slider').slick({
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        dots: false,
        speed: 800,
        centerPadding: '20px',
        infinite: true,
        autoplaySpeed: 2000,
        centerMode: true,
        autoplay: true,
        rtl: $('html').attr('dir') === 'rtl' ? true : false,
    });
  // ================================ Expense Statistics Chart End ================================ 