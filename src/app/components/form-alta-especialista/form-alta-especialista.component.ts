import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDataUsuarioComponent } from '../form-data-usuario/form-data-usuario.component';
import { MatButtonModule } from '@angular/material/button'
import { FormViewerService } from '../../services/form-viewer.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { DataEspecialidadesService } from '../../services/data-especialidades.service';
import { LoginService } from '../../services/login.service';
import { DataUsuariosService } from '../../services/data-usuarios.service';
import { Especialista } from '../../models/especialista';
import { ToTitleCaseDirective } from '../../directives/to-title-case.directive';
import { NotifierService } from '../../services/notifier.service';


@Component({
  selector: 'app-form-alta-especialista',
  standalone: true,
  imports: [
    ToTitleCaseDirective,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    FormDataUsuarioComponent,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './form-alta-especialista.component.html',
  styleUrl: '../form-styles.css'
})

export class FormAltaEspecialistaComponent implements OnInit {
  @Input() submitBtnTxt: string = "Registrarse";

  form: FormGroup = new FormGroup({});
  formEspecialista!: FormGroup;
  addTriggered: boolean = false;
  imagenPerfil!: File;
  failedRegister: boolean = false;
  registerError: string = "";

  constructor (
    public formViewer: FormViewerService,
    public dataEspecialidades: DataEspecialidadesService,
    private providerDataUsuarios: DataUsuariosService,
    private loginService: LoginService,
    private notifier: NotifierService
  ) { }

  ngOnInit(): void {
    const especialidad = new FormControl(null, [Validators.required]);
    const nuevaEspecialidad = new FormControl(null, [Validators.minLength(5), Validators.pattern(this.formViewer.namesRegex)]);
    this.form.addControl('especialidad', especialidad);
    this.form.addControl('nuevaEspecialidad', nuevaEspecialidad);
  }

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
            let especialista: Especialista = new Especialista(
              userInfo.get('nombre')?.value,
              userInfo.get('apellido')?.value,
              parseInt(userInfo.get('edad')?.value),
              parseInt(userInfo.get('dni')?.value),
              userInfo.get('email')?.value,
              userInfo.get('imagenPerfil')?.value,
              "especialista",
              this.form.get('especialidad')?.value,
              false
            );
            
            this.providerDataUsuarios.pushOneEspecialista(especialista, this.imagenPerfil);
            this.form.reset();
            this.notifier.successfullRegisterNotification();
          }
        }
      )
    }
  }
  
  controlHasErrors(control: string){
    return this.formViewer.controlHasErrors(this.form, control);
  }

  getControlErrorMessage(control: string){
    return this.formViewer.getControlErrorMessage(this.form, control);
  }

  async agregarEspecialidad() {
    let nuevaEspecialidad = this.form.get('nuevaEspecialidad');
    
    if (nuevaEspecialidad?.valid && nuevaEspecialidad.value != null && nuevaEspecialidad.value != "" && !this.addTriggered) {
      this.addTriggered = true;
      let result = await this.dataEspecialidades.pushOne(nuevaEspecialidad.value);
      if (result) {
        this.notifier.popUpNotification("Especialidad agregada exitosamente.");
      } else {
        this.notifier.popUpNotification("La especialidad ya existe.");
      }
      nuevaEspecialidad.reset();
      this.addTriggered = false;
    }
  }

  updateImagenPerfil(file: any){
    this.imagenPerfil = file;
  }
}
