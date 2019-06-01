/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col } from 'antd';
import React from 'react';
import { ADMINROLEID } from '../../config/sysparms';
import Ellipsis from '../Ellipsis';
import styles from './PoliceSelect.less';
import { queryPoliceListService } from '../../services/accmservice';

const FormItem = Form.Item;

class PoliceSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      policeList: [],
      loading: false,
      selectPolice: {},
    };
    // this.selectedRows = [];
  }

  onClose = () => {
    const { onClose } = this.props;
    // this.selectedRows = [];
    this.setState({ policeList: [], loading: false, selectPolice: {} });
    onClose();
  }

  onSearch = () => {
    const { form } = this.props;
    const policename = form.getFieldValue('policename');
    this.setState({ loading: true, selectPolice: {} });
    queryPoliceListService({ policename }).then((data) => {
      this.setState({ loading: false });
      if (data && data.result) {
        this.setState({ policeList: data.policeList });
      }
    }).catch((e) => {
      console.error(`警员查询出错：${JSON.stringify(e)}`);
      this.setState({ loading: false });
    });
  }

  onOk = () => {
    const { onOk } = this.props;
    const { selectPolice } = this.state;
    onOk(selectPolice);
    this.setState({ policeList: [], loading: false, selectPolice: {} });
  }

  render() {
    const { visible, form } = this.props;
    const { policeList, loading, selectPolice } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const columns = [{
      align: 'center',
      title: '警员编号',
      dataIndex: 'policeid',
      width: '10%',
      render: (text) => {
        return (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        );
      },
    }, {
      align: 'center',
      title: '警员姓名',
      dataIndex: 'policename',
      width: '10%',
      render: (text) => {
        return (
          <Ellipsis tooltip lines={1}>
            {text}
          </Ellipsis>
        );
      },
    }, {
      align: 'center',
      title: '身份证号',
      dataIndex: 'idcard',
      width: '30%',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    }, {
      align: 'center',
      title: '所属部门',
      dataIndex: 'deptshortname',
      width: '30%',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    }, {
      align: 'center',
      title: '手机号码',
      dataIndex: 'phone',
      width: '20%',
      render: text => (
        <Ellipsis tooltip lines={1}>
          {text}
        </Ellipsis>
      ),
    }];

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.selectedRows = selectedRows;
      },
    };
    return (
      <div>
        <Modal
          visible={visible}
          onCancel={this.onClose}
          onOk={this.onOk}
          width="60%"
          wrapClassName={styles.policeSelect}
        >
          <Form layout="inline">
            <FormItem {...formItemLayout} label="警员姓名" className={styles.formitem}>
              {getFieldDecorator('policename', {
                rules: [{
                  validator: (rule, value, callback) => {
                    if (value && value.match("(?:')|(?:\\s)|(?:%)|(?:--)|(/\\*(?:.|[\\n\\r])*?\\*/)|(\\b(select|update|union|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)\\b)")) {
                      callback('请不要包含特殊字符及命令');
                    }
                    callback();
                  },
                }] })(
                  <Input maxLength="7" />
              )}
            </FormItem>
            <FormItem>
              <Button onClick={this.onSearch}>查询</Button>
            </FormItem>
          </Form>
          <Row>
            <Table
              rowKey="uuid"
              loading={loading}
              columns={columns}
              dataSource={policeList}
              rowClassName={
                (record, index) => {
                  if (selectPolice && record.uuid === selectPolice.uuid) {
                    return styles.tableSelectRow;
                  } else {
                    return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                  }
                }
              }
              onRow={(record) => {
                return {
                  onClick: () => {
                    this.setState({ selectPolice: record });
                  },
                };
              }}
            />
          </Row>
        </Modal>
      </div>
    );
  }
}


export default Form.create()(PoliceSelect);
