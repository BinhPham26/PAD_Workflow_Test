const cta = document.getElementById("ctaLinks");
const keyvisual = document.querySelector(".site-blocks-cover");
let isShown = false;

window.addEventListener("scroll", () => {
  const keyBottom = keyvisual.getBoundingClientRect().bottom;

  if (keyBottom < 0 && !isShown) {
    cta.classList.add("show");
    cta.classList.remove("hide");
    isShown = true;
  } else if (keyBottom >= 0 && isShown) {
    cta.classList.remove("show");
    cta.classList.add("hide");
    isShown = false;
  }
});
