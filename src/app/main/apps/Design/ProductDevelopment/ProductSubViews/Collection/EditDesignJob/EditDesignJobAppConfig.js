import React from 'react';

export const EditCollectionAppConfig = {
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
            path     : "/dashboard/design/editcollection",
            component: React.lazy(() => import('./EditDesignJob'))

        }
    ]
};
