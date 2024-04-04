import React from 'react';
export const LedgerReportAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accounts/ledgerreportgroup',
            component: React.lazy(() => import('./LedgerReport'))
        }
    ]
};
