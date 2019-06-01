/**
 * Created by cherry on 2018/7/10.
 */
import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../components/HostLogQuery/HostLogSearch';
import List from '../components/HostLogQuery/HostLogList';
import Info from '../components/HostLogQuery/HostLogInfo';
import { LOGTYPE } from '../config/enums';

class HostLogQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 详情弹窗
      currentId: '',
    };
  }

  render() {
    const { hostlogquery, common, dispatch } = this.props;
    const {
      hostloglist,
      loginfo,
      queryobj,
      pagination,
      menus,
    } = hostlogquery;
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
          type: 'hostlogquery/queryLog',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page, queryflag: 0 },
        });
        dispatch({ type: 'hostlogquery/updateState', payload: { loginfo: {} } });
        this.setState({
          currentId: '',
        });
      },
    };
    const listprops = {
      pagination,
      hostloglist,
      enumList,
      codeList,
      menus,
      currentId,
      // 分页
      onPageChange(page) {
        dispatch({
          type: 'hostlogquery/queryLog',
          payload: {
            queryobj,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
            queryflag: 1, // 点击查询和点击翻页标志位 0--查询 1--翻页
          },
        });
      },
      // 查看详情
      onView: (record) => {
        dispatch({ type: 'hostlogquery/updateState', payload: { loginfo: record } });
        dispatch({
          type: 'hostlogquery/logDetailLog',
          payload: {
            ...record,
            failcode: record.failcode ? '失败' : '成功',
            firstmenuid: menusMap[record.firstmenuid],
          } });
        this.setState({
          visible: true,
          currentId: record.id,
        });
      },
      // 导出
      onExport: () => {
        const excelName = '主机日志查询';
        const head = {
          eventdesc: '事件描述',
          creationtime: '记录生成时间',
          eventtime: '事件发生时间',
          inserttime: '日志入库时间',
          note: '备注',
        };
        const result = [];
        for (let i = 0; i < hostloglist.length; i += 1) {
          const log = hostloglist[i];
          result.push(
            {
              id: log.id,
              eventdesc: log.eventdesc,
              creationtime: log.creationtime,
              eventtime: log.eventtime,
              inserttime: log.inserttime,
              note: log.note,
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
            type: 'hostlogquery/exportLog',
            payload: { excelName, head, result },
          }).then((data) => {
            if (data && data.result) {
              dispatch({
                type: 'hostlogquery/exportLogRecord',
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
      hostloglist,
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
function mapStateToProps({ hostlogquery, common }) {
  return { hostlogquery, common };
}
export default connect(mapStateToProps)(HostLogQuery);
