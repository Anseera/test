{
  chart: {
    type: "bar",
    width: 600,
    height: 840
  },
  title: {
    text: "",
    align: "left",
    style: {
      fontWeight: "bold",
      fontSize: "12px"
    }
  },
  xAxis: {
    categories: ['Sub-Saharan Africa', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi', 'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros', 'Congo, Rep.', 'Congo, Dem. Rep.', 'Cote d\'Ivoire', 'Equatorial Guinea', 'Eritrea'],
    labels: {
      style: {
        width: "100px",
        "min-width": "100px",
      },
      useHTML: true,
    },
    lineWidth: 0,
    minorGridLineWidth: 0,
    lineColor: "transparent",
    minorTickLength: 0,
    tickLength: 0,
    title: {
      text: null,
    },
  },
  yAxis: {
    min: 0,
    minRange: 1,
    gridLineWidth: 0,
    lineWidth: 0,
    title: {
      text: "",
      align: "high"
    },
    labels: {
      enabled: false
    },
    stackLabels: {
      enabled: true,
      formatter: function() {
        return "" + this.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      }
    }
  },
  legend: {
    enabled: true,
    reversed: false,
    align: "left"
  },
  plotOptions: {
    series: {
      minPointLength: 3
    },
    bar: {
      shadow: false,
      pointWidth: 15,
      pointPadding: 0.1,
      borderWidth: 0,
      dataLabels: {
        format: "{y:,.0f}",
        enabled: true,
        crop: false,
        overflow: "none",
        color: "#000000",
        padding: 0,
        x: 5,
        y: 2,
        style: {
          "color": "contrast",
          "fontSize": "10px",
          "fontWeight": "normal",
          "textOutline": "1px 1px contrast"
        }
      }
    }
  },
  credits: {
    enabled: false,
  },
  exporting: {
    allowHTML: true,
  },
  legend: {
    enabled: false,
    reversed: false,
    align: "left"
  },
  navigation: {
    buttonOptions: {
      //enabled: false
    }
  },
  series: [{
    name: "Your Company",
    data: [198500, 165000, 33500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    color: "#ff9518",
    stack: "company",
  }, {
    name: "Total Market",
    data: [1870821, 0, 2800, 0, 34733, 0, 0, 45444, 0, 0, 0, 0, 729, 8776, 0, 0],
    color: "#003f69",
    stack: "company",
  }, ]
}