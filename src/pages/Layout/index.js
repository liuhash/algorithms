import React, {useEffect, useState} from 'react';
import styles from './index.module.scss'
import { EditOutlined,DiffOutlined, HomeOutlined,LogoutOutlined } from '@ant-design/icons';
import {Layout, Menu, message, Popconfirm} from 'antd';
import {NavLink, Route, Routes, useNavigate,useLocation} from "react-router-dom";
import Home from "../Home";
import ArticleList from "../ArticleList";
import ArticlePublish from "../ArticlePublish";
import {removeToken, hasToken} from "../../utils/storage";
import {getUserProfile} from "../../apis/user";
const { Header, Content, Sider } = Layout;
const LayoutComponent =()=>{
    const [info,setInfo]=useState({data:{name:"",}})
    const navigate=useNavigate()
    const location=useLocation()
    // console.log(location)
    const onConfirm=async ()=>{
        // 移除Token
        removeToken()
        navigate("/login")
        message.success("退出成功")
    };
    useEffect( ()=>
    {
        // console.log(hasToken())
        if(!hasToken()) {
            navigate("/login")
        }
        const asyncFn=async()=>{
            await getUserProfile().then(
                res=>{
                    setInfo(res)
                    // console.log(res)
                })
        }
        asyncFn()
    },[setInfo,navigate])
        return (
            <div className={styles.layout}>
                <Layout>
                    <Header className="header">
                        <div className="logo" />
                        <div className="profile">
                            <span>
                                {info.data.name}
                            {/*<img src={info.data.photo}/>*/}
                            </span>
                            <span>
                                      <Popconfirm
                                          title="你确定要退出本系统吗?"
                                          okText="确定"
                                          cancelText="取消"
                                          onConfirm={onConfirm}
                                      >
                                          <LogoutOutlined/>
                                          {' '}退出
                                      </Popconfirm>
                        </span>
                        </div>
                        {/*<Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />*/}
                    </Header>
                    <Layout>
                        <Sider width={200}>
                            <Menu
                                mode="inline"
                                defaultSelectedKeys={[location.pathname]}
                                style={{
                                    height: '100%', borderRight: 0,
                                }}
                                theme="dark"
                            >
                                <Menu.Item key="/home" icon={<HomeOutlined/>}><NavLink to="/home"/>数据概览</Menu.Item>
                                <Menu.Item key="/home/list" icon={<DiffOutlined/>}><NavLink to="/home/list"/>内容管理</Menu.Item>
                                <Menu.Item key="/home/publish" icon={<EditOutlined/>}><NavLink to="/home/publish"/>发布文章</Menu.Item>
                            </Menu>
                        </Sider>
                        <Layout style={{padding: 24,overflow:"auto"}}>
                            <Content
                                className="site-layout-background">
                                <Routes>
                                    <Route path="*" element={<Home/>}/>
                                    <Route path="list" element={<ArticleList/>}/>
                                    <Route path="publish" element={<ArticlePublish/>}/>
                                </Routes>
                            </Content>
                        </Layout>
                    </Layout>
                </Layout>
            </div>
        );
}


export default LayoutComponent;