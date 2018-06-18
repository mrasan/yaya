export class PageInfo {
    loading: boolean = false;
    showPageBar: boolean = true;
    total: number = 0;
    pageIndex: number = 1;
    pageSize: number = 20;
    showSort: boolean = true;
    sortField: string;
    sortType: string = "asc";

    showLoading(): void {
        this.loading = true;
    }

    hideLoading(): void {
        this.loading = false;
    }

    setSortType(type: string): void {
        if ("descend" == type || "desc" == type) {
            this.sortType = "desc";
        } else if ("ascend" == type || "asc" == type) {
            this.sortField = "asc";
        }
    }
}