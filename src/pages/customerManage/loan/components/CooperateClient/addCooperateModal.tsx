import React, { useState, useEffect } from 'react'
import {
  Modal,
  Button,
  Form,
  Input,
  message,
  Spin,
  Row,
  Col,
  Radio,
  DatePicker,
  Select,
} from 'antd'
import type { addModalProps } from '@/services/types'
import {
  addCooperatelogisticsList,
  getDocusignTemplates,
  getCooperatelogisticsList,
  getSignerListByTemplateId,
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

const { RangePicker } = DatePicker

const { Option } = Select

interface addProps extends addModalProps {
  type: number
}
const AddModal: React.FC<addProps> = ({ type, modalVisible, handleSubmit, handleCancel, info }) => {
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [dataSource, setDataSource] = useState<any[]>([])
  const [dataSource2, setDataSource2] = useState<any[]>([
    {
      contractType: 3,
    },
  ])
  const [editableKeys, setEditableRowKeys] = useState<any[]>([3])
  const [templateList, setTemplateList] = useState<any[]>([])
  const [signType, setSignType] = useState<number>(1)
  const [companyList, setCompanyList] = useState<any[]>([])
  const [companyInfo, setCompanyInfo] = useState<any>({})
  const [spinning] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [tableForm] = Form.useForm()
  const title = type === 1 ? `新建物流合作企业` : '新建仓储合作企业'
  // 获取合同模板
  const getTemplateList = async () => {
    const { rows } = await getDocusignTemplates()
    if (rows) {
      setTemplateList(rows)
    }
  }

  // 获取企业列表
  const getCompany = async () => {
    const { rows } = await getCooperatelogisticsList(type === 1 ? 'logistics' : 'bonded')
    if (rows) {
      setCompanyList(rows)
    }
  }

  useEffect(() => {
    if (modalVisible) {
      getTemplateList()
      getCompany()
      if (info) {
        setDataSource([])
      }
    }
  }, [modalVisible, info])

  const intl = useIntl()
  const text = info
    ? intl.formatMessage({
        id: 'pages.btn.edit',
      })
    : intl.formatMessage({
        id: 'pages.btn.add',
      })

  const columns: ProColumns<any>[] = [
    {
      title: '收件人名字',
      dataIndex: 'enterpriseName',
      width: '28%',
      ellipsis: true,
    },
    {
      title: '签署角色',
      dataIndex: 'docuSignRoleName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号码',
      dataIndex: 'phoneNumber',
    },
  ]

  const columns2 = [
    {
      title: <RequiredLabel label="合同名称" />,
      dataIndex: 'contractName',
      width: '25%',
    },
    {
      title: <RequiredLabel label="合同编号" />,
      dataIndex: 'contractNo',
      width: '17%',
    },
    {
      title: '合同类型',
      dataIndex: 'contractType',
      width: '17%',
      render: () => <span>三方运输协议</span>,
      editable: false,
    },
    {
      title: <RequiredLabel label="签署时间" />,
      dataIndex: 'signTime',
      width: '17%',
      valueType: 'date',
    },
    {
      title: <RequiredLabel label="合同附件" />,
      dataIndex: 'fileList',
      width: '25%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
        ],
      },
      renderFormItem: () => <ComUpload />,
    },
  ]

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
      if (signType === 2) {
        await tableForm.validateFields()
        values.offlineContractAdd = dataSource2.map((item: any) => {
          return {
            ...item,
            signWay: 2,
            recipientList: [
              {
                role: 3,
                enterpriseId: companyInfo.value,
                enterpriseName: companyInfo.children,
              },
            ],
            fileName: item.fileList[0].fileName,
            fileUrl: item.fileList[0].fileUrl,
          }
        })
      } else {
        let flag = false
        dataSource.some((item: any) => {
          if (!item.email) {
            flag = true
          }
        })
        if (flag) {
          message.warning('企业签约人信息不完善,请先去完善企业签约经办人信息!')
          setConfirmLoading(false)
          return
        }
      }
      await addCooperatelogisticsList({
        ...omit(values, ['rangeData']),
        enterpriseId: info,
        partnerType: type,
        validStartDate: moment(values.rangeData[0]).format(dateFormat),
        validEndDate: moment(values.rangeData[1]).format(dateFormat),
      })
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

  // 选择签署类型
  const onChange = (e: any) => {
    setSignType(e.target.value)
  }

  // 选择合同模板
  const onChangeTemplate = async (value: any) => {
    if (!companyInfo.value) {
      message.warning('请先选择企业')
      form.setFieldsValue({ templateId: '' })
      return
    }
    const { data } = await getSignerListByTemplateId({
      templateId: value,
      loanEnterpriseId: info,
      partnerEnterpriseId: companyInfo.value,
    })
    setDataSource(data)
  }
  // 选择合作企业
  const selectCompany = (value: any, options: any) => {
    setCompanyInfo(options)
  }

  const cancel = () => {
    handleCancel()
    form.resetFields()
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
                label="企业"
                name="partnerEnterpriseId"
                rules={[
                  {
                    required: true,
                    message: `${intl.formatMessage({
                      id: 'pages.form.select',
                    })}企业`,
                  },
                ]}
              >
                <Select onChange={selectCompany}>
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
                label="有效日期"
                name="rangeData"
                rules={[
                  {
                    required: true,
                    message: `请选择有效日期`,
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
                label="签署方式"
                name="signWay"
                rules={[
                  {
                    required: true,
                    message: `请选择签署方式`,
                  },
                ]}
              >
                <Radio.Group onChange={onChange}>
                  <Radio value={1}>发起线上签署</Radio>
                  <Radio value={2}>已签署上传</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <h3 style={{ fontWeight: 'bold' }}>签署信息</h3>

          {signType === 1 ? (
            <>
              <Row gutter={24}>
                <Col span={12}>
                  <Form.Item
                    label="合同模板"
                    name="templateId"
                    rules={[
                      {
                        required: true,
                        message: `请选择合同模板`,
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
              // 关闭默认的新建按钮
              recordCreatorProps={false}
              columns={columns2}
              value={dataSource2}
              onChange={setDataSource2}
              editable={{
                form: tableForm,
                editableKeys,
                onValuesChange: (record, recordList) => {
                  setDataSource2(recordList)
                },
                onChange: setEditableRowKeys,
              }}
            />
          )}

          <div className="modal-btns" style={{ marginTop: 24 }}>
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
