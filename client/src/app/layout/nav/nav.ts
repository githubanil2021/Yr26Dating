import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected creds: any={}
  protected accountService = inject(AccountService);


  login(){
    this.accountService.login(this.creds).subscribe({
      next:result=>{
        console.log(result);

      },
      error:error=>alert(error.message),

    });
    console.log(this.creds);
  }

  logout(){
    console.log('logout from nav.ts');
     this.accountService.logout();
  }

}
