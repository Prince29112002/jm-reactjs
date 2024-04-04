import React from 'react';
export const AddJobworkMetalReturnIRAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addjobworkmetalreturn',
            component: React.lazy(() => import('./AddJobworkMetalReturnIR'))
        }
    ]
};
