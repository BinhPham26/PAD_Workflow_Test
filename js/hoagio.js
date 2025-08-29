function DMSStringToArcSeconds(dmsRaw) {
  if (!dmsRaw) return null;
  let dms = dmsRaw.replace(/′|’/g, "'").replace(/″|“|”|''/g, '"').trim();
  const regex = /^(-?)(\d+)°(\d+)'(\d+)?/;
  const match = dms.match(regex);
  if (!match) return null;
  const sign = match[1] === "-" ? -1 : 1;
  const deg = parseInt(match[2], 10);
  const min = parseInt(match[3], 10);
  const sec = match[4] ? parseInt(match[4], 10) : 0;
  if (min >= 60 || sec >= 60) return null;
  return sign * (deg * 3600 + min * 60 + sec);
}

function arcSecondsToDMS(totalArcSeconds) {
  const sign = totalArcSeconds < 0 ? "-" : "";
  totalArcSeconds = Math.abs(totalArcSeconds);

  let degrees = Math.floor(totalArcSeconds / 3600);
  let remainingSec = totalArcSeconds - degrees * 3600;
  let minutes = Math.floor(remainingSec / 60);
  let seconds = Math.round(remainingSec - minutes * 60);

  if (seconds === 60) { seconds = 0; minutes += 1; }
  if (minutes === 60) { minutes = 0; degrees += 1; }

  return `${sign}${degrees}°${minutes}'${seconds}''`;
}

function DMS_toCustomDecimal(dmsRaw) {
  if (!dmsRaw) return null;
  let dms = dmsRaw.replace(/′|’/g, "'").replace(/″|“|”|''/g, '"');
  const regex = /(-?)(\d+)°(\d+)'(\d+)?/;
  const match = dms.match(regex);
  if (!match) return null;
  const sign = match[1] === "-" ? -1 : 1;
  const deg = parseInt(match[2], 10);
  const min = parseInt(match[3], 10);
  const sec = match[4] ? parseInt(match[4], 10) : 0;
  return sign * (deg + min / 100 + sec / 10000);
}

function customDecimalToArcSeconds(decimal) {
  if (decimal === null || decimal === undefined || isNaN(decimal)) return null;
  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);

  const deg = Math.floor(decimal);
  const minDecimal = (decimal - deg) * 100;
  let min = Math.floor(minDecimal);
  let sec = Math.round((minDecimal - min) * 100);

  if (sec === 100) { sec = 0; min += 1; }
  if (min === 60) { min = 0; return sign * ((deg + 1) * 3600); }

  return sign * (deg * 3600 + min * 60 + sec);
}

function parseCustomDegreeInput(str) {
  if (!str) return null;
  str = str
    .trim()
    .replace(/′|’/g, "'")
    .replace(/″|“|”|''/g, '"');
  const regex1 = /^(-?\d+)\*(\d+)'?$/;
  const regex2 = /^(-?\d+)\*(\d+)\*(\d+)"?$/;
  let deg = 0, min = 0, sec = 0;
  if (regex2.test(str)) {
    const match = str.match(regex2);
    deg = parseInt(match[1], 10);
    min = parseInt(match[2], 10);
    sec = parseInt(match[3], 10);
  } else if (regex1.test(str)) {
    const match = str.match(regex1);
    deg = parseInt(match[1], 10);
    min = parseInt(match[2], 10);
  } else if (!isNaN(parseFloat(str))) {
    return parseFloat(str);
  } else {
    return null;
  }
  const sign = deg < 0 ? -1 : 1;
  deg = Math.abs(deg);
  return sign * (deg + min / 100 + sec / 10000);
}

document.getElementById("input1").addEventListener("input", () => {
  const val = parseFloat(document.getElementById("input1").value);
  if (isNaN(val)) return;

  const sign = val < 0 ? "-" : "";
  const abs = Math.abs(val);
  const degrees = Math.floor(abs);
  const decimalPart = abs - degrees;

  let minutes = Math.floor(decimalPart * 100 + 1e-9);
  let seconds = Math.round(((decimalPart * 100) - minutes) * 100);

  if (seconds === 100) { seconds = 0; minutes += 1; }
  if (minutes === 60) { minutes = 0; degrees += 1; }

  const dms = `${sign}${degrees}°${minutes}'${seconds}''`;
  document.getElementById("input2").value = dms;
});

