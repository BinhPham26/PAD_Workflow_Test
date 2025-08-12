 function DMSStringToArcSeconds(dmsRaw) {
  if (!dmsRaw) return null;
  let dms = dmsRaw.replace(/′|’/g, "'").replace(/″|“|”|''/g, '"');
  const regex = /(-?)(\d+)°(\d+)'(\d+)?/;
  const match = dms.match(regex);
  if (!match) return null;
  const sign = match[1] === "-" ? -1 : 1;
  const deg = parseInt(match[2]);
  const min = parseInt(match[3]);
  const sec = match[4] ? parseInt(match[4]) : 0;
  return sign * (deg * 3600 + min * 60 + sec);
}

function arcSecondsToDMS(totalArcSeconds) {
  const sign = totalArcSeconds < 0 ? "-" : "";
  totalArcSeconds = Math.abs(totalArcSeconds);
  const degrees = Math.floor(totalArcSeconds / 3600);
  const remainingSec = totalArcSeconds - degrees * 3600;
  const minutes = Math.floor(remainingSec / 60);
  const seconds = remainingSec - minutes * 60;
  return `${sign}${degrees}°${minutes}'${seconds}''`;
}

function DMS_toCustomDecimal(dmsRaw) {
  if (!dmsRaw) return null;
  let dms = dmsRaw.replace(/′|’/g, "'").replace(/″|“|”|''/g, '"');
  const regex = /(-?)(\d+)°(\d+)'(\d+)?/;
  const match = dms.match(regex);
  if (!match) return null;
  const sign = match[1] === "-" ? -1 : 1;
  const deg = parseInt(match[2]);
  const min = parseInt(match[3]);
  const sec = match[4] ? parseInt(match[4]) : 0;
  return sign * (deg + min / 100 + sec / 10000);
}

function customDecimalToArcSeconds(decimal) {
  if (isNaN(decimal)) return null;
  const sign = decimal < 0 ? -1 : 1;
  decimal = Math.abs(decimal);
  const deg = Math.floor(decimal);
  const minDecimal = (decimal - deg) * 100;
  const min = Math.floor(minDecimal);
  const sec = Math.round((minDecimal - min) * 100);
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
    deg = parseInt(match[1]);
    min = parseInt(match[2]);
    sec = parseInt(match[3]);
  } else if (regex1.test(str)) {
    const match = str.match(regex1);
    deg = parseInt(match[1]);
    min = parseInt(match[2]);
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
  const degrees = Math.floor(val);
  const decimalPart = val - degrees;
  const minutes = Math.floor(decimalPart * 100);
  const seconds = Math.round((decimalPart * 100 - minutes) * 100);
  const dms = `${degrees}°${minutes}'${seconds}''`;
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

document.getElementById("input6").addEventListener("input", () => {
  const dmsInput4 = document.getElementById("input4").value;
  const val2Raw = document.getElementById("input6").value;
  const arc1 = DMSStringToArcSeconds(dmsInput4);
  const val2Decimal = parseCustomDegreeInput(val2Raw);
  const arc2 = customDecimalToArcSeconds(val2Decimal);
  if (arc1 === null || arc2 === null) {
    document.getElementById("input7").value = "Lỗi định dạng";
    return;
  }
  const diffArc = arc1 - arc2; // input6 - input5-5
  const dmsResult = arcSecondsToDMS(diffArc);
  const decimal = DMS_toCustomDecimal(dmsResult);
  document.getElementById("input7").value = dmsResult;
  document.getElementById("input8").value = decimal.toFixed(4);
  document.getElementById("input10").value = decimal.toFixed(4);
});
function parseHyphenDMS(str) {
  if (!str) return null;
  str = str.trim().replace(/\s+/g, "");
  // Cho phép dấu gạch ngang thường hoặc en-dash
  const m = str.match(/^(-?)(\d+)[-–](\d{1,2})[-–](\d{1,2})$/);
  if (!m) return null;

  const sign = m[1] === "-" ? -1 : 1;
  const deg = parseInt(m[2], 10);
  const min = parseInt(m[3], 10);
  const sec = parseInt(m[4], 10);

  // Kiểm tra hợp lệ phút/giây
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

  const diffArc = arcA - arcB;                // A - B
  const dmsResult = arcSecondsToDMS(diffArc); // dùng hàm sẵn có
  out.value = dmsResult;                       // ví dụ: 10°10'2''
}

// Tự động tính mỗi khi người dùng nhập
["inputA", "inputB"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", updateHoaGioCheck);
});
