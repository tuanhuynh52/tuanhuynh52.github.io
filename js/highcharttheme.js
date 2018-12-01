
//High Chart theme 

Highcharts.theme = {
     colors: ['#f45b5b', '#8085e9', '#8d4654', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
     '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
     chart: {
      backgroundColor: null,
      style: {
       fontFamily: 'Signika, serif'
      }
    },
    title: {
      style: {
       color: '#000',
       fontSize: '24px',
       fontWeight: 'bold'
    }
  },
  subtitle: {
    style: {
     color: '#000',
     fontSize: '16px'
  }
  },
  tooltip: {
    borderWidth: 0
  },
  legend: {
    itemStyle: {
     fontWeight: 'bold',
     fontSize: '13px'
  }
  },
  xAxis: {
    labels: {
     style: {
      fontSize: '14px',
      color: '#000',
      fontWeight: 'bold'
  }
  }
  },
  yAxis: {
    labels: {
     style: {
      fontSize: '14px',
      color: '#000',
      fontWeight: 'bold'
      }
    },
    title: {
      fontSize: '18px',
      color: '#000',
      fontWeight: 'bold'
    }
  },
  plotOptions: {
    series: {
     shadow: true
  },
  candlestick: {
     lineColor: '#404048'
  },
  map: {
     shadow: false
  }
  },

     // Highstock specific
     navigator: {
        xAxis: {
         gridLineColor: '#D0D0D8'
     }
  },
  rangeSelector: {
    buttonTheme: {
     fill: 'white',
     stroke: '#C0C0C8',
     'stroke-width': 1,
     states: {
      select: {
       fill: '#D0D0D8'
   }
  }
  }
  },
  scrollbar: {
    trackBorderColor: '#C0C0C8'
  },

     // General
     background2: '#E0E0E8'

  };

  // Apply the theme
  Highcharts.setOptions(Highcharts.theme);