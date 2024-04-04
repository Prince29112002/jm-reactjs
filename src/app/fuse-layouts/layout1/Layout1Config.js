const config = {
    title   : 'Layout 1 - Vertical',
    defaults: {
        mode          : 'fullwidth',
        scroll        : 'content',
        navbar        : {
            display : true,
            folded  : false,
            position: 'left'
        },
        toolbar       : {
            display : true,
            style   : 'fixed',
            position: 'above'
        },
        footer        : {
            display : false,//true,
            style   : 'fixed',
            position: 'below'
        },
        leftSidePanel : {
            display: true
        },
        rightSidePanel: {
            display: true
        }
    }
    ,

};

export default config;
