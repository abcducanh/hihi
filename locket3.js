// LOCKET GOLD - FULL SCRIPT v5
if (typeof $response !== 'undefined') {
    try {
        let body = JSON.parse($response.body);
        
        if (body.subscriber) {
            body.subscriber.entitlements = {
                "locket_gold": {
                    "expires_date": "2099-12-31T23:59:59Z",
                    "product_identifier": "locket.gold.monthly",
                    "purchase_date": new Date().toISOString()
                },
                "premium": {
                    "expires_date": "2099-12-31T23:59:59Z",
                    "product_identifier": "locket.premium.monthly",
                    "purchase_date": new Date().toISOString()
                },
                "badge_locket_gold": {
                    "expires_date": "2099-12-31T23:59:59Z",
                    "product_identifier": "locket.badge.gold",
                    "purchase_date": new Date().toISOString()
                }
            };
            body.subscriber.subscriptions = {
                "locket.gold.monthly": {
                    "expires_date": "2099-12-31T23:59:59Z",
                    "purchase_date": new Date().toISOString(),
                    "original_purchase_date": new Date().toISOString(),
                    "store": "app_store",
                    "is_sandbox": false
                }
            };
            body.subscriber.verified = true;
        }
        
        function unlockBadges(obj) {
            if (!obj || typeof obj !== 'object') return;
            for (let key in obj) {
                let val = obj[key];
                if (key === 'badge' || key === 'badges' || key === 'unlockable') {
                    if (Array.isArray(val)) {
                        val.forEach(item => {
                            if (typeof item === 'object') {
                                item.unlocked = true;
                                item.is_unlocked = true;
                                item.active = true;
                                item.unlocked_at = new Date().toISOString();
                                item.locked = false;
                                if (item.status) item.status = 'unlocked';
                            }
                        });
                    } else if (typeof val === 'object') {
                        val.unlocked = true;
                        val.is_unlocked = true;
                        val.active = true;
                        val.unlocked_at = new Date().toISOString();
                        val.locked = false;
                    }
                }
                if (key === 'locked' || key === 'is_locked') obj[key] = false;
                if (key === 'unlocked' || key === 'is_unlocked') obj[key] = true;
                if (key === 'status' && (val === 'locked' || val === 'inactive')) obj[key] = 'unlocked';
                if (typeof val === 'object') unlockBadges(val);
            }
        }
        unlockBadges(body);
        
        if (body.success === false) body.success = true;
        if (body.unlocked === false) body.unlocked = true;
        
        $done({ body: JSON.stringify(body) });
    } catch(e) {
        $done({});
    }
} else {
    $done({});
}
