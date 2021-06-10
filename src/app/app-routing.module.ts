import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarioComponent } from './crm/calendario/calendario.component';
import { EmailMasivosComponent } from './crm/email-masivos/email-masivos.component';
import { EventoComponent } from './crm/evento/evento/evento.component';
import { VentasProspectosComponent } from './crm/ventas-prospectos/ventas-prospectos.component';
import { RolGuard } from './users/guards/rol.guard';
import { LoginComponent } from './users/login.component';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'ventasProspectos', component: VentasProspectosComponent, canActivate: [RolGuard], data: { rol: ['ROLE_NAIB', 'ROLE_ADMIN_NAIB'] } },
  { path: 'crearEvento', component: EventoComponent, canActivate: [RolGuard], data: { rol: ['ROLE_NAIB', 'ROLE_ADMIN_NAIB'] } },
  { path: 'ventasCalendario', component: CalendarioComponent, canActivate: [RolGuard], data: { rol: ['ROLE_NAIB', 'ROLE_ADMIN_NAIB'] } },
  { path: 'EmailMasivos', component: EmailMasivosComponent, canActivate: [RolGuard], data: { rol: ['ROLE_NAIB', 'ROLE_ADMIN_NAIB'] } },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
