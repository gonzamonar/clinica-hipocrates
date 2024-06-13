import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormDataUsuarioComponent } from '../form-data-usuario/form-data-usuario.component';
import { MatButtonModule } from '@angular/material/button'
import { FormViewerService } from '../../services/form-viewer.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-form-alta-paciente',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormDataUsuarioComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './form-alta-paciente.component.html',
  styleUrl: '../form-styles.css'
})


export class FormAltaPacienteComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  formPaciente!: FormGroup;

  constructor (
    public formViewer: FormViewerService
  ) { }

  ngOnInit(): void {
    const obraSocial = new FormControl(null, [Validators.required]);
    this.form.addControl('obraSocial', obraSocial);
  }

  OnFormSubmitted(){
    // let paciente: Paciente = new Paciente(
    //   parseInt(this.form.get('dni')?.value),
    //   this.form.get('nombre')?.value,
    //   parseInt(this.form.get('edad')?.value),
    //   parseInt(this.form.get('capacidadTransporte')?.value),
    //   this.form.get('pais')?.value,
    //   this.form.get('unidadPropia')?.value,
    // );
    
    // this.providerDataPacientes.pushOne(paciente);

    this.form.reset();
  }

  controlHasErrors(control: string){
    return this.formViewer.controlHasErrors(this.form, control);
  }

  getControlErrorMessage(control: string){
    return this.formViewer.getControlErrorMessage(this.form, control);
  }
}
