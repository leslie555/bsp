import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/common/historysearch';
import List from '../../components/oct/common/historylist';

const { confirm } = Modal;

class HistorDevicestatus extends React.Component {
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
      type: 'octHistorDevicestatus/queryMenuList',
      payload: {},
    });
  }

  render() {
    const { octHistorDevicestatus, common, dispatch, loading } = this.props;
    const { dataSource } = this.state;
    const {
      queryobj,
      pagination,
      resultlist,
      treeData,
      imglist,
    } = octHistorDevicestatus;
    console.log(resultlist);
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const myThis = this;
    const columns = [
      {
        title: '合计',
        width: '20%',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      }, {
        title: '在线设备',
        width: '20%',
        dataIndex: 'roadname',
        key: 'roadname',
        align: 'center',
      }, {
        title: '正常设备',
        width: '20%',
        dataIndex: 'plate_all',
        key: 'plate_all',
        align: 'center',
      }, {
        title: '故障设备',
        width: '20%',
        dataIndex: 'laneno',
        key: 'laneno',
        align: 'center',
      }, {
        title: '时间',
        width: '20%',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      },
    ];
    const searchprops = {
      title: '设备状态历史记录',
      queryobj,
      enumList,
      dataSource,
      treeData,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octHistorDevicestatus/queryHistorDevicestatus',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      columns,
      imglist,
      pagination,
      currentId,
      resultlist,
      enumList,
      loading,
      showV: true,
      onPageChange: (page) => {
        dispatch({
          type: 'octHistorDevicestatus/queryHistorDevicestatus',
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
      onDownload: (record) => {
        console.log(record);
        console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/illegalevent/downloadFile';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(searchprops.queryobj);
        console.log(inputElement);
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

function mapStateToProps({ octHistorDevicestatus, common, loading }) {
  return ({
    octHistorDevicestatus,
    common,
    loading: loading.models.octHistorDevicestatus,
  });
}
export default connect(mapStateToProps)(HistorDevicestatus);
