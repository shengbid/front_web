import MenuProTable from '@/components/ComProtable/MenuProTable'
import type { undoneListProps, undoneListParamProps, doneListProps } from '@/services/types'
import type { ProColumns, ActionType } from '@ant-design/pro-table'
import { Typography, Tabs, Badge } from 'antd'
import { searchdoneList, searchUndoneList, geRecepetList } from '@/services'
import React, { useState, useRef } from 'react'
// import { StatisticCard } from '@ant-design/pro-card'
import { useIntl, history } from 'umi'
import AddModal from './components/addModal'
import DictSelect from '@/components/ComSelect'
// import { FileImageOutlined } from '@ant-design/icons'
const { TabPane } = Tabs
// const { Divider } = StatisticCard
const { Link } = Typography

const Undone: React.FC = () => {
  const [activeKey, setActiveKey] = useState<React.Key | undefined>('tab1')
  const intl = useIntl()
  const actionRef = useRef<ActionType>()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [info, setInfo] = useState<any>()
  const [dbCount, setdbCount] = useState<number>(0)
  const [ybCount] = useState<number>(0)
  const [processTypes, setProcessTypes] = useState<any[]>([])

  const getList = async (param: undoneListParamProps) => {
    // console.log(param)
    // const { rows, total } = await getUndoneList(param)
    const { rows, total } = await searchUndoneList(param)
    setdbCount(total)
    return {
      data: rows,
      total,
    }
  }
  // 获取已办列表
  const getdoList = async (param: undoneListParamProps) => {
    // console.log(param)
    // const { rows, total } = await getdoneList(param)
    const { rows, total } = await searchdoneList(param)
    // setybCount(total)
    return {
      data: rows,
      total,
    }
  }
  // 获取抄送列表
  const getReceptList = async (param: undoneListParamProps) => {
    // console.log(param)
    const { rows, total } = await geRecepetList(param)
    // setybCount(total)
    return {
      data: rows,
      total,
    }
  }

  const columns: ProColumns<undoneListProps>[] = [
    {
      title: '任务编号',
      dataIndex: 'processNo',
    },
    {
      title: '任务类型',
      dataIndex: 'rwlx',
      hideInSearch: true,
      render: (_, recored) => <>{processTypes[recored.rwlx]}</>,
    },
    {
      title: '任务名称',
      dataIndex: 'taskTotalName',
    },
    {
      title: '任务类型',
      key: 'rwlx',
      dataIndex: 'rwlx',
      hideInTable: true,
      renderFormItem: (_, { type }) => {
        if (type === 'form') {
          return null
        }
        return <DictSelect getDictData={setProcessTypes} authorword="process_type" />
      },
    },
    {
      title: '发起人',
      key: 'fqrNickname',
      dataIndex: 'fqrNickname',
      hideInSearch: true,
    },
    {
      title: '接受时间',
      key: 'createdDate',
      width: 160,
      dataIndex: 'createdDate',
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.option',
      }),
      width: 80,
      key: 'option',
      valueType: 'option',
      render: (_, recored) => [
        <Link
          key="picture"
          onClick={async () => {
            setInfo(recored)
            // setModalVisible(true)
            history.push({
              pathname: '/leaderPage/undone/approval',
              query: {
                // id: recored.id,
                // businessKey: recored.businessKey,
                // taskNodeName: recored.name,
                taskNumber: recored.instanceId,
                // formKey: recored.formKey,
                title: recored.taskTotalName,
              },
            })
            sessionStorage.setItem('preUrl', '/leaderPage/undone')
          }}
        >
          {/* <FileImageOutlined style={{ marginRight: 3 }} /> */}
          处理
        </Link>,
      ],
    },
  ]

  const columns2: ProColumns<doneListProps>[] = [
    {
      title: '任务编号',
      dataIndex: 'processNo',
    },
    {
      title: '任务类型',
      dataIndex: 'rwlx',
      hideInSearch: true,
      render: (_, recored) => <>{processTypes[recored.rwlx]}</>,
    },
    {
      title: '任务名称',
      dataIndex: 'taskTotalName',
    },
    {
      title: '任务类型',
      key: 'rwlx',
      dataIndex: 'rwlx',
      hideInTable: true,
      renderFormItem: (_, { type }) => {
        if (type === 'form') {
          return null
        }
        return <DictSelect authorword="process_type" />
      },
    },
    {
      title: '发起人',
      key: 'fqrNickname',
      dataIndex: 'fqrNickname',
      hideInSearch: true,
    },
    {
      title: '接受时间',
      key: 'startTime',
      width: 160,
      dataIndex: 'startTime',
      hideInSearch: true,
      valueType: 'dateTime',
    },
    {
      title: '完成时间',
      key: 'endTime',
      width: 160,
      dataIndex: 'endTime',
      hideInSearch: true,
      valueType: 'dateTime',
      hideInTable: activeKey === 'tab2',
    },
    {
      title: '状态',
      key: 'status',
      width: 160,
      dataIndex: 'status',
      hideInSearch: true,
      hideInTable: activeKey === 'tab3',
    },
    {
      title: intl.formatMessage({
        id: 'pages.table.option',
      }),
      width: 80,
      key: 'option',
      valueType: 'option',
      render: (_, recored) => [
        <Link
          key="picture"
          onClick={async () => {
            setInfo(recored)
            // setModalVisible(true)
            history.push({
              pathname: '/leaderPage/undone/approval',
              query: {
                detail: 'detail',
                // id: recored.id,
                // businessKey: recored.businessKey,
                // taskNodeName: recored.taskNodeName,
                // instanceId: recored.instanceId,
                // formKey: recored.formKey,
                title: recored.taskTotalName,
                taskNumber: recored.instanceId,
              },
            })
            sessionStorage.setItem('preUrl', '/leaderPage/undone')
          }}
        >
          {/* <FileImageOutlined style={{ marginRight: 3 }} /> */}
          详情
        </Link>,
      ],
    },
  ]

  const submit = () => {
    setModalVisible(false)
    actionRef?.current?.reload()
  }

  return (
    <div>
      {/* <StatisticCard.Group direction={'row'} style={{ marginBottom: 24 }}>
        <StatisticCard
          statistic={{
            title: '我的待办',
            value: 19,
            suffix: '个任务',
          }}
        />
        <Divider type="vertical" />
        <StatisticCard
          statistic={{
            title: '我的已办',
            value: 81,
            suffix: '个任务',
          }}
        />
        <Divider type="vertical" />
        <StatisticCard
          statistic={{
            title: '总任务',
            value: 100,
            suffix: '个任务',
          }}
        />
      </StatisticCard.Group> */}
      <Tabs type="card" className="tab-bages" onChange={setActiveKey}>
        <TabPane tab={<Badge count={dbCount}>我的待办</Badge>} key="tab1">
          <MenuProTable<any>
            rowKey="id"
            request={getList}
            columns={columns}
            actionRef={actionRef}
          />
        </TabPane>
        <TabPane tab={<Badge count={ybCount}>抄送给我</Badge>} key="tab2">
          <MenuProTable<any> rowKey="id" request={getReceptList} columns={columns2} />
        </TabPane>
        <TabPane tab="我的已办" key="tab3">
          <MenuProTable<any> rowKey="taskId" request={getdoList} columns={columns2} />
        </TabPane>
      </Tabs>

      <AddModal
        modalVisible={modalVisible}
        handleSubmit={submit}
        info={info}
        handleCancel={() => setModalVisible(false)}
      />
    </div>
  )
}

export default Undone
