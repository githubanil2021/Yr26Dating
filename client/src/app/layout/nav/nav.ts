import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { themes } from '../../../layout/theme';
import { BusyService } from '../../../core/services/busy-service';

@Component({
  selector: 'app-nav',
  imports: [FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit   {
  protected creds: any={}
  protected accountService = inject(AccountService);
  private router =inject(Router);
  protected selectedTheme=signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;
  protected busyService = inject(BusyService);


  constructor(private toastr: ToastrService) {}

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme',this.selectedTheme());
  }

  handleSelectedTheme(theme:string)
  {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme',theme);
  }

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
