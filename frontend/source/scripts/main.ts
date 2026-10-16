import '../styles/main.scss';

import Router from './features/router';
import { appPath, initAppBase } from './features/app-base';
import { isAuthenticated, login, logout } from './features/session';
import { getAppHeaderMarkup, setHeaderActive, syncHeaderAuth } from './blocks/app-header';
import { loginPage } from './blocks/login-page';
import { feedPage } from './blocks/feed-page';
import { itemsPage } from './blocks/items-page';
import { itemPage } from './blocks/item-page';
import { searchPage } from './blocks/search-page';
import { cleanupDemoPage } from './blocks/cleanup-demo-page';
import { notFoundPage } from './blocks/not-found-page';

// Route name → tab title. Item uses the :id param instead
const PAGE_TITLES: Record<string, string> = {
  login: 'Sign in',
  feed: 'Feed',
  items: 'Items',
  search: 'Search',
  'cleanup-demo': 'Cleanup demo',
  'not-found': 'Page not found',
};

// DOM refs
const appRoot = document.querySelector<HTMLElement>('#app');
const pageOutlet = (): HTMLElement | null => document.querySelector('.app__main');

let activeCleanup: (() => void) | null = null;
let router: Router;

// Inject page markup and run block init
function mountPage(block: t_PageBlock, params: t_RouteParams = {}): void {
  const outlet = pageOutlet();
  if (!outlet) {
    return;
  }

  if (activeCleanup) {
    activeCleanup();
    activeCleanup = null;
  }

  outlet.innerHTML = block.getMarkup();
  const cleanup = block.init({
    navigate: (to, replace) => router.navigate(appPath(to), replace),
    params,
  });

  if (typeof cleanup === 'function') {
    activeCleanup = cleanup;
  }

  focusPageHeading();
}

// Move focus to the new page heading so keyboard and AT follow the route
function focusPageHeading(): void {
  const heading = pageOutlet()?.querySelector('h1');

  if (!(heading instanceof HTMLElement)) {
    return;
  }

  heading.tabIndex = -1;
  heading.focus();
}

// Browser tab title for the active route
function documentTitle(name: string, params: t_RouteParams): string {
  const page = name === 'item' ? `Item ${params.id ?? ''}`.trim() : PAGE_TITLES[name];
  return page ? `${page} · Custom routing demo` : 'Custom routing demo';
}

// Auth guard — redirect to login if no session
function requireAuth(): boolean {
  if (isAuthenticated()) {
    return true;
  }

  router.navigate(appPath('/login'), true);
  return false;
}

// Guest guard — redirect authed users to feed
function requireGuest(): boolean {
  if (!isAuthenticated()) {
    return true;
  }

  router.navigate(appPath('/feed'), true);
  return false;
}

// Map child routes to parent nav highlight
function navNameForRoute(name: string): string {
  if (name === 'item') {
    return 'items';
  }

  return name;
}

// Build shell and start router
function bootstrap(): void {
  initAppBase();

  if (!appRoot) {
    return;
  }

  // Persistent BEM shell — pages mount into .app__main only
  appRoot.innerHTML = `
    <div class="app">
      ${getAppHeaderMarkup()}
      <main class="app__main"></main>
      <footer class="app__footer">Custom routing demo</footer>
    </div>
  `;

  syncHeaderAuth(isAuthenticated());

  const routes: t_Route[] = [
    {
      path: appPath('/'),
      name: 'root',
      mount: () => {
        router.navigate(appPath(isAuthenticated() ? '/feed' : '/login'), true);
      },
    },
    {
      path: appPath('/login'),
      name: 'login',
      mount: () => {
        if (!requireGuest()) {
          return;
        }

        mountPage({
          ...loginPage,
          init(ctx) {
            loginPage.init({
              ...ctx,
              navigate: (to, replace) => {
                login();
                syncHeaderAuth(true);
                router.navigate(appPath(to), replace);
              },
            });
          },
        });
      },
    },
    {
      path: appPath('/feed'),
      name: 'feed',
      mount: () => {
        if (!requireAuth()) {
          return;
        }

        mountPage(feedPage);
      },
    },
    {
      path: appPath('/items'),
      name: 'items',
      mount: () => {
        if (!requireAuth()) {
          return;
        }

        mountPage(itemsPage);
      },
    },
    {
      path: appPath('/items/:id'),
      name: 'item',
      mount: (params) => {
        if (!requireAuth()) {
          return;
        }

        mountPage(itemPage, params);
      },
    },
    {
      path: appPath('/search'),
      name: 'search',
      mount: () => {
        if (!requireAuth()) {
          return;
        }

        mountPage(searchPage);
      },
    },
    {
      path: appPath('/cleanup-demo'),
      name: 'cleanup-demo',
      mount: () => {
        if (!requireAuth()) {
          return;
        }

        mountPage(cleanupDemoPage);
      },
      unmount: () => {
        if (activeCleanup) {
          activeCleanup();
          activeCleanup = null;
        }
      },
    },
  ];

  router = new Router({
    routes,
    notFound: {
      path: '*',
      name: 'not-found',
      mount: () => {
        mountPage(notFoundPage);
      },
    },
    onChange: (_path, name, params) => {
      document.title = documentTitle(name, params);

      // Guest chrome: hide header on login; show on authenticated routes
      document.querySelector('.app')?.classList.toggle('app--auth', name === 'login');

      setHeaderActive(navNameForRoute(name), isAuthenticated(), () => {
        logout();
        syncHeaderAuth(false);
        router.navigate(appPath('/login'), true);
      });
    },
  });

  router.start();
}

bootstrap();
