// History API SPA router
class Router {
  private routes: t_Route[];
  private fallbackPath: string;
  private onChange?: t_RouterOptions['onChange'];
  private activeRoute: t_Route | null = null;
  private started = false;

  constructor(options: t_RouterOptions) {
    this.routes = options.routes;
    this.fallbackPath = options.fallbackPath;
    this.onChange = options.onChange;
  }

  // Start listeners and render current URL
  start(): void {
    if (this.started) {
      return;
    }

    this.started = true;
    window.addEventListener('popstate', this.handlePopState);
    document.addEventListener('click', this.handleLinkClick);
    this.renderCurrentPath(true);
  }

  // Client navigate
  navigate(to: string, replace = false): void {
    const target = new URL(to, window.location.href);
    const normalised = this.normalisePath(target.pathname);
    const url = normalised + target.search + target.hash;

    if (replace) {
      window.history.replaceState(null, '', url);
    } else {
      window.history.pushState(null, '', url);
    }

    this.renderPath(normalised);
  }

  // Match pathname to route table
  match(pathname: string): t_RouteMatch | null {
    const path = this.normalisePath(pathname);

    for (const route of this.routes) {
      const params = this.matchPattern(route.path, path);

      if (params !== null) {
        return { route, params };
      }
    }

    return null;
  }

  private handlePopState = (): void => {
    this.renderCurrentPath(false);
  };

  // Intercept same-origin link clicks
  private handleLinkClick = (event: MouseEvent): void => {
    if (event.defaultPrevented || event.button !== 0) {
      return;
    }

    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const anchor = (event.target as Element | null)?.closest('a');

    if (!(anchor instanceof HTMLAnchorElement)) {
      return;
    }

    if (anchor.target && anchor.target !== '_self') {
      return;
    }

    if (anchor.hasAttribute('download')) {
      return;
    }

    const href = anchor.getAttribute('href');

    if (!href || href.startsWith('#')) {
      return;
    }

    let url: URL;

    try {
      url = new URL(href, window.location.href);
    } catch {
      return;
    }

    if (url.origin !== window.location.origin) {
      return;
    }

    event.preventDefault();
    this.navigate(url.pathname + url.search + url.hash);
  };

  private renderCurrentPath(replaceOnFallback: boolean): void {
    const path = this.normalisePath(window.location.pathname);
    const match = this.match(path);

    if (!match) {
      this.navigate(this.fallbackPath, replaceOnFallback);
      return;
    }

    this.applyMatch(match);
  }

  private renderPath(path: string): void {
    const match = this.match(path);

    if (!match) {
      this.navigate(this.fallbackPath, true);
      return;
    }

    this.applyMatch(match);
  }

  private applyMatch(match: t_RouteMatch): void {
    if (this.activeRoute?.unmount) {
      this.activeRoute.unmount();
    }

    this.activeRoute = match.route;
    match.route.mount(match.params);

    const path = this.normalisePath(window.location.pathname);
    this.onChange?.(path, match.route.name, match.params);
  }

  private matchPattern(pattern: string, pathname: string): t_RouteParams | null {
    const patternParts = this.normalisePath(pattern).split('/').filter(Boolean);
    const pathParts = pathname.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) {
      return null;
    }

    const params: t_RouteParams = {};

    for (let i = 0; i < patternParts.length; i += 1) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];

      if (patternPart.startsWith(':')) {
        const paramName = patternPart.slice(1);
        const value = decodeURIComponent(pathPart);

        // Item ids must be numeric
        if (paramName === 'id' && pattern.includes('/items/') && !/^\d+$/.test(value)) {
          return null;
        }

        params[paramName] = value;
        continue;
      }

      if (patternPart !== pathPart) {
        return null;
      }
    }

    return params;
  }

  private normalisePath(path: string): string {
    let bare = path.split('?')[0].split('#')[0] || '/';

    if (bare.endsWith('/index.html')) {
      bare = bare.slice(0, -'/index.html'.length) || '/';
    } else if (bare.endsWith('index.html')) {
      bare = bare.slice(0, -'index.html'.length) || '/';
    }

    if (bare.length > 1 && bare.endsWith('/')) {
      return bare.slice(0, -1);
    }

    return bare || '/';
  }
}

export default Router;
