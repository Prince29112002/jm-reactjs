import StockTaggingList from './StockTaggingList'

export const StockTaggingListAppConfig = {
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
    routes  : [
        {
            path     : '/dashboard/stocktaggingretailer',
            component: StockTaggingList
        }
    ]
};
