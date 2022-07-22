import React, { useState, useRef } from 'react'
import MenuProTable from '@/components/ComProtable/MenuProTable'
import type { creditListProps, creditListParamProps } from '@/services/types'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import { Typography, message } from 'antd'
import { history } from 'umi'
import { editCeditQutoStatus, getCeditList } from '@/services'
import DictSelect from '@/components/ComSelect'

const { Link } = Typography

const CreditManage: React.FC = () => {
  const [auditStatusData, setAuditStatusData] = useState<any>()
  const [quatoStatusData, setQuatoStatusData] = useState<any>()
  const actionRef = useRef<ActionType>()

  const getList = async (param: creditListParamProps) => {
    // console.log(param)
    const { rows, total } = await getCeditList(param)

    return {
      data: rows,
      total,
    }
  }

  // 改变额度状态
  const editQutoStatus = async (params: { id: number; quotaStatus: string }) => {
    await editCeditQutoStatus(params)
    message.success('更新成功')
    actionRef.current?.reload()
  }

  const columns: ProColumns<creditListProps>[] = [
    {
      title: '授信企业名称名称',
      dataIndex: 'enterpriseCreditName',
      width: '30%',
    },
    {
      title: '授信生效日/授信到期日',
      dataIndex: 'creditBecomDate',
      hideInSearch: true,
      render: (_, recored) => (
        <>
          {recored.creditBecomDate}/{recored.creditExpireDate}
        </>
      ),
    },
    {
      title: '授信生效日',
      dataIndex: 'creditBecomDate',
      hideInTable: true,
      valueType: 'dateRange',
      search: {
        transform: (value: any) => ({
          creditBecomDateStart: value[0],
          creditBecomDateEnd: value[1],
        }),
      },
    },
    {
      title: '授信到期日',
      dataIndex: 'creditExpireDate',
      hideInTable: true,
      valueType: 'dateRange',
      search: {
        transform: (value: any) => ({
          creditExpireDateStart: value[0],
          creditExpireDateEnd: value[1],
        }),
      },
    },
    {
      title: '审核状态',
      key: 'auditStatus',
      dataIndex: 'auditStatus',
      hideInSearch: true,
      render: (_, recored) => <>{auditStatusData[recored.auditStatus]}</>,
    },
    {
      title: '审核状态',
      key: 'auditStatus',
      dataIndex: 'auditStatus',
      hideInTable: true,
      renderFormItem: (_, { type }) => {
        if (type === 'form') {
          return null
        }
        return <DictSelect authorword="cus_shzt" getDictData={setAuditStatusData} />
      },
    },
    {
      title: '额度状态',
      key: 'quotaStatus',
      dataIndex: 'quotaStatus',
      hideInSearch: true,
      render: (_, recored) => <>{quatoStatusData[recored.quotaStatus]}</>,
    },
    {
      title: '额度状态',
      key: 'quotaStatus',
      dataIndex: 'quotaStatus',
      hideInTable: true,
      renderFormItem: (_, { type }) => {
        if (type === 'form') {
          return null
        }
        return <DictSelect authorword="cus_edzt" getDictData={setQuatoStatusData} />
      },
    },
    {
      title: '操作',
      width: 170,
      key: 'option',
      valueType: 'option',
      render: (_, recored) => [
        <Link
          key="approval"
          onClick={() => {
            history.push({
              pathname: '/leaderPage/undone/approval',
              query: {
                id: String(recored.id),
              },
            })
          }}
        >
          审核
        </Link>,
        <Link
          key="detail"
          onClick={() => {
            history.push({
              pathname: '/leaderPage/undone/approval',
              query: {
                id: String(recored.id),
              },
            })
          }}
        >
          详情
        </Link>,
        <Link
          key="dis"
          disabled={recored.quotaStatus === 'ygq' || recored.quotaStatus === 'wsx'}
          onClick={() => {
            editQutoStatus(recored)
          }}
        >
          {recored.quotaStatus === 'jy' ? '禁用' : '启用'}
        </Link>,
      ],
    },
  ]
  return <MenuProTable<any> rowKey="id" actionRef={actionRef} request={getList} columns={columns} />
}

export default CreditManage