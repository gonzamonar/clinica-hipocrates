# Clínica Hipócrates
### Angular Web App: [clinica-hipocrates.web.app](https://clinica-hipocrates.web.app)

# Versionado
Este proyecto utiliza:
- [Angular CLI](https://github.com/angular/angular-cli) 17.3.4.
- [Firebase](https://firebase.google.com) (Hosting, Firestore, Auth, Storage) 17.1.0
- [Bootstrap](https://ng-bootstrap.github.io/#/home) 5.3.2
- [Angular Material](https://material.angular.io/guide/getting-started) 17.3.10
- [FontAwesome](https://docs.fontawesome.com/web/use-with/angular/) 0.14.1
- [SweetAlert2](https://sweetalert2.github.io) 11.11.1

# Tipos de Usuario
| Usuario | Requisitos |
| ------ | ------ |
| Anónimo | Usuario sin iniciar sesión. |
| Paciente | Crear cuenta Paciente en `/registro`, verificar el email e iniciar sesión en `/login`. |
| Especialista | Crear una cuenta Especialista en `/registro`, verificar el email, que un Admin lo marque como habilitado en `/usuarios` `Tab - Listado de Usuarios` e iniciar sesión. |
| Admin | Que otro admin cree una cuenta en `/usuarios` `Tab - Alta de Usuarios`, verificar el email e iniciar sesión. |

# Rutas
![Navbar de la página](/readme/navbar-img.png)

| Endpoint | Descripción | Permisos de Usuario |
| ------ | ------ | ------ |
| `/` | Página de bienvenida | Todos |
| `/instalaciones` | Página informativa sobre las instalaciones de la clínica. | Todos |
| `/especialidades` | Página informativa con las especialidades ofrecidas en la clínica.  | Todos |
| `/login` | Form para iniciar sesión | Anónimo |
| `/registro` | Form para registrarse como Paciente o Especialista | Anónimo |
| `/verificar-email` | Form para reenviar el correo de verificación | Anónimo |
| `/usuarios` | `Tab - Listado de Usuarios`: Muestra una tabla con todos los usuarios existentes.  | Admin |
| | `Tab - Alta de Usuarios`: Form para registrar usuarios de tipo Paciente, Especialista y Admin.  | Admin |
| `/turnos` | Listado con todos los turnos de la Clínica. | Admin |
| `/estadisticas` | `Tab - Estadísticas`: Página con estadísticas de los turnos de la clínica. | Admin |
| | `Tab - Logs de Usuarios`: Listado con todos los inicios de sesión a la página.  | Admin |
| `/solicitar-turno` | Form para solicitar un turno para sí mismo (Paciente) o para cualquier Paciente (Admin). | Admin, Paciente |
| `/mis-turnos` | Listado con los turnos sacados por el Paciente / con el Especialista. | Paciente, Especialista |
| `/mis-pacientes` | Listado con la historia clínica de los pacientes que fueron atendidos por el Especialista. | Especialista |
| `/mi-perfil` |  `Tab - Mi Perfil`: Página con los datos y foto del usuario.  | Admin, Paciente, Especialista |
| | `Tab - Mis Horarios`: Página con el selector de horarios semanales del Especialista.  | Especialista |

