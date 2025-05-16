import { Component, OnInit } from '@angular/core';
import { RegistrationComponent } from "../registration/registration/registration.component";

@Component({
  selector: 'app-user',
  imports: [RegistrationComponent],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
