// Search page — reads ?q= query
export const searchPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="search-page">
        <h1 class="search-page__title">Search</h1>
        <form class="search-page__form" data-action="search-form">
          <input class="search-page__input" name="q" type="search" placeholder="Query" />
          <button class="search-page__button" type="submit">Search</button>
        </form>
        <p class="search-page__result" data-slot="result"></p>
      </section>
    `;
  },

  init(ctx) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') ?? '';
    const input = document.querySelector<HTMLInputElement>('.search-page__input');
    const result = document.querySelector<HTMLElement>('[data-slot="result"]');
    const form = document.querySelector<HTMLFormElement>('[data-action="search-form"]');

    if (input) {
      input.value = query;
    }

    if (result) {
      result.textContent = query ? `Results for "${query}" (mock)` : 'Enter a query above.';
    }

    form?.addEventListener('submit', (event) => {
      event.preventDefault();
      const value = input?.value.trim() ?? '';
      ctx.navigate(`/search?q=${encodeURIComponent(value)}`);
    });
  },
};
