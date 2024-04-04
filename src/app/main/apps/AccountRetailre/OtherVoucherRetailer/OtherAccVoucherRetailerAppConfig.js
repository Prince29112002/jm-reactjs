import React from 'react';

export const OtherAccVoucherRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/otheraccvoucherretailer',
            component: React.lazy(() => import('./OtherAccVoucherRetailer'))
        }
    ]
};
