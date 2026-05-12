import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{ path: '', renderMode: RenderMode.Client },
	{ path: 'dashboard', renderMode: RenderMode.Client },
	{ path: 'map', renderMode: RenderMode.Client },
	{ path: 'flights', renderMode: RenderMode.Client },
	{ path: 'flights/new', renderMode: RenderMode.Client },
	{ path: 'flights/:id', renderMode: RenderMode.Client },
  { path: 'alerts', renderMode: RenderMode.Client },
  { path: 'incidents', renderMode: RenderMode.Client },
  { path: 'incidents/new', renderMode: RenderMode.Client },
  { path: 'users', renderMode: RenderMode.Client },
   { path: 'access-denied', renderMode: RenderMode.Client },
   { path: 'signin', renderMode: RenderMode.Client }
];
