import React from "react";
import Button from 'react-bootstrap/Button';
import {FaGoogle} from 'react-icons/fa'
import {BsMicrosoft} from 'react-icons/bs'
import {CgMoreR} from 'react-icons/cg'
import {AiOutlineCheck} from 'react-icons/ai'
import './Login.css'
import { useNavigate } from "react-router-dom";
export default function Login (){
    let navigate = useNavigate();

    const handleLogin = () =>  {
        navigate("/verifyphone");
    }
    return(
            <div className="card card-1">
              <span className="Header"> <h2>Get Started</h2></span> 
        <div className="login">
<div className="first"> 
<Button  className="start" variant="primary" onClick={()=>navigate("/loginAdmin")} >Login With UserId</Button><br></br>
<Button  className="start" variant="primary" onClick={handleLogin} >Login With Phone Number</Button><br></br>

</div>
<div className="Second">
<Button className="btn" variant="danger"><span className="Google"><FaGoogle /></span>Sign in  with Google</Button><br></br>
<Button className="btn"  variant="primary"><span className="Microsoft"><BsMicrosoft /></span>Sign in  with Microsoft</Button><br></br>
<Button className="showf" ><span className="More"><CgMoreR/></span>Show More</Button>
</div>
        </div>
</div>
    )
}