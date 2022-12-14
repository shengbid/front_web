import React, { useState, useEffect } from 'react'
import type { shareholderProps } from '@/services/types'
import ComEditTable from '@/components/ComProtable/ComEditTable'
import type { ProColumns } from '@ant-design/pro-table'
import RequiredTilte from '@/components/RequiredLabel'
import DictSelect from '@/components/ComSelect'
import { idTestReg } from '@/utils/reg'
import { Modal, Form, Button, message } from 'antd'
import { editRelateShareholder } from '@/services'
import ComInputNumber from '@/components/Input/InputNumber'
import { isEmpty } from 'lodash'

interface editProps {
  modalVisible: boolean
  handleCancel: (val?: any) => void
  infoData: any
  creditParams: any
}
const EditRelatedCompany: React.FC<editProps> = ({
  modalVisible,
  creditParams,
  handleCancel,
  infoData,
}) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<shareholderProps[]>()
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)

  const [tableForm] = Form.useForm()

  useEffect(() => {
    if (infoData && infoData.length) {
      setDataSource(
        infoData.map((item: any) => {
          return { ...item, key: item.id }
        }),
      )
      setEditableRowKeys(infoData.map((item: any) => item.id))
    }
  }, [infoData])

  const onSubmit = async () => {
    if (isEmpty(dataSource)) {
      message.warning('至少添加一条数据再提交!')
      return
    }
    await tableForm.validateFields()
    let totalRate = 0
    dataSource?.forEach((item: any) => {
      if (item.shareProportion) {
        totalRate += Number(item.shareProportion)
      }
    })
    if (totalRate > 100) {
      message.warning('占股比例总和不能超过100')
      return
    }
    setConfirmLoading(true)
    try {
      await editRelateShareholder(
        creditParams.enterpriseId,
        dataSource?.map((item: any) => {
          return {
            ...item,
            associatedEnterpriseId: creditParams.enterpriseId,
          }
        }),
      )
    } catch (error) {
      setConfirmLoading(false)
      return
    }
    setConfirmLoading(false)
    handleCancel(1)
  }

  const columns: ProColumns<shareholderProps>[] = [
    {
      title: <RequiredTilte label="股东姓名" />,
      dataIndex: 'shareholderName',
      width: '20%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
        ],
      },
    },
    {
      title: <RequiredTilte label="身份证件类型" />,
      dataIndex: 'identityType',
      width: '18%',
      renderFormItem: () => <DictSelect authorword="cus_sfzlx" />,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
        ],
      },
    },
    {
      title: <RequiredTilte label="证件号码" />,
      dataIndex: 'identityNumber',
      width: '26%',
      formItemProps: {
        rules: [
          {
            required: true,
            validator: ({ field }: any, value: any) => {
              // 获取当前行数据
              const current = tableForm.getFieldValue(`${field.split('.')[0]}`) || {}
              const idType = current.identityType ? current.identityType : 'xgsfz'

              if (!value) {
                return Promise.reject(new Error('此项是必填项'))
              } else if (!idTestReg(value)[idType]) {
                return Promise.reject(new Error('证件号码格式不正确'))
              }
              return Promise.resolve()
            },
          },
        ],
      },
    },
    {
      title: <RequiredTilte label="占股比例(%)" />,
      dataIndex: 'shareProportion',
      width: '140px',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
        ],
      },
      renderFormItem: () => {
        return <ComInputNumber max={100} />
      },
    },
  ]

  return (
    <Modal
      title={'修改关联股东信息'}
      maskClosable={false}
      destroyOnClose
      width={1000}
      visible={modalVisible}
      footer={false}
      onCancel={handleCancel}
    >
      <ComEditTable<shareholderProps>
        rowKey="key"
        scroll={{
          x: 750,
        }}
        columns={columns}
        value={dataSource}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            key: Date.now(),
          }),
        }}
        editable={{
          form: tableForm,
          editableKeys,
          type: 'multiple',
          onValuesChange: (record: any, recordList: any) => {
            setDataSource(recordList)
          },
          onChange: (editableKeyss: any, editableRows: shareholderProps[]) => {
            setEditableRowKeys(editableKeyss)
            setDataSource(editableRows)
          },
        }}
      />
      <div className="modal-btns">
        <Button type="primary" onClick={onSubmit} loading={confirmLoading}>
          确定
        </Button>
        <Button onClick={handleCancel} className="cancel-btn">
          取消
        </Button>
      </div>
    </Modal>
  )
}

export default EditRelatedCompany
