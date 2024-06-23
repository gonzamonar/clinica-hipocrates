import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InstalacionesComponent } from './instalaciones.component';

const routes: Routes = [
  {
    path: '',
    component: InstalacionesComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class InstalacionesRoutingModule { }
