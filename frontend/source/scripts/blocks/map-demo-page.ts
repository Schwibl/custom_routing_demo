// Map demo — interval in init; cleanup return is destroy (clears timer on route leave)
export const mapDemoPage: t_PageBlock = {
  getMarkup() {
    return `
      <section class="map-demo-page">
        <h1 class="map-demo-page__title">Map demo cleanup</h1>
        <p class="map-demo-page__text">Tick count stops when you leave this route (see console for destroy log).</p>
        <p class="map-demo-page__tick" data-slot="tick">0</p>
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
      console.log('[map-demo] destroy: interval cleared');
    };
  },
};
