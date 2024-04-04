import React from 'react';
export const EditPackingSlipAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/tagging/editpackingslip',
            component: React.lazy(() => import('./EditPackingSlip'))
        }
    ]
};
