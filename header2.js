// deleteHeader.js - Xóa header tracking để tránh bị phát hiện

function setHeaderValue(headers, key, value) {
    var lowerKey = key.toLowerCase();
    if (lowerKey in headers) {
        headers[lowerKey] = value;
    } else {
        headers[key] = value;
    }
}

var modifiedHeaders = $request.headers || {};

// Xóa các header tracking
setHeaderValue(modifiedHeaders, "X-RevenueCat-ETag", "");
setHeaderValue(modifiedHeaders, "If-None-Match", "");
setHeaderValue(modifiedHeaders, "X-Client-Version", "");
setHeaderValue(modifiedHeaders, "X-Device-Id", "");
setHeaderValue(modifiedHeaders, "X-Installation-Id", "");

$done({ headers: modifiedHeaders });
