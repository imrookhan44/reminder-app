import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginAdmin.css";
import { userLogin } from "../../services/Auth/auth"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LoginUser({ setToken }) {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState('');
    let navigate = useNavigate()

    const handleSubmit = (event) => {
        event.preventDefault()

        let payload = { email, password }
        userLogin(payload).then((res) => {
            localStorage.setItem("loginToken", res.token)
            localStorage.setItem("role", res.user.role)
            localStorage.setItem("adminId",res.user._id)
            localStorage.setItem("userId", res.user._id)
            setToken(res.token)
            setTimeout(() => {
                navigate("/")
            }, 1000)
            toast.success('User Login Successfully', { theme: "colored" })
        }).catch((err) => {
            console.log(err)
            toast.error("Something Went Wrong", { theme: "colored" })
        });
    }

    const handleChange = (e) => {
        setEmail(e.target.value)


    }
    const handlePassword = (e) => {
        setPassword(e.target.value)
    }
    const showPasswordHandler = () => {
        setShowPassword(!showPassword)
    }
    return (
        <React.Fragment>
            <div className="card card-1" id="login__admin">
                <span className="Header d-flex justify-content-center"><p>Admin</p><p className="stf" onClick={() => navigate("/loginStaff")}>Staff</p></span>
                <form onSubmit={handleSubmit} className="inputForm">
                    <input className="field" type="email" id="email" value={email} placeholder="Enter Email" onChange={handleChange} /> <br />
                    <input className="field" type={showPassword ? "text" : "password"} id="password" value={password} placeholder="Enter Password" onChange={handlePassword} />
                    <br />

                    <button className="sub" type="submit">Login</button>
                </form>
                <button className="password" onClick={()=>navigate("/forgetPassword")} >Forgot Password ?</button>
                <ToastContainer />
            </div>
        </React.Fragment>
    )
}