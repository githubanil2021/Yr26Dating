import { Component, Input, OnInit, signal } from '@angular/core';
import { Register } from "../account/register/register";
import { User } from '../../types/user';

@Component({
  selector: 'app-home',
  imports: [Register],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  protected registerMode=signal(true);
  showRegister(value: boolean)
  {
    this.registerMode.set(value);
  }

    ngOnInit(): void {

    throw new Error('Method not implemented.');
  }


}
