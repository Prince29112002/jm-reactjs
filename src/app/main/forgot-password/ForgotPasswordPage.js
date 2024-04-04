import React ,{useEffect,useState} from 'react';
import {Button, Card, CardContent, TextField, Typography} from '@material-ui/core';
import {darken} from '@material-ui/core/styles/colorManipulator';
import {makeStyles} from '@material-ui/styles';
import {FuseAnimate} from '@fuse';
import {useForm} from '@fuse/hooks';
import clsx from 'clsx';
import {Link} from 'react-router-dom';
import axios from "axios";
import handleError from '../ErrorComponent/ErrorComponent';
import Config from 'app/fuse-configs/Config';
import { useDispatch } from "react-redux";
import * as Actions from "app/store/actions";
import History from "@history";

const useStyles = makeStyles(theme => ({
    root: {
        // background: 'radial-gradient(' + darken(theme.palette.primary.dark, 0.5) + ' 0%, ' + theme.palette.primary.dark + ' 80%)',
        color     : theme.palette.primary.contrastText
    },
     button:{
        margin: 5,
        textTransform: "none",
        backgroundColor: "#415BD4",
        color: "#FFFFFF",
        borderRadius: 7,
        letterSpacing: "0.06px",
    },
    card:{
boxShadow:" 3px 3px 40px 0px rgba(0,0,80,0.2), 0px 0px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
borderRadius: "7px",
    }
}));

function ForgotPasswordPage()
{
    const classes = useStyles();
 
  const dispatch = useDispatch();
  const [emailErr, setEmailErr] = useState("");
  const [email, setEmail] = useState("");

 
  
function handleChange(event){
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "email") {
        setEmail(value);
        setEmailErr("");
  
      }
}

    function emailValidation() {
        var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (!email || emailRegex.test(email) === false) {
            if(email == ""){
                setEmailErr("Enter email id")
              }else{
        
                setEmailErr("Enter valid email id");
              }
              return false;
            }
        return true;
      }
    function handleSubmit(ev)
    {
        ev.preventDefault();
        if(emailValidation()){

            updateSelfPassword()
            resetForm();
            setEmailErr("")
        }
    }
    function resetForm(){
        setEmail("");
        setEmailErr("")

    }
    // useEffect(() => {
    //     updateSelfPassword();
    //       //eslint-disable-next-line
    //   }, []);
    function updateSelfPassword() {
        // const userId = localStorage.getItem("userId");
        // console.log("pwd", password,userId)
    
        axios
          .post(Config.getCommonUrl() + "api/admin/forgotpassword", {
            "email": email,
            // "id": userId
          })
          .then(function (response) {
            console.log(response);
    
            if (response.data.success === true) {
            
                          History.push("/login");
              dispatch(Actions.showMessage({ message: response.data.message ,variant:"success"}));


            } else {
              dispatch(Actions.showMessage({ message: response.data.message ,variant:"error"}));
            }
          })
          .catch((error) => {
            handleError(error, dispatch, {api : "api/admin/forgotpassword", body :{
            //   "password": password,
            // "id": userId
            "email":email,
    
            }})
          });
      }

    return (
        <div className={clsx(classes.root, "flex flex-col flex-auto flex-shrink-0 items-center justify-center p-32")}>

            <div className="flex flex-col items-center justify-center w-full">

                <FuseAnimate animation="transition.expandIn">

                    <Card className= {clsx(classes.card ,"w-full max-w-384")}>

                        <CardContent className="flex flex-col items-center justify-center p-32">

                            <div className=" m-32">
                                <img src= {Config.getjvmLogo()} alt="logo"/>
                            </div>

                            <Typography variant="h6" className="mt-16 mb-32">RECOVER YOUR PASSWORD</Typography>

                            <form
                                name="recoverForm"
                                noValidate
                                className="flex flex-col justify-center w-full"
                                onSubmit={handleSubmit}
                            >
                              <label htmlFor="userName" className="log-label mb-2">
                                     Email ID*
                               </label>
                                <TextField
                                    className="mb-16"
                                    // label="Email"
                                    autoFocus
                                    type="email"
                                    name="email"
                                    value={email}
                                    error={emailErr.length > 0 ? true : false}
                                    helperText={emailErr}
                                    onChange={handleChange}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    placeholder='Enter email id'
                                />

                                <Button
                                    className={classes.button}
                                    type="submit"
                                >
                                    SEND RESET LINK
                                </Button>

                            </form>

                            <div className="flex flex-col items-center justify-center pt-32 pb-24">
                                <Link className="font-medium" to="/login">Go back to login</Link>
                            </div>

                        </CardContent>
                    </Card>
                </FuseAnimate>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;
