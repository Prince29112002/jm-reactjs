import React from 'react';
export const UnpaidMortageReportAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/unpaidmortagereport',
            component: React.lazy(() => import('./UnpaidMortageReport'))
        }
    ]
};
