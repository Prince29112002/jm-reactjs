import React from 'react';
export const StoneAssortmentAppConfing = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/stoneassortment',
            component: React.lazy(() => import('./StoneAssortment'))
        }
    ]
};
