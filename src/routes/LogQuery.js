/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../components/LogQuery/LogSearch';
import List from '../components/LogQuery/LogList';
import Info from '../components/LogQuery/LogInfo';
import { LOGTYPE } from '../config/enums';

class LogQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 详情弹窗
      currentId: '',
    };
  }

  render() {
    const { logquery, common, dispatch } = this.props;
    const {
      loglist,
      loginfo,
      queryobj,
      pagination,
      menus,
    } = logquery;
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
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'logquery/queryLog',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page, queryflag: 0 },
        });
        dispatch({ type: 'logquery/updateState', payload: { loginfo: {} } });
        this.setState({
          currentId: '',
        });
      },
    };
    const listprops = {
      pagination,
      loglist,
      enumList,
      codeList,
      menus,
      currentId,
      // 分页
      onPageChange(page) {
        dispatch({
          type: 'logquery/queryLog',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
            queryflag: 1, // 点击查询和点击翻页标志位 0--查询 1--翻页
          },
        });
      },
      // 查看详情
      onView: (record) => {
        dispatch({ type: 'logquery/updateState', payload: { loginfo: record } });
        dispatch({
          type: 'logquery/logDetailLog',
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
          ausername: '用户名称',
          bdepartmentname: '部门名称',
          clientip: 'IP地址',
          dlogtime: '操作时间',
          elogtype: '日志类型',
          failcode: '操作结果',
          gfunction: '功能模块',
          hfunctionname: '功能名称',
          operatecontent: '操作内容',
        };
        const result = [];
        for (let i = 0; i < loglist.length; i += 1) {
          const log = loglist[i];
          result.push(
            {
              ausername: log.username,
              bdepartmentname: log.departmentname,
              clientip: log.clientip,
              dlogtime: log.logtime,
              elogtype: logTypeEnumMap[log.logtype],
              failcode: log.failcode ? '失败' : '成功',
              gfunction: menusMap[log.firstmenuid],
              hfunctionname: log.functionname,
              operatecontent: log.operatecontent,
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
            type: 'logquery/exportLog',
            payload: { excelName, head, result },
          }).then((data) => {
            if (data && data.result) {
              dispatch({
                type: 'logquery/exportLogRecord',
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
      loginfo,
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
function mapStateToProps({ logquery, common }) {
  return { logquery, common };
}
export default connect(mapStateToProps)(LogQuery);
