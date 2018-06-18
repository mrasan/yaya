import { FieldValue } from "./yaya-field-value";

export class InsertRequest {
    queryCode: string;
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

    static build(queryCode: string, row: any): InsertRequest {
        let rq = new InsertRequest();
        rq.queryCode = queryCode;
        rq.setData(row);
        return rq;
    }
}