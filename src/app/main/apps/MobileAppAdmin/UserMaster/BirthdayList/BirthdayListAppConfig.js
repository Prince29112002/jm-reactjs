import React from 'react';

export const BirthdayListAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/mobappadmin/birthdaylist",
            component: React.lazy(() => import('./BirthdayList'))
        }
    ]
};


