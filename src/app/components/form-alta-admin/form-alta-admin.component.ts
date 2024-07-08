import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormDataUsuarioComponent } from '../form-data-usuario/form-data-usuario.component';
import { MatButtonModule } from '@angular/material/button'
import { FormViewerService } from '../../services/form-viewer.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { DataEspecialidadesService } from '../../services/data-especialidades.service';
import { LoginService } from '../../services/login.service';
import { DataUsuariosService } from '../../services/data-usuarios.service';
import { Admin } from '../../models/admin';
import { NotifierService } from '../../services/notifier.service';
import { SessionService } from '../../services/session.service';


@Component({
  selector: 'app-form-alta-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    FormDataUsuarioComponent,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './form-alta-admin.component.html',
  styleUrl: '../form-styles.css'
})


export class FormAltaAdminComponent {
  form: FormGroup = new FormGroup({});
  imagenPerfil!: File;
  failedRegister: boolean = false;
  registerError: string = "";

  constructor (
    public formViewer: FormViewerService,
    public dataEspecialidades: DataEspecialidadesService,
    private providerDataUsuarios: DataUsuariosService,
    private loginService: LoginService,
    private notifier: NotifierService,
  ) { }


  OnFormSubmitted() {
    this.failedRegister = false;
    this.registerError = "";
    let userInfo: any = this.form.get('userInfo');

    if (userInfo){
      let email: string = userInfo.get('email')?.value;
      let pwd: string = userInfo.get('password')?.value;

      this.loginService.Register(email, pwd).then(
        (res) => {
          this.failedRegister = res.error;
          this.registerError = res.msg;
          if (!res.error){
            let admin: Admin = new Admin(
              userInfo.get('nombre')?.value,
              userInfo.get('apellido')?.value,
              parseInt(userInfo.get('edad')?.value),
              parseInt(userInfo.get('dni')?.value),
              userInfo.get('email')?.value,
              userInfo.get('imagenPerfil')?.value,
              "admin"
            );
            
            this.providerDataUsuarios.pushOneAdmin(admin, this.imagenPerfil);
            this.form.reset();
            this.notifier.successfullRegisterNotification();
          }
        }
      )
    }
  }

  updateImagenPerfil(file: any){
    this.imagenPerfil = file;
  }
}
