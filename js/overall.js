/*
  Merged & fixed script to remove conflicts between the two original snippets.
  - Unifies save/load into a single storage object (localStorage key: "projectOverview").
  - Keeps backwards compatibility with older individual keys (ggmap, dienTich, shinhoku, jihoku).
  - Avoids duplicate global function names (no more two saveData() functions).
  - Wraps everything in DOMContentLoaded so elements exist before use.
  - Removes duplicate click-handler for .btn-ggmap and normalizes URL.

  Replace your two existing scripts with this single script (or include this at the end of <body>),
  and remove the old blocks to avoid duplicate listeners / name collisions.
*/

document.addEventListener("DOMContentLoaded", () => {
  // --- Elements ---
  const ggmapInput = document.getElementById("ggmap");
  const ggmapBtn = document.querySelector(".btn-ggmap");

  const soDuAn = document.getElementById("soDuAn");
  const tenDuAn = document.getElementById("tenDuAn");
  const diaChi = document.getElementById("diaChi");
  const ketQua = document.getElementById("ketQua");
  const fain = document.getElementById("fain");
  const dienTich = document.getElementById("dienTich");
  const shinhoku = document.getElementById("shinhoku");
  const jihoku = document.getElementById("jihoku");

  const bmCo = document.getElementById("bmCo");
  const bmKhong = document.getElementById("bmKhong");
  const keikakuCo = document.getElementById("keikakuCo");
  const keikakuKhong = document.getElementById("keikakuKhong");
  const tenBaiInput = document.getElementById("tenBai");

  // --- Province map (unchanged) ---
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

  function safeValue(val) {
    return val && val !== "undefined" ? val : "";
  }

  // --- Normalize URL helper ---
  function normalizeUrl(url) {
    if (!url) return "";
    url = String(url).trim();
    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    return url;
  }

  // --- Unified save/load (single source of truth) ---
  function saveProjectOverview() {
    const data = {
      ggmap: ggmapInput ? ggmapInput.value : "",
      dienTich: dienTich ? dienTich.value : "",
      shinhoku: shinhoku ? shinhoku.value : "",
      jihoku: jihoku ? jihoku.value : "",
      soDuAn: soDuAn ? soDuAn.value : "",
      tenDuAn: tenDuAn ? tenDuAn.value : "",
      tenBai: tenBaiInput ? tenBaiInput.value : "",
      diaChi: diaChi ? diaChi.value : "",
      ketQua: ketQua ? ketQua.value : "",
      fain: fain ? fain.value : "",
      bmCo: bmCo ? bmCo.checked : false,
      bmKhong: bmKhong ? bmKhong.checked : false,
      keikakuCo: keikakuCo ? keikakuCo.checked : false,
      keikakuKhong: keikakuKhong ? keikakuKhong.checked : false,
    };

    try {
      localStorage.setItem("projectOverview", JSON.stringify(data));
      // keep backward-compatible single keys that older code might rely on
      if (ggmapInput) localStorage.setItem("ggmap", ggmapInput.value);
      if (dienTich) localStorage.setItem("dienTich", dienTich.value);
      if (shinhoku) localStorage.setItem("shinhoku", shinhoku.value);
      if (jihoku) localStorage.setItem("jihoku", jihoku.value);
    } catch (err) {
      console.warn("Could not save to localStorage:", err);
    }
  }

  function loadProjectOverview() {
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem("projectOverview")) || {};
    } catch (err) {
      saved = {};
    }

    // If projectOverview is empty, fallback to old individual keys
    if (!Object.keys(saved).length) {
      saved.ggmap = localStorage.getItem("ggmap") || "";
      saved.dienTich = localStorage.getItem("dienTich") || "";
      saved.shinhoku = localStorage.getItem("shinhoku") || "";
      saved.jihoku = localStorage.getItem("jihoku") || "";
    }

    if (ggmapInput) ggmapInput.value = saved.ggmap || "";
    if (dienTich) dienTich.value = safeValue(saved.dienTich);
    if (shinhoku) shinhoku.value = safeValue(saved.shinhoku);
    if (jihoku) jihoku.value = safeValue(saved.jihoku);

    if (soDuAn) soDuAn.value = safeValue(saved.soDuAn);
    if (tenDuAn) tenDuAn.value = safeValue(saved.tenDuAn);
    if (tenBaiInput) tenBaiInput.value = safeValue(saved.tenBai || saved.tenDuAn);

    if (diaChi) diaChi.value = safeValue(saved.diaChi);
    if (ketQua) ketQua.value = safeValue(saved.ketQua);

    if (fain) fain.value = safeValue(saved.fain) || "アイ工務店様";

    if (bmCo) bmCo.checked = !!saved.bmCo;
    if (bmKhong) bmKhong.checked = !!saved.bmKhong;
    if (keikakuCo) keikakuCo.checked = !!saved.keikakuCo;
    if (keikakuKhong) keikakuKhong.checked = !!saved.keikakuKhong;

    // If diaChi exists but ketQua empty, compute it
    if (diaChi && ketQua && !ketQua.value) {
      const prefix = diaChi.value.slice(0, 4);
      let matched = "";
      Object.keys(provinceMap).forEach((key) => {
        if (prefix.startsWith(key)) matched = provinceMap[key];
      });
      ketQua.value = matched || "";
    }

    // Set ggmap button href if available
    if (ggmapBtn && ggmapInput && ggmapInput.value.trim()) {
      ggmapBtn.setAttribute("href", normalizeUrl(ggmapInput.value));
    }
  }

  // --- Event listeners (all using saveProjectOverview) ---

  // GGMap: update href live and open safely on click
  if (ggmapInput) {
    ggmapInput.addEventListener("input", () => {
      if (ggmapBtn) {
        const url = ggmapInput.value.trim();
        if (url) ggmapBtn.setAttribute("href", normalizeUrl(url));
        else ggmapBtn.removeAttribute("href");
      }
      saveProjectOverview();
    });
  }

  if (ggmapBtn) {
    ggmapBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const url = normalizeUrl(ggmapInput ? ggmapInput.value : "");
      if (!url) {
        alert("Vui lòng nhập link Google Map!");
        if (ggmapInput) ggmapInput.focus();
        return;
      }
      try {
        new URL(url);
      } catch (err) {
        alert("Link không hợp lệ. Vui lòng kiểm tra lại!");
        return;
      }
      ggmapBtn.setAttribute("href", url);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  // soDuAn: numeric only, max 4 digits
  if (soDuAn) {
    soDuAn.addEventListener("input", () => {
      soDuAn.value = soDuAn.value.replace(/\D/g, "").slice(0, 4);
      saveProjectOverview();
    });
  }

  // BM toggles (mutually exclusive)
  if (bmCo && bmKhong) {
    [bmCo, bmKhong].forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) [bmCo, bmKhong].forEach((other) => { if (other !== cb) other.checked = false; });
        saveProjectOverview();
      });
    });
  }

  // Keikaku toggles (mutually exclusive)
  if (keikakuCo && keikakuKhong) {
    [keikakuCo, keikakuKhong].forEach((cb) => {
      cb.addEventListener("change", () => {
        if (cb.checked) [keikakuCo, keikakuKhong].forEach((other) => { if (other !== cb) other.checked = false; });
        saveProjectOverview();
      });
    });
  }

  // diaChi -> ketQua auto update
  if (diaChi) {
    diaChi.addEventListener("input", () => {
      const prefix = diaChi.value.slice(0, 4);
      let matched = "";
      Object.keys(provinceMap).forEach((key) => {
        if (prefix.startsWith(key)) matched = provinceMap[key];
      });
      if (ketQua) ketQua.value = matched || "";
      saveProjectOverview();
    });
  }

  // tenDuAn -> tenBai sync
  if (tenDuAn) {
    tenDuAn.addEventListener("input", () => {
      if (tenBaiInput) tenBaiInput.value = tenDuAn.value;
      saveProjectOverview();
    });
  }

  // 기타 inputs attach save
  [ketQua, fain, dienTich, shinhoku, jihoku].forEach((el) => {
    if (!el) return;
    el.addEventListener("input", saveProjectOverview);
  });

  // Enter => Tab behavior
  document.querySelectorAll("input, select").forEach((el, index, elements) => {
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const next = elements[index + 1];
        if (next) next.focus();
      }
    });
  });

  // Load saved values now
  loadProjectOverview();
});
