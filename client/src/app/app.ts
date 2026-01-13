import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Nav } from "./layout/nav/nav";
import { AccountService } from '../core/services/account-service';
import { Home } from "../features/home/home";
import { User } from '../types/user';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Home],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private accountService = inject(AccountService);
  protected readonly title = 'Dating';//signal('client');
  protected members=signal<User[]>([]);


  private http=inject(HttpClient);

  // ngOnInit(): void {
  //   this.http.get('http://localhost:5001/api/members').subscribe({
  //     next: response=>this.members.set(response),
  //     error: error=>console.log(error),
  //     complete: ()=> console.log('completed')
  //   })
  // }

  //2nd version using getMembers

  async ngOnInit(){
    this.members.set(await this.getMembers());
    this.setCurrentUser();
  }

  setCurrentUser(){
    const userString = localStorage.getItem('user');
    if(!userString) return;

    const user = JSON.parse(userString);
    this.accountService.currentUser.set(user);
  }

  async getMembers(){
    try{
      return lastValueFrom( this.http.get<User[]>('http://localhost:5001/api/members'))
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

}
