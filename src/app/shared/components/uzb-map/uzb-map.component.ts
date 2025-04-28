import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IdNameModel, MapStats } from 'src/app/core/models/common.models';
import { CommonService } from 'src/app/core/services/common.service';
declare var Highcharts: any;
declare var $: any;

@Component({
  selector: 'app-uzb-map',
  templateUrl: './uzb-map.component.html',
  styleUrls: ['./uzb-map.component.css']
})
export class UzbMapComponent implements OnInit {
  @Input() currentRegion: number;
  @Output() clickRegion = new EventEmitter<IdNameModel>();
  selectedRegion: IdNameModel;
  regionList = [
    {
      id: 1111,
      name: 'RepublicUzbekistan'
    },
    {
      id: 3049,
      name: 'Karakalpak'
    },
    {
      id: 2858,
      name: 'Khorezm'
    },
    {
      id: 1008,
      name: 'Navoi'
    },
    {
      id: 242,
      name: 'Bukhara'
    },
    {
      id: 1413,
      name: 'Samarkand'
    },
    {
      id: 679,
      name: 'Kashkadarya'
    },
    {
      id: 1692,
      name: 'Surkhandarya'
    },
    {
      id: 487,
      name: 'Jizzakh'
    },
    {
      id: 2120,
      name: 'TashkentRegion'
    },
    {
      id: 2105,
      name: 'TashkentCity'
    },
    {
      id: 1150,
      name: 'Namangan'
    },
    {
      id: 2,
      name: 'Andijan'
    },
    {
      id: 2434,
      name: 'Fergana'
    },
    {
      id: 1977,
      name: 'Syrdarya'
    }
  ];
  mapStats: MapStats[] = [
    {
      region_id: -1,
      region_name: 'Все',
      active_proposal_count: 96,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 2,
      region_name: 'Andijan',
      active_proposal_count: 96,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 242,
      region_name: 'Bukhara',
      active_proposal_count: 72,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 487,
      region_name: 'Jizzakh',
      active_proposal_count: 51,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 679,
      region_name: 'Kashkadarya',
      active_proposal_count: 83,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 1008,
      region_name: 'Navoi',
      active_proposal_count: 60,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 1150,
      region_name: 'Namangan',
      active_proposal_count: 35,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 1413,
      region_name: 'Samarkand',
      active_proposal_count: 72,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 1692,
      region_name: 'Surkhandarya',
      active_proposal_count: 89,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 1977,
      region_name: 'Syrdarya',
      active_proposal_count: 52,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 2105,
      region_name: 'TashkentCity',
      active_proposal_count: 244,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 2120,
      region_name: 'TashkentRegion',
      active_proposal_count: 149,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 2434,
      region_name: 'Fergana',
      active_proposal_count: 65,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 2858,
      region_name: 'Khorezm',
      active_proposal_count: 64,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    },
    {
      region_id: 3049,
      region_name: 'Karakalpak',
      active_proposal_count: 47,
      today_proposal_count: 0,
      current_year_deals_count: 0,
      current_year_deals_sum: 0,
      last_month_deals_count: 0,
      last_month_deals_sum: 0
    }
  ];

  constructor(
    private service: CommonService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadMapStat()
  }

  selectRegion(id: number) {
    if (id) {
      this.currentRegion = id;
      this.regionList.forEach(item => {
        if (+id === item.id) {
          this.selectedRegion = new IdNameModel();
          this.selectedRegion.id = item.id;
          this.selectedRegion.name = item.name;
        }
      });
      this.clickRegion.emit(this.selectedRegion);
    }
  }

  loadMapStat() {
    this.service.getMapStats().subscribe(data => {
      this.mapStats = data;
      this.runJS();
      this.mapStats = this.mapStats.sort((x, y) => x.region_id - y.region_id);
    });
  }

  translateText(text: string) {
    return this.translate.instant(text);
  }

