/**
 * Created by ljf on 2018/10/05.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Button, Row, Col } from 'antd';
import Search from '../../components/oct/DeviceSearch';
import List from '../../components/oct/DeviceList';
import VideoDialog from '../../components/oct/common/Rtsp';

const { confirm } = Modal;

class DepartmentManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      flag: '2', // 1：添加，2：详情，3：编辑
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
      payloadNow: null,
      dataSource: [], // 设备详情弹窗的设备搜索数据源
      rtspVisible: false, // 是否显示实时视频弹窗
      rtspURL: 'rtsp://20.1.30.199/realtime.264', // rtsp地址
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octDeviceInfo/queryMenuList',
      payload: {},
    });
    dispatch({
      type: 'octDeviceInfo/queryMenuListJ',
      payload: {},
    });
  }

  videoDialogCancel = () => {
    this.setState({ rtspVisible: false });
  }

  render() {
    const { octDeviceInfo, common, dispatch, octQueryOriginal, visible, loading } = this.props;
    const {
      list,
      departmentlist,
      departmentinfo,
      queryobj,
      treeData,
      treeDataJ,
      pagination,
    } = octDeviceInfo;
    const { enumList, codeList } = common;
    const myThis = this;
    const { flag, selectedKeys, currentId, dataSource, payloadNow,
      rtspVisible, rtspURL } = this.state;
    const videoprop = {
      rtspURL,
    };
    const searchprops = {
      queryobj,
      enumList,
      codeList,
      treeData,
      treeDataJ,
      dataSource,
      handleSearch: (value) => {
        if (value.length >= 5) {
          const queryBody = { deviceid: value };
          dispatch({ type: 'octCarRecord/getDeviceID', payload: { queryobj: { ...queryobj, ...queryBody } } }).then((data) => {
            if (data && data.result) {
              myThis.setState({
                dataSource: data.list,
              });
            } else {
              // aaa
            }
          });
        } else {
          myThis.setState({ dataSource: [] });
        }
      },
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octDeviceInfo/queryDevice',
          payload: { queryobj: { ...query }, pagination: page },
        });
        // dispatch({ type: 'octDeviceInfo/updateState', payload: { departmentlist: [] } });
        this.setState({
          flag: '2',
          currentId: '',
          selectedKeys: [],
          payloadNow: { queryobj: { ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      loading,
      pagination,
      departmentlist,
      enumList,
      list,
      queryobj,
      codeList,
      selectedKeys,
      treeData,
      treeDataJ,
      currentId,
      dataSource,
      handleSearch: (value) => {
        if (value.length >= 3) {
          const queryBody = { deviceid: value };
          dispatch({ type: 'octCarRecord/getDeviceID', payload: { queryobj: { ...queryobj, ...queryBody } } }).then((data) => {
            if (data && data.result) {
              myThis.setState({
                dataSource: data.list,
              });
            } else {
              // aaa
            }
          });
        } else {
          myThis.setState({ dataSource: [] });
        }
      },
      // 分页
      onPageChange: (page) => {
        dispatch({
          type: 'octDeviceInfo/queryDevice',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
        this.setState({
          selectedKeys: [],
          payloadNow: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
      },
      // 查看详情
      onView: (record) => {
        // console.log(record);
        dispatch({ type: 'octDeviceInfo/updateState', payload: { departmentinfo: record } });
        this.setState({
          flag: '2',
          currentId: record.deviceid,
        });
      },
      onAddNew: (department) => {
        debugger;
        dispatch({ type: 'octDeviceInfo/addDevice', payload: { department } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag == 1) {
              // const page = { ...pagination, current: 1 };
              dispatch({
                type: 'octDeviceInfo/queryDevice',
                payload: payloadNow,
              });
              // dispatch({ type: 'octDeviceInfo/updateState', payload: { departmentlist: [] } });
              this.setState({
                flag: '2',
              });
            }
          } else {
            Modal.error({
              title: '操作失败',
              content: '操作失败，请联系管理员。',
            });
          }
        });
      },
      onAddEdit: (department) => {
        dispatch({ type: 'octDeviceInfo/updateDevice', payload: { department } }).then((data) => {
          if (data && data.result) {
            message.info(data.info);
            if (data.flag == 1) {
              const page = { ...pagination, current: 1 };
              dispatch({
                type: 'octDeviceInfo/queryDevice',
                payload: payloadNow,
              });
              // dispatch({ type: 'octDeviceInfo/updateState', payload: { departmentlist: [] } });
              this.setState({
                flag: '2',
              });
            }
          } else {
            Modal.error({
              title: '操作失败',
              content: '操作失败，请联系管理员。',
            });
          }
        });
      },
      // 编辑设备信息
      onEdit: (record) => {
        dispatch({ type: 'octDeviceInfo/updateState', payload: { departmentinfo: record } });
        this.setState({
          flag: '3',
          currentId: record.deviceid,
          selectedKeys: [],
        });
      },
      // 添加设备信息
      onAdd: () => {
        dispatch({ type: 'octDeviceInfo/addSon', payload: { departmentinfo: {} } });
        this.setState({
          flag: '1',
          currentId: '',
          selectedKeys: [],
        });
      },
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
      // 删除一个和多个设备信息
      onDelete: (deviceId) => {
        if (deviceId === null || deviceId === '') {
          message.warn('请选择一条数据进行删除');
          return;
        }
        const curthis = this;
        let szTitle = '删除确认';
        let szMsg = '确定要删除该设备吗？';
        if (selectedKeys.length > 1) {
          szMsg = '确定要删除这些设备吗？';
          szTitle = '批量删除确认';
        }
        confirm({
          title: szTitle,
          content: szMsg,
          okText: '确定',
          cancelText: '取消',
          onOk() {
            dispatch({ type: 'octDeviceInfo/deleteDevice', payload: { deviceid: deviceId } }).then((data) => {
              if (data && data.result) {
                message.info(data.info);
                dispatch({
                  type: 'octDeviceInfo/queryDevice',
                  payload: payloadNow,
                });
              }
            });
          },
          onCancel() {
            curthis.setState({
              selectedKeys: [],
            });
          },
        });
      },
      changeSelected: (keys) => {
        this.setState({
          selectedKeys: keys,
        });
      },
      // 批量导出数据
      onDownload: (record) => {
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/octdevice/downLoadFile1';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'department';
        inputElement.value = JSON.stringify(searchprops.queryobj);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        if (pagination.total < 1000) {
          formElement.submit();
          document.body.removeChild(formElement);
        } else if (pagination.total < 100000) {
          confirm({
            title: '导出确认',
            content: '由于数据量很大导出需要一定时间，确认导出？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              formElement.submit();
              document.body.removeChild(formElement);
            },
            onCancel() {
              // alert('操作取消');
            },
          });
        } else {
          message.warning('数据大于100000条,禁止导出');
        }
      },
    };

    return (
      <div>
        <Row>
          <Col span={24} style={{ width: '100%', paddingRight: '1%' }}>
            <Search {...searchprops} />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ width: '100%', paddingRight: '1%' }}>
            <List {...listprops} />
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
function mapStateToProps({ octDeviceInfo, common, loading }) {
  return { octDeviceInfo, common, loading: loading.models.octDeviceInfo };
}
export default connect(mapStateToProps)(DepartmentManage);
