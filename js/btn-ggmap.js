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


// Hàm lưu dữ liệu vào localStorage khi nhập
function saveData() {
  localStorage.setItem("ggmap", document.getElementById("ggmap").value);
  localStorage.setItem("dienTich", document.getElementById("dienTich").value);
  localStorage.setItem("shinhoku", document.getElementById("shinhoku").value);
  localStorage.setItem("jihoku", document.getElementById("jihoku").value);
}

// Hàm tải dữ liệu khi load lại trang
function loadData() {
  document.getElementById("ggmap").value = localStorage.getItem("ggmap") || "";
  document.getElementById("dienTich").value = localStorage.getItem("dienTich") || "";
  document.getElementById("shinhoku").value = localStorage.getItem("shinhoku") || "";
  document.getElementById("jihoku").value = localStorage.getItem("jihoku") || "";
}

// Gán sự kiện cho tất cả các input
document.getElementById("ggmap").addEventListener("input", saveData);
document.getElementById("dienTich").addEventListener("input", saveData);
document.getElementById("shinhoku").addEventListener("input", saveData);
document.getElementById("jihoku").addEventListener("input", saveData);

// Khi trang load xong thì khôi phục dữ liệu
window.addEventListener("load", loadData);

// Tự động gán link cho nút Map mỗi khi nhập URL
document.querySelector(".btn-ggmap").addEventListener("click", function () {
  const url = document.getElementById("ggmap").value.trim();
  if (url) {
    this.setAttribute("href", url);
  } else {
    alert("Vui lòng nhập link Google Map!");
  }
});
