import { request } from 'umi'
import type { creditListProps, creditListParamProps, surveyParamProps } from '@/services/types'
import { paramsToPageParams } from '@/utils/base'

const Url = '/system/credit'
const url = '/system'

/** 获取授信列表 */
export async function getCeditList(params: creditListParamProps) {
  return request<{ rows: creditListProps[]; total: number }>(`${Url}/list`, {
    params: paramsToPageParams(params),
  })
}
/** 修改授信额度状态 */
export async function editCeditQutoStatus(data: { id: number; quotaStatus: string }) {
  return request(`${Url}/edit/quota`, {
    data,
    method: 'put',
  })
}

// 根据任务编号获取授信详情
export async function getCreditDetail(taskNumber: string) {
  return request<{ data: any }>(`${Url}/get/task/details`, {
    params: { taskNumber },
  })
}
// 根据企业id获取授信详情
export async function getCreditDetailById(enterpriseId: string) {
  return request<{ data: any }>(`${Url}/get/credit/details`, {
    params: { enterpriseId },
  })
}

// 获取企业详情
export async function getCompanyDetail(id: number) {
  return request<{ data: any }>(`${url}/enterprise/get/details`, {
    params: { id },
  })
}

// 修改企业
export async function editCompany(data: any) {
  return request<{ data: any }>(`${url}/enterprise/save`, {
    method: 'post',
    data,
  })
}

// 修改企业业务信息
export async function editCompanyBus(data: any) {
  return request<{ data: any }>(`${Url}/edit/enterprise`, {
    method: 'post',
    data,
  })
}
// 修改企业清单
export async function editCompanyFile(data: any) {
  return request<{ data: any }>(`${Url}/edit/operate`, {
    method: 'post',
    data,
  })
}
// 修改企业人员
export async function editCompanyPeople(data: any) {
  return request<{ data: any }>(`${Url}/edit/person`, {
    method: 'post',
    data,
  })
}
// 尽调合同文件
export async function addSurveyReport(data: any) {
  return request<{ data: any }>(`${url}/cus/cusCreditAuditFile/add`, {
    method: 'post',
    data,
  })
}
// 尽调合同文件详情
export async function surveyReportDetail(params: surveyParamProps) {
  return request<{ data: any }>(`${url}/credit/cusCreditAuditFile/get/list`, {
    method: 'get',
    params,
  })
}
// 获取合同附件详情
export async function creditContractDetail(params: any) {
  return request<{ data: any }>(`/activiti/task/getAttatchment`, {
    method: 'get',
    params,
  })
}
