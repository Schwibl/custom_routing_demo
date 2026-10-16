import { appPath } from '../features/app-base';

// Unknown-route view — keeps the bad URL and offers a way home
export const notFoundPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="not-found-page">
        <h1 class="not-found-page__title">Page not found</h1>
        <p class="not-found-page__text">That route does not exist.</p>
        <a class="button button--accent button--with-text not-found-page__home" href="${appPath('/')}">Back home</a>
      </section>
    `;
  },

  init() {},
};
