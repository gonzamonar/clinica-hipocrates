import { Usuario } from "./usuario";

export class Especialista extends Usuario {
    especialidad: string;

    constructor(
        nombre: string,
        apellido: string,
        edad: number,
        dni: number,
        email: string,
        imagenPerfil: string,
        nivelUsuario: string,
        especialidad: string
    ) {
        super(nombre, apellido, edad, dni, email, imagenPerfil, nivelUsuario);
        this.especialidad = especialidad;     
    }

    static arrayConstructor(arr: any[]): Especialista[] {
        return arr.map((e) => { return new Especialista(e.nombre, e.apellido, e.edad, e.dni, e.email, e.imagenPerfil, e.nivelUsuario, e.especialidad); });
    }
}
