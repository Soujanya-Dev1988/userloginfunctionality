import { Component, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {

  private http = inject(HttpClient);
  message = signal('');
  mode = signal('login');
  loggedInUser = signal('');
  login(username: string, password: string) {
    this.http.post(
      'http://localhost:8080/api/login',
      { username: username, password: password },
      { responseType: 'text' }
    ).subscribe(answer => {
      if (answer === 'Login successful') {
        this.loggedInUser.set(username);
        this.mode.set('welcome');
      } else {
        this.message.set(answer);
      }
    });
  }
  signup(username: string, password: string) {
    this.http.post(
      'http://localhost:8080/api/signup',
      { username: username, password: password },
      { responseType: 'text' }
    ).subscribe(answer => this.message.set(answer));
  }
  switchMode(newMode: string) {
    this.mode.set(newMode);
    this.message.set('');
  }

  logout() {
    this.loggedInUser.set('');
    this.switchMode('login');
  }

  onlyNumbers(box: HTMLInputElement) {
    box.value = box.value.replace(/[^0-9]/g, '');
  }
}
