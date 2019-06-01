import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/CarRecordSearch';
import List from '../../components/oct/CarRecordList';
import { downloadPic } from '../../services/octRoadSection';

const { confirm } = Modal;

class CarRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
      dataSource: [],
      visiblePic: false,
      deviceUrl: [],
      loadingDevice: true,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octCarRecord/queryMenuList',
      payload: {},
    });
  }

  handleCloseUrl = () => {
    this.setState({
      visiblePic: false,
    });
  }

  render() {
    const { octCarRecord, common, dispatch, loading } = this.props;
    const { dataSource } = this.state;
    const myThis = this;
    const {
      queryobj,
      treeData,
      pagination,
      resultlist,
    } = octCarRecord;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId, loadingDevice, visiblePic, deviceUrl } = this.state;
    const searchprops = {
      queryobj,
      treeData,
      enumList,
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
        }
      },
      onSearch: (value) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octCarRecord/queryDevice', // 动作
          payload: { queryobj: { ...queryobj, ...value }, pagination: page }, // 要传递的消息
        });
      },
    };
    const listprops = {
      pagination,
      currentId,
      resultlist,
      enumList,
      loading,
      onPageChange: (page) => {
        dispatch({
          type: 'octCarRecord/queryDevice',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
        this.setState({
          selectedKeys: [],
        });
      },
      onView: (record) => {
      },
      changeSelected: (keys) => {
        this.setState({
          selectedKeys: keys,
        });
      },
      onDetail: (query) => {
        // const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octCarRecord/queryDetail',
          payload: { queryobj: { ...queryobj, ...query } },
        });
      },
      onDownload: (record) => {
        console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/vehiclerecord/downloadFile';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
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
      onDownloadPic: (record) => {
        // OLD
        // console.log(searchprops.queryobj);
        // const formElement = document.createElement('form');
        // formElement.style.display = 'display:none;';
        // formElement.method = 'post';
        // formElement.action = '/HiatmpPro/bsp/vehiclerecord/downloadFilePic';
        // formElement.target = 'callBackTarget';
        // const inputElement = document.createElement('input');
        // inputElement.type = 'hidden';
        // inputElement.name = 'params';
        // inputElement.value = JSON.stringify(searchprops.queryobj);
        // formElement.appendChild(inputElement);
        // document.body.appendChild(formElement);
        // if (pagination.total < 1000) {
        //   formElement.submit();
        //   document.body.removeChild(formElement);
        // } else if (pagination.total < 100000) {
        //   confirm({
        //     title: '导出确认',
        //     content: '由于数据量很大导出需要一定时间，确认导出？',
        //     okText: '确定',
        //     cancelText: '取消',
        //     onOk() {
        //       formElement.submit();
        //       document.body.removeChild(formElement);
        //     },
        //     onCancel() {
        //       // alert('操作取消');
        //     },
        //   });
        // } else {
        //   message.warning('数据大于100000条,禁止导出');
        // }
        // OLD至此
        const that = this;
        if (pagination.total < 100000) {
          confirm({
            title: '导出确认',
            content: '由于数据量很大导出需要一定时间，确认导出？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              // formElement.submit();
              // document.body.removeChild(formElement);
              that.setState({
                visiblePic: true,
                loadingDevice: true,
              });
              downloadPic({ ...searchprops.queryobj, type: 'guoche' }).then((r) => {
                // debugger;
                if (r.result) {
                  that.setState({
                    deviceUrl: r.list,
                    visiblePic: true,
                    loadingDevice: false,
                  });
                }
              }).catch((e) => {
              });
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
          <Col span={24} style={{ width: '100%', paddingBottom: '0' }}>
            <Search {...searchprops} />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
            <List {...listprops} />
          </Col>
        </Row>
        <Modal
          visible={visiblePic}
          footer={null}
          title="下载地址"
          // cancelText="关闭"
          onCancel={this.handleCloseUrl}
        >
          <div style={{ paddingBottom: 20 }}>
            {
              loadingDevice ? (
                <div>正在打包中，请稍等</div>
              )
                :
                (
                  deviceUrl.map((item, index) =>
                    (
                      <p>
                        <span>地址{index + 1}:</span>
                        <a href={`/HiatmpPro${item}`} target="_blank" rel="noopener noreferrer">{item}</a>
                      </p>
                    )
                  )
                )
            }
          </div>
        </Modal>
      </div>
    );
  }
}
function mapStateToProps({ octCarRecord, common, loading }) {
  return { octCarRecord, common, loading: loading.models.octCarRecord };
}
export default connect(mapStateToProps)(CarRecord);
