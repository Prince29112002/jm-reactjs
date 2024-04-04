import React from 'react';
export const RepairedJewelReturnJobWorkerAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/repairedjewelreturnjobwork',
            component: React.lazy(() => import('./RepairedJewelReturnJobWorker'))
        }
    ]
};
