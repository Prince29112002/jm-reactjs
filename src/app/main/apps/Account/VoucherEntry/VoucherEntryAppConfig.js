import React from 'react';
export const VoucherEntryAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/voucherentry',
            component: React.lazy(() => import('./VoucherEntry'))
        }
    ]
};
