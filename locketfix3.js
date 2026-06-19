/***********************************************
 > Author:  abcducanh
 > Locket Gold + Badge - Merge an toàn
***********************************************/

var specificDate = "2099-11-25T00:00:00Z";
var url = $request ? $request.url : '';

// ====== HÀM UNLOCK BADGE ======
function unlockBadges(obj) {
    if (!obj || typeof obj !== 'object') return;
    for (let key in obj) {
        let val = obj[key];
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
        if (typeof key === 'string' && key.toLowerCase().includes('badge')) {
            if (typeof val === 'object') {
                val.unlocked = true;
                val.is_unlocked = true;
                val.active = true;
                val.locked = false;
            }
        }
        if (key === 'locked' || key === 'is_locked') obj[key] = false;
        if (key === 'unlocked' || key === 'is_unlocked') obj[key] = true;
        if (key === 'status' && (val === 'locked' || val === 'inactive')) obj[key] = 'unlocked';
        if (typeof val === 'object') unlockBadges(val);
    }
}

// ====== XỬ LÝ RESPONSE ======
if (typeof $response !== 'undefined') {
    try {
        var obj = JSON.parse($response.body);
        var hasSubscriber = (obj.subscriber !== undefined);
        var hasBadge = (obj.badge !== undefined || obj.badges !== undefined || obj.unlockable !== undefined);
        var isLocketApi = (url && url.includes('api.locketcamera.com'));
        
        // ====== 1. XỬ LÝ LOCKET API (Badge) ======
        if (isLocketApi) {
            unlockBadges(obj);
            
            if (obj.user) {
                obj.user.is_gold = true;
                obj.user.has_badge = true;
                obj.user.is_premium = true;
                obj.user.gold_since = specificDate;
            }
            if (obj.profile) {
                obj.profile.is_gold = true;
                obj.profile.has_badge = true;
                obj.profile.is_premium = true;
            }
            if (obj.data) {
                if (obj.data.user) {
                    obj.data.user.is_gold = true;
                    obj.data.user.has_badge = true;
                }
                if (obj.data.profile) {
                    obj.data.profile.is_gold = true;
                    obj.data.profile.has_badge = true;
                }
            }
            
            if (obj.success === false) obj.success = true;
            if (obj.unlocked === false) obj.unlocked = true;
            
            $done({ body: JSON.stringify(obj) });
            return;
        }
        
        // ====== 2. XỬ LÝ REVENUECAT (Gold) ======
        if (hasSubscriber) {
            if (!obj.subscriber) obj.subscriber = {};
            if (!obj.subscriber.entitlements) obj.subscriber.entitlements = {};
            if (!obj.subscriber.subscriptions) obj.subscriber.subscriptions = {};
            
            var xunn = {
                is_sandbox: false,
                ownership_type: "PURCHASED",
                billing_issues_detected_at: null,
                period_type: "normal",
                expires_date: "3000-12-18T01:04:17Z",
                grace_period_expires_date: null,
                unsubscribe_detected_at: null,
                original_purchase_date: specificDate,
                purchase_date: specificDate,
                store: "app_store"
            };
            
            var xunn_entitlement = {
                grace_period_expires_date: null,
                purchase_date: specificDate,
                product_identifier: "com.xunn.premium.yearly",
                expires_date: "3000-12-18T01:04:17Z"
            };
            
            obj.subscriber.subscriptions["com.xunn.premium.yearly"] = xunn;
            obj.subscriber.entitlements["Locket"] = xunn_entitlement;
            
            if (!obj.subscriber.entitlements["badge_locket_gold"]) {
                obj.subscriber.entitlements["badge_locket_gold"] = {
                    expires_date: "3000-12-18T01:04:17Z",
                    product_identifier: "locket.badge.gold",
                    purchase_date: specificDate
                };
            }
            
            obj.subscriber.verified = true;
            if (obj.subscriber.first_seen) obj.subscriber.first_seen = specificDate;
        }
        
        // ====== 3. UNLOCK BADGE NẾU CÓ ======
        if (hasBadge) {
            unlockBadges(obj);
        }
        
        // ====== 4. FIX FLAGS ======
        if (obj.success === false) obj.success = true;
        if (obj.unlocked === false) obj.unlocked = true;
        if (obj.status === 'error') obj.status = 'success';
        
        // ====== 5. TRẢ VỀ ======
        $done({ body: JSON.stringify(obj) });
        
    } catch (e) {
        console.log("Script error:", e);
        $done({});
    }
} else {
    $done({});
}
