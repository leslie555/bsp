import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/collectionreportSearch';
import List from '../../components/oct/collectionReportList';

const { confirm } = Modal;

class CollectionReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
      dataSource: [],
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octCollectionReport/querydevicegroup',
      payload: {},
    });
    dispatch({
      type: 'octDeviceGroup/queryMenuList',
      payload: {},
    });
    dispatch({
      type: 'octDeviceGroup/queryDeviceByGroupsum',
      payload: { id: '1' },
    });
    dispatch({
      type: 'octDeviceGroup/getResourceTree',
      payload: {},
    });
  }

  render() {
    const { octCollectionReport, octDeviceGroup, common, dispatch, loading, loadings } = this.props;
    const { selectedKeys, currentId, dataSource } = this.state;
    /*
    menuList树形结构
    expandedKeys选中的设备
    devicelistsum 总的设备
    */
    const { menuList, devicelistsum, devicelist } = octDeviceGroup;
    const {
      queryobj,
      pagination,
      list,
      Data,
      imgvideo,
    } = octCollectionReport;
    const { enumList, codeList } = common;
    const myThis = this;
    const searchprops = {
      queryobj,
      enumList,
      Data,
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
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octCollectionReport/getCollectionReportData',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      pagination,
      currentId,
      imgvideo,
      resultlist: list,
      enumList,
      menuList,
      devicelistsum,
      devicelist,
      loading,
      dispatch,
      loadings,
      onPageChange: (page) => {
        dispatch({
          type: 'octCollectionReport/getCollectionReportData',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
        this.setState({
          selectedKeys: [],
        });
      },
      changeSelected: (keys) => {
        this.setState({
          selectedKeys: keys,
        });
      },
      onDetail: (query) => {
        dispatch({
          type: 'octTrafficIncident/queryDetail',
          payload: { queryobj: { ...queryobj, ...query } },
        });
      },
      onDownload: (record) => {
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/devicecheck/downloadFile';
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
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octTrafficIncident/queryDevice',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
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
      </div>
    );
  }
}
function mapStateToProps({ octCollectionReport, octDeviceGroup, common, loading, loadings }) {
  return {
    octCollectionReport,
    octDeviceGroup,
    common,
    loading: loading.models.octCollectionReport,
    loadings: loading.models.octDeviceGroup,
  };
}
export default connect(mapStateToProps)(CollectionReport);
