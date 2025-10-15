import { Injectable, inject } from '@angular/core';
import {
  Auth as FirebaseAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  UserCredential
} from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { User as UserModel } from '../../models/user';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private auth: FirebaseAuth = inject(FirebaseAuth);
  private firestore: Firestore = inject(Firestore);

  async getUserProfile(uid: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.exists() ? (userDocSnap.data() as UserModel) : null;
  }

  async register(email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
    // Después de crear la cuenta, SIEMPRE creamos su perfil en Firestore.
    await this.createUserProfile(userCredential.user.uid, userCredential.user.email!);
    return userCredential;
  }

  async loginWithGoogle() {
    const userCredential = await signInWithPopup(this.auth, new GoogleAuthProvider());
    const user = userCredential.user;
    
    // ¡MEJORA IMPORTANTE!
    // Después de un login con Google, verificamos si su perfil ya existe.
    const profile = await this.getUserProfile(user.uid);
    if (!profile) {
      // Si no existe, lo creamos. Esto maneja el primer inicio de sesión.
      await this.createUserProfile(user.uid, user.email!);
    }
    return userCredential;
  }

  // Este método privado ahora es más genérico
  private createUserProfile(uid: string, email: string) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    const newUser: UserModel = {
      uid: uid,
      email: email,
      role: 'user' // Por defecto, todos los nuevos usuarios son 'user'
    };
    return setDoc(userDocRef, newUser);
  }

  // --- MÉTODOS SIN CAMBIOS ---
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
  
  logout() {
    return signOut(this.auth);
  }
}