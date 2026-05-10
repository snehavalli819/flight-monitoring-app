import { ServerRoute, RenderMode } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
	{ path: '', renderMode: RenderMode.Client },
	{ path: 'map', renderMode: RenderMode.Client },
	{ path: 'flights', renderMode: RenderMode.Client },
	{ path: 'flights/new', renderMode: RenderMode.Client },
	{ path: 'flights/:id', renderMode: RenderMode.Client },
];
