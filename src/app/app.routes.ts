import { Routes } from '@angular/router';
import { roleGuard } from './guards/role.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		redirectTo: 'dashboard',
		pathMatch: 'full',
	},
	{
		path: 'dashboard',

		canActivate: [
			authGuard
		],

		loadComponent: () =>
			import(
				'./components/dashboard/dashboard.component'
			).then(
				(m) => m.DashboardComponent
			)
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
		canActivate: [roleGuard],
		data: { roles: ['Supervisor', 'Controller'] },
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
		path: 'incidents/new',
		loadComponent: () => import('./components/incident form/incident-form.component').then((m) => m.IncidentFormComponent),
		canActivate: [roleGuard],
		data: { roles: ['Supervisor', 'Controller'] },
	},
	

	{
		path: 'users',

		canActivate: [
			authGuard,
			roleGuard
		],

		data: {
			roles: [
				'Supervisor'
			]
		},

		loadComponent: () =>
			import(
				'./components/users.component/users.component'
			).then(
				(m) => m.UsersComponent
			)
	},
	{
		path: 'access-denied',

		loadComponent: () =>
			import(
				'./components/access-denied.component/access-denied.component'
			).then(
				(m) => m.AccessDeniedComponent
			)
	}
	,
	{
		path: 'signin',

		loadComponent: () =>
			import(
				'./components/sign-in.component/sign-in.component'
			).then(
				(m) => m.SigninComponent
			)
	},
	{
		path: 'incidents',

		canActivate: [authGuard],

		loadComponent: () =>
			import(
				'./components/incident-history.component/incident-history.component'
			).then((m) => m.IncidentHistoryComponent),
	}
];
