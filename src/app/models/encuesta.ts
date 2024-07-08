
export class Encuesta {
    nro_encuesta: number;
    calificacion_pagina: number;
    comentario_pagina: string;
    calificacion_especialista: number;
    comentario_especialista: string;
    calificacion_turno: number;
    comentario_turno: string;

    constructor(
        nro_encuesta: number,
        calificacion_pagina: number,
        comentario_pagina: string,
        calificacion_especialista: number,
        comentario_especialista: string,
        calificacion_turno: number,
        comentario_turno: string,
    ){
        this.nro_encuesta = nro_encuesta;
        this.calificacion_pagina = calificacion_pagina;
        this.comentario_pagina = comentario_pagina;
        this.calificacion_especialista = calificacion_especialista;
        this.comentario_especialista = comentario_especialista;
        this.calificacion_turno = calificacion_turno;
        this.comentario_turno = comentario_turno;
    }

    
}
