document.addEventListener("DOMContentLoaded", function () {
  // highchart
  Highcharts.chart("highcharts_container", {
    chart: {
      type: "pie",
      custom: {},
      events: {
        render() {
          const chart = this,
            series = chart.series[0];
          let customLabel = chart.options.chart.custom.label;

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label = chart.renderer
              .label("<strong>50%</strong>" + "<br/>Total")
              .css({
                color: "#000",
                textAnchor: "middle",
              })
              .add();
          }

          const x = series.center[0] + chart.plotLeft,
            y =
              series.center[1] + chart.plotTop - customLabel.attr("height") / 2;

          customLabel.attr({
            x,
            y,
          });
          // Set font size based on chart diameter
          customLabel.css({
            fontSize: `${series.center[2] / 12}px`,
          });
        },
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    title: {
      text: "Sohalarning davlat xaridlaridagi ulushi bo‘yicha umumiy statistika",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 10,
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: "{point.name}",
          },
          {
            enabled: true,
            distance: -15,
            format: "{point.percentage:.0f}%",
            style: {
              fontSize: "0.9em",
            },
          },
        ],
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Registrations",
        colorByPoint: true,
        innerSize: "80%",
        data: [
          {
            name: "EV",
            y: 23.9,
          },
          {
            name: "BELLA",
            y: 23.9,
          },
          {
            name: "AOA",
            y: 23.9,
          },
          {
            name: "IIA",
            y: 23.9,
          },
          {
            name: "AAA",
            y: 23.9,
          },
          {
            name: "DBB",
            y: 23.9,
          },
          {
            name: "CCC",
            y: 23.9,
          },
          {
            name: "MMM",
            y: 23.9,
          },
          {
            name: "UAA",
            y: 23.9,
          },
        ],
      },
    ],
  });

  // highchart-1
  Highcharts.chart("highcharts_container1", {
    chart: {
      type: "pie",
      height: "100%",
      custom: {},
      events: {
        render() {
          const chart = this,
            series = chart.series[0];
          let customLabel = chart.options.chart.custom.label;

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label = chart.renderer
              .label("<strong>50%</strong>" + "<br/>umumiyga nisbatan")
              .css({
                color: "#000",
                textAnchor: "middle",
              })
              .add();
          }

          const x = series.center[0] + chart.plotLeft,
            y =
              series.center[1] + chart.plotTop - customLabel.attr("height") / 2;

          customLabel.attr({
            x,
            y,
          });
          // Set font size based on chart diameter
          customLabel.css({
            fontSize: `${series.center[2] / 10}px`,
          });
        },
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 10,
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: "{point.name}",
          },
          {
            enabled: true,
            distance: -15,
            format: "{point.percentage:.0f}%",
            style: {
              fontSize: "0.9em",
            },
          },
        ],
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Registrations",
        colorByPoint: true,
        innerSize: "80%",
        data: [
          {
            name: "EV",
            y: 23.9,
          },
        ],
      },
    ],
  });

  // highchart-2
  Highcharts.chart("highcharts_container2", {
    chart: {
      type: "pie",
      height: "100%",
      custom: {},
      events: {
        render() {
          const chart = this,
            series = chart.series[0];
          let customLabel = chart.options.chart.custom.label;

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label = chart.renderer
              .label("<strong>50%</strong>" + "<br/>umumiyga nisbatan")
              .css({
                color: "#000",
                textAnchor: "middle",
              })
              .add();
          }

          const x = series.center[0] + chart.plotLeft,
            y =
              series.center[1] + chart.plotTop - customLabel.attr("height") / 2;

          customLabel.attr({
            x,
            y,
          });
          // Set font size based on chart diameter
          customLabel.css({
            fontSize: `${series.center[2] / 10}px`,
          });
        },
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 10,
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: "{point.name}",
          },
          {
            enabled: true,
            distance: -15,
            format: "{point.percentage:.0f}%",
            style: {
              fontSize: "0.9em",
            },
          },
        ],
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Registrations",
        colorByPoint: true,
        innerSize: "80%",
        data: [
          {
            name: "EV",
            y: 23.9,
          },
        ],
      },
    ],
  });

  // highchart-3
  Highcharts.chart("highcharts_container3", {
    chart: {
      type: "pie",
      height: "100%",
      custom: {},
      events: {
        render() {
          const chart = this,
            series = chart.series[0];
          let customLabel = chart.options.chart.custom.label;

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label = chart.renderer
              .label("<strong>50%</strong>" + "<br/>umumiyga nisbatan")
              .css({
                color: "#000",
                textAnchor: "middle",
              })
              .add();
          }

          const x = series.center[0] + chart.plotLeft,
            y =
              series.center[1] + chart.plotTop - customLabel.attr("height") / 2;

          customLabel.attr({
            x,
            y,
          });
          // Set font size based on chart diameter
          customLabel.css({
            fontSize: `${series.center[2] / 10}px`,
          });
        },
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 10,
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: "{point.name}",
          },
          {
            enabled: true,
            distance: -15,
            format: "{point.percentage:.0f}%",
            style: {
              fontSize: "0.9em",
            },
          },
        ],
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Registrations",
        colorByPoint: true,
        innerSize: "80%",
        data: [
          {
            name: "EV",
            y: 23.9,
          },
        ],
      },
    ],
  });

  // highchart-4
  Highcharts.chart("highcharts_container4", {
    chart: {
      type: "pie",
      height: "100%",
      custom: {},
      events: {
        render() {
          const chart = this,
            series = chart.series[0];
          let customLabel = chart.options.chart.custom.label;

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label = chart.renderer
              .label("<strong>50%</strong>" + "<br/>umumiyga nisbatan")
              .css({
                color: "#000",
                textAnchor: "middle",
              })
              .add();
          }

          const x = series.center[0] + chart.plotLeft,
            y =
              series.center[1] + chart.plotTop - customLabel.attr("height") / 2;

          customLabel.attr({
            x,
            y,
          });
          // Set font size based on chart diameter
          customLabel.css({
            fontSize: `${series.center[2] / 10}px`,
          });
        },
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 10,
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: "{point.name}",
          },
          {
            enabled: true,
            distance: -15,
            format: "{point.percentage:.0f}%",
            style: {
              fontSize: "0.9em",
            },
          },
        ],
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Registrations",
        colorByPoint: true,
        innerSize: "80%",
        data: [
          {
            name: "EV",
            y: 23.9,
          },
        ],
      },
    ],
  });

  // highchart-5
  Highcharts.chart("highcharts_container5", {
    chart: {
      type: "pie",
      height: "100%",
      custom: {},
      events: {
        render() {
          const chart = this,
            series = chart.series[0];
          let customLabel = chart.options.chart.custom.label;

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label = chart.renderer
              .label("<strong>50%</strong>" + "<br/>umumiyga nisbatan")
              .css({
                color: "#000",
                textAnchor: "middle",
              })
              .add();
          }

          const x = series.center[0] + chart.plotLeft,
            y =
              series.center[1] + chart.plotTop - customLabel.attr("height") / 2;

          customLabel.attr({
            x,
            y,
          });
          // Set font size based on chart diameter
          customLabel.css({
            fontSize: `${series.center[2] / 10}px`,
          });
        },
      },
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
    },
    title: {
      text: "",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.0f}%</b>",
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 10,
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            format: "{point.name}",
          },
          {
            enabled: true,
            distance: -15,
            format: "{point.percentage:.0f}%",
            style: {
              fontSize: "0.9em",
            },
          },
        ],
        showInLegend: true,
      },
    },
    series: [
      {
        name: "Registrations",
        colorByPoint: true,
        innerSize: "80%",
        data: [
          {
            name: "EV",
            y: 23.9,
          },
        ],
      },
    ],
  });
});
(async () => {
  const topology = await fetch(
    "https://code.highcharts.com/mapdata/countries/uz/uz-all.topo.json"
  ).then((response) => response.json());

  // Prepare demo data. The data is joined to map using value of 'hc-key'
  // property by default. See API docs for 'joinBy' for more info on linking
  // data and map.
  const data = [
    ["uz-fa", 10],
    ["uz-tk", 11],
    ["uz-an", 12],
    ["uz-ng", 13],
    ["uz-ji", 14],
    ["uz-si", 15],
    ["uz-ta", 16],
    ["uz-bu", 17],
    ["uz-kh", 18],
    ["uz-qr", 19],
    ["uz-nw", 20],
    ["uz-sa", 21],
    ["uz-qa", 22],
    ["uz-su", 23],
  ];

  // Create the chart
  Highcharts.mapChart("uzb_map", {
    chart: {
      map: topology,
    },

    title: {
      text: "Uzbekistan map",
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: "bottom",
      },
    },

    colorAxis: {
      min: 0,
      stops: [[0, "#D1E9FF"]],
    },

    legend: {
      enabled: false,
    },

    series: [
      {
        data: data,
        name: "Hudud",
        states: {
          hover: {
            color: "#D1E9FF",
            borderColor: "white",
          },
        },
        dataLabels: {
          enabled: true,
          format: "{point.name}",
        },
      },
    ],
  });
})();
