/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Steps, message, Form, Button, Row, Col, Input, Icon, Tooltip, DatePicker, Table } from 'antd';
import React from 'react';
import { connect } from 'dva';
import moment from 'moment';
import DList from './DeviceGroupList';
import Detail from './GroupDevice';

import styles from './CollectionReportModal.less';

const { Step } = Steps;
const { RangePicker } = DatePicker;
const FormItem = Form.Item;
// 不可选择未来日期
function disabledDate(current) {
  return current > moment();
}

class collectionReportModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      Dpagination: {
        // showSizeChanger: true,
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
      leftid: '',
      isAll: true,
      selectedKeys: [],
      result: {
        project: '', // 项目名称
        company: '', // 单位名称
        sendDate: '', // 送检日期
        sendNum: 0, // 送检数量
        okNum: 0, // 符合要求数
        verifier: '', // 验证人
        verifiDate: '', // 验证日期
      },
    };
  }

  componentDidMount() {
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  onOk = () => {
    const { onClose } = this.props;
    onClose();
  }

  picktSendDate = (value, dateString) => {
    const { result } = this.state;
    // console.log('Formatted Selected Time: ', moment(dateString));
    console.log('Formatted Selected Time: ', moment(dateString).format('YYYY-MM-DD'));
    this.setState({
      result: { ...result, sendDate: moment(dateString).format('YYYY-MM-DD') },
    });
  }

  picktVerifiDate = (value, dateString) => {
    const { result } = this.state;
    // console.log('Formatted Selected Time: ', moment(dateString));
    console.log('Formatted Selected Time: ', moment(dateString).format('YYYY-MM-DD'));
    this.setState({
      result: { ...result, verifiDate: moment(dateString).format('YYYY-MM-DD') },
    });
  }

  next() {
    const { form } = this.props;
    const { current } = this.state;
    if (current == '0') {
      form.validateFields((err, values) => {
        if (!err) {
          console.log(values);
          this.setState({ result: values });
        }
      });
    }
    this.setState({ current: current + 1 });
  }

  complete() {
    message.success('Processing complete!');
    console.log(this);
    this.onOk();
  }

  prev() {
    const { current } = this.state;
    const currentx = current - 1;
    this.setState({ current: currentx });
  }

  render() {
    const { form, devicelistsum, columns, menuList,
      dispatch,
      expandedKeys,
      loading,
      devicelist,
      roadtree,
      enumList,
      codeList,
      currentId,
      dataSource,
      nodeInfo,
      idarr,
      queryobj,
      loadings,
    } = this.props;
    const myThis = this;
    const { current, Dpagination, selectedKeys, isAll, leftQuery, leftid, result } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const listprops = {
      menuList,
      dispatch,
      loading,
      // onNodeSelect是点击树形结构调用的函数
      onNodeSelect: (selectedKeysNode, e) => {
        this.setState({
          leftid: selectedKeysNode,
          isAll: true,
          // selectedKeys: [],
        });
        const data = e.node.props.dataRef;
        if (!data.lstSubGroup) {
          data.lstSubGroup = null;
        }
        if (data.queryvalue == 'NULL') {
          data.queryvalue = null;
        }
        const bLeaf = ((data.lstSubGroup && data.lstSubGroup.length) == null);
        const paginationNew = {
          current: 1,
          pageSize: 10,
          total: 0,
        };
        dispatch({
          type: 'octDeviceGroup/updateState',
          payload: { nodeInfo: e.node.props.dataRef, isLeaf: bLeaf },
        });
        if (bLeaf) {
          const page = { ...Dpagination, current: 1 };
          const query = {
            id: data.id,
          };
          dispatch({
            type: 'octDeviceGroup/queryDeviceByGroup',
            payload: {
              queryobj: { ...queryobj, ...query },
              pagination: page,
            },
          });
          this.setState({
            // flag: '1',
            leftQuery: {
              // queryobj: { ...queryobj, ...query },
              Dpagination: page,
            },
          });
        } else {
          dispatch({
            type: 'octDeviceGroup/initState',
            payload: {
              pagination: paginationNew,
              devicelist: [],
            },
          });
        }
      },
    };
    const detailprops = {
      leftid: leftid.toString(),
      loading,
      // flag,
      Dpagination,
      devicelist,
      roadtree,
      devicelistsum,
      enumList,
      codeList,
      selectedKeys,
      dispatch,
      currentId,
      dataSource,
      nodeInfo,
      loadings,
      isAll,
      idarr,
      selectAll: (value) => {
        const selectArr = []; // 包含原有的和当前的设备
        const arr = []; // 只包含当前的设备
        const selectStr = selectedKeys.join(','); // 选中的设备str
        // 把选中的设备编号读出来
        if (selectedKeys.length > 0) {
          for (let i = 0; i < selectedKeys.length; i += 1) {
            selectArr.push(selectedKeys[i]);
          }
        }
        if (devicelist.length > 0) {
          for (let j = 0; j < devicelist.length; j += 1) {
            arr.push(devicelist[j].deviceid.trim());
            if (selectStr.length > 0 && selectStr.indexOf(devicelist[j].deviceid) == -1) {
              selectArr.push(devicelist[j].deviceid.trim());
            }
          }
        }
        if (value == '全选') {
          if (selectStr.length > 0) {
            this.setState({ selectedKeys: selectArr });
          } else {
            this.setState({ selectedKeys: arr });
          }
        } else {
          for (let i = 0; i < devicelist.length; i += 1) {
            for (let j = 0; j < selectArr.length; j += 1) {
              if (devicelist[i].deviceid.trim() === selectArr[j].trim()) {
                selectArr.splice(j, 1);
              }
            }
          }
          this.setState({ selectedKeys: selectArr });
        }
      },
      All: () => {
        const arr = [];
        for (let k = 0; k < devicelist.length; k += 1) {
          arr.push(devicelist[k].deviceid);
        }
        const newarr = [];
        for (let i = 0; i < arr.length; i += 1) {
          for (let j = 0; j < selectedKeys.length; j += 1) {
            if (arr[i] == selectedKeys[j]) {
              newarr.push(arr[i]);
            }
          }
        }
        if ((arr.toString() == newarr.toString()) && arr.length > 0) {
          return '取消全选';
        } else {
          return '全选';
        }
      },
      refreshData: () => {
        this.refreshLeftNode();
      },
      onPageChange: (page) => {
        this.setState({
          Dpagination: { ...Dpagination, current: page.current, pageSize: page.pageSize },
        });
      },
      changeSelected: (keys) => {
        this.setState({
          selectedKeys: keys,
        });
        console.log('keys:', keys);
      },
    };
    const SelectdataSource = () => {
      console.log('result:', result);
      const arr = [];
      const str = selectedKeys.join(',');
      for (let i = 0; i < devicelist.length; i += 1) {
        if (str.indexOf(devicelist[i].deviceid != -1)) {
          arr.push(devicelist[i]);
        }
      }
      return arr;
    };
    const Selectcolumn = [
      {
        title: '序号',
        dataIndex: 'none',
        key: (txt, record, index) => `${index + 1}`,
        align: 'center',
        width: '10%',
        render: (text, record, index) => `${index + 1}`,
      },
      {
        title: '设备编号',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
        width: '40%',
      },
      {
        title: '设备名称',
        dataIndex: 'devicename',
        key: 'devicename',
        align: 'center',
        width: '50%',
      },
    ];
    const step1 = (
      <div style={{ margin: '0 auto' }}>
        <Row>
          <Col span={2} />
          <Col span={16}>
            <FormItem {...formItemLayout} label="项目名称">
              {getFieldDecorator('project', {
                // rules: [{
                //   required: true, message: '请输入检查人姓名',
                // }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={16}>
            <FormItem {...formItemLayout} label="单位名称">
              {getFieldDecorator('company', {
                // rules: [{
                //   required: true, message: '请输入检查人姓名',
                // }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={16}>
            <FormItem {...formItemLayout} label="送检日期">
              {getFieldDecorator('sendDate', {
                initialValue: '',
                // rules: [{
                //   required: true,
                //   message: '请输入送检日期！',
                // }],
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Time"
                  disabledDate={disabledDate}
                  onChange={this.picktSendDate}
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={16}>
            <FormItem {...formItemLayout} label="送检数量">
              {getFieldDecorator('sendNum', {
                // rules: [{
                //   required: true, message: '请输入检查人姓名',
                // }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={16}>
            <FormItem {...formItemLayout} label="符合要求数">
              {getFieldDecorator('okNum', {
                // rules: [{
                //   required: true, message: '请输入检查人姓名',
                // }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={16}>
            <FormItem {...formItemLayout} label="验证人">
              {getFieldDecorator('verifier', {
                // rules: [{
                //   required: true, message: '请输入检查人姓名',
                // }],
              })(
                <Input />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={2} />
          <Col span={16}>
            <FormItem {...formItemLayout} label="验证日期">
              {getFieldDecorator('verifiDate', {
                // rules: [{
                //   required: true, message: '请输入检查人姓名',
                // }],
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Select Time"
                  disabledDate={disabledDate}
                  onChange={this.picktVerifiDate}
                />
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
    const step2 = (
      <Row>
        <Col span={8}>
          <DList {...listprops} />
        </Col>
        <Col span={16}>
          <Detail {...detailprops} />
        </Col>
      </Row>
    );
    const step3 = (
      <Row>
        <Col span={10}>
          <h3>您输入的信息:</h3>
          <div>
            项目名称:<span>{result.project}</span>
          </div>
          <div>
            单位名称:<span>{result.company}</span>
          </div>
          <div>
            {/* 送检日期:<span>{result.sendDate}</span> */}
          </div>
          <div>
            送检数量:<span>{result.sendNum}</span>
          </div>
          <div>
            符合要求数:<span>{result.okNum}</span>
          </div>
          <div>
            验证人:<span>{result.verifier}</span>
          </div>
          <div>
            {/* 验证日期:<span>{result.verifiDate}</span> */}
          </div>
        </Col>
        <Col span={14}>
          <h3>选中了{selectedKeys.length}个设备:</h3>
          <div>
            <Table
              rowKey="deviceid"
              columns={Selectcolumn}
              dataSource={SelectdataSource()}
            />
          </div>
        </Col>
      </Row>
    );
    const steps = [{
      title: '送检信息',
      content: step1,
    }, {
      title: '选择设备',
      content: step2,
    }, {
      title: '生成文档',
      content: step3,
    }];
    return (
      <div>
        <Modal
          title="生成报告"
          visible
          onCancel={this.onClose}
          width="60%"
          footer={[
            <Row className={styles.stepsAction}>
              <Col span={18}>
                <div style={{ textAlign: 'left' }}>
                  {
                    current > 0 && (
                      <Button type="danger" onClick={() => this.prev()}>
                        <Icon type="left" /> 上一步
                      </Button>
                    )
                  }
                  {
                    current < steps.length - 1
                    && <Button type="primary" onClick={() => this.next()}><Icon type="right" /> 下一步</Button>
                  }
                  {
                    current === steps.length - 1
                    && <Button type="primary" onClick={() => this.complete()}><Icon type="copy" /> 完成</Button>
                  }
                </div>
              </Col>
              <Col span={6}>
                <Button key="back" onClick={this.onClose}>关闭</Button>
              </Col>
            </Row>,
          ]}
        >
          <Steps current={current}>
            {steps.map(item => <Step key={item.title} title={item.title} />)}
          </Steps>
          <div className={styles.stepsContent}>
            <Form>
              {steps[current].content}
            </Form>
          </div>
        </Modal>
      </div>
    );
  }
}

collectionReportModal.prototypes = {
};
export default Form.create()(collectionReportModal);
