import { appPath } from '../features/app-base';

// Feed page — authenticated home
export const feedPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="feed-page">
        <h1 class="feed-page__title">Feed</h1>
        <p class="feed-page__text">Authenticated home. Custom History API router — no React Router.</p>
        <ul class="feed-page__links">
          <li><a class="feed-page__link" href="${appPath('/items')}">Browse items</a></li>
          <li><a class="feed-page__link" href="${appPath('/search')}">Search</a></li>
          <li><a class="feed-page__link" href="${appPath('/map-demo')}">Map demo (destroy cleanup)</a></li>
        </ul>
      </section>
    `;
  },

  init() {},
};
