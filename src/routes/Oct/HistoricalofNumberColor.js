import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/common/historysearch';
import List from '../../components/oct/common/historylist';

const { confirm } = Modal;

class HistoricalofNumberColor extends React.Component {
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
      type: 'octHistoricalofNumberColor/queryMenuList',
      payload: {},
    });
  }

  render() {
    const { octHistoricalofNumberColor, common, dispatch, loading } = this.props;
    const { dataSource } = this.state;
    const {
      queryobj,
      pagination,
      resultlist,
      treeData,
      imglist,
    } = octHistoricalofNumberColor;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const myThis = this;
    const columns = [
      {
        title: '设备分组',
        width: '12.5%',
        align: 'center',
        dataIndex: 'groupname',
        key: 'groupname',
      },
      {
        title: '蓝牌车辆',
        width: '12.5%',
        align: 'center',
        dataIndex: 'cpn_blue',
        key: 'cpn_blue',
      },
      {
        title: '黄牌车辆',
        width: '12.5%',
        dataIndex: 'cpn_yellow',
        key: 'cpn_yellow',
        align: 'center',
      },
      {
        title: '新能源小车',
        width: '12.5%',
        dataIndex: 'cpn_ne_small',
        key: 'cpn_ne_small',
        align: 'center',
      },
      {
        title: '新能源大车',
        width: '12.5%',
        dataIndex: 'cpn_ne_big',
        key: 'cpn_ne_big',
        align: 'center',
      },
      {
        title: '其它类型车',
        width: '12.5%',
        dataIndex: 'cpn_other',
        key: 'cpn_other',
        align: 'center',
      },
      {
        title: '汇总',
        width: '12.5%',
        dataIndex: 'cpn_total',
        key: 'cpn_total',
        align: 'center',
      },
      {
        title: '时间',
        width: '12.5%',
        dataIndex: 'rec_time',
        key: 'time',
        rec_time: 'center',
        align: 'center',
      },
    ];
    const searchprops = {
      title: '号牌颜色历史记录',
      queryobj,
      enumList,
      dataSource,
      visible: true,
      treeData,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octHistoricalofNumberColor/queryHistoricalofNumberColor',
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
          type: 'octHistoricalofNumberColor/updateState',
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
        formElement.action = '/HiatmpPro/bsp/chartList/download_plateColor';
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

function mapStateToProps({ octHistoricalofNumberColor, common, loading }) {
  return ({
    octHistoricalofNumberColor,
    common,
    loading: loading.models.octHistoricalofNumberColor,
  });
}
export default connect(mapStateToProps)(HistoricalofNumberColor);
