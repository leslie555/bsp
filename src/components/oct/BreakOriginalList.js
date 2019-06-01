/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin, notification } from 'antd';
import { ENUM_ILLEGAL } from '../../config/enums';
import styles from '../AccountManage/AccountInfo.less';
import BreakSelect from './common/BreakSelect';

class BreakOriginalList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 详情窗口
      detailLoading: false, // 按钮是否加载loading效果
      entity: {}, // 选择弹框的记录
    };
    this.getEnumValue = this.getEnumValue.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  onBreakInfoSelect = () => {
    this.setState({ visible: false });
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
  }

  // 截取字符串
  getPicture(value) {
    const { enumList } = this.props;
    let a = value;
    if (a.length > 8) {
      a = ''.concat(a.substr(0, 7), '...');
    }
    return a;
  }


  showBreakSelect = (record) => {
    this.setState({
      entity: record,
      visible: true,
    });
  };

  showDeviceUpload = () => {
  }

  render() {
    const {
      resultlist,
      pagination,
      onPageChange,
      onDownload,
      selectedKeys,
      changeSelected,
      codeList,
      loading,
      enumList,
      imglist,
      getImageList,
      currentId,
    } = this.props;
    const { visible, entity, detailLoading } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '序号',
        width: '5%',
        key: 'sn',
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      }, {
        title: '路段',
        width: '10%',
        dataIndex: 'roadname',
        key: 'roadname',
        align: 'center',
      }, {
        title: '设备编号',
        width: '10%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '车道编号',
        width: '8%',
        dataIndex: 'laneno',
        key: 'laneno',
        align: 'center',
      }, {
        title: '违法类型',
        width: '34%',
        dataIndex: 'illegalid',
        key: 'illegalid',
        align: 'center',
        render: (text) => {
          if (text == null) {
            return '类型未知';
          } else {
            const result = text.toString();
            return (<span>{this.getEnumValue(ENUM_ILLEGAL, result)}</span>);
          }
        },
      }, {
        title: '车牌号',
        width: '10%',
        dataIndex: 'plateno',
        key: 'plateno,',
        align: 'center',
      }, {
        title: '违法时间',
        width: '13%',
        dataIndex: 'eventtime',
        key: 'eventtime,',
        align: 'center',
      }, {
        title: '事件详情查看',
        width: '10%',
        // dataIndex: 'picname1',
        // key: 'picname1',
        align: 'center',
        render: (record) => {
          return (
            <span>
              <Button
                shape="circle"
                icon="search"
                loading={detailLoading}
                onClick={() => this.showBreakSelect(record)}
              />
            </span>
          );
        },
      }];
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys) => {
        changeSelected(selectedRowKeys);
      },
    };
    const selectProps = {
      enumList,
      imglist,
      entity,
      getImageList: (id) => {
        getImageList(id);
      },
      onClose: () => {
        this.setState({ visible: false });
      },
      onOk: () => {
        this.onBreakInfoSelect();
      },
    };
    const sum = resultlist ? resultlist.length : 0;
    const tableprops = {
      rowKey: (record, index) => `${record.deviceid}${index + 1}`,
      dataSource: resultlist,
      columns,
      loading,
      pagination,
      onChange: onPageChange,
      locale: {
        emptyText: '暂无数据',
      },
    };

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={14}>
                <div>搜索结果 共<span className="allNumLight">{sum}</span> 条</div>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px' }} disabled={sum <= 0} onClick={onDownload}><i className="table-right icon iconfont icon-export" />批量导出</Button>
              </Col>
            </Row>
          </div>
          <Table {...tableprops} />
          {visible ? <BreakSelect {...selectProps} /> : null}
        </div>
        {/* <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div> */}
      </div>
    );
  }
}
BreakOriginalList.prototypes = {
  // loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(BreakOriginalList);
