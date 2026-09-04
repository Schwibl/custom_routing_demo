// Item detail page — reads :id param
export const itemPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="item-page">
        <h1 class="item-page__title">Item detail</h1>
        <p class="item-page__id" data-slot="id"></p>
        <a class="item-page__back" href="/items">Back to list</a>
      </section>
    `;
  },

  init(ctx) {
    const slot = document.querySelector<HTMLElement>('[data-slot="id"]');
    const id = ctx.params?.id ?? 'unknown';
    if (slot) {
      slot.textContent = `Showing item #${id}`;
    }
  },
};
