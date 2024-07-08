import { Component, OnInit, ViewChild } from '@angular/core';
import { LoggerService } from '../../services/logger.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Log } from '../../models/log';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-listado-logs',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    MatTableModule,
  ],
  templateUrl: './listado-logs.component.html',
  styleUrl: './listado-logs.component.css'
})

export class ListadoLogsComponent implements OnInit {
  displayedColumns: string[] = ['fecha', 'usuario'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor (
    public logger: LoggerService,
  ) { }

  ngOnInit(): void {
    this.logger.fetchAll().subscribe(
      (res) => {
        this.dataSource = new MatTableDataSource<any>(Log.constructorArr(res));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    });
  }
}
