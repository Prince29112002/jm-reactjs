import React from 'react';

export const LedgerReportRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/accountretailer/ledgerreportretailer',
            component: React.lazy(() => import('./LedgerReportRetailer'))
        }
    ]
};
