import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected creds: any={}
  protected accountService = inject(AccountService);
  private router =inject(Router);

  /**
   *
   */
  constructor(private toastr: ToastrService) {}


  login(){
    this.accountService.login(this.creds).subscribe({
      next:result=>{
        this.toastr.success('Login from nav.ts!', 'Login');
        console.log(result);
        this.router.navigateByUrl('/members');

      },
      error:error=>alert(error.message),

    });
    console.log(this.creds);
  }

  logout(){
     this.toastr.warning('Logout from nav.ts!', 'Logout');

     console.log('logout from nav.ts');
     this.accountService.logout();
     this.router.navigateByUrl('/');
  }

}
