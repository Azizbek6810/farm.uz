import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrls: ['./skeleton-loader.component.css']
})
export class SkeletonLoaderComponent implements OnInit {
  @Input() count: number = 5;
  @Input() animationType: string = 'progress';
  @Input() appearance: string = null;
  @Input() style: any = {height: '50px'};

  constructor() { }

  ngOnInit(): void {
  }

}
