import React from 'react';

export const VoucherListRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/voucherlistretailer',
            component: React.lazy(() => import('./VoucherListRetailer'))
        }
    ]
};
