import { HttpInterceptorFn, JsonpInterceptor } from '@angular/common/http';
import { inject } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { catchError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
const router = inject(Router);

  return next(req).pipe(
    catchError(error =>{
      if(error){
        switch (error.status) {
          case 400:
            {
              alert(error.error);
              console.log('400Err:');
              console.log(JSON.stringify(error));
              if(error.error.errors){
                const modelStateErrors=[];
                for(const key in error.error.errors){
                  if(error.error.errors[key]){
                     alert('where error.error.errors[key]'+key);
                    modelStateErrors.push(error.error.errors[key])
                  }
                }
                throw modelStateErrors.flat();
              }
              else{

                     alert('not where error.error.errors[key]');
                alert(error.error + error.status);
              }
            }
            break;
        case 401:
            alert('unauthrized');
            break;
        case 404:
            alert('not found');
            router.navigateByUrl('/not-found')
            break;
       case 500:
            alert('inter server err');
            const navigationExtra : NavigationExtras={state:{error:error.error}}
            router.navigateByUrl('/server-error', navigationExtra);
            break;


          default:
            alert('something went wrong');break;
        }
      }

      throw error;
    })
  );
};
