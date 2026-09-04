// Login page — form stub; session.login runs in the route wrapper in main.ts
export const loginPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="login-page">
        <h1 class="login-page__title">Sign in</h1>
        <p class="login-page__text">Demo auth — no backend. Continue sets a local session and opens the feed.</p>
        <form class="login-page__form" data-action="login-form">
          <label class="login-page__label">
            Email (stub)
            <input class="login-page__input" type="email" name="email" value="demo@example.com" autocomplete="username" />
          </label>
          <button type="submit" class="login-page__button" data-action="login">Continue</button>
        </form>
      </section>
    `;
  },

  init(ctx) {
    const form = document.querySelector<HTMLFormElement>('[data-action="login-form"]');

    const onSubmit = (event: Event) => {
      event.preventDefault();
      ctx.navigate('/feed');
    };

    form?.addEventListener('submit', onSubmit);

    return () => {
      form?.removeEventListener('submit', onSubmit);
    };
  },
};
