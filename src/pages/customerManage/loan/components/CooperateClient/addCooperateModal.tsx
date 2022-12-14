import React, { useState, useEffect } from 'react'
import {
  Modal,
  Button,
  Form,
  message,
  Spin,
  Row,
  Col,
  Radio,
  DatePicker,
  Select,
  Input,
} from 'antd'
import type { addModalProps } from '@/services/types'
import {
  addCooperatelogistics,
  getDocusignTemplates,
  getCooperatelogisticsList,
  getSignerListByTemplateId,
  retryCooperatelogistics,
} from '@/services'
import { useIntl } from 'umi'
import type { ProColumns } from '@ant-design/pro-table'
import SimpleProtable from '@/components/ComProtable/SimpleProTable'
import { EditableProTable } from '@ant-design/pro-table'
import ComUpload from '@/components/ComUpload'
import RequiredLabel from '@/components/RequiredLabel'
import moment from 'moment'
import { dateFormat } from '@/utils/base'
import { omit } from 'lodash'
import { getDictData } from '@/utils/dictData'

const { RangePicker } = DatePicker

const { Option } = Select

interface addProps extends addModalProps {
  type: number
}
const AddModal: React.FC<addProps> = ({ type, modalVisible, handleSubmit, handleCancel, info }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [dataSource2, setDataSource2] = useState<any[]>([])
  const [editableKeys, setEditableRowKeys] = useState<any[]>([])
  const [templateList, setTemplateList] = useState<any[]>([])
  const [signType, setSignType] = useState<number>(1)
  const [companyList, setCompanyList] = useState<any[]>([])
  const [companyInfo, setCompanyInfo] = useState<any>({})
  const [spinning, setSpinning] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const [form] = Form.useForm()
  const [tableForm] = Form.useForm()

  const pathRoute = `${window.location.href}`

  const [phoneData, setPhoneData] = useState<any>()

  const getDict = async () => {
    const obj = await getDictData('phone_code')
    setPhoneData(obj)
  }

  useEffect(() => {
    if (type === 1) {
      setDataSource2([
        {
          contractType: 3,
        },
      ])
      setEditableRowKeys([3])
    } else {
      setDataSource2([
        {
          contractType: 4,
        },
      ])
      setEditableRowKeys([4])
    }
  }, [type])

  // ??????????????????
  const getTemplateList = async () => {
    setSpinning(true)
    try {
      const { rows } = await getDocusignTemplates({ templateType: type === 1 ? 3 : 4 })
      if (rows) {
        setTemplateList(rows)
      }
    } catch (error) {
      setSpinning(false)
      return
    }
    setSpinning(false)
  }

  // ??????????????????
  const getCompany = async () => {
    setSpinning(true)
    try {
      const { rows } = await getCooperatelogisticsList(type === 1 ? 'logistics' : 'warehouse')
      if (rows) {
        setCompanyList(rows)
      }
    } catch (error) {
      setSpinning(false)
      return
    }
    setSpinning(false)
  }

  useEffect(() => {
    if (modalVisible) {
      setSignType(1)
      getTemplateList()
      getCompany()
      getDict()
    }
  }, [modalVisible])

  useEffect(() => {
    if (modalVisible) {
      if (info.partnerId) {
        form.setFieldsValue({
          partnerEnterpriseId: info.partnerId,
          id: info.id,
        })
        setCompanyInfo({
          value: info.partnerId,
          label: info.partnerFullName,
        })
        if (info.partnerId) {
          setTitle('??????????????????')
        } else {
          setTitle(type === 1 ? `????????????????????????` : '????????????????????????')
        }
      }
    }
  }, [modalVisible, info])

  const intl = useIntl()
  const text = info.partnerId
    ? intl.formatMessage({
        id: 'pages.btn.edit',
      })
    : intl.formatMessage({
        id: 'pages.btn.add',
      })

  const columns: ProColumns<any>[] = [
    {
      title: '???????????????',
      dataIndex: 'enterpriseName',
      width: '28%',
      ellipsis: true,
    },
    {
      title: '????????????',
      dataIndex: 'docuSignRoleName',
    },
    {
      title: '??????',
      dataIndex: 'email',
    },
    {
      title: '????????????',
      dataIndex: 'phoneNumber',
      render: (val, recored) => (
        <span>
          {phoneData[recored.phoneArea]}
          {val}
        </span>
      ),
    },
  ]

  const columns2 = [
    {
      title: <RequiredLabel label="????????????" />,
      dataIndex: 'contractName',
      width: '25%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
          },
        ],
      },
    },
    {
      title: <RequiredLabel label="????????????" />,
      dataIndex: 'contractNo',
      width: '17%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
          },
        ],
      },
    },
    {
      title: '????????????',
      dataIndex: 'contractType',
      width: '17%',
      render: () => <span>{type === 1 ? '??????????????????' : '??????????????????'}</span>,
      editable: false,
    },
    {
      title: <RequiredLabel label="????????????" />,
      dataIndex: 'signTime',
      width: '17%',
      valueType: 'date',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
          },
        ],
      },
    },
    {
      title: <RequiredLabel label="????????????" />,
      dataIndex: 'fileList',
      width: '25%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '??????????????????',
          },
        ],
      },
      renderFormItem: () => <ComUpload limit={1} />,
    },
  ]

  const handleOk = async (values: any) => {
    // console.log(values)
    setConfirmLoading(true)
    try {
      if (signType === 2) {
        try {
          await tableForm.validateFields()
        } catch (error) {
          setConfirmLoading(false)
          message.warning('????????????????????????????????????')
          return
        }

        values.offlineContractAdd = dataSource2.map((item: any) => {
          return {
            ...omit(item, ['fileList']),
            signWay: 2,
            recipientList: [
              {
                role: 1,
                enterpriseId: info.enterpriseId,
                enterpriseName: info.enterpriseName,
              },
              {
                role: 3,
                enterpriseId: companyInfo.value,
                enterpriseName: companyInfo.children,
              },
            ],
            fileName: item.fileList[0].fileName,
            fileUrl: item.fileList[0].fileUrl,
          }
        })[0]
      } else {
        let flag = false
        dataSource.some((item: any) => {
          if (!item.email) {
            flag = true
          }
        })
        if (flag) {
          message.warning('??????????????????????????????,??????????????????????????????????????????!')
          setConfirmLoading(false)
          return
        }
      }
      if (info.partnerId) {
        // ????????????
        await retryCooperatelogistics({
          ...omit(values, ['rangeData']),
          enterpriseId: info.enterpriseId,
          partnerType: type,
          returnUrl: pathRoute,
          validStartDate: moment(values.rangeData[0]).format(dateFormat),
          validEndDate: moment(values.rangeData[1]).format(dateFormat),
        })
      } else {
        // ??????
        await addCooperatelogistics({
          ...omit(values, ['rangeData']),
          enterpriseId: info.enterpriseId,
          partnerType: type,
          returnUrl: pathRoute,
          validStartDate: moment(values.rangeData[0]).format(dateFormat),
          validEndDate: moment(values.rangeData[1]).format(dateFormat),
        })
      }
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

  // ??????????????????
  const onChange = (e: any) => {
    setSignType(e.target.value)
    if (e.target.value === 2) {
      setDataSource2([{ contractType: type === 1 ? 3 : 4 }])
      setEditableRowKeys([type === 1 ? 3 : 4])
    }
  }

  // ??????????????????
  const onChangeTemplate = async (value: any) => {
    if (!companyInfo.value) {
      message.warning('??????????????????')
      form.setFieldsValue({ templateId: '' })
      return
    }
    const { data } = await getSignerListByTemplateId({
      templateId: value,
      loanEnterpriseId: info.enterpriseId,
      partnerEnterpriseId: companyInfo.value,
    })
    setDataSource(data)
  }
  // ??????????????????
  const selectCompany = (value: any, options: any) => {
    setCompanyInfo(options)
  }

  const cancel = () => {
    handleCancel()
    form.resetFields()
    setDataSource([])
  }

  return (
    <Modal
      title={title}
      maskClosable={false}
      destroyOnClose
      width={1000}
      visible={modalVisible}
      footer={false}
      onCancel={cancel}
    >
      <Spin spinning={spinning}>
        <Form
          name="basic"
          initialValues={{ signWay: 1 }}
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
                label="??????"
                name="partnerEnterpriseId"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'pages.form.select',
                    })}??????`,
                  },
                ]}
              >
                <Select onChange={selectCompany} disabled={!!info.partnerId}>
                  {companyList.map((item) => (
                    <Option key={item.id} value={item.id}>
                      {item.fullName}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="????????????"
                name="rangeData"
                rules={[
                  {
                    required: true,
                    message: `?????????????????????`,
                  },
                ]}
              >
                <RangePicker />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label="????????????"
                name="signWay"
                rules={[
                  {
                    required: true,
                    message: `?????????????????????`,
                  },
                ]}
              >
                <Radio.Group onChange={onChange}>
                  <Radio value={1}>??????????????????</Radio>
                  <Radio value={2}>???????????????</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ fontWeight: 'bold' }}>????????????</h3>

          {signType === 1 ? (
            <>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="????????????"
                    name="templateId"
                    rules={[
                      {
                        required: true,
                        message: `?????????????????????`,
                      },
                    ]}
                  >
                    <Select onChange={onChangeTemplate}>
                      {templateList.map((item) => (
                        <Option key={item.id} value={item.id}>
                          {item.docusignTemplateName}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <SimpleProtable rowKey="id" columns={columns} dataSource={dataSource || []} />
            </>
          ) : (
            <EditableProTable<any>
              rowKey="contractType"
              className="nopaddingtable"
              maxLength={5}
              // ???????????????????????????
              recordCreatorProps={false}
              columns={columns2}
              value={dataSource2}
              onChange={setDataSource2}
              editable={{
                form: tableForm,
                editableKeys,
                onValuesChange: (record, recordList) => {
                  console.log(recordList)
                  setDataSource2(recordList)
                },
                onChange: setEditableRowKeys,
              }}
            />
          )}

          <div className="modal-btns" style={{ marginTop: 24 }}>
            <Button type="primary" htmlType="submit" loading={confirmLoading}>
              ?????????????????????
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
