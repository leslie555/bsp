/**
 * Created by ljf on 2018/10/05.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Button, Row, Col } from 'antd';
import Search from '../../components/oct/CheckTimeDeviceSearch';
import List from '../../components/oct/CheckTimeDeviceList';

const { confirm } = Modal;

class CheckDeviceTime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
      dataSource: [], // 设备详情弹窗的设备搜索数据源
    };
  }

  render() {
    const { octCheckDeviceTime, dispatch, common, loading } = this.props;
    const {
      departmentlist,
      queryobj,
      pagination,
    } = octCheckDeviceTime;
    // console.log('typeandid', type, deviceid);
    const { codeList, enumList } = common;
    const { selectedKeys, currentId, dataSource } = this.state;
    const searchprops = {
      queryobj,
      codeList,
      enumList,
      dataSource,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octCheckDeviceTime/queryDevice',
          payload: {
            queryobj: { ...queryobj, ...query },
            pagination: page,
          },
        });
      },
    };
    const listprops = {
      loading,
      pagination,
      departmentlist,
      enumList,
      queryobj,
      codeList,
      currentId,
      dataSource,
      // 分页
      onPageChange: (page) => {
        dispatch({
          type: 'octCheckDeviceTime/queryDevice',
          payload: {
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
            queryobj,
          },
        });
        this.setState({
          selectedKeys: [],
        });
      },
      // 查看详情
      onView: (record) => {
        dispatch({ type: 'octCheckDeviceTime/updateState', payload: { departmentinfo: record } });
        this.setState({
          currentId: record.deviceid,
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
      </div>
    );
  }
}
function mapStateToProps({ octCheckDeviceTime, common, loading }) {
  return { octCheckDeviceTime, common, loading: loading.models.octCheckDeviceTime };
}
export default connect(mapStateToProps)(CheckDeviceTime);
