/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin, Tooltip, Input, message } from 'antd';
import styles from '../DictionaryManage/querydatalist.less';
import Querydetail from './common/querydetail';
import Modaltable from './Modaltable';
import { MAINTENAN_UNIT, SGDW, SSXM } from '../../config/enums';


class querydatalist extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      danweiID: '0',
      danweiName: '未知',
      detailvisible: false,
      records: {},
      visible: false,
      entry: {},
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentDidMount() {
  }

  // 根据枚举值获取枚举名
  getEnumValue(enumtypeid, enumvalue) {
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      const enumObj = enumList[i];
      if (enumObj.enumtypeid === enumtypeid && enumObj.enumvalue === enumvalue) {
        return enumObj.enumname;
      }
    }
    return null;
  }

  // 查询项目名称
  getWeiHuJianShe(enumvalue) {
    if (enumvalue == '-1') {
      return '总计';
    } else if (enumvalue == '-2' || enumvalue == '0' || enumvalue == null || enumvalue == '') {
      return '未知';
    }
    const v = this.getEnumValue(SSXM, enumvalue);
    // if (v) {
    //   return v;
    // } else {
    //   return this.getEnumValue(SGDW, enumvalue);
    // }
    return v;
  }

  // 更多
  showdetail = (record) => {
    if (record) {
      const dwName = this.getWeiHuJianShe(record.project_id);
      let szDanWei = '未知';
      if (dwName) {
        szDanWei = dwName;
      }
      this.setState({
        danweiName: szDanWei,
        danweiID: record.project_id,
        detailvisible: true,
        records: record,
      });
    } else {
      this.setState({
        detailvisible: true,
        danweiName: '项目分类统计',
      });
    }
  }

  showdetailevisible(record) {
    const { dispatch } = this.props;
    const { name, time } = record;
    const { detailevisible, entry } = this.state;
    this.setState({
      visible: true,
      entry: record,
    });
    dispatch({
      type: 'query/queryDetails',
      payload: {
        project_id: record.project_id,
        pagination: {
          total: 1,
        },
      },
    });
  }

  render() {
    const { loading, name, resultlist, enumList, onRefresh, dataSource, paginations } = this.props;
    const { detailvisible, danweiID, danweiName, records, visible,
      entry,
    } = this.state;
    // 列表
    const columns = [
      {
        title: '项目名称',
        width: '15%',
        align: 'center',
        dataIndex: 'project_id',
        key: 'project_id',
        render: (text) => {
          if (text == 0) {
            return (<span>未知</span>);
          } else {
            return (<span>{this.getWeiHuJianShe(text)}</span>);
          }
        },
      }, {
        title: '建设数量',
        width: '15%',
        dataIndex: 'amount1',
        key: 'amount1',
        align: 'center',
        render: (value) => {
          if (value) {
            return value;
          } else {
            return 0;
          }
        },
      }, {
        title: '接入二级平台数量',
        width: '15%',
        dataIndex: 'amount3',
        key: 'amount3',
        align: 'center',
      }, {
        title: '接入综合集成数',
        width: '15%',
        dataIndex: 'amount4',
        key: 'amount4',
        align: 'center',
      }, {
        title: '运行正常数量',
        width: '15%',
        dataIndex: 'amount5',
        key: 'amount5',
        align: 'center',
        render: (text, record) => {
          if (record.project_id != -1) {
            return <a onClick={() => this.showdetailevisible(record)}>{text}</a>;
          } else {
            return `${text}`;
          }
        },
      }, {
        title: '操作',
        width: '10%',
        key: 'action',
        align: 'center',
        render: (record) => {
          return (
            (record.project_id == '-1' || record.project_id == '-2') ? '' : <Button onClick={(e) => { this.showdetail(record); }}>更多</Button>
          );
        },
      }];
    const querydetailProps = {
      title: `${danweiName} 历史记录`,
      enumList,
      records,
      loading,
      danweiID,
      onClose: () => {
        this.setState({
          detailvisible: false,
        });
      },
      onRefresh: () => {
        this.setState({
          detailvisible: false,
        });
        onRefresh();
      },
    };
    const title = entry.project_id == 0 ? '未知' : this.getEnumValue(SSXM, entry.project_id);
    const Listprops = {
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
          title: '交通流流量综合',
          align: 'center',
          dataIndex: 'flow',
          key: 'flow',
        },
      ],
      title,
      entry,
      dataSource,
      loading,
      onClose: () => {
        this.setState({
          visible: false,
        });
      },
      onDownload: (record) => {
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/company/downloadFile';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify({ project_id: entry.project_id });
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        console.log(inputElement);
        if (paginations.total < 1000) {
          formElement.submit();
          document.body.removeChild(formElement);
        } else if (paginations.total < 100000) {
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
      <div className="outline-out">
        <div>
          <div>
            <Row>
              <Col span={14}>
                <div>{name}</div>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px' }} disabled={(loading)} onClick={(e) => { this.showdetail(); }}><Icon type="search" />历史纪录</Button>
              </Col>
            </Row>
          </div>
          <Table
            rowKey={(record, index) => `${record.project_id}${index}`}
            columns={columns}
            dataSource={resultlist}
            pagination={false}
            loading={loading}
            rowClassName={(record, index) => {
              if (
                record.project_id == null ||
                record.project_id == undefined
              ) {
                return 'displayNone';
              }
            }}
          />
          {detailvisible ? <Querydetail {...querydetailProps} /> : null}
          {visible ? <Modaltable {...Listprops} /> : null}
        </div>
      </div>
    );
  }
}
querydatalist.prototypes = {
};
export default Form.create()(querydatalist);
