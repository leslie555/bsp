/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button } from 'antd';

class QueryMainRoadList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 默认是早上高峰
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentWillMount() {
    const { typea } = this.props;
    if (typea == '早高峰') {
      this.setState({
        visible: true,
      });
    }
  }

  onPoliceInfoSelect = (police) => {
    // const { form } = this.props;
  }

  onDownload = () => {
    const { onDownload, typea } = this.props;
    if (typea == '早高峰') {
      onDownload('befor');
    } else {
      onDownload('after');
    }
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

  showDeviceUpload = () => {
    // this.setState({ displayName: 'block' });
  }

  render() {
    const {
      codeList,
      groupCount,
      loading,
      dataSource,
      excel,
      onPageChange,
      onAdd,
      onDownload,
      selectedKeys,
      changeSelected,
      currentId,
      typea,
    } = this.props;
    const { DeviceUploadVisible, src, visible } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '日期',
        width: '10%',
        dataIndex: 'cdate',
        key: 'cdate',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if ((index % (2 * groupCount)) == 0) {
            obj.props.rowSpan = 2 * groupCount;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      }, {
        title: '时间',
        width: '10%',
        dataIndex: 'ctime',
        key: 'ctime',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if ((index % (2 * groupCount)) == 0) {
            obj.props.rowSpan = 2 * groupCount;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      }, {
        title: '设备分组',
        width: '10%',
        dataIndex: 'groupname',
        key: 'groupname',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index % 2 == 0) {
            obj.props.rowSpan = 2;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      }, {
        title: '速度',
        width: '10%',
        dataIndex: 'speedtype',
        key: 'speedtype',
        align: 'center',
      }, {
        title: '设备编号',
        width: '10%',
        dataIndex: 'speeddeviceid',
        key: 'speeddeviceid,',
        align: 'center',
      }, {
        title: '速度值',
        width: '10%',
        dataIndex: 'speedvalue',
        key: 'speedvalue',
        align: 'center',
      }, {
        title: '平均速度',
        width: '10%',
        dataIndex: 'speedaverage',
        key: 'speedaverage',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          if (index % 2 == 0) {
            obj.props.rowSpan = 2;
          } else {
            obj.props.rowSpan = 0;
          }
          return obj;
        },
      }, {
        title: '流量',
        width: '10%',
        dataIndex: 'flowtype',
        key: 'flowtype',
        align: 'center',
      }, {
        title: '设备编号',
        width: '10%',
        dataIndex: 'flowdeviceid',
        key: 'flowdeviceid,',
        align: 'center',
      }, {
        title: '流量值',
        width: '10%',
        dataIndex: 'flowvalue',
        key: 'flowvalue',
        align: 'center',
      }];
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys) => {
        changeSelected(selectedRowKeys);
      },
    };

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={21}>
                <div>{typea}</div>
              </Col>
              <Col span={1} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px', marginTop: '8%' }} disabled={(excel == null) || (!excel)} onClick={this.onDownload}><i className="table-right icon iconfont icon-export" />
                  批量导出
                </Button>
              </Col>
            </Row>
          </div>
          <Table
            columns={columns}
            rowClassName={
              (record, index) => {
                if (record.deviceid === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }}
            loading={loading}
            dataSource={dataSource}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
            bordered
            rowKey={(record, index) => `${record.deviceid}${index + 1}`}
          />
        </div>
      </div>
    );
  }
}
QueryMainRoadList.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(QueryMainRoadList);
