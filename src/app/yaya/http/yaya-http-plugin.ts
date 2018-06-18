import { HttpRequest, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class YHttpPlugin {
    /**
     * 发起请求前调用
     * @param req http请求
     */
    before(req: HttpRequest<any>): HttpRequest<any> {
        return req;
    }

    /**
     * 请求成功时调用
     * @param res http响应
     */
    success(res: any) {

    };

    /**
     * 请求失败时调用
     * @param error 错误信息
     */
    error(error: any) {

    };

    /**
     * 请求结束时调用,不管成功还是失败
     */
    final() {

    };
}