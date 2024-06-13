import { Usuario } from "./usuario";

export class Paciente extends Usuario {
    obraSocial: string;
    imagenPerfilAlt: string;

    constructor(
        nombre: string,
        apellido: string,
        edad: number,
        dni: number,
        email: string,
        imagenPerfil: string,
        nivelUsuario: string,
        obraSocial: string,
        imagenPerfilAlt: string
    ) {
        super(nombre, apellido, edad, dni, email, imagenPerfil, nivelUsuario);
        this.obraSocial = obraSocial;
        this.imagenPerfilAlt = imagenPerfilAlt;       
    }

    static arrayConstructor(arr: any[]): Paciente[] {
        return arr.map((e) => { return new Paciente(e.nombre, e.apellido, e.edad, e.dni, e.email, e.imagenPerfil, e.nivelUsuario, e.obraSocial, e.imagenPerfilAlt); });
    }
}
