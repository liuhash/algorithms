import React, {Component} from 'react';
import {Select} from "antd";
import {getChannels} from "../../apis/channels";
const {Option}=Select
class Channel extends Component {
    state={
        channels:[],
    }
    componentDidMount() {
        this.getChannelList()
    }
    async getChannelList(){
        const res=await getChannels()
        // console.log(res)
        this.setState({
            channels:res.data.channels
        })
    }
    render() {
        return (
            <div>
                <Select
                    style={{width: 120}}
                    placeholder={"请选择文章频道"}
                    value={this.props.value}
                    onChange={this.props.onChange}

                >
                    {
                        this.state.channels.map((item)=>(
                                <Option key={item.id} value={item.id}>{item.name}</Option>
                            )
                        )
                    }

                </Select>
            </div>
        );
    }
}

export default Channel;