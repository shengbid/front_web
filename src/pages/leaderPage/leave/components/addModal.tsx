import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, message, Spin, DatePicker, Select } from 'antd'
import type { addModalProps } from '@/services/types'
import {
  // addLeva,
  addCredit,
  postDetail,
} from '@/services'
// import DictSelect from '@/components/ComSelect'
import { useIntl } from 'umi'
import { dateFormat } from '@/utils/base'
// import moment from 'moment'

const { TextArea } = Input
const { Option } = Select

const AddModal: React.FC<addModalProps> = ({ modalVisible, handleSubmit, handleCancel, info }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)
  const [form] = Form.useForm()
  const intl = useIntl()
  const text = info
    ? intl.formatMessage({
        id: 'pages.btn.edit',
      })
    : intl.formatMessage({
        id: 'pages.btn.add',
      })

  const getDetail = async () => {
    setSpinning(true)
    const { data } = await postDetail(info)
    setSpinning(false)
    if (data) {
      form.setFieldsValue({ ...data })
    }
  }

  useEffect(() => {
    if (modalVisible && info) {
      getDetail()
    }
  }, [modalVisible])

  const handleOk = async (values: any) => {
    setConfirmLoading(true)
    try {
      // Reflect.set(values, 'leaveStartTime', moment(values.leaveStartTime).format(dateFormat))
      // Reflect.set(values, 'leaveEndTime', moment(values.leaveEndTime).format(dateFormat))
      // await addLeva(values)
      await addCredit({ key: 'sxspProcess', username: values.title })
      setConfirmLoading(false)
    } catch (error) {
      setConfirmLoading(false)
      return
    }
    message.success(
      `${text}${intl.formatMessage({
        id: 'pages.form.success',
      })}`,
    )
    handleSubmit()
    form.resetFields()
  }

  const cancel = () => {
    handleCancel()
    form.resetFields()
  }

  return (
    <Modal
      title={`${text}${intl.formatMessage({
        id: 'sys.post.name',
      })}`}
      maskClosable={false}
      destroyOnClose
      width={600}
      visible={modalVisible}
      footer={false}
      onCancel={cancel}
    >
      <Spin spinning={spinning}>
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 18 }}
          onFinish={handleOk}
          form={form}
          autoComplete="off"
        >
          <Form.Item label="id" name="id" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Form.Item
            label="????????????"
            name="type"
            rules={[
              {
                required: false,
                message: '?????????????????????',
              },
            ]}
          >
            <Select>
              <Option value="??????">??????</Option>
              <Option value="??????">??????</Option>
              <Option value="??????">??????</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="??????"
            name="title"
            rules={[
              {
                required: true,
                message: '???????????????',
              },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
          <Form.Item
            label="????????????"
            name="leaveStartTime"
            rules={[
              {
                required: false,
                message: '?????????????????????',
              },
            ]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>
          <Form.Item
            label="????????????"
            name="leaveEndTime"
            rules={[
              {
                required: false,
                message: '?????????????????????',
              },
            ]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item>

          <Form.Item
            label="??????"
            name="reason"
            rules={[
              {
                required: false,
                message: `${intl.formatMessage({
                  id: 'pages.form.input',
                })}${intl.formatMessage({
                  id: 'pages.form.remark',
                })}`,
              },
            ]}
          >
            <TextArea autoSize={{ minRows: 3, maxRows: 5 }} maxLength={500} />
          </Form.Item>

          <div className="modal-btns">
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              {intl.formatMessage({
                id: 'pages.btn.confirm',
              })}
            </Button>
            <Button onClick={cancel} className="cancel-btn">
              {intl.formatMessage({
                id: 'pages.btn.cancel',
              })}
            </Button>
          </div>
        </Form>
      </Spin>
    </Modal>
  )
}

export default AddModal
