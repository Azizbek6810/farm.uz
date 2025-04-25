import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/core/auth/authentication.service';

@Component({
  selector: 'app-cabinet',
  templateUrl: './cabinet.component.html',
  styleUrls: ['./cabinet.component.css']
})
export class CabinetComponent implements OnInit {
  constructor(
    private router: Router,
    public auth: AuthenticationService
  ) {}

  ngOnInit(): void {}

  onLogOut(event: any): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
