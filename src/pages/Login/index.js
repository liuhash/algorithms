import React from 'react';
import {useNavigate} from "react-router-dom";
import {Card,Form,Input,Checkbox,Button,message} from 'antd'
import './login.scss'
import logo from "assets/logo.png"
import {login} from "../../apis/user";

const Login= ()=> {
    const navigate=useNavigate()
    const onFinish=async ({mobile,code})=>{
        try{
            const res=await login(mobile,code)
            // console.log(res)
            // 1.保存token
            // console.log("保存成功")
            localStorage.setItem('token',res.data.token)
            // 2.跳转首页
            // console.log(this.props)
            // console.log("登陆成功")
            navigate("/home")
            // 3.提示成功
            message.success("登陆成功！",1,function () {
                console.log("消息关闭了！")
            })
        }catch(error) {
            message.error(error.response.data.message,1)
        }
    }
        return (
            <div className="login">
                <Card className="login-container">
                    <img alt="" src={logo} className="login-logo"/>
                    <Form size="large"
                          validateTrigger={['onChange','onBlur']}
                          onFinish={onFinish}
                        initialValues={{
                            mobile:"13911111111",
                            code:"246810",
                            agree:"true"
                        }}
                    >
                        <Form.Item
                            name="mobile"
                            rules={[
                                {
                                    required: true,
                                    message: '手机号不能为空',
                                },
                                {
                                    pattern:/^1[3-9]\d{9}$/,
                                    message:'手机号格式错误',
                                }
                            ]}
                        >
                            <Input placeholder="请输入你的手机号"/>
                        </Form.Item>

                        <Form.Item
                            name="code"
                            rules={[
                                {
                                    required: true,
                                    message: '验证码不得为空！',
                                },
                                {
                                    pattern:/^\d{6}$/,
                                    message:'验证码格式错误！',
                                }
                            ]}
                        >
                            <Input placeholder={"请输入验证码"}/>
                        </Form.Item>

                        <Form.Item
                            name="agree"
                            valuePropName="checked"
                            rules={[{
                                validator(rule,value){
                                    if(value){
                                        return Promise.resolve()
                                    }else{
                                        return Promise.reject(new Error('请阅读相关协议！'))
                                    }
                                }
                            }]}>
                            <Checkbox>我已阅读并同意上述条款和用户协议</Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" block>
                                登录
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </div>
        );
}

export default Login;