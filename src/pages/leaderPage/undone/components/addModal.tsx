import React, { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, message, Spin, Radio } from 'antd'
import type { addModalProps } from '@/services/types'
import { approvalOpeator, approvalSave } from '@/services'
// import DictSelect from '@/components/ComSelect'
import { useIntl } from 'umi'
// import { dateFormat } from '@/utils/base'
// import moment from 'moment'

const { TextArea } = Input
// const { Option } = Select

const AddModal: React.FC<addModalProps> = ({ modalVisible, handleSubmit, handleCancel, info }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [spinning, setSpinning] = useState<boolean>(false)
  const [approvalData, setApprovalData] = useState<any[]>([])
  const [form] = Form.useForm()
  const intl = useIntl()

  const getDetail = async () => {
    setSpinning(true)
    const { data } = await approvalOpeator(info.id)
    setSpinning(false)
    if (data) {
      const arr: any[] = []
      data.forEach((item: any) => {
        const strings = item.split('--__!!')
        arr.push({
          controlId: strings[0],
          controlType: strings[1],
          controlLable: strings[2],
          controlIsParam: strings[3],
          controlValue: '',
          controlDefault: strings[4] ? strings[4] : null,
        })
      })
      setApprovalData(arr)
      console.log(arr)
      form.setFieldsValue(info)
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
      approvalData[0].controlValue = values.opinion
      approvalData[1].controlValue = values.reason
      await approvalSave(info.id, approvalData)
      setConfirmLoading(false)
    } catch (error) {
      setConfirmLoading(false)
      return
    }
    message.success(
      `${intl.formatMessage({
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
      title="??????"
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
          {/* <Form.Item
            label="????????????"
            name="type"
            rules={[
              {
                required: true,
                message: '?????????????????????',
              },
            ]}
          >
            <Select>
              <Option value="??????">??????</Option>
              <Option value="??????">??????</Option>
              <Option value="??????">??????</Option>
            </Select>
          </Form.Item> */}
          <Form.Item
            label="??????"
            name="instanceName"
            rules={[
              {
                required: true,
                message: '???????????????',
              },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
          {/* <Form.Item
            label="????????????"
            name="leaveStartTime"
            rules={[
              {
                required: true,
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
                required: true,
                message: '?????????????????????',
              },
            ]}
          >
            <DatePicker format={dateFormat} />
          </Form.Item> */}

          {/* <Form.Item
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
          </Form.Item> */}

          <Form.Item
            label="????????????"
            name="opinion"
            rules={[
              {
                required: true,
                message: '?????????????????????',
              },
            ]}
          >
            <Radio.Group>
              <Radio value={0}>??????</Radio>
              <Radio value={1}>?????????</Radio>
            </Radio.Group>
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
