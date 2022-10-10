import React, {Component} from 'react';
import {Breadcrumb, Button, Card, Form, Radio, Select, DatePicker, Table} from "antd";
import {Link} from "react-router-dom";
import {ArticleStatus} from "../../apis/constants";
import {getChannels} from "../../apis/channels";
import {getArticles} from "../../apis/article";
const {Option} =Select;
const {RangePicker}=DatePicker

class ArticleList extends Component {
    columns=[
        {
            title:'封面',
            dataIndex:'name',
    },
        {
            title: '标题',
            dataIndex: '',
        },
        {
            title:'状态' ,
            dataIndex: '',
        },
        {
            title:'发布时间' ,
            dataIndex: '',
        },
        {
            title: '阅读数',
            dataIndex: '',
        },
        {
            title:'评论数' ,
            dataIndex: '',
        },
        {
            title:'点赞数' ,
            dataIndex: '',
        },
        {
            title:'操作' ,
            dataIndex:'',
        }
    ]
    state={
        channels:[],
        articles:{}
    }
    render() {
        return (
            <div>
                <Card
                    title={
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/home" >首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            文章列表
                        </Breadcrumb.Item>
                </Breadcrumb>
                }
                >

                <Form initialValues={{status:-1}} onFinish={this.onFinish}>
                    <Form.Item label="状态" name="status">
                        <Radio.Group>
                            {
                                ArticleStatus.map((item)=>(
                                    <Radio key={item.id} value={item.id}>{item.name}</Radio>
                                )
                                )
                            }
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item label="频道" name="channel_id">
                        <Select style={{width: 120}}>
                            {
                                this.state.channels.map((item)=>(
                                        <Option key={item.id} value={item.id}>{item.name}</Option>
                                    )
                                )
                            }

                        </Select>
                    </Form.Item>

                    <Form.Item label="日期"  name="date">
                        <RangePicker/>
                    </Form.Item>

                    <Form.Item className="item">
                        <Button type="primary" htmlType="submit">筛选</Button>
                    </Form.Item>
                </Form>
                </Card>

                <Card title="根据查询条件查询到***条结果:">
                    <Table columns={this.columns} />;
                </Card>
            </div>
        );
    }
    componentDidMount() {
        this.getChannelList()
        this.getArticleList()
    }
    async getChannelList(){
        const res=await getChannels()
        console.log(res)
        this.setState({
            channels:res.data.channels
        })
    }
    async getArticleList(){
        const res=await getArticles()
        // console.log(res2)
        this.setState({
            articles:res.data
        })
    }

    onFinish=(values)=>{
        // console.log(values)
    }
}

export default ArticleList;