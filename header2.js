// deleteHeader.js - Xóa header tracking

function setHeaderValue(headers, key, value) {
    var lowerKey = key.toLowerCase();
    if (lowerKey in headers) {
        headers[lowerKey] = value;
    } else {
        headers[key] = value;
    }
}

var modifiedHeaders = $request.headers || {};

// Xóa cache headers
setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");
setHeaderValue(modifiedHeaders, "If-None-Match", "");
setHeaderValue(modifiedHeaders, "Cache-Control", "no-cache");
setHeaderValue(modifiedHeaders, "Pragma", "no-cache");

// Xóa tracking headers
setHeaderValue(modifiedHeaders, "X-Client-Version", "");
setHeaderValue(modifiedHeaders, "X-Device-Id", "");
setHeaderValue(modifiedHeaders, "X-Installation-Id", "");

$done({ headers: modifiedHeaders });
