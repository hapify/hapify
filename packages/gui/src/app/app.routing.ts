import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CHANNEL_ROUTES, ChannelModule } from './channel/channel.module';
import { ChannelComponent } from './components/channel/channel.component';
import { ModelComponent } from './components/model/model.component';
import { MODEL_ROUTES, ModelModule } from './model/model.module';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/model',
    pathMatch: 'full',
  },
  {
    path: 'model',
    component: ModelComponent,
    children: MODEL_ROUTES,
  },
  {
    path: 'channel',
    component: ChannelComponent,
    children: CHANNEL_ROUTES,
  },
];

@NgModule({
  imports: [ModelModule, ChannelModule, RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
