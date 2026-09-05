// Cleanup demo — interval in init; cleanup return is destroy (clears timer on route leave)
export const cleanupDemoPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="cleanup-demo-page">
        <h1 class="cleanup-demo-page__title">Cleanup demo</h1>
        <p class="cleanup-demo-page__text">Tick count stops when you leave this route (see console for destroy log).</p>
        <p class="cleanup-demo-page__tick" data-slot="tick">0</p>
      </section>
    `;
  },

  init() {
    const tickEl = document.querySelector<HTMLElement>('[data-slot="tick"]');
    let count = 0;

    const timer = window.setInterval(() => {
      count += 1;
      if (tickEl) {
        tickEl.textContent = String(count);
      }
    }, 500);

    // destroy: clear interval when the router leaves this page
    return () => {
      window.clearInterval(timer);
      console.log('[cleanup-demo] destroy: interval cleared');
    };
  },
};
