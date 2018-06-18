import { FieldValue } from "./yaya-field-value";

export class UpdateRequest {
    queryCode: string;
    rowKey: string;
    paramList: Array<FieldValue>;

    setData(row: any): void {
        let attrs = Object.getOwnPropertyNames(row);
        attrs.forEach(x => this.addField(x, row[x]));
    }


    addField(field: string, value: any) {
        if (!this.paramList) {
            this.paramList = new Array<FieldValue>();
        }
        this.paramList.push(new FieldValue(field, value));
    }


    static build(queryCode: string, row: any): UpdateRequest {
        let rq = new UpdateRequest();
        rq.queryCode = queryCode;
        rq.setData(row);
        return rq;
    }
}