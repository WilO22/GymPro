import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router'; // Importamos RouterOutlet

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet], // Lo añadimos para que <router-outlet> funcione
  templateUrl: './auth-layout.html'
})
export class AuthLayout {

}