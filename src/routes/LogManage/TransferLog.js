/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/LogManage/TransferLogSearch';
import List from '../../components/LogManage/TransferLogList';
import { LOGTYPE } from '../../config/enums';

class TransferLog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 详情弹窗
      currentId: '',
    };
  }

  render() {
    const { transferlog, common, dispatch } = this.props;
    const {
      loglist,
      loginfo,
      queryobj,
      pagination,
      menus,
    } = transferlog;
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
          type: 'transferlog/queryLog',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page, queryflag: 0 },
        });
        dispatch({ type: 'transferlog/updateState', payload: { loginfo: {} } });
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
          type: 'transferlog/queryLog',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
            queryflag: 1, // 点击查询和点击翻页标志位 0--查询 1--翻页
          },
        });
      },
      // 查看详情
      onView: (record) => {
        dispatch({ type: 'transferlog/updateState', payload: { loginfo: record } });
        dispatch({
          type: 'transferlog/logDetailLog',
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
        const excelName = '传输日志查询';
        const head = {
          serverip: '服务器ip',
          recordtime: '记录时间',
          filename: '传输文件名',
          failreason: '失败原因描述',
        };
        const result = [];
        for (let i = 0; i < loglist.length; i += 1) {
          const log = loglist[i];
          result.push(
            {
              serverip: log.requestsysip,
              recordtime: log.recordtime,
              filename: log.xmlname,
              failreason: log.errormsg,
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
            type: 'transferlog/exportLog',
            payload: { excelName, head, result },
          }).then((data) => {
            if (data && data.result) {
              dispatch({
                type: 'transferlog/exportLogRecord',
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
          <Col>
            <List {...listprops} />
          </Col>
        </Row>
      </div>
    );
  }
}
function mapStateToProps({ transferlog, common }) {
  return { transferlog, common };
}
export default connect(mapStateToProps)(TransferLog);
