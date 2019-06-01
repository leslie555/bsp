/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Spin, Row, Col, Table, Icon, Button, message, Tree, Modal, Input } from 'antd';
import styles from '../AccountManage/AccountInfo.less';
import DeviceSelect from './common/DeviceSelect';
import FileUpload from './common/FileUpload';
import { addDeviceToGroup } from '../../services/octDeviceGroup';

const FormItem = Form.Item;

class DeviceGroupDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceSelectVisible: false, // 设备信息选择窗口
      fileUploadVisible: false, // 上传窗口
      // expandedKeys: ['0'], // 展开节点
      // selectedKeys: [],
      Sortvisible: false, // 排序窗口
    };
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   selectedKeys: nextProps.idarr,
    //   isall: nextProps.isAll,
    // });
  }

  onDeviceInfoSelect = (id, deviceid) => {
    const { form, refreshData } = this.props;
    addDeviceToGroup({ id, deviceid }).then((data) => {
      if (data && data.result) {
        message.info(data.info);
        refreshData();
      }
    }).catch((err) => {
      console.error(`设备添加出错：${JSON.stringify(err)}`);
    });
    this.setState({ deviceSelectVisible: false });
  }

  // 保存新增分组
  onsave = () => {
  }

  onSelectChange = (deviceid) => {
    const { changeSelected } = this.props;
    changeSelected(deviceid);
    // this.setState({ selectedKeys: deviceid });
  }

  onDevceSelectClose = () => {
    this.setState({ deviceSelectVisible: false });
  }

  // 全选
  selectAll = () => {
    const { selectAll } = this.props;
    selectAll();
  }

  showDeviceSelect = () => {
    this.setState({ deviceSelectVisible: true });
  }

  // 排序
  DeviceSort = () => {
    this.setState({ Sortvisible: true });
  }

  // 排序
  DeviceSortclose = () => {
    this.setState({ Sortvisible: false });
  }

  showFileUpload = () => {
    this.setState({ fileUploadVisible: true });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, dispatch, leftid } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        const jsonStr = JSON.stringify(values);
        // const str1 = jsonStr.replace(jsonStr[0], '');
        // const str2 = str1.replace(str1[str1.length - 1], '');
        // const str3 = str2.replace(/"/g, '');
        const strArr = jsonStr.replace(jsonStr[0], '').replace(jsonStr[jsonStr.length - 1], '').replace(/"/g, '').split(',');
        console.log(strArr);
        dispatch({
          type: 'octDeviceGroup/saveSort',
          payload: { groupId: leftid, values: strArr },
        });
        this.setState({ Sortvisible: false });
      }
    });
  }

  render() {
    const {
      flag,
      enumList,
      roadtree,
      devicelistsum,
      selectedKeys,
      isAll,
      form,
      onDelete,
      loading,
      pagination,
      currentId,
      devicelist,
      nodeInfo,
      dispatch,
    } = this.props;
    const { deviceSelectVisible, fileUploadVisible, Sortvisible } = this.state;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '30px' },
    };
    const { getFieldDecorator } = form;
    // 列表
    const columns = [
      {
        title: '设备名称',
        width: '30%',
        dataIndex: 'devicename',
        key: 'devicename',
        align: 'center',
      }, {
        title: '设备id',
        width: '30%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '设备位置',
        width: '30%',
        dataIndex: 'devicepos',
        key: 'devicepos',
        align: 'center',
      }, {
        title: '排序',
        width: '5%',
        dataIndex: 'sort',
        key: 'sort',
        align: 'center',
      }, {
        title: '操作',
        width: '10%',
        align: 'center',
        key: 'action',
        render: (record) => {
          return (
            <span>
              <Icon
                type="delete"
                onClick={() => onDelete(record.deviceid)}
                style={{
                  fontSize: '18px',
                  marginLeft: '4px',
                  cursor: 'pointer',
                }}
                title="删除"
              />
            </span>
          );
        },
      }];
    const columns1 = [
      {
        title: '设备名称',
        width: '33%',
        dataIndex: 'devicename',
        key: 'devicename',
        align: 'center',
      }, {
        title: '设备id',
        width: '33%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '序号',
        width: '33%',
        dataIndex: 'sort',
        key: 'sort',
        align: 'center',
        render: (txt, record) => {
          return (
            <span>
              {getFieldDecorator(`${record.deviceid}`, {
                initialValue: record.sort ? record.sort : 0,
                rules: [
                  {
                    // required: true,
                    pattern: /^\d+$/,
                    message: '数字!',
                  },
                ],
              })(
                <Input placeholder="" />
              )}
            </span>
          );
        },
      }];
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: this.onSelectChange,
    };
    const DeviceSelectprops = {
      onClose: () => {
        this.setState({ deviceSelectVisible: false });
      },
      nodeInfo,
      enumList,
      roadtree,
      devicelistsum,
      dispatch,
    };
    const ids = selectedKeys.join(',');
    const FileUploadprops = {
      name: 'file',
      action: '/HiatmpPro/bsp/devicegroup/excelToData',
      showUploadList: true,
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
      downloadTemplate: '/HiatmpPro/bsp/devicegroup/downloadModel',
      width: '60%',
      visible: fileUploadVisible,
      onClose: () => { this.setState({ fileUploadVisible: false }); },
      onOk: () => { this.setState({ fileUploadVisible: false }); },
    };
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={8}>
                <div>
                  分组设备 共<span className="allNumLight">{devicelist.length}</span> 个
                  <Button type="primary" onClick={this.selectAll} style={{ margin: '5px 5px', visibility: flag === '2' ? 'hidden' : 'visible' }}><i className="table-right icon iconfont " />{isAll ? '全选' : '取消全选'}</Button>
                  <span style={{ visibility: flag === '2' ? 'hidden' : 'visible' }}>已选择<span className="allNumLight">{selectedKeys.length}</span>个设备</span>
                </div>
              </Col>
              <Col span={16} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px', visibility: flag === '2' ? 'hidden' : 'visible' }} onClick={this.DeviceSort}>排序</Button>
                <Button type="primary" style={{ margin: '0 5px', visibility: flag === '2' ? 'hidden' : 'visible' }} onClick={this.showFileUpload}><i className="table-right icon iconfont icon-import" />批量导入</Button>
                <Button type="primary" style={{ margin: '0 5px', visibility: flag === '2' ? 'hidden' : 'visible' }} onClick={this.showDeviceSelect}><i className="table-right icon iconfont icon-tianjia" />新增</Button>
                <Button type="primary" style={{ margin: '0 5px', visibility: flag === '2' ? 'hidden' : 'visible' }} onClick={() => onDelete(ids)}><i className="table-right icon iconfont icon-delete-tab" />批量删除</Button>
              </Col>
            </Row>
          </div>
          <Table
            rowKey="deviceid"
            columns={columns}
            // loading={loading}
            scroll={{ y: 550 }}
            dataSource={devicelist}
            pagination={pagination}
            // onChange={onPageChange}
            rowSelection={rowSelection}
            locale={{ emptyText: '暂无数据' }}
            rowClassName={
              (record, index) => {
                if (record.cdepartmentid === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableeevenRow';
                }
              }}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
          />
          {
            !deviceSelectVisible ? null :
              (<DeviceSelect {...DeviceSelectprops} onOk={this.onDeviceInfoSelect} />)
          }
          {
            !Sortvisible ? null :
              (
                <Modal
                  title="设备排序"
                  loading={loading}
                  visible={Sortvisible}
                  onCancel={this.DeviceSortclose}
                  width="60%"
                  footer={[
                    <Button onClick={this.handleSubmit}>确定</Button>,
                    <Button onClick={this.DeviceSortclose}>关闭</Button>,
                  ]}
                >
                  <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
                    <Table
                      rowKey="deviceid"
                      columns={columns1}
                      loading={loading}
                      scroll={{ y: 500 }}
                      dataSource={devicelist}
                      pagination={false}
                      // onChange={onPageChange}
                      // rowSelection={rowSelection}
                      locale={{ emptyText: '暂无数据' }}
                      rowClassName={
                        (record, index) => {
                          if (record.cdepartmentid === currentId) {
                            return 'selectedRow';
                          } else {
                            return index % 2 === 0 ? 'tableoddRow' : 'tableeevenRow';
                          }
                        }}
                      onRow={(record) => {
                        return {
                          // onClick: () => onView(record),
                        };
                      }}
                    />
                  </Col>
                </Modal>
              )
          }
          <FileUpload
            {...FileUploadprops}
          />
          <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
            <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
          </div>
        </div>
      </div>
    );
  }
}
DeviceGroupDetail.prototypes = {
  groupinfo: PropTypes.object,
};

export default Form.create()(DeviceGroupDetail);
