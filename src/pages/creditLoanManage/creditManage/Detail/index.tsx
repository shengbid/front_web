import React from 'react'
import { Tabs, Typography } from 'antd'
import CardTitle from '@/components/ComPage/CardTitle'
import SimpleProtable from '@/components/ComProtable/SimpleProTable'
import { getCreditHistory } from '@/services'
import type { ProColumns } from '@ant-design/pro-table'
import DictShow from '@/components/ComSelect/dictShow'
import styles from './index.less'
import { history } from 'umi'

const { TabPane } = Tabs
const { Link } = Typography

const Detail: React.FC = (props: any) => {
  const { enterpriseId, cusEnterpriseCredit } = props.location.query

  const getDetail = async () => {
    const { rows } = await getCreditHistory(enterpriseId, cusEnterpriseCredit)
    return {
      data: rows,
    }
  }

  const columns: ProColumns<any>[] = [
    {
      title: '任务编号',
      key: 'taskNumber',
      dataIndex: 'taskNumber',
    },
    {
      title: '审核状态',
      dataIndex: 'auditStatus',
      width: '30%',
      render: (_, recored) => <DictShow dictValue={recored.auditStatus} dictkey="cus_shzt" />,
    },
    {
      title: '审核完成时间',
      key: 'updateTime',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
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
                detail: 'detail',
              },
            })
          }}
        >
          详情
        </Link>,
      ],
    },
  ]

  return (
    <div className={styles.contanier}>
      <Tabs type="card">
        <TabPane tab="授信信息" key="1">
          <></>
        </TabPane>
        <TabPane tab="授信审核记录" key="2">
          <CardTitle title="授信审核记录">
            <SimpleProtable key="id" columns={columns} request={getDetail} />
          </CardTitle>
        </TabPane>
      </Tabs>
    </div>
  )
}

export default Detail