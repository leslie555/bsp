/**
 * Created by Administrator on 2017/12/26 0026.
 */
import React, { Component } from 'react';
import moment from 'moment';
import { Modal, Form, Table, Badge, Icon } from 'antd';
import { announceTypes, isNotEmpty } from '../../utils/utils';
import AnnounceInfoModal from './AnnounceInfoModal';
import styles from './Card.less';

class AnnounceListModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      open: false,
    };
  }

  onRowDoubleClick = (data) => {
    const { dispatch, noticeInfo, record } = this.props;
    const { recordNoticeType } = this.state;

    const queryobj = { noticeId: data.notice_id };
    dispatch({
      type: 'user/getNoticeInfo',
      payload: { queryobj: { ...queryobj } },
    });
    this.setState({
      open: true,
      recordNoticeType: data.notice_type,
    });
  };

  showModelHandler = (e) => {
    const { form } = this.props;

    if (e) e.stopPropagation();
    form.resetFields();
    this.setState({
      visible: true,
    });
  };

  okHandler = () => {
    const { onOk, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        onOk(values, this.hideModelHandler);
      }
    });
  };

  hideModelHandler = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { children, record } = this.props;
    const { noticeInfo, recordNoticeType, visible, open } = this.state;

    const dataSource = isNotEmpty(record)
      ? record.filter((element) => {
        const arr = ['0', '1'];
        let cc = false;
        for (const i of arr) {
          if (element.notice_type == arr[i]) {
            cc = true;
            break;
          }
        }
        return cc;
      })
      : [];
    const columns = [
      {
        title: '',
        dataIndex: 'icon',
        className: 'tablefield',
        width: '8%',
        render: (text, data, index) => {
          return (
            <span>{data.is_read == '0' ? <Badge status="error" /> : <Icon type="message" />}</span>
          );
        },
      },
      {
        title: '类型',
        dataIndex: 'notice_type',
        key: 'type',
        className: 'tablefield',
        width: '20%',
        render: (text, data, index) => {
          return (
            <span style={{ fontWeight: data.is_read != '0' ? 'normal' : 'bold' }}>
              {announceTypes(text)}
            </span>
          );
        },
      },
      {
        title: '标题',
        dataIndex: 'notice_title',
        className: 'tablefield',
        width: '45%',
        render: (text, data, index) => (
          <span style={{ fontWeight: data.is_read != '0' ? 'normal' : 'bold' }}>{text}</span>
        ),
      },
      {
        title: '时间',
        dataIndex: 'pubtime',
        className: 'tablefield',
        width: '30%',
        render: (text, data, index) => (
          <span style={{ fontWeight: data.is_read != '0' ? 'normal' : 'bold' }}>
            {moment(text).format('YYYY-MM-DD')}
          </span>
        ),
      },
    ];
    return (
      <span>
        <span onClick={this.showModelHandler}>{children}</span>
        <Modal
          title="公告列表"
          visible={visible}
          onOk={this.okHandler}
          onCancel={this.hideModelHandler}
          record={record}
          width="700px"
          footer={null}
          className={styles.modalbodyxx}
        >
          <AnnounceInfoModal
            visible={open}
            record={noticeInfo}
            recordNoticeType={recordNoticeType}
            onCancel={this.hideModelHandler}
          />
          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size="small"
            className="listTable"
            onRowDoubleClick={data => this.onRowDoubleClick(data)}
          />
        </Modal>
      </span>
    );
  }
}

export default Form.create()(AnnounceListModal);
