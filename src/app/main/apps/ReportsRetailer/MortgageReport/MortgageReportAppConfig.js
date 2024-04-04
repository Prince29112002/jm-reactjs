import React from 'react';
export const MortgageReportAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/mortgagereport',
            component: React.lazy(() => import('./MortgageReport'))
        }
    ]
};
