import React from 'react';
export const PaidSchemeReportsRetailerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/paidschemereportsretailer',
            component: React.lazy(() => import('./PaidSchemeReportsRetailer'))
        }
    ]
};