document.getElementById("input3").addEventListener("input", () => {
  const dms1 = document.getElementById("input2").value;
  const dms2 = document.getElementById("input3").value;
  const arc1 = DMSStringToArcSeconds(dms1);
  const arc2 = DMSStringToArcSeconds(dms2);
  if (arc1 === null || arc2 === null) {
    document.getElementById("input4").value = "Lỗi định dạng";
    return;
  }
  const totalArc = arc1 + arc2;
  const dmsResult = arcSecondsToDMS(totalArc);
  const customDecimal = DMS_toCustomDecimal(dmsResult);
  document.getElementById("input4").value = dmsResult;
  document.getElementById("input5").value = customDecimal.toFixed(4);
  document.getElementById("input9").value = customDecimal.toFixed(4);
  document.getElementById("input5-5").value = dmsResult;
});

document.getElementById("input4").addEventListener("input", () => {
  const dms = document.getElementById("input4").value;
  const decimal = DMS_toCustomDecimal(dms);
  document.getElementById("input5").value = decimal !== null ? decimal.toFixed(4) : "Lỗi";
  document.getElementById("input9").value = decimal !== null ? decimal.toFixed(4) : "Lỗi";
  document.getElementById("input5-5").value = dms;
});

function DMSStringToArcSeconds(input) {
  if (!input) return null;
  const s = String(input).trim();

  // Bắt dấu và hướng
  let sign = 1;
  if (/[-]/.test(s) || /[SW]\b/i.test(s)) sign = -1;

  // Lấy 3 số d, m, s (có thể thiếu)
  // Chấp nhận các phân cách: ° ' " * khoảng trắng
  const parts = s
    .replace(/[NSEWnsew]/g, "")
    .replace(/[^\d.+-]+/g, " ")
    .trim()
    .split(/\s+/)
    .map(Number)
    .filter(n => !Number.isNaN(n));

  if (parts.length === 0) return null;

  const d = parts[0] ?? 0;
  const m = parts[1] ?? 0;
  const sec = parts[2] ?? 0;

  if ([d, m, sec].some(n => !isFinite(n))) return null;
  if (m < 0 || m >= 60 || sec < 0 || sec >= 60) return null;

  const arc = (Math.abs(d) * 3600) + (m * 60) + sec;
  return sign * arc;
}

