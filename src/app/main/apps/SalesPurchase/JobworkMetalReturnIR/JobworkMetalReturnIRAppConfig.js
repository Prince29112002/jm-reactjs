import React from 'react';
export const JobworkMetalReturnIRAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/jobworkmetalreturn',
            component: React.lazy(() => import('./JobworkMetalReturnIR'))
        }
    ]
};
