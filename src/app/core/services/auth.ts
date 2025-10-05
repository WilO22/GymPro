// --- SECCIÓN DE IMPORTACIONES: Cargamos las herramientas necesarias ---

// Importamos 'Injectable' (un decorador) y 'inject' (una función) del núcleo de Angular para crear nuestro servicio.
import { Injectable, inject } from '@angular/core';
// Importamos las herramientas específicas de Firebase Authentication.
import {
  // Importamos la clase 'Auth' de Firebase y le damos un alias 'FirebaseAuth' para evitar conflictos de nombres.
  Auth as FirebaseAuth,
  // Función para iniciar sesión con credenciales de correo y contraseña.
  signInWithEmailAndPassword,
  // Función para crear una nueva cuenta de usuario.
  createUserWithEmailAndPassword,
  // Clase que representa el proveedor de autenticación de Google.
  GoogleAuthProvider,
  // Función para iniciar sesión a través de una ventana emergente (popup).
  signInWithPopup,
  // Función para cerrar la sesión del usuario actual.
  signOut
} from '@angular/fire/auth';

// --- DEFINICIÓN DEL SERVICIO ---

// El decorador '@Injectable' marca esta clase para que participe en el sistema de Inyección de Dependencias.
@Injectable({
  // 'providedIn: root' configura este servicio como un 'singleton', creando una única instancia para toda la aplicación.
  providedIn: 'root'
})
// Exportamos la clase 'Auth' para que pueda ser utilizada (inyectada) en otros componentes y servicios.
export class Auth {

  // Declaramos una propiedad privada 'auth' para mantener la instancia del servicio de Firebase.
  // Usamos la función 'inject' para obtener la dependencia de 'FirebaseAuth' que registramos en app.config.ts.
  private auth: FirebaseAuth = inject(FirebaseAuth);

  // --- MÉTODO PARA INICIAR SESIÓN CON CORREO Y CONTRASEÑA ---
  // Este método público recibe las credenciales del usuario.
  login(email: string, password: string) {
    // Llama a la función de Firebase, pasando la instancia de autenticación y las credenciales.
    // Devuelve una Promesa (Promise) que se resolverá con el resultado de la operación.
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // --- MÉTODO PARA REGISTRAR UN NUEVO USUARIO ---
  // Este método público se encarga de la creación de una nueva cuenta.
  register(email: string, password: string) {
    // Llama a la función de Firebase para crear un usuario y devuelve la Promesa correspondiente.
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  // --- MÉTODO PARA INICIAR SESIÓN CON GOOGLE ---
  // Este método gestiona el flujo de autenticación mediante un proveedor externo como Google.
  loginWithGoogle() {
    // Llama a la función de Firebase para mostrar una ventana emergente.
    // Necesita la instancia de 'auth' y una nueva instancia del proveedor de Google.
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  // --- MÉTODO PARA CERRAR SESIÓN ---
  // Cierra la sesión activa del usuario en el dispositivo actual.
  logout() {
    // Llama a la función de Firebase para cerrar la sesión y devuelve la Promesa.
    return signOut(this.auth);
  }

}