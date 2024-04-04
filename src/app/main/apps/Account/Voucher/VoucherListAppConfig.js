import React from 'react';
export const VoucherListAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/voucherlist',
            component: React.lazy(() => import('./VoucherList'))
        }
    ]
};
