import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, deleteDoc, getDocs, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Horario } from '../models/horario';
import { DataTurnosService } from './data-turnos.service';
import { Turno } from '../models/turno';

@Injectable({
  providedIn: 'root'
})
export class DataHorariosService {
  TABLE: string = 'horarios';
  weekDays: string[] = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'];
  dayInMillis: number = 86400000;
  turnos!: Turno[];

  constructor(
    private firestore: Firestore,
    private providerDataTurnos: DataTurnosService
  ) {
    this.fetchAll();
    this.providerDataTurnos.fetchAll().subscribe(
      (res) => {
        this.turnos = Turno.constructorArr(res);
    });
  }

  async pushOne(horarios: string, especialista: string, especialidad: string): Promise<boolean> {
    let success = false;
    let dataCollection = collection(this.firestore, this.TABLE);

    await this.deleteOne(especialista, especialidad);
    
    let status = await addDoc(dataCollection, {
      'especialista': especialista,
      'especialidad': especialidad,
      'horarios': horarios,
    });
    
    if (status){
      success = true;
    }

    return success;
  }

  async deleteOne(especialista: string, especialidad: string){
    let col = collection(this.firestore, this.TABLE);
    const fetchQuery = query(
      col, 
      where("especialista", "==", especialista),
      where("especialidad", "==", especialidad),
      limit(1),
    );
    const querySnapshot = await getDocs(fetchQuery);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref);
    });
  }
  
  async fetchOne(especialista: string, especialidad: string): Promise<any> {
      let col = collection(this.firestore, this.TABLE);
      const fetchQuery = query(
        col, 
        where("especialista", "==", especialista),
        where("especialidad", "==", especialidad),
        limit(1),
      );
      const querySnapshot = await getDocs(fetchQuery);
      return querySnapshot.docs[0]?.data();
  }

  fetchAll(){
    // let col = collection(this.firestore, this.TABLE);
    // const sortedQuery = query(
    //   col,
    //   orderBy('apellido', 'asc')
    // );
    // const observable = collectionData(sortedQuery);
    // return observable;
  }

  crearArrayHorarios(arrHorarios: string[], arrFechas: Date[]): Horario[] {
    let horarios: Horario[] = [];

    for (let fecha of arrFechas){
      arrHorarios.forEach(
        (item) => {
          let diaDeSemana = this.weekDays[fecha.getDay()];

          if (item.includes(diaDeSemana)){
            let hora = item.split(" - ")[1];
            let dia = fecha.toLocaleDateString('es-AR');
            let horario = new Horario(fecha, diaDeSemana, dia, hora);
            horarios.push(horario);
          }
      });
    }
    return horarios;
  }

  crearArrFechas(cantDias: number): Date[] {
    let dates: Date[] = [];
    for (let i=1; i<cantDias+1; i++){
      let date = new Date(+new Date() + this.dayInMillis * i);
      if (date.getDay() != 0){
        dates.push(date);
      }
    }
    return dates;
  }

  quitarHorariosUsados(horarios: Horario[], especialista: string, especialidad: string): Horario[] {
    this.turnos.filter((i) => { return i.especialista == especialista && i.especialidad == especialidad});
    this.turnos.forEach((i) =>{
      horarios = horarios.filter((h) => { return !(h.dia == i.dia && h.hora == i.hora) });
    });
    return horarios;
  }
}
