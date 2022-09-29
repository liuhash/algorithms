import React, {Component} from 'react';
import {Card} from 'antd'
import './login.css'
import logo from "../../assets/logo.png"
class Login extends Component {
    render() {
        return (
            <div className="login">
                <Card className="login-container">
                    <img src={logo} className="login-logo"/>

                </Card>
            </div>
        );
    }
}

export default Login;