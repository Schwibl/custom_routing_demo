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
import { mapDemoPage } from './blocks/map-demo-page';

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

        document.querySelector('.app')?.classList.add('app--auth');
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

        document.querySelector('.app')?.classList.remove('app--auth');
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
      path: appPath('/map-demo'),
      name: 'map-demo',
      mount: () => {
        if (!requireAuth()) {
          return;
        }

        mountPage(mapDemoPage);
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
    fallbackPath: appPath('/login'),
    onChange: (_path, name) => {
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
