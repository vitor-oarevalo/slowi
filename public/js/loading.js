// const MIN_TIME = 750;
const MIN_TIME = 0;
const inicio = performance.now();

function esconderLoading() {
  const loader = document.getElementById("loader");
  loader.classList.add("hidden");
  loader.addEventListener("transitionend", () => loader.remove(), { once: true });
}

window.addEventListener("load", () => {
  const restante = Math.max(0, MIN_TIME - (performance.now() - inicio));
  setTimeout(esconderLoading, restante);
});