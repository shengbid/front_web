import React, { useState, useEffect } from 'react'
import { useIntl } from 'umi'
import DictSelect from '@/components/ComSelect'
import { idReg } from '@/utils/reg'
import { Form, Input, Row, Col, Button, message } from 'antd'
import ComUpload from '@/components/ComUpload'
import UploadImage from '@/components/ComUpload/uploadImage'
import { editCompanyPeople } from '@/services'
import { isEmpty } from 'lodash'
import PhoneInput from '@/components/Input/phoneInput'

interface reralProps {
  handleCancel: () => void
  info: any
}

// 实控人配偶信息
const MetalPersonInfo: React.FC<reralProps> = ({ handleCancel, info }) => {
  const intl = useIntl()
  const [idType, setIdTyp] = useState<string>('xgsfz')

  const [form] = Form.useForm()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  useEffect(() => {
    form.setFieldsValue(info)
    setIdTyp(info.identityType)
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
    values.creditReport = JSON.stringify(values.creditReport)
    await editCompanyPeople(values)
    setConfirmLoading(false)
    handleCancel()
    message.success('修改成功')
  }

  // 回显身份信息
  const setIdInfo = (files: any) => {
    if (files && files.length) {
      const item = files[0]
      if (idType === 'hz') {
        form.setFieldsValue({
          identityNumber: item.passportNumber,
          name: item.passportName,
        })
      } else {
        form.setFieldsValue({
          identityNumber: item.number,
          name: item.identityName,
        })
      }
    }
  }

  const gutter = 24
  return (
    <Form
      name="basic"
      layout="vertical"
      initialValues={{ phoneArea: '+86', identity: 'qyfr' }}
      form={form}
      autoComplete="off"
      scrollToFirstError
      onFinish={handleOk}
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
            <DictSelect
              allowClear={false}
              authorword="cus_sfzlx"
              onChange={(val: string) => setIdTyp(val)}
            />
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
              idReg[idType],
            ]}
          >
            <Input maxLength={18} />
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
            <UploadImage
              urlStr={idType !== 'hz' ? '/file/upload/identity' : '/file/upload/passport'}
              limit={1}
              infoData={{ cardSide: 'front' }}
              onChange={setIdInfo}
            />
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
              id: 'credit.apply.metalName',
            })}
            rules={[
              {
                required: true,
                message: `${intl.formatMessage({
                  id: 'pages.form.input',
                })}${intl.formatMessage({
                  id: 'credit.apply.metalName',
                })}`,
              },
            ]}
          >
            <Input maxLength={50} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <PhoneInput initType={info.phoneArea} />
        </Col>
      </Row>

      <Form.Item
        name="creditReport"
        label={intl.formatMessage({
          id: 'credit.apply.metalCreditReport',
        })}
        rules={[
          {
            required: true,
            message: `${intl.formatMessage({
              id: 'pages.form.select',
            })}${intl.formatMessage({
              id: 'credit.apply.metalCreditReport',
            })}`,
          },
        ]}
      >
        <ComUpload limit={1} />
      </Form.Item>
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

export default MetalPersonInfo
