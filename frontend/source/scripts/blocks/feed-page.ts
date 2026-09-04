// Feed page block
export const feedPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="feed-page">
        <h1 class="feed-page__title">Feed</h1>
        <p class="feed-page__text">Authenticated home route. Navigation uses a custom History API router — no React Router.</p>
      </section>
    `;
  },

  init() {},
};
