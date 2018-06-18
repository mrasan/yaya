export class DeleteRequest {
    rowKeys: Array<any> = new Array<any>();
    queryCode: string;
    addRow(key: any) {
        this.rowKeys.push(key);
    }

    static buildSingleRow(queryCode: string, rowkey: any): DeleteRequest {
        let rq = new DeleteRequest();
        rq.queryCode = queryCode;
        rq.addRow(rowkey);
        return rq;
    }

    static buildMulRow(queryCode: string, rowkeys: Array<any>): DeleteRequest {
        let rq = new DeleteRequest();
        rq.queryCode = queryCode;
        rq.rowKeys = rowkeys;
        return rq;
    }
}