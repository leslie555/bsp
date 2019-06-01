/**
 * Created by Administrator on 2018/8/13.
 */
import { Modal, Table, Form, Input, Button, Row, Col, Tabs, Icon, Tooltip, InputNumber } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const FormItem = Form.Item;
const { TabPane } = Tabs;

class Modaltable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
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

  handleSubmit() {
    const { form, onSave } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        onSave(values);
      }
    });
  }

  render() {
    const { form, columns,
      title, detailevisible,
      onClose, dataSource,
      flag,
      obj1, onDownload,
      entry,
      loading,
    } = this.props;
    const { pagination } = this.state;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const onPageChange = (page) => {
      this.setState({
        pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
      });
    };
    return (
      <div>
        <Modal
          title={title}
          visible
          onCancel={onClose}
          width="80%"
          footer={[
            <Button key="back" onClick={onClose}>关闭</Button>,
          ]}
        >
          <Row>
            <Col span={18} />
            <Col span={4} style={{ textAlign: 'right' }}>
              <Button type="primary" style={{ margin: '2px' }} onClick={onDownload}><i className="table-right icon iconfont" />批量导出</Button>
            </Col>
          </Row>
          <Row>
            <Table
              rowKey="deviceid"
              columns={columns}
              loading={loading}
              dataSource={dataSource}
              onChange={onPageChange}
              pagination={pagination}
              locale={{ emptyText: '暂无数据' }}
            />
          </Row>
        </Modal>
      </div>
    );
  }
}

Modaltable.prototypes = {
  list: PropTypes.array,
  dataSource: PropTypes.array,
  enumList: PropTypes.array,
  onCancel: PropTypes.func,
};
export default Form.create()(Modaltable);
