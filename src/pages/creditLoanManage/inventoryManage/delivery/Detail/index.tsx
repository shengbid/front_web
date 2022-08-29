import React, { useState, useEffect } from 'react'
import ComPageContanier from '@/components/ComPage/ComPagContanier'
import { Button, /*Typography,*/ Spin, Table } from 'antd'
import { history } from 'umi'
import ComCard from '@/components/ComPage/ComCard'
import Descriptions from '@/components/ComPage/Descriptions'
import SimpleProtable from '@/components/ComProtable/SimpleProTable'
import type { ProColumns } from '@ant-design/pro-table'
import { formatAmount } from '@/utils/base'
import { getInventoryDeliveryDetail } from '@/services'
import CargoFile from '../components/cargoFile'
import { isEmpty } from 'lodash'
import { formatEmpty } from '@/utils/base'

// const { Link } = Typography

const { DescriptionsItem } = Descriptions

// 转在途,转在仓详情
const Detail: React.FC = (props: any) => {
  const [basicData, setBasicData] = useState<any>({})
  const [dataSource, setDataSource] = useState<any[]>([])
  const [dataSource2, setDataSource2] = useState<any[]>([])
  const [spinning, setSpinning] = useState<boolean>(true)

  const { id } = props.location.query

  // 获取详情
  const getDetail = async () => {
    try {
      const { data } = await getInventoryDeliveryDetail(id)
      setSpinning(false)
      if (data) {
        setBasicData(data)
        if (!isEmpty(data.outGoodList)) {
          setDataSource(data.outGoodList)
        }
        if (!isEmpty(data.stockAnnexList)) {
          setDataSource2(data.stockAnnexList)
        }
      }
    } catch (error) {
      setSpinning(false)
    }
  }

  useEffect(() => {
    getDetail()
  }, [])

  useEffect(() => {
    setBasicData({})
    setDataSource([])
  }, [])

  const columns: ProColumns<any>[] = [
    {
      title: '商品编号/ID',
      key: 'enterpriseGoodNumber',
      dataIndex: 'enterpriseGoodNumber',
    },
    {
      title: '商品名称',
      key: 'goodName',
      dataIndex: 'goodName',
    },
    {
      title: '条形码',
      key: 'barCode',
      dataIndex: 'barCode',
    },
    {
      title: '有效期',
      key: 'effectiveDate',
      dataIndex: 'effectiveDate',
    },
    {
      title: '批次号',
      key: 'batchNumber',
      dataIndex: 'batchNumber',
      width: 90,
    },
    {
      title: '良品数量',
      key: 'completeCount',
      dataIndex: 'completeCount',
      valueType: 'digit',
      width: 100,
    },
    {
      title: '残次品数量',
      key: 'imperfectCount',
      dataIndex: 'imperfectCount',
      valueType: 'digit',
      width: 100,
    },
    {
      title: '出库数量',
      key: 'warehouseTotal',
      dataIndex: 'warehouseTotal',
      valueType: 'digit',
      width: 100,
    },
    {
      title: '采购单价',
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
      title: '总价',
      key: 'warehousePrice',
      dataIndex: 'warehousePrice',
      // valueType: 'digit',
      width: 110,
      hideInSearch: true,
      render: (val) => formatAmount(val),
    },
    {
      title: '单位',
      key: 'unit',
      dataIndex: 'unit',
      width: 60,
      hideInSearch: true,
    },
  ]

  const cancel = () => {
    history.goBack()
  }

  return (
    <Spin spinning={spinning}>
      <ComPageContanier
        title="出库详情"
        extra={
          <Button type="primary" onClick={cancel}>
            返回
          </Button>
        }
      >
        <ComCard title="基础信息" style={{ marginTop: 12 }}>
          <Descriptions>
            <DescriptionsItem label="货主企业">{basicData.enterpriseName}</DescriptionsItem>
            <DescriptionsItem label="出库单号">{basicData.outWarehouseCode}</DescriptionsItem>
            <DescriptionsItem label="出库仓库">{basicData.warehouseName}</DescriptionsItem>
            <DescriptionsItem label="关联金融产品">{basicData.financOrder}</DescriptionsItem>
            <DescriptionsItem label="关联还款单号">{basicData.repaymentCode}</DescriptionsItem>
            <DescriptionsItem label="销售类型">{basicData.saleType}</DescriptionsItem>
            <DescriptionsItem label="实际出仓时间">--</DescriptionsItem>
            <DescriptionsItem label="关联销售单号">
              {formatEmpty(basicData.financOrder)}
            </DescriptionsItem>
            <DescriptionsItem label="销售平台">--</DescriptionsItem>
          </Descriptions>
        </ComCard>

        <ComCard title="出库商品信息">
          <SimpleProtable
            columns={columns}
            dataSource={dataSource}
            scroll={{ x: 1300, y: 500 }}
            summary={(pageData) => {
              let totalUsableCount = 0
              let totalBadCount = 0
              let totalDeliveryCount = 0

              pageData.forEach(({ completeCount, imperfectCount, warehouseTotal }) => {
                if (completeCount) {
                  totalUsableCount += Number(completeCount)
                }
                if (imperfectCount) {
                  totalBadCount += Number(imperfectCount)
                }
                if (warehouseTotal) {
                  totalDeliveryCount += Number(warehouseTotal)
                }
              })
              if (isEmpty(dataSource)) {
                return <></>
              }
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5}>
                    合计
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1}>{totalUsableCount}</Table.Summary.Cell>
                  <Table.Summary.Cell index={2}>{totalBadCount}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3}>{totalDeliveryCount}</Table.Summary.Cell>
                  <Table.Summary.Cell index={3} colSpan={4} />
                </Table.Summary.Row>
              )
            }}
          />
        </ComCard>

        {/* <ComCard title="商品估值">
          <Descriptions>
            <DescriptionsItem label="本次质押商品值">{basicData.goodValuation}</DescriptionsItem>
            <DescriptionsItem label="本次质押实际估值">
              {basicData.goodValuation}
              <Link
                onClick={() => {
                  setRuleVisible(true)
                }}
              >
                查看质押规则
              </Link>
            </DescriptionsItem>
          </Descriptions>
        </ComCard> */}

        <CargoFile
          infoData={dataSource2}
          handleSuccess={getDetail}
          info={{
            id: basicData.id,
            version: basicData.version,
            enterpriseId: basicData.enterpriseId,
          }}
        />
      </ComPageContanier>
    </Spin>
  )
}

export default Detail
