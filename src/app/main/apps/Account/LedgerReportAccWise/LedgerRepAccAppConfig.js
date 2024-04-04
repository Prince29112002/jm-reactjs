import React from 'react';
export const LedgerRepAccAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/ledgerreportledger',
            component: React.lazy(() => import('./LedgerRepAcc'))
        }
    ]
};
