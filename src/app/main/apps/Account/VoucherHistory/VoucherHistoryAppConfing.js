import React from 'react';
export const VoucherHistoryAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/voucherhistory',
            component: React.lazy(() => import('./VoucherHistory'))
        }
    ]
};
