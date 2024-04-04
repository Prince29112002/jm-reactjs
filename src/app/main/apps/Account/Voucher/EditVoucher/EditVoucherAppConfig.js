import React from 'react';
export const EditVoucherAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/editvoucher',
            component: React.lazy(() => import('./EditVoucher'))
        }
    ]
};
