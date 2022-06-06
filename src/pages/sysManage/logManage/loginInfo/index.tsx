import React, { useState, useRef } from 'react'
import MenuProTable from '@/components/ComProtable/MenuProTable'
import type { loginInfoProps, loginInfoParamProps } from '@/services/types'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import { message, Tag } from 'antd'
import { getLoginInfoList, deleteLoginInfo } from '@/services'
import ExportFile from '@/components/ComUpload/exportFile'
import DictSelect from '@/components/ComSelect'
import { useIntl } from 'umi'

const { MenuMultiDelButton } = MenuProTable

const RoleManage: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [params, setParams] = useState<loginInfoParamProps>()
  const intl = useIntl()
  const actionRef = useRef<ActionType>()

  const columns: ProColumns<loginInfoProps>[] = [
    {
      title: intl.formatMessage({
        id: 'sys.loginInfo.infoId',
      }),
      key: 'infoId',
      hideInSearch: true,
      dataIndex: 'infoId',
    },
    {
      title: intl.formatMessage({
        id: 'sys.user.userName',
      }),
      key: 'userName',
      dataIndex: 'userName',
    },
    {
      title: intl.formatMessage({
        id: 'sys.loginInfo.ipaddr',
      }),
      key: 'ipaddr',
      dataIndex: 'ipaddr',
    },
    {
      title: intl.formatMessage({
        id: 'sys.loginInfo.loginLocation',
      }),
      key: 'loginLocation',
      hideInSearch: true,
      dataIndex: 'loginLocation',
    },
    {
      title: intl.formatMessage({
        id: 'sys.loginInfo.browser',
      }),
      key: 'browser',
      hideInSearch: true,
      dataIndex: 'browser',
    },
    {
      title: intl.formatMessage({
        id: 'sys.loginInfo.os',
      }),
      key: 'os',
      hideInSearch: true,
      dataIndex: 'os',
    },
    {
      title: intl.formatMessage({
        id: 'sys.loginInfo.status',
      }),
      key: 'status',
      dataIndex: 'status',
      hideInTable: true,
      renderFormItem: (_, { type }) => {
        if (type === 'form') {
          return null
        }
        return <DictSelect authorword="sys_common_status" />
      },
    },
    {
      title: intl.formatMessage({
        id: 'sys.base.status',
      }),
      key: 'status',
      dataIndex: 'status',
      hideInSearch: true,
      render: (val) =>
        val === '0' ? (
          <Tag color="processing">
            {intl.formatMessage({
              id: 'pages.form.success',
            })}
          </Tag>
        ) : (
          <Tag color="error">
            {intl.formatMessage({
              id: 'pages.form.fail',
            })}
          </Tag>
        ),
    },
    {
      title: intl.formatMessage({
        id: 'sys.loginInfo.msg',
      }),
      key: 'msg',
      hideInSearch: true,
      dataIndex: 'msg',
    },
    {
      title: intl.formatMessage({
        id: 'sys.loginInfo.loginTime',
      }),
      key: 'accessTime',
      dataIndex: 'accessTime',
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'sys.loginInfo.loginTime',
      }),
      hideInTable: true,
      dataIndex: 'accessTime',
      valueType: 'dateRange',
      search: {
        transform: (value: any) => ({ beginTime: value[0], endTime: value[1] }),
      },
    },
  ]

  const getList = async (param: loginInfoParamProps) => {
    // console.log(param)
    setParams(param)
    const { rows, total } = await getLoginInfoList(param)
    return {
      data: rows,
      total,
    }
  }

  // 批量删除
  const multipleDelete = async () => {
    console.log(selectedRowKeys)
    if (selectedRowKeys.length) {
      await deleteLoginInfo(selectedRowKeys.join(','))
      message.success(
        intl.formatMessage({
          id: 'pages.form.delete',
        }),
      )
      actionRef.current?.reload()
      setSelectedRowKeys([])
    } else {
      message.warning(
        intl.formatMessage({
          id: 'pages.table.oneDataDelete',
        }),
      )
    }
  }

  return (
    <>
      <MenuProTable<loginInfoProps>
        request={getList}
        rowKey="infoId"
        columns={columns}
        actionRef={actionRef}
        toolBarRender={() => [
          <ExportFile
            authorword="monitor:logininfor:export"
            key="export"
            params={params}
            title={intl.formatMessage({
              id: 'sys.operate.name',
            })}
            url="/monitor/logininfor"
          />,
          <MenuMultiDelButton
            authorword="monitor:logininfor:remove"
            key="delete"
            onClick={multipleDelete}
          />,
        ]}
        tableAlertRender={false}
        rowSelection={{
          selectedRowKeys,
          onChange: (value) => {
            setSelectedRowKeys(value)
          },
        }}
      />
    </>
  )
}

export default RoleManage
