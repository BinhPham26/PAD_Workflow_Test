const button = document.getElementById("button-laytenfile"); // ✅ ID mới
const input = document.querySelector(".form-control");
const body = document.body;
let overlay = null;

// Xử lý khi bấm nút "OKE"
button.addEventListener("click", showLightbox);

// Xử lý khi bấm Enter trong ô input
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // ✅ Ngăn scroll về đầu trang
    showLightbox();
  }
});

function showLightbox() {
  const userInput = input.value.trim();
  if (!userInput) {
    alert("Vui lòng nhập tên bài");
    return;
  }

  disableScroll();

  overlay = document.createElement("div");
  overlay.className = "lightbox-overlay";

  const contentBox = document.createElement("div");
  contentBox.className = "lightbox-content";
  contentBox.innerHTML = `
      ${generateRow("Point", "納品　【TREND-POINT】" + userInput)}
      ${generateRow("Folder ảnh", "BM・境界標の写真")}
      ${generateRow("Excel list điểm", "座標リスト")}
       ${generateRow("Excel chứa ảnh","【写真帳】" + userInput)}
      ${generateRow("Checklist",【チェックリスト】" + userInput)}
      ${generateRow("ONE", userInput)}
      <div class="lightbox-close">Đóng</div>
    `;

  overlay.appendChild(contentBox);
  document.body.appendChild(overlay);

  // Đóng bằng nút "Đóng"
  contentBox
    .querySelector(".lightbox-close")
    .addEventListener("click", closeLightbox);

  // Đóng bằng phím Esc
  document.addEventListener("keydown", escKeyHandler);
}

function generateRow(label, value) {
  return `
      <div class="lightbox-row">
        <div class="label">${label}:</div>
        <input class="value-input" readonly value="${value}" />
      </div>
    `;
}

function closeLightbox() {
  if (overlay) {
    overlay.remove();
    overlay = null;
    enableScroll();
    document.removeEventListener("keydown", escKeyHandler);
  }
}

function escKeyHandler(e) {
  if (e.key === "Escape") {
    closeLightbox();
  }
}

function disableScroll() {
  document.body.classList.add("no-scroll");
  window.addEventListener("wheel", preventDefault, { passive: false });
  window.addEventListener("touchmove", preventDefault, { passive: false });
  window.addEventListener("scroll", preventDefault, { passive: false });
}

function enableScroll() {
  document.body.classList.remove("no-scroll");
  window.removeEventListener("wheel", preventDefault);
  window.removeEventListener("touchmove", preventDefault);
  window.removeEventListener("scroll", preventDefault);
}

function preventDefault(e) {
  e.preventDefault();
}
