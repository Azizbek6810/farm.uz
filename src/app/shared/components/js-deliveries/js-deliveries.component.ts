import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { DeliveryChild, DeliveryParent, RegionDistrict } from 'src/app/core/models/common.models';
import { JsRegionDistrict, OfferEditModelDeliviries } from 'src/app/pages/cabinet/provider/provider.models';

@Component({
  selector: 'app-regions-districts',
  templateUrl: './js-deliveries.component.html',
  styleUrls: ['./js-deliveries.component.css']
})
export class JsDeliveriesComponent implements OnInit {
  @Input('data') data: RegionDistrict[];
  @Input('isAll') isAll: boolean = false;
  @Input('isDisableAll') isDisableAll: boolean = false;
  @Input('onEditData') onEditData: OfferEditModelDeliviries[] = [];
  filteredData: RegionDistrict[];
  isAllRegions: boolean = false;

  demoItems: DeliveryParent[] = [];

  destroy$: Subject<any>;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges() {
    if (this.data) {
      this.filteredData = this.data;
      if (this.onEditData && this.onEditData.length > 0) {
        this.setEditValues();
      }
    }
  }

  setEditValues() {
    this.onEditData.forEach(region => {
      if (this.filteredData && this.filteredData.length > 0) {
        let viewRegion = this.filteredData.find(s => s.id == region.id);
        viewRegion.selected = true;

        region.children.forEach(district => {
          let viewDistrict = viewRegion.children.find(s => s.id == district.id);
          viewDistrict.selected = true;
          let demoDistrict = <RegionDistrict>{
            id: district.id,
            name: district.name,
            region_id: district.region_id,
            selected: true
          };
          this.onDistrict(demoDistrict);
        });
      }
    });
  }

  getSelectedDeliviries(){
    const items: any= [];
    this.demoItems.forEach(region => {
      region.children.forEach(district => {
        let jsItem = <JsRegionDistrict>{region_id: district.regionId, district_id: district.districtId};
        items.push(jsItem);
      })
    });
    return items;
  }

  onAllRegions() {
    this.isAllRegions = !this.isAllRegions;
    if (this.isAllRegions) {
      this.filteredData.forEach(region => {
        region.selected = true;
        region.children.forEach(district => {
          district.selected = true;
        });
      });
    } else {
      this.filteredData.forEach(region => {
        region.selected = false;
        region.children.forEach(district => {
          district.selected = false;
        });
      });
    }

    this.filteredData.forEach(region => {
      this.toggleDemos(region);
    });
  }

  filterRegions(value: any) {
    let dd: any;
    if (value) {
      dd = value.target.value;
    } else {
      return;
    }
    if (dd == '') {
      this.filteredData = this.data;
    } else {
      this.filteredData = this.data.filter(s => s.name.toLowerCase().includes(dd.toLowerCase()));
    }
  }

  onRegion(region: RegionDistrict) {
    if (!this.isDisableAll) {
      this.toggleChildren(region);
      this.toggleDemos(region);
    }
  }

  toggleDemos(region: RegionDistrict) {
    if (region.selected) {
      let regionDemo = this.demoItems.find(s => s.regionId == region.id);
      if (!regionDemo) {
        let newRegionDemo = <DeliveryParent>{ regionId: region.id, regionName: region.name };
        newRegionDemo.children = [];
        region.children.forEach(district => {
          let newDistrictDemo = <DeliveryChild>{
            districtId: district.id,
            districtName: district.name,
            regionId: district.region_id
          };
          newRegionDemo.children.push(newDistrictDemo);
        });
        this.demoItems.push(newRegionDemo);
      } else {
        region.children.forEach(district => {
          let districtDemo = regionDemo.children.find(s => s.districtId == district.id);
          if (!districtDemo) {
            let newDistrictDemo = <DeliveryChild>{
              districtId: district.id,
              districtName: district.name,
              regionId: district.region_id
            };
            regionDemo.children.push(newDistrictDemo);
          }
        });
      }
    } else {
      this.demoItems = this.demoItems.filter(s => s.regionId != region.id);
    }
  }

  toggleChildren(region: RegionDistrict) {
    let item = this.filteredData.find(s => s.id == region.id);
    if (item) {
      item.children.forEach(element => {
        element.selected = region.selected;
      });
    }
  }

  onDistrict(district: RegionDistrict) {
    if (district.selected) {
      let regionDemo = this.demoItems.find(s => s.regionId == district.region_id);
      if (!regionDemo) {
        let newRegionDemo = <DeliveryParent>{
          regionId: district.region_id,
          regionName: this.getRegionName(district.region_id)
        };
        newRegionDemo.children = [];
        let newDistrictDemo = <DeliveryChild>{
          districtId: district.id,
          districtName: district.name,
          regionId: district.region_id
        };
        newRegionDemo.children.push(newDistrictDemo);
        this.demoItems.push(newRegionDemo);
      } else {
        let districtDemo = regionDemo.children.find(s => s.districtId == district.id);
        if (!districtDemo) {
          let newDistrictDemo = <DeliveryChild>{
            districtId: district.id,
            districtName: district.name,
            regionId: district.region_id
          };
          regionDemo.children.push(newDistrictDemo);
        }
      }
    } else {
      let regionDemo = this.demoItems.find(s => s.regionId == district.region_id);
      if (regionDemo) {
        regionDemo.children = regionDemo.children.filter(s => s.districtId != district.id);
        if (regionDemo.children.length == 0) {
          this.demoItems = this.demoItems.filter(s => s.regionId != regionDemo.regionId);
        }
      }
    }
  }

  getRegionName(regionId: number): string {
    return this.data.find(s => s.id == regionId).name;
  }

  getSelectedNumber(region: RegionDistrict): number {
    return region.children.filter(s => s.selected).length;
  }

  onChildDelete(child: DeliveryChild) {
    if (!this.isDisableAll) {
      let regionDemo = this.demoItems.find(s => s.regionId == child.regionId);
      if (regionDemo) {
        regionDemo.children = regionDemo.children.filter(s => s.districtId != child.districtId);
        if (regionDemo.children.length == 0) {
          this.demoItems = this.demoItems.filter(s => s.regionId != regionDemo.regionId);
        }

        let regionItem = this.filteredData.find(s => s.id == child.regionId);
        if (regionItem) {
          let districtItem = regionItem.children.find(s => s.id == child.districtId);
          if (districtItem) {
            districtItem.selected = false;
          }
        }
      }
    }
  }

}
