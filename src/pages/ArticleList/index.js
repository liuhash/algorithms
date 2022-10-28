import React, {Component} from 'react';
import {Breadcrumb, Button, Card, Form, Radio,DatePicker, Table, Tag, Space,Modal,message} from "antd";
import {Link, useNavigate} from "react-router-dom";
import {ArticleStatus} from "../../apis/constants";
import {delArticles, getArticles} from "../../apis/article";
import defaultImage from "assets/error.png"
import {EditOutlined,DeleteOutlined,ExclamationCircleOutlined} from "@ant-design/icons";
import Channel from "../../components/Channel";
const {RangePicker}=DatePicker
const {confirm}=Modal

class ArticleListPrimitive extends Component {
    columns=[
        {
            title:'封面',
            dataIndex:'',
            render(data){
                if(data.cover.type===0)
                {
                    return <img src={defaultImage} style={{width:200,height:150,objectFit:'cover'}} alt=""/>
                }
                return <img src={data.cover.images[0]} style={{width:200,height:150,objectFit:'cover'}} alt=""/>
            }
    },
        {
            title: '标题',
            dataIndex: 'title',
        },
        {
            title:'状态' ,
            dataIndex: 'status',
            render(status) {
                const obj= ArticleStatus.find(item=>item.id===status)
                return(
                    <Tag color={obj.color}>
                        {obj.name}
                    </Tag>)

            }
        },
        {
            title:'发布时间' ,
            dataIndex: 'pubdate',
        },
        {
            title: '阅读数',
            dataIndex: 'read_count',
        },
        {
            title:'评论数' ,
            dataIndex: 'comment_count',
        },
        {
            title:'点赞数' ,
            dataIndex: 'like_count',
        },
        {
            title:'操作' ,
            dataIndex:'',
            render:(data)=> {

                return(
                    <Space>
                        <Button type="primary"
                                shape="circle"
                                icon={<EditOutlined />}
                                onClick={()=>this.handleEdit(data.id)}/>
                        <Button type="primary"
                                danger
                                shape="circle" icon={<DeleteOutlined />}
                            onClick={()=>this.onDelete(data.id)}/>
                    </Space>
                );
        }
        }
    ]
    // 用于存放查询文章列表的参数
    reqParams={
        pages:1,
        per_page:10,
    }
    state={
        articles:{}
    }
    render() {
        const {total_count,results,per_page,page}=this.state.articles
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
                        <Channel></Channel>
                    </Form.Item>

                    <Form.Item label="日期"  name="date">
                        <RangePicker/>
                    </Form.Item>

                    <Form.Item className="item">
                        <Button type="primary" htmlType="submit">筛选</Button>
                    </Form.Item>
                </Form>
                </Card>

                <Card title={`根据查询条件查询到${total_count}条结果:`}>
                    <Table columns={this.columns} dataSource={results} rowKey='id'
                    pagination={{
                        position:["bottomCenter"],
                        total:total_count,
                        pageSize:per_page,
                        current:page,
                        onChange:this.onChange
                    }}/>;
                </Card>
            </div>
        );
    }
    componentDidMount() {
        this.getArticleList()
    }
    async getArticleList(){
        const res=await getArticles(this.reqParams)
        // console.log(res2)
        this.setState({
            articles:res.data
        })
    }

    onFinish=({status,channel_id,date})=>{
        // console.log(values)
        if(status!==-1)
        {
            this.reqParams.status=status
        }else {
            delete this.reqParams.status
        }
        if(channel_id!==undefined)
        {
            this.reqParams.channel_id=channel_id
        }else {
            delete this.reqParams.channel_id
        }
        if(date)
        {
            this.reqParams.begin_pubdate=date[0].startOf('day').format("YYYY-MM-DD")
            this.reqParams.end_pubdate=date[1].endOf('day').format("YYYY-MM-DD")
        }else {
            delete this.reqParams.begin_pubdate
            delete this.reqParams.end_pubdate
        }
        // 如果是查询的操作，使页码值为1。
        this.reqParams.pages=1
        console.log(this.reqParams)
        // 重新发送请求
        this.getArticleList()
    }
    onChange=(page,pageSize)=>{
        // console.log(page,pageSize)
        this.reqParams.page=page
        this.reqParams.per_page=pageSize
        this.getArticleList()
    }
    onDelete=(id)=>{
        console.log(id)
        confirm({
            title:'温馨提示' ,
            icon: <ExclamationCircleOutlined />,
            content: '您确定要删除这篇文章吗?',
            onOk:async ()=> {
                // 发送请求删除文章
                await delArticles(id)
                this.getArticleList()
                message.success('删除成功')
            }
        });
    }
    handleEdit=(id)=>{
        const {navigate}=this.props
        navigate(`/home/publish/${id}`)
    }
}
function ArticleList(props){
    const navigate=useNavigate()
    return <ArticleListPrimitive {...props} navigate={navigate}/>
}

export default ArticleList;