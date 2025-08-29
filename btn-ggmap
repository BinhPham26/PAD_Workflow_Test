// Lấy phần tử input & button
const ggmapInput = document.getElementById("ggmap");
const ggmapBtn = document.querySelector(".btn-ggmap");

// Hàm chuẩn hóa link (tự thêm https:// nếu thiếu)
function normalizeUrl(url) {
  url = url.trim();
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }
  return url;
}

// Xử lý sự kiện click nút "Map"
ggmapBtn.addEventListener("click", (e) => {
  e.preventDefault(); // Ngăn trình duyệt xử lý mặc định

  let url = normalizeUrl(ggmapInput.value);

  // Kiểm tra nếu chưa nhập link
  if (!url) {
    alert("Vui lòng nhập link Google Map!");
    ggmapInput.focus();
    return;
  }

  // Kiểm tra URL hợp lệ
  try {
    new URL(url);
  } catch (err) {
    alert("Link không hợp lệ. Vui lòng kiểm tra lại!");
    return;
  }

  // Cập nhật href để mở đúng link
  ggmapBtn.setAttribute("href", url);
  window.open(url, "_blank", "noopener,noreferrer");
});
