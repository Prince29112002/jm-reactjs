import React from 'react';

export const SettingMethodAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/masters/settingmethod',
            component: React.lazy(() => import('./SettingMethod'))
        }
    ]
};
