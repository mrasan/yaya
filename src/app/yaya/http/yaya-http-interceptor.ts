import {
    HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { YHttpPlugin } from './yaya-http-plugin';
import { finalize, tap } from 'rxjs/operators';

@Injectable()
export class YHttpInterceptor implements HttpInterceptor {

    constructor(private plugin: YHttpPlugin) {
    }
    /**
     * 拦截http请求
     * @param req http请求
     * @param next 下一个拦截器
     */
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (this.plugin) {
            req = this.plugin.before(req.clone());
        }
        return next.handle(req).pipe(
            tap(x => {
                if (this.plugin) {
                    this.plugin.success(x);
                }
            },
                error => {
                    if (this.plugin) {
                        this.plugin.error(error);
                    }
                }),
            finalize(() => {
                if (this.plugin) {
                    this.plugin.final();
                }
            })
        )
    }
}