// 2) “Số độ tùy chỉnh” parser
//    Nhận các kiểu: 
//    - "d*m*s*" hoặc "d m s"  -> hiểu là DMS
//    - "mm.ss" (không có độ)  -> hiểu là phút.giây (0–59.99)
//    - số thuần               -> hiểu là độ THẬP PHÂN (decimal degrees)
function parseCustomDegreeInput(raw) {
  if (raw == null) return null;
  const str = String(raw).trim();
  if (str === "") return null;

  // Nếu có ký hiệu / phân cách DMS thì chuyển như DMS
  if (/[°'"\*]/.test(str) || /^\s*\d+(\s+\d+){1,2}\s*$/.test(str)) {
    const as = DMSStringToArcSeconds(str);
    if (as == null) return null;
    // Trả về “độ tùy chỉnh” D.mmss
    return arcSecondsToCustomDecimal(as);
  }

  // Nếu dạng mm.ss (chỉ 0–59.xx) -> hiểu là phút.giây
  if (/^\-?\d+(\.\d+)?$/.test(str)) {
    const num = Number(str);
    if (!isFinite(num)) return null;
    // nếu |num| < 60 coi là mm.ss (phút.giây)
    if (Math.abs(num) < 60) {
      const sign = num < 0 ? -1 : 1;
      const abs = Math.abs(num);
      const mm = Math.trunc(abs);
      const frac = abs - mm;
      // giải thích .ss là giây 2 chữ số (sexagesimal nén), ví dụ 30.25 -> 30 phút 25 giây
      const ss = Math.round(frac * 100);
      if (mm >= 60 || ss >= 60) return null;
      // chuyển thành “độ tùy chỉnh” D.mmss với D=0
      return sign * (0 + (mm * 100 + ss) / 10000);
    }
    // Ngược lại: hiểu là ĐỘ THẬP PHÂN (decimal degrees)
    return num;
  }

  return null;
}

// 3) custom decimal (D.mmss) -> arc-seconds
function customDecimalToArcSeconds(customDeg) {
  if (customDeg == null || !isFinite(customDeg)) return null;
  const sign = customDeg < 0 ? -1 : 1;
  const abs = Math.abs(customDeg);
  const D = Math.trunc(abs);
  const frac = abs - D;
  const mmss = Math.round(frac * 10000);
  const M = Math.floor(mmss / 100);
  const S = mmss % 100;
  if (M >= 60 || S >= 60) return null;
  const arc = D * 3600 + M * 60 + S;
  return sign * arc;
}

// 4) arc-seconds -> DMS string "±DD°MM'SS.SS\""
function arcSecondsToDMS(arc) {
  if (arc == null || !isFinite(arc)) return "";
  const sign = arc < 0 ? "-" : "";
  let abs = Math.abs(arc);

  // làm tròn giây đến 2 chữ số thập phân để tránh lỗi float
  let D = Math.floor(abs / 3600);
  abs -= D * 3600;
  let M = Math.floor(abs / 60);
  let S = abs - M * 60;

  // xử lý dồn số khi S ~ 60 do làm tròn
  S = Math.round(S * 100) / 100;
  if (S >= 60) { S -= 60; M += 1; }
  if (M >= 60) { M -= 60; D += 1; }

  const SS = S.toFixed(2).padStart(5, "0"); // "00.00" đến "59.99"
  const MM = String(M).padStart(2, "0");
  const DD = String(D);

  return `${sign}${DD}°${MM}'${SS}"`;
}

// 5) DMS -> custom decimal (D.mmss)
function DMS_toCustomDecimal(dmsString) {
  const arc = DMSStringToArcSeconds(dmsString);
  if (arc == null) return null;
  return arcSecondsToCustomDecimal(arc);
}

// 6) arc-seconds -> custom decimal (D.mmss)
function arcSecondsToCustomDecimal(arc) {
  const sign = arc < 0 ? -1 : 1;
  let abs = Math.abs(arc);
  let D = Math.floor(abs / 3600);
  abs -= D * 3600;
  let M = Math.floor(abs / 60);
  let S = Math.round((abs - M * 60)); // làm tròn giây về số nguyên để xuất mmss

  if (S >= 60) { S -= 60; M += 1; }
  if (M >= 60) { M -= 60; D += 1; }

  const mmss = (M * 100 + S); // nén phút & giây thành 4 chữ số
  const custom = D + mmss / 10000;
  return sign * custom;
}

// ====== WIRING VÀO INPUTS ======
document.getElementById("input6").addEventListener("input", () => {
  const dmsLeft = document.getElementById("input5-5").value; // vế trái: DMS
  const rawRight = document.getElementById("input6").value;  // vế phải: mm.ss | d*m*s* | số

  // 1) Quy về cung giây
  const arcLeft = DMSStringToArcSeconds(dmsLeft);
  const rightCustomDecimal = parseCustomDegreeInput(rawRight);   // -> “độ tùy chỉnh” D.mmss
  const arcRight = (rightCustomDecimal == null) ? null : customDecimalToArcSeconds(rightCustomDecimal);

  // 2) Kiểm tra lỗi
  if (arcLeft === null || arcRight === null) {
    document.getElementById("input7").value  = "Lỗi định dạng";
    document.getElementById("input8").value  = "";
    document.getElementById("input10").value = "";
    return;
  }

  // 3) Tính hiệu (trên cung giây)
  const diffArc = arcLeft - arcRight;

  // 4) Đổi ngược ra DMS & “độ tùy chỉnh” (D.mmss)
  const dmsResult = arcSecondsToDMS(diffArc);
  const customDecimal = arcSecondsToCustomDecimal(diffArc);

  // 5) Đẩy kết quả
  document.getElementById("input7").value  = dmsResult;                // DMS
  document.getElementById("input8").value  = customDecimal.toFixed(4); // D.mmss
  document.getElementById("input10").value = customDecimal.toFixed(4); // mirror
});

function parseHyphenDMS(str) {
  if (!str) return null;
  str = str.trim().replace(/\s+/g, "");
  const m = str.match(/^(-?)(\d+)[-–](\d{1,2})[-–](\d{1,2})$/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  const deg = parseInt(m[2], 10);
  const min = parseInt(m[3], 10);
  const sec = parseInt(m[4], 10);
  if (min >= 60 || sec >= 60) return null;
  return sign * (deg * 3600 + min * 60 + sec);
}

function updateHoaGioCheck() {
  const a = document.getElementById("inputA").value;
  const b = document.getElementById("inputB").value;
  const out = document.getElementById("inputC");

  if (!a || !b) { out.value = ""; return; }

  const arcA = parseHyphenDMS(a);
  const arcB = parseHyphenDMS(b);

  if (arcA === null || arcB === null) {
    out.value = "Lỗi định dạng (ví dụ: 214-12-14)";
    return;
  }

  const diffArc = arcA - arcB;
  const dmsResult = arcSecondsToDMS(diffArc);
  out.value = dmsResult;
}

["inputA", "inputB"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", updateHoaGioCheck);
});
