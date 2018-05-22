import {Routes, RouterModule} from '@angular/router';
import {PointDetailsComponent} from "./components/point-details/point-details.component";
import {NgModule} from "@angular/core";
import {HomeComponent} from "./components/home/home.component";

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  // {
  //   path: 'points',
  //   component: PointDetailsComponent,
  // },
  {
    path: 'home',
    component: HomeComponent,
    children:[
      {
    path: 'points',
    component: PointDetailsComponent,
  },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule{

}
