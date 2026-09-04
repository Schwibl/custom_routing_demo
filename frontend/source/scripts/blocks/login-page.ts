// Login page block
export const loginPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="login-page">
        <h1 class="login-page__title">Sign in</h1>
        <p class="login-page__text">Demo auth — no backend. Click continue to set a local session.</p>
        <button type="button" class="login-page__button" data-action="login">Continue</button>
      </section>
    `;
  },

  init(ctx) {
    const button = document.querySelector<HTMLButtonElement>('[data-action="login"]');
    button?.addEventListener('click', () => {
      ctx.navigate('/feed');
    });
  },
};
