import { Injectable } from '@angular/core';
import { Crud } from '../interfaces/crud';

@Injectable({
  providedIn: 'root'
})
export class DataPacientesService implements Crud {

  constructor() { }
  
  pushOne() {
    throw new Error('Method not implemented.');
  }
}
