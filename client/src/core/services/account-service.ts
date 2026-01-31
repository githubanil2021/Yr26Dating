import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { LoginCreds, RegisterCreds, User } from '../../types/user';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LikesService } from './likes-service';

@Injectable({
  providedIn: 'root',
})
export class AccountService {

  private http=inject(HttpClient);
  //baseUrl ='http://localhost:5001/api/';
  private baseUrl = environment.apiUrl;
  private likesService = inject(LikesService);
  currentUser = signal<User |null>(null);

  register(creds:RegisterCreds){
    return this.http.post<User>(this.baseUrl+'account/register', creds).pipe(
      tap(user=>{
        if(user){
          this.setCurrentUser(user);
        }
      })
    );
  }

  login(creds:LoginCreds){
    return this.http.post<User>(this.baseUrl+'account/login', creds).pipe(
      tap(user=>{
        if(user){
          this.setCurrentUser(user);

        }
      })
    );
  }

  setCurrentUser(user:User){
      localStorage.setItem('user',JSON.stringify(user));
      this.currentUser.set(user);
      this.likesService.getLikeIds();
  }


  logout(){
    localStorage.removeItem('user');
    localStorage.removeItem('filters');
    this.currentUser.set(null);
    console.log('logout from accountservice');
    this.likesService.clearLikeIds(); 
  }


}
