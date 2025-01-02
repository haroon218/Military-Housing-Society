import { HttpInterceptorFn } from '@angular/common/http';

export const requestsInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token'); // Replace 'token' with your actual key used to store the token

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return next(clonedRequest);
  }

  return next(req);};
