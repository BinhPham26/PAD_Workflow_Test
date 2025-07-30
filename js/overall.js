const soDuAn = document.getElementById("soDuAn");
const tenDuAn = document.getElementById("tenDuAn");
const diaChi = document.getElementById("diaChi");
const ketQua = document.getElementById("ketQua");
const fain = document.getElementById("fain");
const dienTich = document.getElementById("dienTich");

const bmCo = document.getElementById("bmCo");
const bmKhong = document.getElementById("bmKhong");
const keikakuCo = document.getElementById("keikakuCo");
const keikakuKhong = document.getElementById("keikakuKhong");

/** Danh sách tỉnh -> 系 */
const provinceMap = {
  北海道: "12系",
  青森県: "10系",
  岩手県: "10系",
  宮城県: "10系",
  秋田県: "10系",
  山形県: "10系",
  福島県: "9系",
  茨城県: "9系",
  栃木県: "9系",
  群馬県: "9系",
  埼玉県: "9系",
  千葉県: "9系",
  東京都: "9系",
  神奈川県: "9系",
  新潟県: "8系",
  富山県: "7系",
  石川県: "7系",
  福井県: "6系",
  山梨県: "8系",
  長野県: "8系",
  岐阜県: "7系",
  静岡県: "8系",
  愛知県: "7系",
  三重県: "6系",
  滋賀県: "6系",
  京都府: "6系",
  大阪府: "6系",
  兵庫県: "5系",
  奈良県: "6系",
  和歌山県: "6系",
  鳥取県: "5系",
  島根県: "3系",
  岡山県: "5系",
  広島県: "3系",
  沖縄県: "15系",
  大分県: "2系",
  鹿児島県: "2系",
  宮崎県: "2系",
  山口県: "3系",
  熊本県: "2系",
  福岡県: "2系",
  佐賀県: "2系",
  長崎県: "1系",
  徳島県: "4系",
  香川県: "4系",
  高知県: "4系",
  愛媛県: "4系",
};

/** Hàm trả về giá trị an toàn */
function safeValue(val) {
  return val && val !== "undefined" ? val : "";
}

// Giới hạn nhập số dự án tối đa 4 số
soDuAn.addEventListener("input", () => {
  soDuAn.value = soDuAn.value.replace(/\D/g, "").slice(0, 4);
  saveData();
});

// Chỉ chọn 1 trong 2 checkbox BM
[bmCo, bmKhong].forEach((cb, _, arr) => {
  cb.addEventListener("change", () => {
    if (cb.checked)
      arr.forEach((other) => other !== cb && (other.checked = false));
    saveData();
  });
});

// Chỉ chọn 1 trong 2 checkbox Keikaku
[keikakuCo, keikakuKhong].forEach((cb, _, arr) => {
  cb.addEventListener("change", () => {
    if (cb.checked)
      arr.forEach((other) => other !== cb && (other.checked = false));
    saveData();
  });
});

// Khi nhập địa chỉ -> tự động cập nhật Kết quả
diaChi.addEventListener("input", () => {
  const prefix = diaChi.value.slice(0, 4);
  let matched = "";

  Object.keys(provinceMap).forEach((key) => {
    if (prefix.startsWith(key)) matched = provinceMap[key];
  });

  ketQua.value = matched || "";
  saveData();
});

// Khi nhập Tên dự án -> đồng bộ với input #tenBai nếu có
tenDuAn.addEventListener("input", () => {
  const tenBaiInput = document.getElementById("tenBai");
  if (tenBaiInput) {
    tenBaiInput.value = tenDuAn.value;
  }
  saveData();
});

// Load dữ liệu từ localStorage
const savedData = JSON.parse(localStorage.getItem("projectOverview")) || {};

soDuAn.value = safeValue(savedData.soDuAn);
tenDuAn.value = safeValue(savedData.tenDuAn);
diaChi.value = safeValue(savedData.diaChi);
ketQua.value = safeValue(savedData.ketQua);
fain.value = safeValue(savedData.fain) || "アイ工務店様";
dienTich.value = safeValue(savedData.dienTich);

// *** FIX: khôi phục luôn #tenBai khi reload ***
const tenBaiInput = document.getElementById("tenBai");
if (tenBaiInput) {
  tenBaiInput.value = safeValue(savedData.tenBai || savedData.tenDuAn);
}

bmCo.checked = !!savedData.bmCo;
bmKhong.checked = !!savedData.bmKhong;
keikakuCo.checked = !!savedData.keikakuCo;
keikakuKhong.checked = !!savedData.keikakuKhong;

// Lưu dữ liệu vào localStorage
function saveData() {
  const data = {
    soDuAn: soDuAn.value || "",
    tenDuAn: tenDuAn.value || "",
    // Lưu thêm giá trị #tenBai (nếu tồn tại)
    tenBai: document.getElementById("tenBai")
      ? document.getElementById("tenBai").value
      : "",
    diaChi: diaChi.value || "",
    ketQua: ketQua.value || "",
    fain: fain.value || "",
    dienTich: dienTich.value || "",
    bmCo: bmCo.checked,
    bmKhong: bmKhong.checked,
    keikakuCo: keikakuCo.checked,
    keikakuKhong: keikakuKhong.checked,
  };
  localStorage.setItem("projectOverview", JSON.stringify(data));
}

// Gắn sự kiện lưu dữ liệu cho các input còn lại
[ketQua, fain, dienTich].forEach((el) => {
  el.addEventListener("input", saveData);
});

// *** TÍNH NĂNG: Enter = Tab ***
document.querySelectorAll("input, select").forEach((el, index, elements) => {
  el.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const next = elements[index + 1];
      if (next) next.focus();
    }
  });
});
