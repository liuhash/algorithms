import axios from 'axios'
import {message} from "antd";
import {getToken, hasToken, removeToken} from 'utils/storage'
export const baseURL="http://geek.itheima.net/v1_0/"
const instance=axios.create({
    baseURL,
    timeout:5000,
})
// 配置拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    if(hasToken())
    {
        config.headers.Authorization=`Bearer ${getToken()}`
        // console.log(config.headers.Authorzation)
    }
    // 在发送请求之前做些什么
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return response.data;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    // 确保有response
    if(!error.response){
        return Promise.reject(new Error('网络繁忙，请稍后再试！'))
    }
    if(error.response.status===401)
    {
        removeToken()
        window.location.href="http://127.0.0.1:3000/login"
        message.warning("登陆信息过期！")
    }
    console.log(error)
    return Promise.reject(error);
});

export default instance