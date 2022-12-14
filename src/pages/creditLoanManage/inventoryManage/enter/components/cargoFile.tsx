import React, { useState, useEffect } from 'react'
import { Form, Popconfirm, message } from 'antd'
import { EditableProTable } from '@ant-design/pro-table'
import RequiredLabel from '@/components/RequiredLabel'
import ComCard from '@/components/ComPage/ComCard'
import type { ProColumns } from '@ant-design/pro-table'
import { editCargoFile } from '@/services'
import DictSelect from '@/components/ComSelect'
import ComUpload from '@/components/ComUpload'
import { getDictData } from '@/utils/dictData'
import { isEmpty } from 'lodash'

interface infoProps {
  infoData: any
  info: any
  handleSuccess: () => void
}

const EditCargo: React.FC<infoProps> = ({ infoData, info, handleSuccess }) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([])
  const [dataSource, setDataSource] = useState<any[]>([])
  const [tableform] = Form.useForm()
  const [contractTypeData, setContractTypeData] = useState<any>()

  const getDict = async () => {
    const obj = await getDictData('stock_file_type')
    setContractTypeData(obj)
  }

  useEffect(() => {
    getDict()
  }, [])

  useEffect(() => {
    if (infoData && infoData.length) {
      setDataSource(
        infoData.map((item: any) => {
          return {
            ...item,
            key: item.groupId,
          }
        }),
      )
      setEditableRowKeys([])
    }
  }, [infoData])

  // 删除
  const delteRecored = async (ids: any) => {
    const arr = dataSource.filter((item) => item.id !== ids)
    await editCargoFile({
      id: info.id,
      version: info.version,
      stockAnnexList: arr,
      enterpriseId: info.enterpriseId,
    })
    setDataSource(arr)
    message.success('删除成功!')
    handleSuccess()
  }

  const columns: ProColumns<any>[] = [
    {
      title: <RequiredLabel label="文件类型" />,
      dataIndex: 'fileType',
      width: '30%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
        ],
      },
      renderFormItem: (_, { record }) => {
        const arr: any[] = []
        dataSource.forEach((item) => {
          if (item.fileType !== record.fileType) {
            arr.push(item.fileType)
          }
        })
        return <DictSelect onShowData={arr} authorword="stock_file_type" />
      },
      render: (_: any, recored: any) => <>{contractTypeData[recored.fileType]}</>,
    },
    {
      title: <RequiredLabel label="附件" />,
      dataIndex: 'fileList',
      width: '65%',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项是必填项',
          },
        ],
      },
      renderFormItem: () => <ComUpload />,
      render: (val: any, recored: any) =>
        isEmpty(recored.fileList) ? <>-</> : <ComUpload value={recored.fileList} isDetail />,
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (text: any, record: any, _: any, action: any) => [
        <a
          key="editable"
          onClick={() => {
            console.log(record)
            action?.startEditable?.(record.key)
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="是否确认删除?"
          onConfirm={() => {
            delteRecored(record.id)
          }}
          okText="确定"
          cancelText="取消"
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ]

  return (
    <ComCard title="理货报告及附件">
      <EditableProTable<any>
        rowKey="key"
        className="nopaddingtable"
        columns={columns}
        value={dataSource}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          record: () => ({
            key: Date.now(),
          }),
        }}
        onChange={setDataSource}
        editable={{
          // type: 'multiple',
          form: tableform,
          editableKeys,
          actionRender: (row, config, defaultDom) => {
            return [defaultDom.save, defaultDom.cancel]
          },
          onSave: async () => {
            await editCargoFile({
              id: info.id,
              version: info.version,
              stockAnnexList: dataSource,
              enterpriseId: info.enterpriseId,
            })
            message.success('保存成功!')
            handleSuccess()
          },
          onCancel: () => {
            handleSuccess()
          },
          onValuesChange: (record: any, recordList: any) => {
            setDataSource(recordList)
          },
          onChange: (editableKeyss: any) => {
            setEditableRowKeys(editableKeyss)
          },
        }}
      />
    </ComCard>
  )
}

export default EditCargo
