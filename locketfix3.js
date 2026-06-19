/***********************************************
 > Author:  abcducanh
***********************************************/
// Updated Locket_fix.js
// ========= Đặt ngày tham gia là 25/11/2027 ========= //
var specificDate = "2099-11-25T00:00:00Z"; // Định dạng ISO 8601

// ========= ID Mapping ========= //
const mapping = {
  '%E8%BD%A6%E7%A5%A8%E7%A5%A8': ['vip+watch_vip'],
  'Locket': ['Gold'] // Đảm bảo rằng Locket Gold được sử dụng đúng cách
};

// ========= Kiểm tra và Khởi tạo ========= //
var ua = $request.headers["User-Agent"] || $request.headers["user-agent"];

// Bắt lỗi khi parsing response
try {
  var obj = JSON.parse($response.body);
} catch (e) {
  console.log("Error parsing response body:", e);
  $done({}); // Trả kết quả trống nếu lỗi xảy ra
}

// Đảm bảo các key cơ bản tồn tại
if (!obj.subscriber) obj.subscriber = {};
if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};

// ========= Tạo thông tin gói Locket Gold ========= //
var xunn = {
  is_sandbox: false,
  ownership_type: "PURCHASED",
  billing_issues_detected_at: null,
  period_type: "normal",
  expires_date: "3000-12-18T01:04:17Z", // Ngày hết hạn lâu dài
  grace_period_expires_date: null,
  unsubscribe_detected_at: null,
  original_purchase_date: specificDate,  // Ngày tham gia
  purchase_date: specificDate,          // Ngày mua
  store: "app_store"
};

var xunn_entitlement = {
  grace_period_expires_date: null,
  purchase_date: specificDate, // Ngày tham gia
  product_identifier: "com.xunn.premium.yearly",
  expires_date: "3000-12-18T01:04:17Z" // Ngày hết hạn lâu dài
};

// ========= Áp dụng Mapping ========= //
const match = Object.keys(mapping).find(e => ua.includes(e));

if (match) {
  let entitlementKey = mapping[match][0] || "Locket";
  let subscriptionKey = mapping[match][1] || "com.xunn.premium.yearly";

  obj.subscriber.subscriptions[subscriptionKey] = xunn;
  obj.subscriber.entitlements[entitlementKey] = xunn_entitlement;
} else {
  // Gán mặc định nếu không có khớp
  obj.subscriber.subscriptions["com.hoangvanbao.premium.yearly"] = xunn;
  obj.subscriber.entitlements["Locket"] = xunn_entitlement;
}

// ========= THÊM XỬ LÝ BADGE ========= //
function unlockBadges(data) {
  if (!data || typeof data !== 'object') return;
  
  for (let key in data) {
    let val = data[key];
    
    // Nếu key chứa "badge" hoặc "unlockable" hoặc "achievements"
    if (key === 'badge' || key === 'badges' || key === 'unlockable' || key === 'achievements') {
      if (Array.isArray(val)) {
        val.forEach(item => {
          if (typeof item === 'object') {
            item.unlocked = true;
            item.is_unlocked = true;
            item.active = true;
            item.locked = false;
            item.unlocked_at = new Date().toISOString();
            if (item.status) item.status = 'unlocked';
          }
        });
      } else if (typeof val === 'object') {
        val.unlocked = true;
        val.is_unlocked = true;
        val.active = true;
        val.locked = false;
        val.unlocked_at = new Date().toISOString();
        if (val.status) val.status = 'unlocked';
      }
    }
    
    // Nếu key chứa từ "badge"
    if (typeof key === 'string' && key.toLowerCase().includes('badge')) {
      if (typeof val === 'object') {
        val.unlocked = true;
        val.is_unlocked = true;
        val.active = true;
        val.locked = false;
        val.unlocked_at = new Date().toISOString();
      }
    }
    
    // Field locked/unlocked
    if (key === 'locked' || key === 'is_locked') data[key] = false;
    if (key === 'unlocked' || key === 'is_unlocked') data[key] = true;
    if (key === 'active' || key === 'is_active') data[key] = true;
    if (key === 'status' && (val === 'locked' || val === 'inactive')) data[key] = 'unlocked';
    
    // Đệ quy
    if (typeof val === 'object') {
      unlockBadges(val);
    }
  }
}

// Chạy hàm unlock badge trên toàn bộ obj
unlockBadges(obj);

// Nếu response có success false thì sửa
if (obj.success === false) obj.success = true;
if (obj.unlocked === false) obj.unlocked = true;
if (obj.status === 'error') obj.status = 'success';

// ========= Thêm thông báo và Log ========= //
obj.Attention = " Vui lòng không bán hoặc chia sẻ cho người khác!";
console.log("User-Agent:", ua);
console.log("Final Modified Response:", JSON.stringify(obj, null, 2));

// ========= Trả kết quả cuối cùng ========= //
$done({ body: JSON.stringify(obj) });
