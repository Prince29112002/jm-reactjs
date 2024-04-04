import React from 'react';

export const DebitCreditRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/debitcreditretailer',
            component: React.lazy(() => import('./DebitCreditRetailer'))
        }
    ]
};
