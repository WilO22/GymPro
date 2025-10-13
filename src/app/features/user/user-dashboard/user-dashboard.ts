import { Component } from '@angular/core';
import { ClassList } from '../class-list/class-list';
import { MyReservations } from '../my-reservations/my-reservations';

@Component({
  selector: 'app-user-dashboard',
  imports: [ClassList, MyReservations],
  templateUrl: './user-dashboard.html',
  styleUrl: './user-dashboard.css'
})
export class UserDashboard {

}
