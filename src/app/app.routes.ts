import { Routes } from '@angular/router';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
	},
	{
		path: 'map',
		loadComponent: () => import('./components/flight map/flight-map.component').then((m) => m.FlightMapComponent),
	},
	{
		path: 'flights',
		loadComponent: () => import('./components/flight list/flights-list.component').then((m) => m.FlightsListComponent),
	},
	{
		path: 'flights/new',
		loadComponent: () => import('./components/incident form/incident-form.component').then((m) => m.IncidentFormComponent),
		canActivate: [RoleGuard],
	},
	{
		path: 'flights/:id',
		loadComponent: () => import('./components/flight detail/flight-detail.component').then((m) => m.FlightDetailComponent),
	},
	{
		path: 'alerts',

		loadComponent: () =>
			import(
				'./components/alert-page.component/alert-page.component'
			).then(
				(m) => m.AlertPageComponent
			)
	},
	{
		path: 'incidents',
		loadComponent: () => import('./components/incident form/incident-form.component').then((m) => m.IncidentFormComponent),
	},
	{
		path: 'aircraft',
		loadComponent: () => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
	},
	{
		path: 'airports',
		loadComponent: () => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
	},
	{
		path: 'users',
		loadComponent: () => import('./components/dashboard/dashboard.component').then((m) => m.DashboardComponent),
	}
];
