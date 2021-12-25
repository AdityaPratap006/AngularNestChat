import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { PublicAuthGuard } from './guards/public-auth.guard';

const routes: Routes = [
  {
    path: 'private',
    loadChildren: () =>
      import('./private/private.module').then((m) => m.PrivateModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'public',
    loadChildren: () =>
      import('./public/public.module').then((m) => m.PublicModule),
    canActivate: [PublicAuthGuard],
  },
  {
    path: '**',
    redirectTo: 'public',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
