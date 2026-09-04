// Item detail page — reads :id param
export const itemPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="item-page">
        <h1 class="item-page__title" data-slot="title">Item</h1>
        <a class="item-page__back" href="/items">Back to list</a>
      </section>
    `;
  },

  init(ctx) {
    const title = document.querySelector<HTMLElement>('[data-slot="title"]');
    const id = ctx.params?.id ?? 'unknown';

    if (title) {
      title.textContent = `Item ${id}`;
    }
  },
};
