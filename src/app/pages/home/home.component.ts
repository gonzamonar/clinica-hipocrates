import { Component } from '@angular/core';
import { FormRegisterComponent } from '../../components/form-register/form-register.component';
import { FormLoginComponent } from '../../components/form-login/form-login.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormLoginComponent,
    FormRegisterComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})

export class HomeComponent {
}
