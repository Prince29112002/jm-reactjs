import React from 'react';
export const AddArticianReturnIRAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addarticianreturn',
            component: React.lazy(() => import('./AddArticianReturnIR'))
        }
    ]
};
