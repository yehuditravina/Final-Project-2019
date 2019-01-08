// Modules - angularCore
import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

// Modules - ourCustom
import {EntitiesManagmentModule} from './admin/entitiesManagment/entities-managment.module';
import {SharedModule} from './shared/shared.module';
// import {EmployeeModule} from './employee/employee.module';
import {HomeModule} from './home/home.module';
import {AdminModule} from './admin/admin.module';
import {Auth2Module} from './auth/auth2.module';
import {AppRoutingModule} from './app-routing.module';
// Components
import {AppComponent} from './app.component';
import {LayoutHeaderComponent} from './shared/components/layout/layout-header/layout-header.component';
import {LayoutFooterComponent} from './shared/components/layout/layout-footer/layout-footer.component';

import {ShoppingModule} from './shopping/shopping.module';
import {AuthService} from './shared/services/auth.service';
import {CurrentUser} from './shared/currentUser';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    // NgbModule,
    // GoTopButtonModule, to install
    HomeModule,
    SharedModule,
    // EmployeeModule,
    // EntitiesManagmentModule,
    Auth2Module,
    AdminModule,
    ShoppingModule,
    ShoppingModule,
    AppRoutingModule,
  ],
  declarations: [
    AppComponent,
    LayoutHeaderComponent,
    LayoutFooterComponent,
  ],
  bootstrap: [AppComponent],
  providers:[ CookieService,
              AuthService,
              CurrentUser]
})
export class AppModule {
}











