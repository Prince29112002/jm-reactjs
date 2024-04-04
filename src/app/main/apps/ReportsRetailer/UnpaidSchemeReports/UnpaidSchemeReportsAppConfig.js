import React from 'react';
export const UnpaidSchemeReportsAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/unpaidschemereports',
            component: React.lazy(() => import('./UnpaidSchemeReports'))
        }
    ]
};
