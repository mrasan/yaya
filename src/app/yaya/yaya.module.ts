import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { YHttpPlugin } from './http/yaya-http-plugin';
import { YHttpInterceptor } from './http/yaya-http-interceptor';
import { YAYA_API_ENV } from './http/yaya-http';
import { MasterService } from './service/yaya-master-service';
import { EnviromentDefault } from './env/environment-default';


@NgModule({
    imports: [
        CommonModule,
        HttpClientModule
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: YHttpInterceptor, multi: true },
        { provide: YAYA_API_ENV, useValue: EnviromentDefault },
        { provide: MasterService, useClass: MasterService},
        YHttpPlugin,

    ],
    declarations: []
})
export class YayaModule { }
