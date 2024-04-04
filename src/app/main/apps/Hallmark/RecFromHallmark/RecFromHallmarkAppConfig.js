import React from 'react';

export const RecFromHallmarkAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/hallmark/recfromhallmark',
            component: React.lazy(() => import('./RecFromHallmark'))

        }
    ]
};
