import React from 'react';

export const MainDesignAppConfig = {
    settings: {
        layout: {
            config: {
                navbar: {
                    display: false
                },
                toolbar: {
                    display: true
                },
                footer: {
                    display: false
                },
                leftSidePanel: {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes: [
        {
            path: "/dashboard/design",
            // component: MainDesignPage
            component: React.lazy(() => import('./MainDesignPage'))

        }
    ]
};


