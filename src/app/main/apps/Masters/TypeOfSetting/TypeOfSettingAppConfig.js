import React from 'react';

export const TypeOfSettingAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/typeofsetting',
            component: React.lazy(() => import('./TypeOfSetting'))
        }
    ]
};
