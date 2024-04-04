import React from 'react';
export const EditDesignAppConfig = {
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
            path     : '/dashboard/design/editdesign',
            component: React.lazy(() => import('./EditDesign'))
        }
    ]
};
