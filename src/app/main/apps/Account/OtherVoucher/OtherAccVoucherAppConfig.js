import React from 'react';
export const OtherAccVoucherAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/othervoucherlist',
            component: React.lazy(() => import('./OtherAccVoucher'))
        }
    ]
};