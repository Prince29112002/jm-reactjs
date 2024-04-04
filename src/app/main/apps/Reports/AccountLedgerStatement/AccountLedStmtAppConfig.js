import React from 'react';
export const AccountLedStmtAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reports/accountledger',
            component: React.lazy(() => import('./AccountLedgerStatement'))
        }
    ]
};
