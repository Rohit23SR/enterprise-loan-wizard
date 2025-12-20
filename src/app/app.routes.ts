import { Routes } from '@angular/router';
import { Wizard } from './components/wizard/wizard';
import { SuccessScreen } from './components/success-screen/success-screen';

export const routes: Routes = [
  { path: '', component: Wizard },
  { path: 'success', component: SuccessScreen },
  { path: '**', redirectTo: '' }
];
