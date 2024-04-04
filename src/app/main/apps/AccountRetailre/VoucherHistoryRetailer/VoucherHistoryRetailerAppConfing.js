import React from 'react';

export const VoucherHistoryRetailerAppConfing = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/voucherhistoryretailer',
            component: React.lazy(() => import('./VoucherHistoryRetailer'))
        }
    ]
};
