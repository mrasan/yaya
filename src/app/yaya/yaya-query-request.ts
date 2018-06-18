import { FieldValue } from "./yaya-field-value";

export class QueryRequest {
    queryCode: string;
    page: number;
    pageSize: number;
    paramList: Array<FieldValue>;
    constructor() {
        this.paramList = new Array<FieldValue>();
    }
    setPage(page: number): void {
        this.page = page;
    }
    getPage(): number {
        return this.page;
    }

    setPageSize(size: number) {
        this.pageSize = size;
    }

    getPageSize(): number {
        return this.pageSize;
    }

    addParam(name: string, value: any): void {
        if (value) {
            this.paramList.push(new FieldValue(name, value));
        }
    }

    clearParamList(): void {
        this.paramList.length = 0;
    }

    static simpleBuild(queryCode: string): QueryRequest {
        let rq = new QueryRequest();
        rq.queryCode = queryCode;
        return rq;
    }

    static pageBuild(queryCode: string, page: number, size: number): QueryRequest {
        let rq = new QueryRequest();
        rq.queryCode = queryCode;
        rq.page=page;
        rq.pageSize=size;
        return rq;
    }
}