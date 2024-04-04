import React from 'react';

export const CreateNewCADAppConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: true
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes  : [
        {
            path     : "/dashboard/design/createcad",
            component: React.lazy(() => import('./CreateNewCAD'))

        }
    ]
};
