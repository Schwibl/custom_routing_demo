import { appPath } from '../features/app-base';

const FAKE_ITEMS = [
  { id: 1, title: 'Alpha module' },
  { id: 2, title: 'Beta service' },
  { id: 3, title: 'Gamma panel' },
];

// Items list page
export const itemsPage: t_PageBlock = {
  getMarkup() {
    const list = FAKE_ITEMS.map(
      (item) =>
        `<li class="items-page__item"><a class="items-page__link" href="${appPath(`/items/${item.id}`)}">${item.title}</a></li>`,
    ).join('');

    return `
      <section class="items-page">
        <h1 class="items-page__title">Items</h1>
        <ul class="items-page__list">${list}</ul>
      </section>
    `;
  },

  init() {},
};
