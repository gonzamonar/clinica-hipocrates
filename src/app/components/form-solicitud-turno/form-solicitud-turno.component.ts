import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DataUsuariosService } from '../../services/data-usuarios.service';
import { DataHorariosService } from '../../services/data-horarios.service';
import { DataTurnosService } from '../../services/data-turnos.service';
import { NotifierService } from '../../services/notifier.service';
import { SessionService } from '../../services/session.service';

import { Especialista } from '../../models/especialista';
import { Paciente } from '../../models/paciente';
import { Horario } from '../../models/horario';
import { Turno } from '../../models/turno';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-form-solicitud-turno',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatStepperModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule,
    MatBadgeModule
  ],
  templateUrl: './form-solicitud-turno.component.html',
  styleUrls: ['../form-styles.css', './form-solicitud-turno.component.css']
})

export class FormSolicitudTurnoComponent implements OnInit {
  especialistas!: Especialista[];
  opcionesEspecialidades!: string[];
  opcionesEspecialistas!: Especialista[];
  opcionesPacientes!: Paciente[];
  selectedEspecialista: Especialista | null = null;
  selectedPaciente: Paciente | null = null;
  opcionesHorarios!: Horario[];
  opcionesFechas!: string[];
  opcionesHoras!: string[];
  sendingRequest: boolean = false;

  zeroStepForm = this._formBuilder.group({
    paciente: ['', Validators.required],
  });

  firstStepForm = this._formBuilder.group({
    especialidad: ['', Validators.required],
  });

  secondStepForm = this._formBuilder.group({
    especialista: ['', Validators.required],
  });
  
  thirdStepForm = this._formBuilder.group({
    fecha: ['', Validators.required],
  });
  
  fourthStepForm = this._formBuilder.group({
    hora: ['', Validators.required],
  });

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginatorHoras') paginatorHoras!: MatPaginator;
  @ViewChild(MatStepper) stepper!: MatStepper;

  constructor(
    private _formBuilder: FormBuilder,
    public session: SessionService,
    private providerDataUsuarios: DataUsuariosService,
    private providerDataHorarios: DataHorariosService,
    private providerDataTurnos: DataTurnosService,
    private notifier: NotifierService
  ) {}


  ngOnInit(): void {
    this.providerDataUsuarios.fetchAll()
    .subscribe((res) => {
      this.especialistas = Especialista.filtrarHabilitados(Especialista.constructorArr(res));
      this.opcionesPacientes = Paciente.constructorArr(res);
      this.opcionesEspecialidades = Especialista.getEspecialidades(this.especialistas);
    });
  }
  

  pacienteSelectChanged($event: MatSelectChange){
    this.selectedPaciente = null;

    if ($event.value != undefined) {
      this.selectedPaciente = Paciente.filtrarUno(this.opcionesPacientes, $event.value);
    } else {
      this.selectedPaciente = null;
    }
  }

  
  especialidadSelectChanged($event: MatSelectChange){
    this.selectedEspecialista = null;
    this.secondStepForm.controls.especialista.reset();
    this.thirdStepForm.controls.fecha.reset();
    this.fourthStepForm.controls.hora.reset();

    if ($event.value != undefined) {
      this.opcionesEspecialistas = Especialista.filtrarPorEspecialidad(this.especialistas, $event.value);
    } else {
      this.opcionesEspecialistas = [];
    }
  }


  especialistaSelectChanged($event: MatSelectChange){
    this.thirdStepForm.controls.fecha.reset();
    this.fourthStepForm.controls.hora.reset();
    let especialidad: string | null = this.firstStepForm.controls.especialidad.value;

    if ($event.value != undefined && especialidad != null) {
      this.selectedEspecialista = Especialista.filtrarUno(this.especialistas, $event.value);
      this.providerDataHorarios.fetchOne(this.selectedEspecialista.email, especialidad).then(
        (data) => {
          this.opcionesHorarios = this.providerDataHorarios.crearArrayHorarios(
            data.horarios.split(","),
            this.providerDataHorarios.crearArrFechas(15)
          )
          this.opcionesHorarios = this.providerDataHorarios.quitarHorariosUsados(this.opcionesHorarios, $event.value, especialidad);

          this.opcionesFechas = this.opcionesHorarios.map((h) => { return h.displayDay(); });
          this.opcionesFechas = [...new Set(this.opcionesFechas)];
          this.paginator.length = this.opcionesFechas.length;
        });
    } else {
      this.selectedEspecialista = null;
    }
  }


  fechaSelectChanged($event: MatRadioChange){
    this.fourthStepForm.controls.hora.reset();
    
    if ($event.value != undefined) {
      this.opcionesHoras = this.opcionesHorarios.filter((i) => { return i.dia == $event.value.split(" ")[1] }).map((i) => { return i.hora; });
      this.paginatorHoras.length = this.opcionesHoras.length;
    }
  }


  getCountFecha(fecha: string){
    let dia = fecha.split(" ")[1];
    return Horario.contarDias(this.opcionesHorarios, dia);
  }


  confirmarTurno(){
    this.sendingRequest = true;

    if (this.session.isPatientLevelSession() && this.session.data != null && this.session.data != undefined){
      this.zeroStepForm.controls.paciente.setValue(this.session.data?.email);
    }

    if (
      this.zeroStepForm.controls.paciente.value != ''
      && this.zeroStepForm.controls.paciente.value != null
      && this.firstStepForm.controls.especialidad.value != null
      && this.secondStepForm.controls.especialista.value != null
      && this.thirdStepForm.controls.fecha.value != null
      && this.fourthStepForm.controls.hora.value != null
    ){
      let paciente = this.zeroStepForm.controls.paciente.value;
      let especialidad = this.firstStepForm.controls.especialidad.value;
      let especialista = this.secondStepForm.controls.especialista.value;
      let fecha = this.thirdStepForm.controls.fecha.value.split(" ")[1];
      let hora = this.fourthStepForm.controls.hora.value;

      let turno = new Turno(
        0,
        especialista,
        especialidad,
        paciente,
        fecha,
        hora
      );

      this.providerDataTurnos.pushOne(turno)
      .then(
        (res) => {
          if (res){
            this.notifier.popUpNotification("Turno confirmado exitosamente.");
            this.stepper.reset();
          } else {
            this.notifier.popUpNotification("No se pudo confirmar el turno, inténtelo nuevamente.");
          }
          this.sendingRequest = false;
        })
      } else {
      this.notifier.popUpNotification("Ha ocurrido un error en los campos ingresados.");
      this.sendingRequest = false;
    }
  }
}
