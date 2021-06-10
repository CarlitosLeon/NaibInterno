import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {MatButtonModule} from '@angular/material/button';
import { LoginComponent } from './users/login.component';
import { AuthService } from './users/service/auth.service';
import { NgxSpinnerModule } from "ngx-spinner";
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MenuFMComponent } from './menu-fm/menu-fm.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatBadgeModule } from '@angular/material/badge';
import { DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { VentasProspectosComponent } from './crm/ventas-prospectos/ventas-prospectos.component';
import { MatAutocompleteModule} from '@angular/material/autocomplete';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NgxSummernoteModule } from 'ngx-summernote'; 
import {MatStepperModule} from '@angular/material/stepper';
import { EventoComponent } from './crm/evento/evento/evento.component';
import { UsuarioComponent } from './crm/usuario/usuario.component'
import {MatCheckboxModule} from '@angular/material/checkbox';

import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import { CalendarioComponent } from './crm/calendario/calendario.component';
import { EmailMasivosComponent } from './crm/email-masivos/email-masivos.component';

import { FormatTelefonosPipe} from './crm/ventas-prospectos/format-telefonos.pipe';
import { FilterEstadosPipe } from './crm/ventas-prospectos/filter-estados.pipe';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
])

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuFMComponent,
    VentasProspectosComponent,
    EventoComponent,
    UsuarioComponent,
    CalendarioComponent,
    EmailMasivosComponent,
    FilterEstadosPipe,
    FormatTelefonosPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxSpinnerModule,
    FormsModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatSidenavModule,
    MatExpansionModule,
    MatSliderModule,
    MatFormFieldModule,
    MatSelectModule,
    MatBadgeModule,
    MatToolbarModule,
    MatListModule,
    MatDividerModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatDatepickerModule, 
    MatNativeDateModule,
    MatSlideToggleModule,
    NgxSummernoteModule,
    MatStepperModule,
    MatButtonModule,
    FullCalendarModule,
    MatCheckboxModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    AuthService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
