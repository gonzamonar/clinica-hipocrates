import { Component, OnInit } from '@angular/core';
import { DataTurnosService } from '../../services/data-turnos.service';
import { Turno } from '../../models/turno';
import { CommonModule } from '@angular/common';
import { DataUsuariosService } from '../../services/data-usuarios.service';
import { Especialista } from '../../models/especialista';
import { Paciente } from '../../models/paciente';
import { CardTurnoComponent } from '../card-turno/card-turno.component';
import { SessionService } from '../../services/session.service';
import { Usuario } from '../../models/usuario';
import { DataHistoriaClinicaService } from '../../services/data-historia-clinica.service';
import { HistoriaClinica } from '../../models/historia-clinica';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-listado-turnos',
  standalone: true,
  imports: [
    CommonModule,
    CardTurnoComponent,
    FormsModule,
    MatInputModule,
    MatIconModule,
  ],
  templateUrl: './listado-turnos.component.html',
  styleUrl: './listado-turnos.component.css'
})

export class ListadoTurnosComponent implements OnInit {
  turnos!: Turno[];
  turnosFiltrados: Turno[] = [];
  especialistas!: Especialista[];
  pacientes!: Paciente[];
  usuarios!: Usuario[];
  historiasClinicas: HistoriaClinica[] = [];
  searchStr: string = '';

  constructor(
    public providerDataTurnos: DataTurnosService,
    public providerDataUsuarios: DataUsuariosService,
    public providerDataHistoriaClinica: DataHistoriaClinicaService,
    public session: SessionService,
  ){ }

  ngOnInit() {
    this.providerDataHistoriaClinica.fetchAll().subscribe(
      (res) => {
        this.historiasClinicas = HistoriaClinica.constructorArr(res);
    });

    this.providerDataUsuarios.fetchAll().subscribe(
      (res) => {
        if (res != null){
          this.usuarios = Usuario.constructorArr(res);
          this.especialistas = Especialista.constructorArr(res);
          this.pacientes = Paciente.constructorArr(res);
        }
    });

    this.providerDataTurnos.fetchAll().subscribe(
      (res) => {
        this.turnos = Turno.ordenarPorNroTurnoDesc(Turno.constructorArr(res));
        
        if (this.session.isPatientLevelSession() && this.session.data != null){
          this.turnos = Turno.filtrarPorPaciente(this.turnos, this.session.data?.email);
        }

        if (this.session.isSpecialistLevelSession() && this.session.data != null){
          this.turnos = Turno.filtrarPorEspecialista(this.turnos, this.session.data?.email);
        }

        this.filtrarTurnos();
    });
  }

  getHistoriaClinica(nro_turno: number): HistoriaClinica {
    return HistoriaClinica.filtrarPorTurno(this.historiasClinicas, nro_turno);
  }

  filtrarTurnos(){
    let searchStr = this.searchStr.toLocaleLowerCase();

    if (searchStr != '' && this.especialistas != null && this.pacientes != null && this.turnos != null){
      this.turnosFiltrados = this.turnos.filter((t) => {
        let especialista: Usuario = Usuario.filtrarUno(this.especialistas, t.especialista);
        let paciente: Usuario = Usuario.filtrarUno(this.pacientes, t.paciente);
        let checkHistoriaClinica = false;
        if (t.nro_historia_clinica){
          let historiaClinica = HistoriaClinica.filtrarPorTurno(this.historiasClinicas, t.nro_turno);
          checkHistoriaClinica = historiaClinica.includes(searchStr);
        }
        return especialista.includes(searchStr) || paciente.includes(searchStr) || t.includes(searchStr) || checkHistoriaClinica;
      });
    } else {
      this.turnosFiltrados = this.turnos;
    }
  }
}
