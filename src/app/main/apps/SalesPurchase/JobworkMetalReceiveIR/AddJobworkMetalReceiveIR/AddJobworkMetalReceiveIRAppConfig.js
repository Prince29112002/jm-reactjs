import React from 'react';
export const AddJobworkMetalReceiveIRAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addjobworkmetalreceive',
            component: React.lazy(() => import('./AddJobworkMetalReceiveIR'))
        }
    ]
};
