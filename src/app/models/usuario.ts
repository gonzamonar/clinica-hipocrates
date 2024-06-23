export class Usuario {
    nombre: string;
    apellido: string;
    edad: number;
    dni: number;
    email: string;
    imagenPerfil: string;
    nivelUsuario: string;


    constructor (
        nombre: string,
        apellido: string,
        edad: number,
        dni: number,
        email: string,
        imagenPerfil: string,
        nivelUsuario: string
    ) {
        this.nombre = nombre;
        this.apellido = apellido;
        this.edad = edad;
        this.dni = dni;
        this.email = email;
        this.imagenPerfil = imagenPerfil;
        this.nivelUsuario = nivelUsuario;
    }

    fullName(): string{
        return this.nombre + " " + this.apellido;
    }
}
