import { Estado } from "./enums/estado";

export class Turno {
    nro_turno: number;
    estado: string;
    especialista: string;
    especialidad: string;
    paciente: string;
    dia: string;
    hora: string;
    comentario: string | null;
    review: string | null;
    nro_encuesta: number | null;
    calificacion: number | null;
    nro_historia_clinica: number | null;

    constructor(
        nro_turno: number,
        especialista: string,
        especialidad: string,
        paciente: string,
        dia: string,
        hora: string,
        estado: string = Estado.Pendiente,
        comentario: string | null = null,
        review: string | null = null,
        nro_encuesta: number | null = null,
        calificacion: number | null = null,
        nro_historia_clinica: number | null = null,
    ) {
        this.nro_turno = nro_turno;
        this.estado = estado;
        this.especialista = especialista;
        this.especialidad = especialidad;
        this.paciente = paciente;
        this.dia = dia;
        this.hora = hora;
        this.comentario = comentario;
        this.review = review;
        this.nro_encuesta = nro_encuesta;
        this.calificacion = calificacion;
        this.nro_historia_clinica = nro_historia_clinica;
    }

    encuestaRealizada(): boolean {
        return this.nro_encuesta != null;
    }

    tieneComentarios(): boolean {
        return this.comentario != null;
    }

    tieneReseñas(): boolean {
        return this.review != null;
    }

    includes(str: string){
        let searchStr: string = str.toLocaleLowerCase();
        return this.especialidad.toLocaleLowerCase().includes(searchStr);
    }



    static constructorArr(arr: any): Turno[] {
        return arr.map((i: Turno) => { return new Turno(
            i.nro_turno,
            i.especialista,
            i.especialidad,
            i.paciente,
            i.dia,
            i.hora,
            i.estado,
            i.comentario,
            i.review,
            i.nro_encuesta,
            i.calificacion,
            i.nro_historia_clinica,
        ) });
    }

    static filtrarUno(arr: Turno[], nro_turno: number): Turno {
        return arr.filter((i) => {return i.nro_turno == nro_turno})[0];
    }

    static ordenarPorNroTurnoDesc(arr: Turno[]){
        return arr.sort((a, b) => { return b.nro_turno - a.nro_turno });
    }

    static ordenarPorFecha(arr: Turno[]){
        return arr.sort((a, b) => { return a.dia.localeCompare(b.dia) });
    }

    static ordenarPorEspecialista(arr: Turno[]){
        return arr.sort((a, b) => { return a.especialista.localeCompare(b.especialista) });
    }

    static ordenarPorEspecialidad(arr: Turno[]){
        return arr.sort((a, b) => { return a.especialidad.localeCompare(b.especialidad) });
    }

    static contarPorEspecialista(arr: Turno[], especialista: string){
        return arr.reduce((total, value) => { return value.especialista == especialista ? total + 1 : total }, 0);
    }

    static contarPorEspecialidad(arr: Turno[], especialidad: string){
        return arr.reduce((total, value) => { return value.especialidad == especialidad ? total + 1 : total }, 0);
    }

    static contarPorDia(arr: Turno[], dia: string){
        return arr.reduce((total, value) => { return value.dia == dia ? total + 1 : total }, 0);
    }

    static contarPorEstado(arr: Turno[], estado: string){
        return arr.reduce((total, value) => { return value.estado == estado ? total + 1 : total }, 0);
    }

    static contarPorNoEstado(arr: Turno[], estado: string){
        return arr.reduce((total, value) => { return value.estado != estado ? total + 1 : total }, 0);
    }

    static filtrarPorEspecialista(arr: Turno[], especialista: string){
        return arr.filter((t: Turno) => { return t.especialista == especialista });
    }

    static filtrarPorPaciente(arr: Turno[], paciente: string){
        return arr.filter((t: Turno) => { return t.paciente == paciente });
    }

    static filtrarPorFecha(arr: Turno[], diaInicio: string, diaFin: string){
        return arr.filter((t: Turno) => { return t.dia >= diaInicio && t.dia <= diaFin });
    }

    static getEspecialidades(arr: Turno[]){
        return [... new Set(arr.map((t: Turno) => { return t.especialidad }))];
    }

    static getDias(arr: Turno[]){
        return [... new Set(arr.map((t: Turno) => { return t.dia }))];
    }

    static getEspecialistas(arr: Turno[]){
        return [... new Set(arr.map((t: Turno) => { return t.especialista }))];
    }
}
