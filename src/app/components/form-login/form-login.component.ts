import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { SessionService } from '../../services/session.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'
import { MatButtonModule } from '@angular/material/button'


@Component({
  selector: 'app-form-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSlideToggleModule,
    MatButtonModule
  ],
  templateUrl: './form-login.component.html',
  styleUrl: '../form-styles.css'
})

export class FormLoginComponent {
  loginError: boolean = false;
  email: string = '';
  password: string = '';
  rememberLogin: boolean = false;
  hide: boolean = true;

  constructor(
    public login: LoginService,
    public session: SessionService
  ) { }

  async Login() {
    this.loginError = false;
    this.loginError = await this.login.signIn(this.email, this.password, this.rememberLogin);
  }

  Logout() {
    this.login.signOut();
  }

  quickAccess(email: string, pwd: string){
    this.email = email;
    this.password = pwd;
  }
}
