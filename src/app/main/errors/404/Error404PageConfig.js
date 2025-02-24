import React from 'react';

export const Error404PageConfig = {
    settings: {
        layout: {
            config: {}
        }
    },
    routes  : [
        {
            path     : '/errors/error-404',
            component: React.lazy(() => import('./Error404Page'))
        }
    ]
};
