import React from 'react';

export const LedgerRateAppConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/ledgerrate',
            component: React.lazy(() => import('./LedgerRate'))
        }
    ]
};
