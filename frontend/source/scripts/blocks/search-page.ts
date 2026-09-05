// Search page — reads ?q= and shows mock results
export const searchPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="search-page">
        <h1 class="search-page__title">Search</h1>
        <form class="search-page__form" data-action="search-form">
          <input class="input" name="q" type="search" placeholder="Query" />
          <button class="button button--accent button--with-text" type="submit">Search</button>
        </form>
        <p class="search-page__summary" data-slot="summary"></p>
        <ul class="search-page__results" data-slot="results"></ul>
      </section>
    `;
  },

  init(ctx) {
    const MOCK_HITS = ['Alpha module', 'Beta service', 'Gamma panel', 'Delta route', 'Epsilon guard'];
    const params = new URLSearchParams(window.location.search);
    const query = params.get('q') ?? '';
    const form = document.querySelector<HTMLFormElement>('[data-action="search-form"]');
    const input = form?.querySelector<HTMLInputElement>('input[name="q"]');
    const summary = document.querySelector<HTMLElement>('[data-slot="summary"]');
    const results = document.querySelector<HTMLElement>('[data-slot="results"]');

    if (input) {
      input.value = query;
    }

    if (summary && results) {
      if (!query) {
        summary.textContent = 'Enter a query above.';
        results.innerHTML = '';
      } else {
        const hits = MOCK_HITS.filter((hit) => hit.toLowerCase().includes(query.toLowerCase()));
        const shown = hits.length ? hits : MOCK_HITS.slice(0, 2).map((hit) => `${hit} (near miss)`);
        summary.textContent = `Results for "${query}" (mock)`;
        results.innerHTML = shown
          .map((hit) => `<li class="search-page__hit">${hit}</li>`)
          .join('');
      }
    }

    const onSubmit = (event: Event) => {
      event.preventDefault();
      const value = input?.value.trim() ?? '';
      ctx.navigate(`/search?q=${encodeURIComponent(value)}`);
    };

    form?.addEventListener('submit', onSubmit);

    return () => {
      form?.removeEventListener('submit', onSubmit);
    };
  },
};
