import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserComponent } from './empleado/user.component';
import { FormComponent } from './empleado/form.component';
import { PaginatorComponent } from './empleado/paginator/paginator.component';

import { UserService } from './empleado/user.service';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { DetalleComponent } from './empleado/detalle/detalle.component';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';
import { ProveedorComponent } from './proveedor/proveedor.component';
import { DetalleFacturaComponent } from './facturas/detalle-factura.component';
import { FacturasComponent } from './facturas/facturas.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormProveComponent} from './proveedor/form-proveedor/formProve.component';
import {PaginatorProveComponent} from './proveedor/paginatorProve/paginatorProve.component';
import { ProductoComponent } from './producto/producto.component';
import { DetalleProductoComponent } from './producto/detalle-producto/detalle-producto.component';
import { PaginatorProductoComponent } from './producto/paginator-producto/paginator-producto.component';
import { FormProductoComponent } from './producto/form-producto/form-producto.component';
import { EntradaComponent } from './entrada/entrada.component';
import { DetalleEntradaComponent } from './entrada/detalle/detalle-entrada.component';
import { DetalleProveedorComponent } from './proveedor/detalleProveedor/detalle-proveedor.component';

registerLocaleData(localeEs, 'es');

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'empleados', component: UserComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_USER'} },
  {path: 'empleados/page/:page', component: UserComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_USER'} },
  {path: 'empleados/form', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_ADMIN'} },
  {path: 'empleados/form/:id', component: FormComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_ADMIN'} },

  {path: 'proveedores', component: ProveedorComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_USER'} },
  {path: 'proveedores/page/:page', component: ProveedorComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_USER'} },
  {path: 'proveedores/form', component: FormProveComponent },
  {path: 'proveedores/form/:id', component: FormProveComponent },

  {path: 'productos', component: ProductoComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_USER'} },
  {path: 'productos/page/:page', component: ProductoComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_USER'} },
  {path: 'productos/form', component: FormProductoComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_ADMIN'} },
  {path: 'productos/form/:id', component: FormProductoComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_ADMIN'} },

  {path: 'facturas/:id', component: DetalleFacturaComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_ADMIN'}},
  {path: 'facturas/form/:empleadoId', component: FacturasComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_ADMIN'}},

  {path: 'entradas/:id', component: DetalleEntradaComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_ADMIN'}},
  {path: 'entradas/form/:proveedorId', component: EntradaComponent, canActivate: [AuthGuard, RoleGuard], data:{role: 'ROLE_ADMIN'}},

  {path: 'login', component: LoginComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    UserComponent,
    ProveedorComponent,
    FormComponent,
    FormProveComponent,
    PaginatorComponent,
    PaginatorProveComponent,
    DetalleComponent,
    LoginComponent,
    DetalleFacturaComponent,
    FacturasComponent,
    ProductoComponent,
    DetalleProductoComponent,
    PaginatorProductoComponent,
    FormProductoComponent,
    EntradaComponent,
    DetalleEntradaComponent,
    DetalleProveedorComponent
  ],
  imports: [
    BrowserModule,
    MatSliderModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule
  ],
  providers: [UserService,
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },],
  bootstrap: [AppComponent]
})
export class AppModule { }
