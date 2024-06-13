import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDataUsuarioComponent } from '../form-data-usuario/form-data-usuario.component';
import { MatButtonModule } from '@angular/material/button'
import { FormViewerService } from '../../services/form-viewer.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-alta-especialista',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormDataUsuarioComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './form-alta-especialista.component.html',
  styleUrl: '../form-styles.css'
})

export class FormAltaEspecialistaComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  formEspecialista!: FormGroup;

  constructor (
    public formViewer: FormViewerService
  ) { }

  ngOnInit(): void {
    const especialidad = new FormControl(null, [Validators.required]);
    this.form.addControl('especialidad', especialidad);
  }

  OnFormSubmitted(){
    console.log(this.form.value);
  }
  
  controlHasErrors(control: string){
    return this.formViewer.controlHasErrors(this.form, control);
  }

  getControlErrorMessage(control: string){
    return this.formViewer.getControlErrorMessage(this.form, control);
  }
}
