/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col, Icom, Button } from 'antd';
import Tree from '../../components/oct/AreaDetailtree';
import List from '../../components/oct/AreaDetailList';
import VideoDialog from '../../components/oct/common/Rtsp';

const { confirm } = Modal;

class AreaDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：叶子，2：非叶子
      selectedKeys: [],
      currentId: '', // 当前选中行的部门Id
      dataSource: [],
      leftQuery: '',
      leftid: '', // 左边id
      zhongid: [], // 分组对应查询的值,默认为空
      rtspVisible: false, // 是否显示实时视频弹窗
      rtspURL: 'rtsp://20.1.30.199/realtime.264', // rtsp地址
      isAll: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { leftQuery } = this.state;
    dispatch({
      type: 'octAreaDetail/queryMenuList',
      payload: {},
    });
    // dispatch({
    //   type: 'octAreaDetail/AreaDetail',
    //   payload: { id: leftQuery },
    // });
    setInterval(() => {
      this.refreshLeftNode();
    }, 1000);
  }

  refreshLeftNode = () => {
    const { leftQuery } = this.state;
    const { dispatch } = this.props;
    const date = new Date();
    const sec = date.getSeconds();
    if (sec == 10) {
      dispatch({
        type: 'octAreaDetail/AreaDetail',
        payload: { id: leftQuery },
      });
    }
  }

  videoDialogCancel = () => {
    this.setState({ rtspVisible: false });
  }

  render() {
    const { dataSource, flag, selectedKeys, currentId, zhongid, leftid,
      isAll, leftQuery, rtspVisible, rtspURL } = this.state;
    const { octAreaDetail, common, dispatch, loading } = this.props;
    const {
      expandedKeys,
      groupinfo,
      menuList,
      queryobj,
      pagination,
      devicelist,
      roadtree,
      devicelistsum,
      isLeaf,
      nodeInfo,
      resultlist,
      arr,
      statistics,
      activeKey,
    } = octAreaDetail;
    const myThis = this;
    const videoprop = {
      rtspURL,
    };
    const { queryvalue } = nodeInfo;
    const { codeList, enumList } = common;
    const Treeprops = {
      menuList,
      dispatch,
      expandedKeys,
      loading,
      // onNodeSelect是点击树形结构调用的函数
      onNodeSelect: (selectedKeysNode, e) => {
        const str = selectedKeysNode.join();
        if (str) {
          console.log('str', str);
          if (str) {
            this.setState({
              leftQuery: str,
            });
          }
          dispatch({
            type: 'octAreaDetail/AreaDetail',
            payload: { id: str },
          });
        } else {
          dispatch({
            type: 'octAreaDetail/AreaDetailClear',
            payload: {},
          });
        }
      },
    };
    const Listprops = {
      leftQuery,
      loading,
      activeKey,
      resultlist,
      statistics,
      codeList,
      onVideo: (rtspurl) => {
        if (rtspurl == null || rtspurl.length == 0) {
          Modal.error({
            title: '无法播放',
            content: '还未配置RTSP地址',
          });
        } else {
          this.setState({
            rtspURL: rtspurl,
            rtspVisible: true,
          });
        }
      },
    };
    return (
      <div>
        <Row>
          <Col span={6}>
            {/* listprops就包含menulist，通过HierarchyGetall()接口获取到 */}
            <Tree {...Treeprops} />
          </Col>
          <Col span={18} style={{ width: '74%', marginRight: '1%' }}>
            <Row>
              {/* <Search /> */}
              <List {...Listprops} />
            </Row>
          </Col>
        </Row>
        <Modal
          title="实时视频播放"
          visible={rtspVisible}
          width={770}
          height={500}
          destroyOnClose
          onCancel={this.videoDialogCancel}
          footer={[
            <Button key="back" onClick={this.videoDialogCancel}>关闭</Button>,
          ]}
        >
          <VideoDialog {...videoprop} />
        </Modal>
      </div>
    );
  }
}
function mapStateToProps({ octAreaDetail, common, loading }) {
  return { octAreaDetail, common, loading: loading.models.octAreaDetail };
}
export default connect(mapStateToProps)(AreaDetail);
