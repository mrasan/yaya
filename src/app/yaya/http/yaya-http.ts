import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { catchError, map, tap, first, filter } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { Injectable, InjectionToken, Inject } from "@angular/core";
import { FieldValue } from "../yaya-field-value";
import { MasterService } from '../service/yaya-master-service';
import { Response } from '../yaya-response';
/**
 * 错误处理
 */
export type HandleError =
    <T> (operation?: string, result?: T) => (error: HttpErrorResponse) => Observable<T>;

/**
 * 环境变量设置
 */
export const YAYA_API_ENV = new InjectionToken<string>('YAYA_API_ENV');

/**
 * http请求封装
 */
@Injectable()
export class YHttp {
    private createHandleError = <T>
        (api = 'api', result = {} as T) => this.handleError(api, result);

    constructor(private http: HttpClient, @Inject(YAYA_API_ENV) private env, private master: MasterService) {
        this.configPreHandle();
    }

    get<T>(apiCode: string, params?: Array<FieldValue>, result?: T): Observable<T> {
        try {
            let api = apiCode;
            let url = this.getPathByCode(apiCode);
            let httpParam = new HttpParams();
            if (params && params.length > 0) {
                params.map(x => httpParam = httpParam.set(x.field, x.value));
            }
            return this.http.get<T>(url, { params: httpParam }).pipe(
                tap((x: any) => {
                    //结果窥探处理
                    this.responseHandle(apiCode, x);
                }),
                catchError(this.handleError<T>(api))
            )
        } catch (e) {
            console.error(e);
            return this.buildFaultResult(e);
        }
    }

    post<T>(apiCode: string, body: any, result?: T): Observable<T> {
        try {
            let api = apiCode;
            let url = this.getPathByCode(apiCode);
            return this.http.post<T>(url, body).pipe(
                catchError(this.handleError<T>(api, result))
            )
        } catch (e) {
            console.error(e);
            return this.buildResult(result);
        }
    }

    private handleError<T>(api = 'api', result?: T) {
        return (error: HttpErrorResponse): Observable<T> => {
            //网络问题处理
            this.master.networkError(api, error);
            return this.buildFaultResult(error.message);
        };
    }

    /**
     * 通过api编码获取接口路径
     * 如果未找到则抛出异常
     * @param code api编码
     */
    private getPathByCode(code: string): string {
        let result = null;
        if (!this.env.apiObs) {
            throw new Error('no apis found pleache check config');
        }
        this.env.apiObs.pipe(filter((x: any) => x.code == code)).subscribe(x => result = x.url);
        if (!result) {
            throw new Error("api code:" + code + " not found please check the code and env all correct");
        }
        return result;
    }

    /**
     * 配置文件预处理
     * 1. 创建env的观察者对象方便后续操作
     * 2. 创建api的观察者对象方便后续操作
     * 3. 设置默认环境信息
     * 4. 对不规范路径信息进行处理
     */
    private configPreHandle(): void {
        //help information
        if (!this.env.envs || this.env.envs.length == 0) {
            console.error("no enviroment config found");
            console.error("1. add { provide: YAYA_API_ENV, useValue: YOU_ENVIROMENT_CONFIG } to app.module.ts providers");
            console.error("2. ensure the envs attribute is not empty in config");
            return;
        }
        this.env.envObs = from(this.env.envs).pipe(map((x: any) => {
            if (!x.baseURL.endsWith("/")) {
                x.baseURL = x.baseURL + "/";
            }
            return x;
        }));
        if (!this.env.default) {
            this.env.envObs.pipe(first()).subscribe(x => this.env.defaultEnv = x);
        } else {
            this.env.envObs.pipe(first((x: any) => x.env == this.env.default)).subscribe(x => this.env.defaultEnv = x);
        }
        this.env.apiObs = from(this.env.apis).pipe(map((x: any) => {
            let env = null;
            if (!x.env) {
                env = this.env.defaultEnv;
            } else {
                this.env.envObs.pipe(first((y: any) => y.env == x.env)).subscribe(y => env = y);
            }
            //可以直接定义接口地址不需要通过env
            if (x.uri.startsWith("http://") || x.uri.startsWith("https://")) {
                x.url = x.uri;
            } else {
                //没有以http或者https开头的默认都走env
                if (x.uri.startsWith("/")) {
                    x.uri = x.uri.substr(1, x.uri.length - 1);
                }
                x.url = env.baseURL + x.uri;
            }
            return x;
        }));

        //MOCK
        let assets = "assets/";
        this.env.apiObs = this.env.apiObs.pipe(map((x: any) => {
            if (x.mock) {
                if (x.mock.startsWith("/")) {
                    x.mock = x.mock.substr(1, x.mock.length - 1);
                }
                x.url = assets + x.mock;
            }
            return x;
        }));
    }

    private responseHandle(api: string, res: any): void {
        if (this.master.isSystemError(api, res)) {
            if (this.master.systemErrorHandle(api, res)) {
                throw new Error("api:" + api + " system error");
            }
        }
        if (this.master.isBusinessError(api, res)) {
            if (this.master.businessErrorHandle(api, res)) {
                throw new Error("api:" + api + " business error");
            }
        }
        if (res && res.table) {
            for (let i = 0; i < res.table.length; ++i) {
                res.table[i].seq = i + 1;
            }
        }
    }

    private buildFaultResult<T>(message: string): Observable<T> {
        return of(Response.error(message) as any);
    }

    private buildResult<T>(result: T): Observable<T> {
        if (!result) {
            return of(Response.ok as any);
        }
        return of(result as T);
    }
}