import React from 'react';

export const DeleteVoucherRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/deletevoucherretailer',
            component: React.lazy(() => import('./DeleteVoucherRetailer'))
        }
    ]
};
