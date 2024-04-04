import React from 'react';
export const AddRepairedJewelReturnJobWorkerApConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/sales/addrepairedjewelreturnjobwork',
            component: React.lazy(() => import('./AddRepairedJewelReturnJobWorker'))
        }
    ]
};
