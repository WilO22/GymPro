export interface User {
  uid: string;       // El ID único que nos da Firebase Authentication. Es la clave primaria del usuario.
  email: string;     // La dirección de correo electrónico utilizada para el registro y el inicio de sesión.
  displayName?: string; // El nombre a mostrar del usuario. Es opcional ('?') y puede no estar definido.
  role: 'user' | 'admin'; // El rol define los permisos del usuario; solo puede ser 'user' o 'admin'.
}