import {Routes, RouterModule} from '@angular/router';
import {PointAddComponent} from './components/point-add/point-add.component';
import {NgModule} from '@angular/core';
import {HomeComponent} from './components/home/home.component';
import {PointDetailComponent} from "./components/point-detail/point-detail.component";
import {PointResolveService} from "./services/point-resolve.service";
import {PointEditComponent} from "./components/point-edit/point-edit.component";
import {ResultsSearchComponent} from "./components/results-search/results-search.component";

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
      {
        path: 'edit/:id',
        resolve: {point : PointResolveService},
        component: PointEditComponent,
      },
      {
        path: 'search',
        component: ResultsSearchComponent,
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
