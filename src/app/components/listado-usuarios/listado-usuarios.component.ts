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


@Component({
  selector: 'app-listado-usuarios',
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
  templateUrl: './listado-usuarios.component.html',
  styleUrl: './listado-usuarios.component.css'
})

export class ListadoUsuariosComponent implements OnInit {
  displayedColumns: string[] = ['nombre', 'apellido', 'edad', 'dni', 'email', 'imagenPerfil', 'nivelUsuario', 'especialidad', 'habilitado', 'obraSocial', 'imagenPerfilAlt'];
  dataSource!: MatTableDataSource<any>;
  requestInProgress: boolean = false;
  hideImgs: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor (
    public userdataProvider: DataUsuariosService,
  ) { }
  
  ngOnInit(): void {
    this.userdataProvider.fetchAll().subscribe((response) => {
      this.dataSource = new MatTableDataSource<any>(response);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  habilitar(email: string, habilitacionActual: boolean | null){
    this.requestInProgress = true;
    if (habilitacionActual != null){
      this.userdataProvider.updateHabilitacionEspecialista(email, habilitacionActual)
      .then(() => { this.requestInProgress = false; });
    } else {
      this.requestInProgress = false;
    }

  }

  toggleChanges($event: MatSlideToggleChange){
    this.hideImgs = $event.checked;
  }
}
