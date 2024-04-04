import React from 'react';
export const PackingSlipAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/tagging/packingslip',
            component: React.lazy(() => import('./PackingSlip'))
        }
    ]
};
