/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin, notification } from 'antd';
import styles from '../AccountManage/AccountInfo.less';
import TrafficIncidentSelect from './common/TrafficIncidentSelect';
import { queryTrafficEventByDetail } from '../../services/octTrafficIncident';
import { TRAFFIC, DIRECTION } from '../../config/enums';

class TrafficIncidentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceSelectVisible: false, // 警员信息选择窗口
      entity: {}, // 选择弹框的记录
      detailLoading: false, // 按钮是否加载loading效果
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  onIncidentSelect = () => {
    this.setState({ deviceSelectVisible: false });
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

  showIncidentSelect = (record) => {
    // console.log(record);
    this.setState({
      entity: record,
      deviceSelectVisible: true,
      detailLoading: false,
    });
  }

  showDeviceUpload = () => {
  }

  render() {
    const { codeList, loading, img, imgvideo, getImgVideo, enumList } = this.props;
    const { deviceSelectVisible, entity, detailLoading } = this.state;
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
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      }, {
        title: '路段',
        width: '20%',
        dataIndex: 'roadname',
        key: 'roadname',
        align: 'center',
      }, {
        title: '设备编号',
        width: '15%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '车道编号',
        width: '15%',
        dataIndex: 'laneno',
        key: 'laneno',
        align: 'center',
      }, {
        title: '事件类型',
        width: '15%',
        dataIndex: 'eventtype',
        key: 'eventtype',
        align: 'center',
        render: (text) => {
          const result = text.toString();
          return (<span>{this.getEnumValue(TRAFFIC, result)}</span>);
        },
      }, {
        title: '事件时间',
        width: '20%',
        dataIndex: 'et',
        key: 'et,',
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
                onClick={() => this.showIncidentSelect(record)}
              />
            </span>
          );
        },
      }];
    const {
      resultlist,
      pagination,
      onDownload,
      currentId,
      onPageChange,
    } = this.props;

    const selectProps = {
      entity,
      enumList,
      onClose: () => {
        this.setState({ deviceSelectVisible: false });
      },
      onOk: () => {
        this.setState({ deviceSelectVisible: false });
      },
      getImgVideo: (id) => {
        getImgVideo(id);
      },
      imgvideo,
      loading,
    };

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={14}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px' }} disabled={(pagination.total == null) || (pagination.total <= 0)} onClick={onDownload}><i className="table-right icon iconfont icon-export" />
                  批量导出
                </Button>
              </Col>
            </Row>
          </div>
          <Table
            rowKey="id"
            dataSource={resultlist}
            columns={columns}
            rowClassName={
              (record, index) => {
                if (record.id === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }
            }
            // loading={loading}
            // rowSelection={rowSelection}
            onChange={onPageChange}
            pagination={pagination}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
          />
          {deviceSelectVisible ? <TrafficIncidentSelect {...selectProps} /> : null}
        </div>
        <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div>
      </div>
    );
  }
}
TrafficIncidentList.prototypes = {
  // loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onView: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(TrafficIncidentList);
