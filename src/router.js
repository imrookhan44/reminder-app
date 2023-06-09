import React, { useState, useEffect } from "react";
import Login from "./components/User_Login/Login";
import AddFile from "./components/AddFile/AddFile";
import LoginAdmin from "./components/User_Login/LoginAdmin";
import LoginStaff from "./components/User_Login/LoginStaff";
import SignUp from "./components/User_Login/SignUp";
import ReminderAlert from "./components/Reminder/ReminderAlert"
import ReminderServices from "./components/Reminder_Services/Reminder_Services";
import ReminderSetting from "./components/Reminder_Setting/Reminder_Setting";
import {
    BrowserRouter,
    Route,
    Routes,
} from "react-router-dom";
import VerifyPhone from "./components/User_Login/VerifyPhone";
import VerifyOtp from "./components/User_Login/VerifyOtp";
import Naavbar from "./components/Navbar/Navbar";
import PrivateRoutes from "./components/PrivateComponent/PrivateRoutes";
import RemindersPage from "./components/Reminders/RemindersPage";
import GetUser from "./components/CreateUser/GetUser";
import DashBoard from "./components/Dashboard/DashBoard";
import BizFiles from "./components/AddFile/BizFiles";
import ForgetPassword from "./components/User_Login/ForgetPassword";
import UpdateFIle from "./components/updateFile/UpdateFIle";

export default function RouterComponent() {
    const [token, setToken] = useState(null)
    const [googleToken, setGoogleToken] = useState(null)
    const [phoneId, setPhoneId] = useState(null)

    const phoneAuthentication = () => {
        let uid = localStorage.getItem('uid')
        setPhoneId(uid)
    }
    const google = () => {
        let token = localStorage.getItem("email")
        setGoogleToken(token)
    }
    const userToken = () => {
        let token = localStorage.getItem("loginToken")
        setToken(token)
    }
    useEffect(() => {
        userToken()
    }, [])
    useEffect(() => {
        google()
    }, [])
    useEffect(() => {
        phoneAuthentication()
    }, [])



    return (
        <BrowserRouter>
            {token || googleToken || phoneId ? (<Naavbar setToken={setToken} setGoogleToken={setGoogleToken} setPhoneId={setPhoneId} />) : (null)}
            <Routes>
                <Route element={<PrivateRoutes />}>
                    {localStorage.getItem("role") === "admin" ?
                        <>
                            <Route path="/getUser" element={<GetUser />} />
                            <Route path="/reminderservices" element={<ReminderServices />} />
                            <Route path="/addFile/:_id" element={<AddFile />} />
                            <Route path="/remindersetting" element={<ReminderSetting />} />
                            <Route path="/bizFiles" element={<BizFiles />} />
                            <Route path="/" element={< DashBoard />} />
                        </> : <>
                            <Route path="/remindersetting/:_id" element={<ReminderSetting />} />
                            <Route path="/addFile" element={<AddFile />} />
                            {/* <Route path="/login" element={<Login />} /> */}
                            <Route path="/" element={<ReminderAlert />} />
                            <Route path="/reminderservices" element={<ReminderServices />} />
                            <Route path="/reminders/:_id" element={<RemindersPage />} />
                            <Route path="/update/:_id" element={<UpdateFIle />} />

                        </>
                    }
                </Route>
                <Route path="/login" element={<Login setGoogleToken={setGoogleToken} />} />
                <Route path="/signUp" element={<SignUp />} />
                <Route path="/forgetPassword" element={<ForgetPassword />} />
                <Route path="/loginAdmin" element={<LoginAdmin setToken={setToken} />} />
                <Route path="/loginStaff" element={<LoginStaff />} />
                <Route path="/verifyphone" element={<VerifyPhone setPhoneId={setPhoneId} />} />
                <Route path="/verifyOtp" element={<VerifyOtp />} />
            </Routes>
        </BrowserRouter>

    )
}
