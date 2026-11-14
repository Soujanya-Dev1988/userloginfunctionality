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

formatPhone(box: HTMLInputElement) {
    let digits = box.value.replace(/[^0-9]/g, '');
    digits = digits.substring(0, 10);

    if (digits.length > 6) {
      box.value = digits.substring(0, 3) + '-' + digits.substring(3, 6) + '-' + digits.substring(6);
    } else if (digits.length > 3) {
      box.value = digits.substring(0, 3) + '-' + digits.substring(3);
    } else {
      box.value = digits;
    }
  }
  saveDetails(firstName: string, lastName: string, address: string, phone: string) {
    this.http.post(
      'http://localhost:8080/api/details',
      {
        username: this.loggedInUser(),
        firstName: firstName,
        lastName: lastName,
        address: address,
        phone: phone
      },
      { responseType: 'text' }
    ).subscribe(answer => this.message.set(answer));
  }
}
