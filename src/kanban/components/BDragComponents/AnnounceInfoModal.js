/**
 * Created by Administrator on 2017/12/25 0025.
 */
import React from 'react';
import { Modal, Input, Button } from 'antd';
import styles from './Card.less';
/* eslint-disable   */
function AnnounceInfoModal({
  record = {},
  visible,
  onCancel,
  recordNoticeType = '0',
  currentSelectRecord,
}) {
  function okHandler() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // onOk(values, this.props.onCancel);
      }
    });
  }
  return (
    <Modal
      title={
        recordNoticeType == '2' ? '通知信息' : recordNoticeType == '0' ? '阅读公告' : '签收公告'
      }
      visible={visible}
      record={record}
      onCancel={onCancel}
      closable={recordNoticeType != '1' || currentSelectRecord.is_signed == 1}
      width="700px"
      footer={[
        <Button
          type="primary"
          key="确定"
          size="large"
          onClick={onCancel}
          style={{
            display: recordNoticeType == '1' && currentSelectRecord.is_signed != 1 ? '' : 'none',
          }}
        >
          签收
        </Button>,
      ]}
      className={styles.modalbodyxx}
    >
      <span>
        <span>
          <h1 style={{ textAlign: 'center' }}>{record.notice_title}</h1>
          <div style={{ paddingTop: '40px', paddingBottom: '40px', fontSize: '20px' }}>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.notice_desc}
          </div>
        </span>
      </span>
    </Modal>
  );
}

export default AnnounceInfoModal;
