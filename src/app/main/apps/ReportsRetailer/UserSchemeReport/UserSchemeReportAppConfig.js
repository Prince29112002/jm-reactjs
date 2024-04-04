import React from 'react';
export const UserSchemeReportAppConfig = {
    settings: {
        layout: {
            config: {
                
            }
        }
    },
    routes  : [
        {
            path     : '/dashboard/reportsretailer/userschemereport',
            component: React.lazy(() => import('./UserSchemeReport'))
        }
    ]
};
