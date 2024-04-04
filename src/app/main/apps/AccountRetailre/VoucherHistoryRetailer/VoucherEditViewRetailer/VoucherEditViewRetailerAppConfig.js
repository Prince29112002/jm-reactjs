import React from 'react';

export const VoucherEditViewRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/vouchereditviewretailer',
            component: React.lazy(() => import('./VoucherEditViewRetailer'))
        }
    ]
};