  runJS() {
    const self = this;
    let lastSelectedRegion: any = null;
    setTimeout(() => {
      let regions: any = {};
    // Processing region data
      for (let i = 0; i < this.mapStats.length; i++) {
        let obj = {
          label: this.mapStats[i].region_name,
          lots: this.mapStats[i].active_proposal_count,
          id: this.mapStats[i].region_id,
          currentTenders: this.mapStats[i].active_proposal_count,
          todaysTenders: this.mapStats[i].today_proposal_count,
          currentYear: this.mapStats[i].current_year_deals_count,
          lastMonth: this.mapStats[i].last_month_deals_count,
          sumDealsCYear: this.mapStats[i].current_year_deals_sum,
          sumDealsLastMonth: this.mapStats[i].last_month_deals_sum
        };
        if (this.mapStats[i].region_id === 2) {
          regions['uz-an'] = obj;
        } else if (this.mapStats[i].region_id === 242) {
          regions['uz-bu'] = obj;
        } else if (this.mapStats[i].region_id === 487) {
          regions['uz-ji'] = obj;
        } else if (this.mapStats[i].region_id === 679) {
          regions['uz-qa'] = obj;
        } else if (this.mapStats[i].region_id === 1008) {
          regions['uz-nw'] = obj;
        } else if (this.mapStats[i].region_id === 1150) {
          regions['uz-ng'] = obj;
        } else if (this.mapStats[i].region_id === 1413) {
          regions['uz-sa'] = obj;
        } else if (this.mapStats[i].region_id === 1692) {
          regions['uz-su'] = obj;
        } else if (this.mapStats[i].region_id === 1977) {
          regions['uz-si'] = obj;
        } else if (this.mapStats[i].region_id === 2105) {
          regions['uz-tk'] = obj;
        } else if (this.mapStats[i].region_id === 2120) {
          regions['uz-ta'] = obj;
        } else if (this.mapStats[i].region_id === 2434) {
          regions['uz-fa'] = obj;
        } else if (this.mapStats[i].region_id === 2858) {
          regions['uz-kh'] = obj;
        } else if (this.mapStats[i].region_id === 3049) {
          regions['uz-qr'] = obj;
        }
      }

      let data = Highcharts.geojson(Highcharts.maps['countries/uz/uz-all']);

      for (let i = 0; i < data.length; i++) {
        let key = data[i].properties['hc-key'];
        data[i].drilldown = key;
        data[i].properties['woe-name'] = self.translateText(regions[key].label);
        data[i].properties['woe-lots'] = regions[key].lots;
        data[i].properties['woe-id'] = regions[key].id;
        data[i].properties['woe-currentTenders'] = regions[key].currentTenders;
        data[i].properties['woe-currentYear'] = regions[key].currentYear;
        data[i].properties['woe-todaysTenders'] = regions[key].todaysTenders;
        data[i].properties['woe-lastMonth'] = regions[key].lastMonth;
        data[i].properties['woe-sumDealsCYear'] = regions[key].sumDealsCYear;
        data[i].properties['woe-sumDealsLastMonth'] = regions[key].sumDealsLastMonth;

        if (data[i].properties['hc-key'] === 'uz-tk') {
          data[i].color = '#2d58cb'; // default region
        }
      }

      let chart: any = Highcharts.mapChart('map_container', {
        chart: {
          events: {
            drilldown: function (e: any) {
              if (!e.seriesOptions) {
                let chart: any = this;
                chart.showLoading(`
                  <h2 style="color: #004d40">
                    <span class="text-danger">
                       ${self.translateText(e.point.properties['woe-name'])}
                    </span>
                    <span class="text-danger">загрузка....</span>
                  </h2>
                  <i class="icon-spinner icon-spin icon-3x"></i>
                `);
                setTimeout(() => {
                  chart.hideLoading();
                  $('#regionName').html(e.point.properties['woe-name']);
                  $('#sumLastMonth').html(e.point.properties['woe-sumDealsLastMonth'] + ' ');
                  $('#currentTenders').html(e.point.properties['woe-currentTenders']);
                  $('#todaysTenders').html(e.point.properties['woe-todaysTenders']);
                  $('#currentYear').html(e.point.properties['woe-currentYear']);
                  $('#lastMonth').html(e.point.properties['woe-lastMonth']);
                  $('#sumDealsCYear').html(e.point.properties['woe-sumDealsCYear'] + ' ');
                  $('#loadPropByRegion').attr('href', 'lots/1' + e.point.properties['woe-id']);
                }, 500);
              }
            }
          }
        },
        title: {
          text: ''
        },
        subtitle: {
          text: '',
          useHTML: true,
          align: 'right',
          style: {
            fontSize: '16px'
          }
        },
        legend: false,
        colorAxis: {
          min: 0,
          minColor: '#e6e7e8',
          maxColor: '#005645'
        },
        mapNavigation: {
          enabled: false,
          buttonOptions: {
            verticalAlign: 'buttom'
          }
        },
        plotOptions: {
          map: {
            color: '#b5dcfd'
          },
          series: {
            dataLabels: {
              enabled: true,
              allowOverlap: true,
              useHTML: true,
              style: {
                'text-align': 'center'
              }
            }
          }
        },
        series: [
          {
            data: data,
            name: '',
            joinBy: ['properties.woe-name', 'properties.woe-lots'],
            animation: true,
            events: {
              click: (e: any) => {
                const regionId = e.point.properties['woe-id'];
                // Reset the color of all regions
                chart.series[0].data.forEach((point: any) => {
                  point.update({ color: '#b5dcfd' }); // Original color
                });

                // Select a new color for the selected region
                e.point.update({
                  color: '#2d58cb'
                });

                lastSelectedRegion = e.point;
                e.point.options.defaultColor = e.point.color;
                this.selectRegion(regionId);
              }
            },
            dataLabels: {
              enabled: false
            },
            states: {
              hover: {
                color: '#2D58CB'
              }
            },
            shadow: false
          }
        ],
        xAxis: {
          events: {
            setExtremes: function () {
              $('#button').hide();
            }
          }
        },
        exporting: false,
        drilldown: {
          activeDataLabelStyle: {
            color: '#ffffff',
            textDecoration: 'none',
            textOutline: '1px #ffffff'
          },
          drillUpButton: {
            relativeTo: 'spacingBox',
            position: {
              x: 0,
              y: 60
            }
          }
        },
        tooltip: {
          borderColor: '#ffffff',
          pointFormat: `<p style="color: #000;text-align:center;font-size: 14px;font-weight:normal;">
            {point.properties.woe-name}: {point.properties.woe-lots} шт
          </p>`,
          shared: true
        },
        credits: {
          enabled: true
        }
      });

      document.getElementById('colorizeButton').addEventListener('click', () => {
        chart.series[0].data.forEach((point: any) => {
          point.update({ color: '#2D58CB' });
        });

        this.selectRegion(1111)
      });
    }, 1000);
  }
}
