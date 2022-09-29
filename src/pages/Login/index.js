import React, {Component} from 'react';
import {Button} from 'antd'
class Login extends Component {
    render() {
        return (
            <div>
                login component
                <Button type={"primary"}>我是一个按钮</Button>
            </div>
        );
    }
}

export default Login;