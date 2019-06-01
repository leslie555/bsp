import React from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Modal, message, Row, Col, Button, Table, Icon, Form, Input, notification, Badge } from 'antd';
import codeMessage from '../../utils/request';
import StatusSelect from '../../components/oct/VersionStatusSelect';
import StatusSearch from '../../components/oct/VersionStatusSearch';
import { JKZT } from '../../config/enums';

const { confirm } = Modal;

class VersionStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      configvisible: false, // 修改配置文件是否显示
      detailevisible: false, // 接口服务器详情是否显示
      editconfig: false, // 修改配置文件是否显示
      oldip: '', // 接口ip
      serverdata: '', // 服务器配置文件内容
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        pageSize: 10,
        total: null,
        onShowSizeChange: (() => {
          setTimeout(() => {
            window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
          }, 1000);
        }),
      },
      configpagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        pageSize: 10,
        total: null,
        onShowSizeChange: (() => {
          setTimeout(() => {
            window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
          }, 1000);
        }),
      },
      detailepagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        pageSize: 10,
        total: null,
        onShowSizeChange: (() => {
          setTimeout(() => {
            window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
          }, 1000);
        }),
      },
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octVersionStatus/getServerStatus',
      payload: {},
    });
  }

  // 根据枚举值获取枚举名
  getEnumValue(enumtypeid, enumvalue) {
    const { common } = this.props;
    const { enumList, codeList } = common;
    for (let i = 0; i < enumList.length; i += 1) {
      if (enumList[i].enumtypeid == enumtypeid && enumList[i].enumvalue == enumvalue) {
        console.log('enumObj.enumname', enumList[i].enumname);
        return enumList[i].enumname;
      }
    }
    return null;
  }

  // 显示修改配置文件
  handleConfig = () => {
    this.setState({ configvisible: true });
  }

  // 关闭修改配置文件
  handleConfigclose = () => {
    this.setState({ configvisible: false });
  }

  // 升级按钮
  handleUpdate = () => {
    location.hash = '#/versionUpload';
  }

  // 显示接口服务器详情
  showdetaile = (v) => {
    const { dispatch } = this.props;
    if (v) {
      // dispatch({
      //   type: 'octVersionStatus/GetServiceDevice',
      //   payload: {
      //     interfaceId: v.interfaceip,
      //   },
      // });
      this.setState({ detailevisible: true, oldip: v.interfaceip });
    }
  }

  // 关闭接口服务器详情
  showdetaileclose = (v) => {
    const { dispatch } = this.props;
    this.setState({ detailevisible: false, oldip: '' });
    dispatch({
      type: 'octVersionStatus/updateState',
      payload: { detailSource: [], detailCount: 0 },
    });
  }

  checkStatus = (response) => {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    console.log(codeMessage);
    const errortext = codeMessage[response.status] || response.statusText;
    notification.error({
      message: `请求错误 ${response.status}: ${response.url}`,
      description: errortext,
    });
    const error = new Error(errortext);
    error.name = response.status;
    error.response = response;
    throw error;
  }

  parseJSON = (response) => {
    if (response.status === 210) {
      window.location.href = `/HiatmpPro/login?_g=${__modulename}&url=${encodeURIComponent(
        window.location.href
      )}`;
    } else {
      return response.json();
    }
  }

  // 显示editconfig
  showeditconfig = (v) => {
    const { dispatch } = this.props;
    this.setState({ editconfig: true, oldip: v.interfaceip });
    const initObj = {
      credentials: 'omit',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
      // body: JSON.stringify(ip),
    };
    return fetch(`http://20.2.15.33:8808/GetPropByIp?interfaceip=${v.interfaceip}`, initObj)
      .then(this.checkStatus)
      .then(this.parseJSON)
      .then(res => {
        this.setState({ serverdata: res.data });
      })
      .catch(e => {
        const status = e.name;
        if (status === 401) {
          dispatch(routerRedux.push('/exception/500'));
          return;
        }
        if (status === 403) {
          dispatch(routerRedux.push('/exception/404'));
          return;
        }
        if (status <= 504 && status >= 500) {
          dispatch(routerRedux.push('/exception/500'));
          return;
        }
        if (status >= 404 && status < 422) {
          dispatch(routerRedux.push('/exception/404'));
        }
      });
  }

  render() {
    const { octVersionStatus, common, dispatch, loading, form } = this.props;
    const { configvisible, detailevisible,
      editconfig, oldip, serverdata,
      pagination, configpagination, detailepagination } = this.state;
    const { resultlist, detailSource, detailCount } = octVersionStatus;
    const { enumList, codeList } = common;
    const myThis = this;
    const tableprops = {
      columns: [
        {
          title: '序号',
          width: '20%',
          align: 'center',
          render: (text, record, index) => `${index + 1}`,
        },
        {
          title: '接口ip',
          width: '20%',
          dataIndex: 'interfaceip',
          key: 'interfaceip',
          align: 'center',
          render: (text, record) => {
            if (text) {
              return <a onClick={() => this.showdetaile(record)}>{text}</a>;
            }
          },
        },
        {
          title: '接口名称',
          width: '20%',
          dataIndex: 'interfacename',
          key: 'interfacename',
          align: 'center',
        },
        {
          title: '版本号',
          width: '20%',
          dataIndex: 'version',
          key: 'version',
          align: 'center',
        },
        {
          title: '状态',
          width: '20%',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
          render: (text, record) => {
            if (text == '0') {
              return <Badge status="success" text={this.getEnumValue(JKZT, text)} />;
            } else if (text == '2') {
              return <Badge status="warning" text={this.getEnumValue(JKZT, text)} />;
            } else if (text == '1') {
              return <Badge status="Processing" text={this.getEnumValue(JKZT, text)} />;
            } else {
              return text;
            }
          },
        },
      ],
      dataSource: resultlist,
      loading,
      pagination,
      locale: { emptyText: '暂无数据' },
      rowKey: 'interfaceip',
      onChange: (page) => {
        this.setState({
          pagination: {
            current: page.current,
            pageSize: page.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            total: null,
            onShowSizeChange: (() => {
              setTimeout(() => {
                window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
              }, 1000);
            }),
          },
        });
      },
    };
    const configtableprops = {
      columns: [
        {
          title: '序号',
          width: '20%',
          align: 'center',
          render: (text, record, index) => `${index + 1}`,
        },
        {
          title: '接口ip',
          width: '20%',
          dataIndex: 'interfaceip',
          key: 'interfaceip',
          align: 'center',
        },
        {
          title: '接口名称',
          width: '20%',
          dataIndex: 'interfacename',
          key: 'interfacename',
          align: 'center',
        },
        {
          title: '版本号',
          width: '20%',
          dataIndex: 'version',
          key: 'version',
          align: 'center',
        },
        {
          title: '状态',
          width: '20%',
          dataIndex: 'status',
          key: 'status',
          align: 'center',
        },
        {
          title: '操作',
          width: '20%',
          dataIndex: 'action',
          key: 'action',
          align: 'center',
          render: (txt, record) => {
            return (
              <span>
                <Icon
                  type="edit"
                  style={{ fontSize: '18px', marginLeft: '4px', cursor: 'pointer' }}
                  // onClick={(e) => { onEdit(record); e.stopPropagation(); }}
                  onClick={(e) => { this.showeditconfig(record); }}
                  title="编辑"
                />
              </span>
            );
          },
        },
      ],
      dataSource: resultlist,
      loading,
      pagination: configpagination,
      locale: { emptyText: '暂无数据' },
      rowKey: 'interfaceip',
      onChange: (page) => {
        this.setState({
          configpagination: {
            current: page.current,
            pageSize: page.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            total: null,
            onShowSizeChange: (() => {
              setTimeout(() => {
                window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
              }, 1000);
            }),
          },
        });
      },
    };
    const detailetableprops = {
      columns: [
        {
          title: '设备编号',
          align: 'center',
          dataIndex: 'deviceid',
          key: 'deviceid',
        },
        {
          title: '时间日期',
          align: 'center',
          dataIndex: 'time',
          key: 'time',
        },
        {
          title: '过车总数',
          align: 'center',
          dataIndex: 'veh_count',
          key: 'veh_count',
        },
        {
          title: '违法总数',
          align: 'center',
          dataIndex: 'illegal_count',
          key: 'illegal_count',
        },
        {
          title: '事件总数',
          align: 'center',
          dataIndex: 'event_count',
          key: 'event_count',
        },
        {
          title: '交通流文件总数',
          align: 'center',
          dataIndex: 'file_count',
          key: 'file_count',
        },
        {
          title: '交通流流量总和',
          align: 'center',
          dataIndex: 'flow',
          key: 'flow',
        },
      ],
      dataSource: detailSource,
      loading,
      pagination: detailepagination,
      locale: { emptyText: '暂无数据' },
      rowKey: 'interfaceip',
      onChange: (page) => {
        this.setState({
          detailepagination: {
            current: page.current,
            pageSize: page.pageSize,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条`,
            total: null,
            onShowSizeChange: (() => {
              setTimeout(() => {
                window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
              }, 1000);
            }),
          },
        });
      },
    };
    // 接口服务器详情Modalprops
    const Modalprops = {
      title: `接口服务器${oldip}详情`,
      visible: detailevisible,
      onCancel: this.showdetaileclose,
      width: '60%',
      footer: [
        <Button onClick={this.showdetaileclose}>关闭</Button>,
      ],
    };
    // 修改配置文件Modalprops
    const configModalprops = {
      title: '修改配置文件',
      visible: configvisible,
      onCancel: this.handleConfigclose,
      width: '60%',
      footer: [
        <Button onClick={this.handleConfigclose}>关闭</Button>,
      ],
    };
    const StatusSelectprops = {
      serverdata,
      oldip,
      editconfig,
      // 关闭editconfig
      ditconfigclose: () => {
        this.setState({ editconfig: false, oldip: '' });
      },
      // 保存editconfig
      saveEditconfig: (v) => {
        if (v) {
          console.log(v);
          const { servervalue } = v;
          console.log(servervalue);
          this.setState({ editconfig: false, oldip: '' });
          const mybody = {
            interpaceIp: oldip,
            content: servervalue,
          };
          const initObj = {
            credentials: 'omit',
            headers: {
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(mybody),
          };
          return fetch(`http://20.2.15.33:8808/SetPropByIp?interpaceIp=${oldip}&content=${JSON.stringify(servervalue)}`, initObj)
            .then(this.checkStatus)
            .then(this.parseJSON)
            .then(res => {
              message.success('更新成功！');
            })
            .catch(e => {
              const status = e.name;
              if (status === 401) {
                dispatch(routerRedux.push('/exception/500'));
                return;
              }
              if (status === 403) {
                dispatch(routerRedux.push('/exception/404'));
                return;
              }
              if (status <= 504 && status >= 500) {
                dispatch(routerRedux.push('/exception/500'));
                return;
              }
              if (status >= 404 && status < 422) {
                dispatch(routerRedux.push('/exception/404'));
              }
              message.error('更新失败！');
            });
        }
      },
    };
    const StatusSearchprops = {
      oldip,
      onSearch: (value) => {
        console.log('StatusSearchprops', value);
        dispatch({
          type: 'octVersionStatus/GetServiceDevice',
          payload: value,
        });
      },
    };
    return (
      <div>
        <div className="outline-inner-padding">
          <Row>
            <Col span={18}>
              <div>接口服务器共<span className="allNumLight">{(resultlist || []).length}</span> 个</div>
            </Col>
            <Col span={2} style={{ textAlign: 'right' }}>
              <Button onClick={this.handleConfig} type="primary" style={{ margin: '0 5px' }}>修改配置文件</Button>
            </Col>
            <Col span={2} style={{ textAlign: 'right' }}>
              <Button onClick={this.handleUpdate} type="primary" style={{ margin: '0 5px' }}>升级</Button>
            </Col>
          </Row>
        </div>
        {/* 默认列表 */}
        <Table {...tableprops} />
        {/* 服务器详情 */}
        {detailevisible ?
          (
            <Modal {...Modalprops}>
              <div>共有<span className="allNumLight">{detailCount}</span> 个设备</div>
              <StatusSearch {...StatusSearchprops} />
              <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
                <Table {...detailetableprops} />
              </Col>
            </Modal>
          ) : null}
        {/* 显示配置文件页面 */}
        {configvisible ?
          (
            <Modal {...configModalprops}>
              <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
                <Table {...configtableprops} />
              </Col>
            </Modal>
          ) : null}
        {/* 编辑配置文件 */}
        {editconfig ? <StatusSelect {...StatusSelectprops} /> : null}
      </div>
    );
  }
}

function mapStateToProps({ octVersionStatus, common, loading }) {
  return ({
    octVersionStatus,
    common,
    loading: loading.models.octVersionStatus,
  });
}
export default connect(mapStateToProps)(VersionStatus);
