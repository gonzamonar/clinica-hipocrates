import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTurnosService } from '../../services/data-turnos.service';
import { CommonModule } from '@angular/common';
import { Turno } from '../../models/turno';
import { DataUsuariosService } from '../../services/data-usuarios.service';
import { Especialista } from '../../models/especialista';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepicker, MatDatepickerInputEvent, MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-info-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule
  ],
  templateUrl: './info-estadisticas.component.html',
  styleUrl: './info-estadisticas.component.css'
})

export class InfoEstadisticasComponent implements OnInit {
  turnos!: Turno[];
  turnosSolicitados!: Turno[];
  turnosRealizados!: Turno[];
  especialidades!: string[];
  especialistas!: Especialista[];
  emailsEspecialistas!: string[];
  dias!: string[];
  fechaTurnosSolicitadosDesde!: Date;
  fechaTurnosSolicitadosHasta!: Date;

  constructor(
    private providerDataTurnos: DataTurnosService,
    private providerDataUsuarios: DataUsuariosService,
  ){}

  ngOnInit() {
    this.providerDataTurnos.fetchAll().subscribe(
      (res) => {
        this.turnos = Turno.constructorArr(res);
        this.turnosSolicitados = this.turnos;
        this.turnosRealizados = this.turnos;
        this.especialidades = Turno.getEspecialidades(Turno.ordenarPorEspecialidad(this.turnos));
        this.emailsEspecialistas = Turno.getEspecialistas(Turno.ordenarPorEspecialista(this.turnos));
        this.dias = Turno.getDias(Turno.ordenarPorFecha(this.turnos));
    });

    this.providerDataUsuarios.fetchAll().subscribe(
      (res) => {
        this.especialistas = Especialista.filtrarPorEmails(Especialista.constructorArr(res), this.emailsEspecialistas);
    });
  }

  cantidadTurnosEspecialidades(especialidad: string){
    return Turno.contarPorEspecialidad(this.turnos, especialidad);
  }

  cantidadTurnosDias(dia: string){
    return Turno.contarPorDia(this.turnos, dia);
  }

  cantidadTurnosSolicitadosEspecialistas(especialista: string){
    return Turno.contarPorNoEstado(Turno.filtrarPorEspecialista(this.turnosSolicitados, especialista), 'Finalizado');
  }
  
  cantidadTurnosFinalizadosEspecialistas(especialista: string){
    return Turno.contarPorEstado(Turno.filtrarPorEspecialista(this.turnosRealizados, especialista), 'Finalizado');
  }

  filtrarFechaTurnosSolicitados(){
    // console.log("DESDE: " +  this.formatDate(this.fechaTurnosSolicitadosDesde));
    // console.log("HASTA: " + this.formatDate(this.fechaTurnosSolicitadosHasta));
    if (this.fechaTurnosSolicitadosDesde != null && this.fechaTurnosSolicitadosHasta != null){
      this.turnosSolicitados = Turno.filtrarPorFecha(this.turnos, this.formatDate(this.fechaTurnosSolicitadosDesde), this.formatDate(this.fechaTurnosSolicitadosHasta));
    }
  }

  filtrarFechaTurnosRealizados(){
    this.turnosRealizados = Turno.filtrarPorFecha(this.turnos, '28/6/24', '29/6/24');
  }

  formatDate(date: Date): string {
    return date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear();
  }
}
