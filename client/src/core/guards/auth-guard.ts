import { CanActivateFn } from '@angular/router';
import { AccountService } from '../services/account-service';
import { inject } from '@angular/core';
import { Toast } from 'ngx-toastr';

export const authGuard: CanActivateFn = () => {
  const accountService = inject(AccountService);



  if(accountService.currentUser()) return true;
  else {
    alert('you stop');
    return false;
  }

};
