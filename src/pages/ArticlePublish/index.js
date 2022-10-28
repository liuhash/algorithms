import React, {Component} from 'react';
import {Breadcrumb, Button, Card, Form, Input, Modal, Radio, Space, Upload,message} from "antd";
import {Link, useNavigate, useParams} from "react-router-dom"
import Channel from "../../components/Channel";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import styles from './index.module.scss'
import {PlusOutlined} from "@ant-design/icons";
import {baseURL} from "utils/requests"
import {addArticles, getArticleById, updateArticle} from "../../apis/article";
class ArticlePublishPrimitive extends Component {

    state={
        type:0,
        fileList:[],
        showPreview:false,
        previewUrl:"",
        id:this.props.params.id
    }
    formRef=React.createRef()
    render() {
        return (
            <div className={styles.root}>
                <Card
                    title={
                    <Breadcrumb>
                        <Breadcrumb.Item>
                            <Link to="/home">首页</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>{this.state.id?"编辑文章":"发布文章"}</Breadcrumb.Item>
                    </Breadcrumb>
                    }
                >
                    <Form
                        labelCol={{span:4}}
                        onFinish={this.onFinish}
                        initialValues={{
                            content:"",
                            type:this.state.type,

                        }}
                        ref={this.formRef}
                    >
                        <Form.Item label="标题" name={"title"} rules={[
                            {
                                required:true,
                                message:"文章的标题不能为空"
                            }
                        ]}>
                            <Input style={{width:400}} placeholder={"请输入文章标题"}></Input>
                        </Form.Item>
                        <Form.Item label="频道">
                            <Channel></Channel>
                        </Form.Item>
                        <Form.Item label="封面"
                        name={"type"}>
                            <Radio.Group onChange={this.changeType} >
                                <Radio value={1}>单图</Radio>
                                <Radio value={3}>三图</Radio>
                                <Radio value={0}>无图</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset:4}}>
                            {
                                this.state.type!==0&&(
                                    <Upload listType={"picture-card"}
                                            fileList={this.state.fileList}
                                            action={`${baseURL}upload`}
                                            name={"image"}
                                            onChange={this.uploadImage}
                                            onPreview={this.handlePreview}
                                            beforeUpload={this.beforeUpload}
                                    >
                                        {this.state.fileList.length<this.state.type&&<PlusOutlined/>}
                                    </Upload>
                                )
                            }
                        </Form.Item>
                        <Form.Item label="内容" name={"content"}
                        rules={[{
                            required:true,
                            message:"文章的标题不能为空"
                        }]}
                        >
                            <ReactQuill theme="snow" placeholder={"请输入文章内容"} ></ReactQuill>
                        </Form.Item>
                        <Form.Item wrapperCol={{offset:4}}>
                            <Space>
                                <Button htmlType="submit" size="large">
                                    {this.state.id?"编辑文章":"发布文章"}
                                </Button>
                                <Button size={"large"} onClick={this.addDraft}>
                                    存入草稿
                                </Button>
                            </Space>

                        </Form.Item>
                    </Form>
                </Card>
                <Modal open={this.state.showPreview}
                       title={"图片预览"}
                       footer={null}
                       onCancel={this.handleCancel}
                >
                    <img
                        alt="example"
                        style={{
                            width: '100%',
                        }}
                        src={this.state.previewUrl}
                    />
                </Modal>
            </div>
        );
    }
    async componentDidMount() {
        // console.log(this.state.id)
        if(this.state.id){
            const res=await getArticleById(this.state.id)
            const fileList=res.data.cover.images.map(item=> {
                return{
                    url:item
                }
            })
            const values={
                ...res.data,
                type:res.data.cover.type,

            }
           this.formRef.current.setFieldsValue(values)
            this.setState({
                fileList:fileList,
                type:res.data.cover.type
            })
        }
    }

    async save(values,draft=false){
        const {navigate}=this.props
        const {fileList,type}=this.state
        if(fileList.length!==type)
        {
            return message.warn("上传图片数量不正确！")
        }
        const images=fileList.map((item)=>{
            return item.thumbUrl
        })
        if(this.state.id){
            await updateArticle({
                ...values,
                cover:{
                    type,
                    images,
                },
              id:this.state.id
            },draft)
            message.success("修改成功！")
        }else{
            await addArticles({
                ...values,
                cover:{
                    type,
                    images,
                },
                draft
            })
            message.success("添加成功！")
        }
        navigate("/home/list")
    }
    onFinish=async (values)=>{
        this.save(values,false)
    }
    changeType=(e)=>{
        // console.log(e.target.value)
    this.setState({
        type:e.target.value,
        fileList:[]
    })
    }
    beforeUpload=(file)=>{
        if(file.size>=1024*500){
            message.warn('上传的文件不能超过500kb!')
            return Upload.LIST_IGNORE
        }
        if(!['images/png','images/jpeg'].includes(file.type)){
            message.warn("只能上传jpg或png的图片。")
            return Upload.LIST_IGNORE
        }
        return true
    }
    uploadImage=({fileList})=>{
        this.setState({
            fileList:fileList
        })
    }
    handlePreview=(file)=>{
        // console.log(file)
        this.setState({
            showPreview:true,
            previewUrl:file.thumbUrl
        })
    }
    handleCancel=()=>{
        this.setState({
            showPreview:false,
            previewUrl:""
        })
    }
    addDraft=async (values)=>{
        const res=this.formRef.current.validateFields()
        console.log(res)
        this.save(values,true)
    }
}
function ArticlePublish(props){
    const navigate=useNavigate();
    const params=useParams();
    return <ArticlePublishPrimitive {...props} navigate={navigate} params={params}/>
}
export default ArticlePublish;