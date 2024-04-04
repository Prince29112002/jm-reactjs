import React from 'react';
export const MeltingReceiveAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/meltingreceive',
            component: React.lazy(() => import('./MeltingReceive'))
        }
    ]
};
