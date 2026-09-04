// App header with nav links
export function getAppHeaderMarkup(): string {
  return `
    <header class="app-header">
      <a class="app-header__brand" href="/feed" data-route="feed">Routing demo</a>
      <nav class="app-header__nav">
        <a class="app-header__link" href="/feed" data-route="feed">Feed</a>
        <a class="app-header__link" href="/items" data-route="items">Items</a>
        <a class="app-header__link" href="/search" data-route="search">Search</a>
        <a class="app-header__link" href="/map-demo" data-route="map-demo">Map demo</a>
        <a class="app-header__link app-header__link--auth" href="/login" data-route="login">Login</a>
        <button type="button" class="app-header__logout app-header__link--hidden" data-action="logout">Logout</button>
      </nav>
    </header>
  `;
}

// Toggle active nav link and auth controls
export function setHeaderActive(routeName: string, isAuthed: boolean, onLogout: () => void): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('.app-header__link');
  const logoutBtn = document.querySelector<HTMLButtonElement>('[data-action="logout"]');
  const loginLink = document.querySelector<HTMLAnchorElement>('[data-route="login"]');

  links.forEach((link) => {
    const name = link.getAttribute('data-route');
    link.classList.toggle('app-header__link--active', name === routeName);
  });

  if (logoutBtn && !logoutBtn.dataset.bound) {
    logoutBtn.dataset.bound = '1';
    logoutBtn.addEventListener('click', onLogout);
  }

  syncHeaderAuth(isAuthed);
}

// Show/hide header auth state from session
export function syncHeaderAuth(isAuthed: boolean): void {
  const loginLink = document.querySelector<HTMLAnchorElement>('[data-route="login"]');
  const logoutBtn = document.querySelector<HTMLButtonElement>('[data-action="logout"]');

  if (loginLink && logoutBtn) {
    loginLink.classList.toggle('app-header__link--hidden', isAuthed);
    logoutBtn.classList.toggle('app-header__link--hidden', !isAuthed);
  }
}
