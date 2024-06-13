import { Injectable } from '@angular/core';
import { browserLocalPersistence, inMemoryPersistence, setPersistence } from 'firebase/auth';
import Swal from 'sweetalert2'; //https://sweetalert2.github.io
import { signOut } from 'firebase/auth';
import { SessionService } from './session.service';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(
    public auth: Auth,
    public session: SessionService
  ) { }

  async signIn(email: string, password: string, remember: boolean = false): Promise<boolean> {
    let persistence = remember ? browserLocalPersistence : inMemoryPersistence ;
    let loginError: boolean;

    return setPersistence(this.auth, persistence)
    .then(() =>
      signInWithEmailAndPassword(this.auth, email, password)
      .then(
        (response) => {
          this.session.updateSession(response.user);
          loginError = false;
        }
      ).catch((e) => {
        loginError = true;
      })
    )
    .catch((error) => {
      console.error('Error setting session persistence:', error);
      loginError = true;
    })
    .then(() => {
      return loginError;
    });
  }

  signOut(){
    signOut(this.auth).then(
      () => {
        Swal.fire({
          title: "¿Deseas cerrar sesión?",
          text: "",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#42b54d",
          confirmButtonText: "Sí, salir",
          cancelButtonText: "Cancelar"
        }).then((result) => {
          if (result.isConfirmed) {
            Swal.fire({
              title: "¡Sesión cerrada!",
              text: "Tu sesión fue cerrada exitosamente.",
              icon: "success"
            });
            this.session.closeSession();
          }
        });
    })
  }
}
