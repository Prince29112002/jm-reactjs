import React from 'react';
export const DeletedVoucherAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/deletedvoucher',
            component: React.lazy(() => import('./DeletedVoucher'))
        }
    ]
};
