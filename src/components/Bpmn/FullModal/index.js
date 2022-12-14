/*
 * @Author: 易样
 */
import React, { Component } from 'react'
import { Modal } from 'antd'
import styles from './index.less'

class FullModal extends Component {
  render() {
    const { visible, title = '', onCancel, children } = this.props

    return (
      <Modal
        title={title}
        visible={visible}
        onCancel={onCancel}
        width={'65%'}
        // height={'calc(100% - 100px)'}
        footer={null}
        className={styles.fullModal}
      >
        {children}
      </Modal>
    )
  }
}

export default FullModal
