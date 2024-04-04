import React from 'react';
export const ArticianReturnIRAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/articianreturn',
            component: React.lazy(() => import('./ArticianReturnIR'))
        }
    ]
};
