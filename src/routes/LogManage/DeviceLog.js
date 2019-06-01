/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/LogManage/DeviceLogSearch';
import List from '../../components/LogManage/DeviceLogList';
import Info from '../../components/LogManage/DeviceLogInfo';
import { LOGTYPE } from '../../config/enums';

class DeviceLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 详情弹窗
      currentId: '',
    };
  }

  render() {
    const { devicelog, common, dispatch, loading } = this.props;
    const {
      loglist,
      loginfo,
      queryobj,
      pagination,
      menus,
    } = devicelog;
    const { confirm } = Modal;
    const { enumList, codeList } = common;
    const { visible, currentId } = this.state;
    // 获取日志类型枚举值对应关系
    const logTypeEnumMap = {};
    for (let i = 0; i < enumList.length; i += 1) {
      const obj = enumList[i];
      if (obj.enumtypeid === (LOGTYPE || '')) {
        logTypeEnumMap[obj.enumvalue] = obj.enumname;
      }
    }
    // 获取功能模块对应关系
    const menusMap = {};
    for (let i = 0; i < menus.length; i += 1) {
      const menu = menus[i];
      menusMap[menu.id] = menu.name;
    }
    const searchprops = {
      queryobj,
      enumList,
      codeList,
      menus,
      onSearch: (query) => {
        dispatch({
          type: 'devicelog/queryLog',
          payload: query,
        });
      },
    };
    const listprops = {
      pagination,
      loglist,
      enumList,
      codeList,
      menus,
      loading,
      currentId,
      // 分页
      onPageChange(page) {
        dispatch({
          type: 'devicelog/updateState',
          payload: {
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
      },
      // 查看详情
      onView: (record) => {
        dispatch({ type: 'devicelog/updateState', payload: { loginfo: record } });
      },
      // 导出
      onDownload: () => {
        // console.log(searchprops.queryobj);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/logmanage/downLoad';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(searchprops.queryobj);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        if (loglist.length < 1000) {
          formElement.submit();
          document.body.removeChild(formElement);
        } else if (loglist.length < 100000) {
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
    const infoprops = {
      loginfo,
      enumList,
      menus,
    };
    return (
      <div>
        <Search {...searchprops} />
        <Row>
          <Col span={18} style={{ width: '74%', marginRight: '1%' }}>
            <List {...listprops} />
          </Col>
          <Col span={6}>
            <Info {...infoprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ devicelog, common, loading }) {
  return { devicelog, common, loading: loading.models.devicelog };
}
export default connect(mapStateToProps)(DeviceLog);
