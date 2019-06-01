/**
 * Created by hc on 2018/10/15.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../components/AlarmQuery/AlarmSearch';
import List from '../components/AlarmQuery/AlarmList';
import { ALARMTYPE } from '../config/enums';
import Info from '../components/AlarmQuery/AlarmInfo';

class AlarmQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 详情弹窗
      currentId: '',
    };
  }

  render() {
    const { alarmquery, common, dispatch } = this.props;
    const {
      alarmlist,
      alarminfo,
      queryobj,
      pagination,
      menus,
    } = alarmquery;
    const { enumList, codeList } = common;
    const { visible, currentId } = this.state;
    // 获取日志类型枚举值对应关系
    const logTypeEnumMap = {};
    for (let i = 0; i < enumList.length; i += 1) {
      const obj = enumList[i];
      if (obj.enumtypeid === (ALARMTYPE || '')) {
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
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'alarmquery/queryLog',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page, queryflag: 0 },
        });
        dispatch({ type: 'alarmquery/updateState', payload: { alarminfo: {} } });
        this.setState({
          currentId: '',
        });
      },
    };
    const listprops = {
      pagination,
      alarmlist,
      enumList,
      codeList,
      menus,
      currentId,
      // 分页
      onPageChange(page) {
        dispatch({
          type: 'alarmquery/queryLog',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
            queryflag: 1, // 点击查询和点击翻页标志位 0--查询 1--翻页
          },
        });
      },
      // 查看详情
      onView: (record) => {
        dispatch({ type: 'alarmquery/updateState', payload: { alarminfo: record } });
        dispatch({
          type: 'alarmquery/logDetailLog',
          payload: {
            ...record,
            logtype: logTypeEnumMap[record.logtype],
            failcode: record.failcode ? '失败' : '成功',
            firstmenuid: menusMap[record.firstmenuid],
          } });
        this.setState({
          visible: true,
          currentId: record.nid,
        });
      },
      // 导出
      onExport: () => {
        const excelName = '日志查询';
        const head = {
          adeviceid: '设备编号',
          balarmtime: '报警时间',
          calarmtype: '报警类型',
          dorgtype: '处理机构',
          edealflag: '处理标志',
          fdealtime: '处理时间',
          goperator: '操作人',
          halarminfo: '报警内容',
        };
        const result = [];
        for (let i = 0; i < alarmlist.length; i += 1) {
          const log = alarmlist[i];
          result.push(
            {
              adeviceid: log.deviceid,
              balarmtime: log.alarmtime,
              calarmtype: logTypeEnumMap[log.alarmtype],
              dorgtype: log.orgtype,
              edealflag: (log.dealflag == '0' ? '未处理' : (log.dealflag == '1' ? '误报处理' : '简单处理')),
              fdealtime: log.dealtime,
              goperator: log.operator,
              halarminfo: log.alarminfo,
            });
        }
        if (result.length === 0) {
          Modal.warning({
            title: '提示',
            content: '列表中无数据',
            okText: '确定',
          });
        } else {
          const params = queryobj;
          dispatch({
            type: 'alarmquery/exportLog',
            payload: { excelName, head, result },
          }).then((data) => {
            if (data && data.result) {
              dispatch({
                type: 'alarmquery/exportLogRecord',
                payload: { queryobj: params, pagination },
              });
              if (data.file) {
                message.success('导出成功！');
                const obj = data.file;
                const a = document.createElement('a');
                // if (data.devMode) {
                //   a.href = encodeURI(encodeURI(obj.url));
                // } else {
                a.href = obj.url;
                // }
                a.target = '_blank';
                a.download = obj.filename;
                const o = document.body;
                o.appendChild(a).click();
              }
            } else {
              message.error('导出失败！');
            }
          });
        }
      },
    };
    const infoprops = {
      alarminfo,
      enumList,
      visible,
      menus,
      onCloseModal: () => {
        this.setState({
          visible: false,
        });
      },
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
function mapStateToProps({ alarmquery, common }) {
  return { alarmquery, common };
}
export default connect(mapStateToProps)(AlarmQuery);
