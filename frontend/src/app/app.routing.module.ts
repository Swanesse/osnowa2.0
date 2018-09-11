import {Routes, RouterModule} from '@angular/router';
import {PointAddComponent} from './components/point-add/point-add.component';
import {NgModule} from '@angular/core';
import {HomeComponent} from './components/home/home.component';
import {PointDetailComponent} from "./components/point-detail/point-detail.component";
import {PointResolveService} from "./services/point-resolve.service";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {
        path: 'points',
        component: PointAddComponent,
      },
      {
        path: 'detail/:id',
        resolve: {point : PointResolveService},
        component: PointDetailComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
