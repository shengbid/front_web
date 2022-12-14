import React, { useState } from 'react'
import { Modal, Button, Form, Input, message, Spin, Row, Col } from 'antd'
import type { addModalProps } from '@/services/types'
import { addLoanCustomer } from '@/services'
import DictSelect from '@/components/ComSelect'
import { useIntl } from 'umi'
import { accountReg } from '@/utils/reg'
import PhoneInput from '@/components/Input/phoneInput'

const AddModal: React.FC<addModalProps> = ({ modalVisible, handleSubmit, handleCancel, info }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [spinning] = useState<boolean>(false)
  const [form] = Form.useForm()
  const intl = useIntl()
  const text = info
    ? intl.formatMessage({
        id: 'pages.btn.edit',
      })
    : intl.formatMessage({
        id: 'pages.btn.add',
      })

  // const getDetail = async () => {
  //   setSpinning(true)
  //   const { data } = await postDetail(info)
  //   setSpinning(false)
  //   if (data) {
  //     form.setFieldsValue({ ...data })
  //   }
  // }

  // useEffect(() => {
  //   if (modalVisible && info) {
  //     getDetail()
  //   }
  // }, [modalVisible])

  const handleOk = async (values: any) => {
    console.log(values)
    setConfirmLoading(true)
    try {
      await addLoanCustomer(values)
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
        id: 'customer.loan.company',
      })}`}
      maskClosable={false}
      destroyOnClose
      width={800}
      visible={modalVisible}
      footer={false}
      onCancel={cancel}
    >
      <Spin spinning={spinning}>
        <Form
          name="basic"
          initialValues={{ phoneArea: '+86' }}
          onFinish={handleOk}
          form={form}
          autoComplete="off"
          layout="vertical"
        >
          <h3 style={{ fontWeight: 'bold' }}>
            {intl.formatMessage({
              id: 'customer.loan.baseInfo',
            })}
          </h3>
          <Form.Item label="id" name="id" style={{ display: 'none' }}>
            <Input />
          </Form.Item>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'customer.loan.register',
                })}
                name="registerAddr"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'pages.form.select',
                    })}${intl.formatMessage({
                      id: 'customer.loan.register',
                    })}`,
                  },
                ]}
              >
                <DictSelect authorword="company_register" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'customer.loan.companyName',
                })}
                name="fullName"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'pages.form.input',
                    })}${intl.formatMessage({
                      id: 'customer.loan.companyName',
                    })}`,
                  },
                ]}
              >
                <Input maxLength={50} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'customer.loan.companyShort',
                })}
                name="shortName"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'pages.form.input',
                    })}${intl.formatMessage({
                      id: 'customer.loan.companyShort',
                    })}`,
                  },
                ]}
              >
                <Input maxLength={20} />
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ fontWeight: 'bold' }}>
            {intl.formatMessage({
              id: 'customer.loan.accountInfo',
            })}
          </h3>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={intl.formatMessage({
                  id: 'customer.loan.accountName',
                })}
                name="userName"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'pages.form.input',
                    })}${intl.formatMessage({
                      id: 'customer.loan.accountName',
                    })}`,
                  },
                  accountReg,
                ]}
              >
                <Input maxLength={18} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <PhoneInput />
            </Col>
          </Row>

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
