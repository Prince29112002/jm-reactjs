import React from 'react';

export const LedgerRepAccRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/ledgerrepaccretailer',
            component: React.lazy(() => import('./LedgerRepAccRetailer'))
        }
    ]
};
