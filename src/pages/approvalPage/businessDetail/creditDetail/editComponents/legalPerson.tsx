import React, { useState, useEffect } from 'react'
import { Form, Input, Row, Col, Button, message } from 'antd'
import DictSelect from '@/components/ComSelect'
import { phoneReg, idCardReg } from '@/utils/reg'
import RequiredLabel from '@/components/RequiredLabel'
import { useIntl } from 'umi'
import UploadImage from '@/components/ComUpload/uploadImage'
import { editCompanyPeople } from '@/services'
import { isEmpty } from 'lodash'

interface reralProps {
  handleCancel: () => void
  info: any
}

// 法人信息
const LegalPerson: React.FC<reralProps> = ({ handleCancel, info }) => {
  const intl = useIntl()
  const [idType, setIdTyp] = useState<string>('xgsfz')
  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  useEffect(() => {
    form.setFieldsValue(info)
  }, [])

  // 修改
  const handleOk = async (values: any) => {
    values.frontFileName = values.idFront[0].fileName
    values.frontFileUrl = values.idFront[0].fileUrl
    values.pictureDomain = values.idFront[0].pictureDomain
    if (!isEmpty(values.idReverse)) {
      values.backFileName = values.idReverse[0].fileName
      values.backFileUrl = values.idReverse[0].fileUrl
    }
    await editCompanyPeople(values)
    setConfirmLoading(false)
    handleCancel()
    message.success('修改成功')
  }

  const gutter = 24
  return (
    <Form
      name="basic"
      // labelCol={{ span: 6 }}
      // wrapperCol={{ span: 18 }}
      initialValues={{ phoneArea: '1', identity: 'qyfr' }}
      form={form}
      autoComplete="off"
      scrollToFirstError
      onFinish={handleOk}
      layout="vertical"
    >
      <Form.Item label="identity" name="identity" style={{ display: 'none' }}>
        <Input />
      </Form.Item>
      <Form.Item label="id" name="id" style={{ display: 'none' }}>
        <Input />
      </Form.Item>
      <Row gutter={gutter}>
        <Col span={12}>
          <Form.Item
            name="identityType"
            label={intl.formatMessage({
              id: 'credit.apply.idType',
            })}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({
                  id: 'pages.form.select',
                })}${intl.formatMessage({
                  id: 'credit.apply.idType',
                })}`,
              },
            ]}
          >
            <DictSelect authorword="cus_sfzlx" onChange={(val: string) => setIdTyp(val)} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="identityNumber"
            label={intl.formatMessage({
              id: 'credit.apply.idNo',
            })}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({
                  id: 'pages.form.input',
                })}${intl.formatMessage({
                  id: 'credit.apply.idNo',
                })}`,
              },
              idCardReg,
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={gutter}>
        <Col span={12}>
          <Form.Item
            name="idFront"
            label={intl.formatMessage({
              id: 'credit.apply.idFront',
            })}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({
                  id: 'pages.form.upload',
                })}${intl.formatMessage({
                  id: 'credit.apply.idFront',
                })}`,
              },
            ]}
          >
            <UploadImage limit={1} />
          </Form.Item>
        </Col>
        <Col span={12}>
          {idType !== 'hz' && (
            <Form.Item
              name="idReverse"
              label={intl.formatMessage({
                id: 'credit.apply.idReverse',
              })}
              rules={[
                {
                  required: true,
                  message: `${intl.formatMessage({
                    id: 'pages.form.upload',
                  })}${intl.formatMessage({
                    id: 'credit.apply.idReverse',
                  })}`,
                },
              ]}
            >
              <UploadImage limit={1} />
            </Form.Item>
          )}
        </Col>
      </Row>
      <Row gutter={gutter}>
        <Col span={12}>
          <Form.Item
            name="name"
            label={intl.formatMessage({
              id: 'credit.apply.legalName',
            })}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({
                  id: 'pages.form.input',
                })}${intl.formatMessage({
                  id: 'credit.apply.legalName',
                })}`,
              },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label={
              <RequiredLabel
                label={intl.formatMessage({
                  id: 'credit.apply.phone',
                })}
              />
            }
          >
            <Form.Item
              name="phoneArea"
              style={{ display: 'inline-block', marginBottom: 0, width: '30%' }}
            >
              <DictSelect authorword="phone_code" allowClear={false} />
            </Form.Item>
            <Form.Item
              name="phoneNumber"
              style={{ display: 'inline-block', marginBottom: 0, width: '70%' }}
              rules={[
                {
                  required: true,
                  message: `${intl.formatMessage({
                    id: 'pages.form.input',
                  })}${intl.formatMessage({
                    id: 'credit.apply.phone',
                  })}`,
                },
                phoneReg,
              ]}
            >
              <Input maxLength={50} />
            </Form.Item>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={gutter}>
        <Col span={12}>
          <Form.Item
            name="marriageStatus"
            label={intl.formatMessage({
              id: 'credit.apply.maritalStatus',
            })}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({
                  id: 'pages.form.select',
                })}${intl.formatMessage({
                  id: 'credit.apply.maritalStatus',
                })}`,
              },
            ]}
          >
            <DictSelect authorword="hyqk" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="houseAddr"
            label={intl.formatMessage({
              id: 'credit.apply.address',
            })}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({
                  id: 'pages.form.input',
                })}${intl.formatMessage({
                  id: 'credit.apply.address',
                })}`,
              },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
        </Col>
      </Row>
      <div className="modal-btns">
        <Button type="primary" htmlType="submit" loading={confirmLoading}>
          {intl.formatMessage({
            id: 'pages.btn.confirm',
          })}
        </Button>
        <Button onClick={handleCancel} className="cancel-btn">
          {intl.formatMessage({
            id: 'pages.btn.cancel',
          })}
        </Button>
      </div>
    </Form>
  )
}

export default LegalPerson
