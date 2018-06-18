/**
 * 接口返回规范
 * 主要考虑之前code过于简单无法描述更多信息因此这里采用http标准响应编码和业务错误编码结合的方式
 * 规定:
 * 如果是系统级别错误,code使用http标准编码表示具体见code字段定义
 * 如果是业务级别错误,如数据验证不通过使用业务错误编码表示,具体见code字段定义
 * 项目组需要维护业务错误编码和错误描述关系,类似ora错误,做到任何一个业务错误编码都能找到具体原因
 * 对象类型数据和列表类型数据用不同字段表示
 * 开发人员根据接口逻辑选择存放数据字段,前端开发人员根据接口文档从特定的字段取数据
 */
export class Response<T> {
    static ok: Response<any> = new Response<any>("200");

    constructor(code: string, message?: string) {
        this.code = code;
        this.total = 0;
        this.data = {} as T;
        this.table = [];
        this.message = message;
    }
    /**
     * http规范：
     * 200:调用成功
     * 404:资源未找到
     * 500:系统出错
     * 401:未授权
     * 业务错误编码(业务系统编码+接口编号+错误序列号)如:
     * YY-180226 配置
     * MES-20001-0001
     * MES-20001-0002
     */
    code: string;
    /**
     * 记录错误信息或者需要提示给用户的信息
     */
    message: string;
    /**
     * 记录总数
     */
    total: number;
    /**
     * 非列表数据
     */
    data: T;
    /**
     * 列表数据
     */
    table: Array<T>;

    static error<T>(message: string): Response<T> {
        return new Response<T>("ENV_ERROR", message);
    }

    isOk(): boolean {
        return this.code == "200";
    }
}