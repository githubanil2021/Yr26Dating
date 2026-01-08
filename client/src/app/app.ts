import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = 'Dating';//signal('client');
  protected members=signal<any>([]);


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
  }

  async getMembers(){
    try{
      return lastValueFrom( this.http.get('http://localhost:5001/api/members'))
    }
    catch(error){
      console.log(error);
      throw error;
    }
  }

}
