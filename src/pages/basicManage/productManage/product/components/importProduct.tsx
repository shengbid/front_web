import React, { useState, useEffect } from 'react'
import { Modal, Button } from 'antd'
import type { addModalProps, productListProps } from '@/services/types'
import SimpleProtable from '@/components/ComProtable/SimpleProTable'
import type { ProColumns } from '@ant-design/pro-table'
import { Typography, message } from 'antd'
import { addMutilProduct } from '@/services'
import { formatAmount } from '@/utils/base'

const { Link } = Typography

const ImportProduct: React.FC<addModalProps> = ({
  modalVisible,
  handleSubmit,
  handleCancel,
  info,
}) => {
  const [dataSource, setDataSource] = useState<any[]>([])
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false)
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    if (modalVisible && info) {
      setDataSource(info)
      setCount(info.filter((item: any) => item.existFlag).length)
    }
  }, [modalVisible, info])

  const columns: ProColumns<productListProps>[] = [
    {
      title: '商品名称',
      key: 'goodName',
      dataIndex: 'goodName',
    },
    {
      title: '品牌名称',
      key: 'goodBrand',
      dataIndex: 'goodBrand',
    },
    {
      title: '商品条码',
      key: 'barCode',
      dataIndex: 'barCode',
      render: (_, recored) => (
        <span style={recored.existFlag ? { color: 'red' } : {}}>{recored.barCode}</span>
      ),
    },
    {
      title: 'REF码',
      key: 'goodRef',
      dataIndex: 'goodRef',
    },
    {
      title: 'SKU NO',
      key: 'goodSku',
      dataIndex: 'goodSku',
    },
    {
      title: '商品HScode',
      key: 'goodHscode',
      dataIndex: 'goodHscode',
      hideInSearch: true,
    },
    {
      title: '最近采购单价',
      key: 'purchasePrice',
      dataIndex: 'purchasePrice',
      // valueType: 'digit',
      width: 125,
      hideInSearch: true,
      render: (val) => formatAmount(val),
    },
    {
      title: '公允单价',
      key: 'fairPrice',
      dataIndex: 'fairPrice',
      // valueType: 'digit',
      width: 110,
      hideInSearch: true,
      render: (val) => formatAmount(val),
    },
    {
      title: '保质期(月)',
      key: 'warrantyMonth',
      dataIndex: 'warrantyMonth',
      width: 90,
      hideInSearch: true,
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
      width: 60,
      hideInSearch: true,
    },
    {
      title: '操作',
      width: 85,
      key: 'option',
      valueType: 'option',
      render: (_, recored) => [
        <Link
          key="edit"
          onClick={() => {
            setDataSource(dataSource.filter((item: any) => item.barCode !== recored.barCode))
          }}
        >
          删除
        </Link>,
      ],
    },
  ]

  const submit = async () => {
    setConfirmLoading(true)
    try {
      await addMutilProduct({ jxGoodManageList: dataSource })
    } catch (error) {
      setConfirmLoading(false)
      return
    }
    setConfirmLoading(false)
    message.success('添加成功!')
    handleSubmit()
  }

  return (
    <Modal
      title="批量导入商品"
      maskClosable={false}
      destroyOnClose
      width={1000}
      visible={modalVisible}
      footer={null}
      onCancel={handleCancel}
    >
      <div style={{ paddingBottom: 15, fontSize: 14 }}>
        <span>
          本次新增 <span style={{ color: 'red' }}>{dataSource.length}</span> 个商品
        </span>
        {count ? (
          <span>
            ，其中 <span style={{ color: 'red' }}>{count}</span> 个商品已存在，
            若继续提交会覆盖已有商品信息。
          </span>
        ) : null}
      </div>
      <SimpleProtable
        key="barCode"
        columns={columns}
        dataSource={dataSource}
        scroll={{ x: 1100 }}
      />
      <div className="modal-btns" style={{ marginTop: 24 }}>
        <Button type="primary" onClick={submit} loading={confirmLoading}>
          确定
        </Button>
        <Button onClick={handleCancel} className="cancel-btn">
          取消
        </Button>
      </div>
    </Modal>
  )
}

export default ImportProduct
