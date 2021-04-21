import { Routes } from '@angular/router';

// Components
import { NewComponent } from './components/new/new.component';
import { RootComponent } from './components/root/root.component';

export const MODEL_ROUTES: Routes = [
  {
    path: '',
    component: RootComponent,
  },
  {
    path: 'new',
    component: NewComponent,
  },
];
