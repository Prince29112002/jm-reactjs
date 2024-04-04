import React from 'react';
import {Button, Card, CardContent, Checkbox, FormControl, FormControlLabel, TextField, Typography} from '@material-ui/core';
import {darken} from '@material-ui/core/styles/colorManipulator';
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate} from '@fuse';
import {useForm} from '@fuse/hooks';
import clsx from 'clsx';
import {Link} from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    root: {
        background: 'radial-gradient(' + darken(theme.palette.primary.dark, 0.5) + ' 0%, ' + theme.palette.primary.dark + ' 80%)',
        color     : theme.palette.primary.contrastText
    }
}));

function OuterPage()
{

    const classes = useStyles();    

    return (
        <div className={clsx(classes.root, "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32")}>
            <div className="flex flex-col items-center justify-center w-full">
                
            </div>
        </div>
    );
}

export default OuterPage;
