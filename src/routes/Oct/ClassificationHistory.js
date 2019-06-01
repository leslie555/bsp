import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/common/historysearch';
import List from '../../components/oct/common/historylist';

const { confirm } = Modal;

class ClassificationHistory extends React.Component {
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
      type: 'octClassificationHistory/queryMenuList',
      payload: {},
    });
  }

  render() {
    const { octClassificationHistory, common, dispatch, loading } = this.props;
    const { dataSource } = this.state;
    const {
      queryobj,
      pagination,
      resultlist,
      treeData,
    } = octClassificationHistory;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const myThis = this;

    const searchprops = {
      title: '车籍分类历史记录',
      queryobj,
      enumList,
      dataSource,
      treeData,
      visible: true,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octClassificationHistory/queryClassificationHistory',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const columns = [
      {
        title: '设备分组',
        width: '14%',
        align: 'center',
        dataIndex: 'groupname',
        key: 'groupname',
      },
      {
        title: '川A车辆',
        width: '14%',
        dataIndex: 'countsca',
        key: 'countsca',
        align: 'center',
      },
      {
        title: '省内异地',
        width: '14%',
        dataIndex: 'countnotasc',
        key: 'countnotasc',
        align: 'center',
      },
      {
        title: '省外异地',
        width: '14%',
        dataIndex: 'countnotsc',
        key: 'countnotsc',
        align: 'center',
      },
      {
        title: '川A出租',
        width: '14%',
        dataIndex: 'counttaxi',
        key: 'counttaxi',
        align: 'center',
      },
      {
        title: '汇总',
        width: '14%',
        dataIndex: 'countall',
        key: 'countall',
        align: 'center',
      },
      {
        title: '日期时间',
        width: '16%',
        dataIndex: 'rec_date',
        key: 'rec_date',
        align: 'center',
      },
    ];
    const listprops = {
      columns,
      pagination,
      currentId,
      resultlist,
      enumList,
      showV: true,
      loading,
      onPageChange: (page) => {
        console.log(page);
        dispatch({
          type: 'octClassificationHistory/updateState',
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
        console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/chartList/download_classification';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(searchprops.queryobj);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        if (resultlist.length < 1000) {
          formElement.submit();
          document.body.removeChild(formElement);
        } else if (resultlist.length < 100000) {
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

function mapStateToProps({ octClassificationHistory, common, loading }) {
  return ({
    octClassificationHistory,
    common,
    loading: loading.models.octClassificationHistory,
  });
}
export default connect(mapStateToProps)(ClassificationHistory);
