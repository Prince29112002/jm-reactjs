import React from 'react';
export const VoucherEditViewAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/vouchereditview',
            component: React.lazy(() => import('./VoucherEditView'))
        }
    ]
};