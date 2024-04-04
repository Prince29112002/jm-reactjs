import React from 'react';
export const JobworkMetalReceiveIRAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/jobworkmetalreceive',
            component: React.lazy(() => import('./JobworkMetalReceiveIR'))
        }
    ]
};
