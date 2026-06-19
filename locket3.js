/***********************************************
 * LOCKET GOLD - Premium + Badge Unlock
 * Tối ưu cho Shadowrocket / Surge
 ***********************************************/

// ========== CẤU HÌNH NGÀY ==========
var joinDate = "2099-12-25T00:00:00Z";
var expireDate = "2099-12-31T23:59:59Z";

// ============================================

if (typeof $response !== 'undefined') {
    try {
        let body = JSON.parse($response.body);

        // Đảm bảo subscriber tồn tại
        if (!body.subscriber) body.subscriber = {};
        if (!body.subscriber.entitlements) body.subscriber.entitlements = {};
        if (!body.subscriber.subscriptions) body.subscriber.subscriptions = {};

        // ====== 1. FAKE PREMIUM ======
        body.subscriber.entitlements["locket_gold"] = {
            "expires_date": expireDate,
            "product_identifier": "locket.gold.monthly",
            "purchase_date": joinDate
        };

        body.subscriber.entitlements["premium"] = {
            "expires_date": expireDate,
            "product_identifier": "locket.premium.monthly",
            "purchase_date": joinDate
        };

        body.subscriber.subscriptions["locket.gold.monthly"] = {
            "expires_date": expireDate,
            "purchase_date": joinDate,
            "original_purchase_date": joinDate,
            "store": "app_store",
            "is_sandbox": false,
            "ownership_type": "PURCHASED",
            "period_type": "normal"
        };

        body.subscriber.subscriptions["locket.premium.monthly"] = {
            "expires_date": expireDate,
            "purchase_date": joinDate,
            "original_purchase_date": joinDate,
            "store": "app_store",
            "is_sandbox": false,
            "ownership_type": "PURCHASED",
            "period_type": "normal"
        };

        if (body.subscriber.first_seen) {
            body.subscriber.first_seen = joinDate;
        }
        body.subscriber.verified = true;

        // ====== 2. UNLOCK BADGE ======
        function unlockBadges(obj) {
            if (!obj || typeof obj !== 'object') return;

            for (let key in obj) {
                let val = obj[key];

                // Nếu key chứa "badge" hoặc "unlockable"
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
                if (key === 'locked' || key === 'is_locked') obj[key] = false;
                if (key === 'unlocked' || key === 'is_unlocked') obj[key] = true;
                if (key === 'active' || key === 'is_active') obj[key] = true;
                if (key === 'status' && (val === 'locked' || val === 'inactive')) obj[key] = 'unlocked';

                // Đệ quy
                if (typeof val === 'object') {
                    unlockBadges(val);
                }
            }
        }

        // Chạy hàm unlock badge
        unlockBadges(body);

        // ====== 3. Nếu response có success false thì sửa ======
        if (body.success === false) body.success = true;
        if (body.unlocked === false) body.unlocked = true;
        if (body.status === 'error') body.status = 'success';

        // ====== 4. Trả về ======
        $done({ body: JSON.stringify(body) });

    } catch (e) {
        $done({});
    }
} else {
    $done({});
}
