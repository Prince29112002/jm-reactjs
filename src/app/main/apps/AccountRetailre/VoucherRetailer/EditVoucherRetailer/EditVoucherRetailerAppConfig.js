import React from 'react';

export const EditVoucherRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/voucherlistretailer/editvoucherretailer',
            component: React.lazy(() => import('./EditVoucherRetailer'))
        },
        {
            path     : '/dashboard/accountretailer/otheraccvoucherretailer/editvoucherretailer',
            component: React.lazy(() => import('./EditVoucherRetailer'))
        }
    ]
};
