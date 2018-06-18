import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";

/**
 * yaya系统处理服务
 * 可继承该服务实现自定义业务逻辑
 */
@Injectable()
export class MasterService {

    /**
     * 判断是否系统错误
     * @param response 
     * @param apiCode
     */
    isSystemError(apiCode: string, response: any): boolean {
        if (response && response.code && response.code != '200') {
            let code = response.code;
            if (code == '404' || code == '401' || code == '500') {
                return true;
            }
        }
        return false;
    }

    /**
     * 网络问题处理
     * @param apiCode 
     * @param response 
     */
    networkError(apiCode:string,error:HttpErrorResponse):void{
        console.error(apiCode + "  error");
        console.error(error);
        const message = (error.error instanceof ErrorEvent) ?
            error.error.message :
            `server returned code ${error.status} with body "${error.error}"`;
    }

    /**
     * 判断是否是业务错误
     * @param response 
     * @param apiCode
     */
    isBusinessError(apiCode: string, response: any): boolean {
        if (response && response.code && response.code != '200') {
            let code = response.code;
            if (code != '404' && code != '401' && code != '500') {
                return true;
            }
        }
        return false;
    }

    /**
     * 系统错误处理
     * @param apiCode 
     * @param response 
     * @returns 是否希望系统抛出异常
     */
    systemErrorHandle(apiCode: string, response: any): boolean {
        return false;
    }

    /**
     * 业务错误处理
     * @param apiCode 
     * @param response 
     * @returns 是否希望系统抛出异常
     */
    businessErrorHandle(apiCode: string, response: any): boolean {
        return false;
    }
}