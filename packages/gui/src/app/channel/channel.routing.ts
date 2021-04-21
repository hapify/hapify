import { Routes } from '@angular/router';
// Components
import { EditComponent } from './components/edit/edit.component';
import { RootComponent } from './components/root/root.component';

export const CHANNEL_ROUTES: Routes = [
  {
    path: '',
    component: RootComponent,
  },
  {
    path: 'edit/:id',
    component: EditComponent,
  },
];
