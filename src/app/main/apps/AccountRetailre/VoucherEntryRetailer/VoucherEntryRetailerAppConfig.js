import React from 'react';

export const VoucherEntryRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/voucherentryretailer',
            component: React.lazy(() => import('./VoucherEntryRetailer'))
        }
    ]
};
