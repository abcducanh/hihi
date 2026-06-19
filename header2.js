// deleteHeader.js - NightmarketServer
// Updated - Xóa tracking headers

const version = 'V1.0.4';

function setHeaderValue(e, a, d) {
  var r = a.toLowerCase();
  r in e ? e[r] = d : e[a] = d;
}

var modifiedHeaders = $request.headers || {};

// Xóa ETag - tránh cache
setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");

// Xóa thêm 1 số header tracking khác (tùy chọn)
setHeaderValue(modifiedHeaders, "If-None-Match", "");
setHeaderValue(modifiedHeaders, "X-Client-Version", "");
setHeaderValue(modifiedHeaders, "X-Device-Id", "");

console.log("Headers cleaned:", JSON.stringify(modifiedHeaders));

$done({ headers: modifiedHeaders });
