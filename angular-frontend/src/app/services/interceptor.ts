import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authToken = localStorage.getItem('authToken'); // Feltételezzük, hogy itt tárolod a tokent
  const isApiRequest = req.url.startsWith('http://localhost:8080/api/'); // Csak a mi API végpontjainkra alkalmazzuk


  if (authToken && isApiRequest) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next(cloned);
  }

  return next(req);
};
