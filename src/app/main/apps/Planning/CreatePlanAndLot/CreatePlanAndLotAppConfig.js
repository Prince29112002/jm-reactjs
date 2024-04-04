import React from 'react';

export const CreatePlanAndLotAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path: "/dashboard/planningdashboard/planningorders/createplanandlot",
            component: React.lazy(() => import('./CreatePlanAndLot'))
        }
    ]
};
