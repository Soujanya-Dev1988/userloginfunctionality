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
  usernameError = signal('');
  passwordError = signal('');
  firstNameError = signal('');
  lastNameError = signal('');
  addressError = signal('');
  phoneError = signal('');

  login(username: string, password: string) {
    this.usernameError.set('');
    this.passwordError.set('');

    if (username.trim() === '') {
      this.usernameError.set('Please enter your username');
    }

    if (password.trim() === '') {
      this.passwordError.set('Please enter your password');
    }

    if (this.usernameError() || this.passwordError()) {
      return;
    }

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
    this.usernameError.set('');
    this.passwordError.set('');
    this.firstNameError.set('');
    this.lastNameError.set('');
    this.addressError.set('');
    this.phoneError.set('');
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
  saveDetails(firstName: string, lastName: string, address: string, phone: string, boxes: HTMLInputElement[]) {
    this.message.set('');
    this.firstNameError.set('');
    this.lastNameError.set('');
    this.addressError.set('');
    this.phoneError.set('');

    if (firstName.trim() === '') {
      this.firstNameError.set('Please enter your First name');
    }

    if (lastName.trim() === '') {
      this.lastNameError.set('Please enter your Last name');
    }

    if (address.trim() === '') {
      this.addressError.set('Please enter your Address');
    }

    if (phone.trim() === '') {
      this.phoneError.set('Please enter your Phone #');
    } else if (!/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone)) {
      this.phoneError.set('Phone number must look like xxx-xxx-xxxx');
    }

    if (this.firstNameError() || this.lastNameError() || this.addressError() || this.phoneError()) {
      return;
    }

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
    ).subscribe(answer => {
      this.message.set(answer);

      if (answer === 'Details saved successfully') {
        for (const box of boxes) {
          box.value = '';
        }
      }
    });
  }
}
