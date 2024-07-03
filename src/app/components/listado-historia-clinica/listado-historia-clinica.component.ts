import { Component, OnInit, ViewChild } from '@angular/core';
import { DataUsuariosService } from '../../services/data-usuarios.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RenderNullStringFieldPipe } from '../../pipes/render-null-string-field.pipe';
import { RenderBooleanFieldPipe } from '../../pipes/render-boolean-field.pipe';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSlideToggleChange, MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataHistoriaClinicaService } from '../../services/data-historia-clinica.service';
import { Usuario } from '../../models/usuario';
import { SessionService } from '../../services/session.service';
import { HistoriaClinica } from '../../models/historia-clinica';
import { DataTurnosService } from '../../services/data-turnos.service';
import { Turno } from '../../models/turno';

@Component({
  selector: 'app-listado-historia-clinica',
  standalone: true,
  imports: [
    CommonModule,
    RenderNullStringFieldPipe,
    RenderBooleanFieldPipe,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSortModule,
    MatSlideToggleModule
  ],
  templateUrl: './listado-historia-clinica.component.html',
  styleUrl: './listado-historia-clinica.component.css'
})

export class ListadoHistoriaClinicaComponent {
  displayedColumns: string[] = ['fecha', 'paciente', 'especialista', 'altura', 'peso', 'temperatura', 'presion', 'datoDinamico1', 'datoDinamico2', 'datoDinamico3'];
  dataSource!: MatTableDataSource<HistoriaClinica>;
  usuarios!: Usuario[];
  turnos!: Turno[];
  title: string = 'Historias Clínicas';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor (
    public providerDataHistoriaClinica: DataHistoriaClinicaService,
    public providerDataUsuarios: DataUsuariosService,
    public providerDataTurnos: DataTurnosService,
    public session: SessionService,
  ) { }
  
  ngOnInit(): void {
    if (this.session.isSpecialistLevelSession()){
      this.displayedColumns.splice(2, 1);
    } else if (this.session.isPatientLevelSession()){
      this.displayedColumns.splice(1, 1);
    }

    this.providerDataUsuarios.fetchAll().subscribe(
      (response) => {
        this.usuarios = Usuario.constructorArr(response);
    });

    this.providerDataTurnos.fetchAll().subscribe(
      (response) => {
        this.turnos = Turno.constructorArr(response);
    });

    this.providerDataHistoriaClinica.fetchAll().subscribe(
      (response) => {
        let historiasClinicas: HistoriaClinica[] = HistoriaClinica.constructorArr(response);

        if (this.session.isPatientLevelSession() && this.session.data){
          historiasClinicas = HistoriaClinica.filtrarPorPaciente(historiasClinicas, this.session.data.email);
          this.title = 'Historia Clínica de ' + this.session.data.fullName();
        }

        if (this.session.isSpecialistLevelSession() && this.session.data){
          historiasClinicas = HistoriaClinica.filtrarPorEspecialista(historiasClinicas, this.session.data.email);
        }

        this.dataSource = new MatTableDataSource<HistoriaClinica>(historiasClinicas);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }

  renderName(usuario: string): string {
    let str: string = usuario;
    if (this.usuarios != null && this.usuarios != undefined){
      str = Usuario.getUserFullName(this.usuarios, usuario);
    }
    return str;
  }

  renderFecha(nro_turno: string): string {
    let str: string = '-';
    if (this.turnos != null && this.turnos != undefined){
      str = Turno.filtrarUno(this.turnos, parseInt(nro_turno)).dia;
    }
    return str;
  }
}
