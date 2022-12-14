import { request } from 'umi'
import type { leaveListProps, leaveListParamProps } from '@/services/types'
import { paramsToPageParams } from '@/utils/base'

const url = '/activiti/task'
const leaveurl = '/activiti/leave'

/** 获取请假列表 */
export async function getLeaveList(params: leaveListParamProps) {
  return request<{ rows: leaveListProps[]; total: number }>(`/activiti/leave/list`, {
    params: paramsToPageParams(params),
  })
}

/** 新增编辑 */
export async function addLeva(data: leaveListProps) {
  return request<{ data: any[] }>(`/activiti/leave`, {
    method: 'post',
    data,
  })
}

/** 请假详情 */
export async function leaveDetail(id: string) {
  return request<{ data: any }>(`${leaveurl}/ById/${id}`)
}
/** 审批历史 */
export async function leaveHistory(id: string) {
  return request<{ data: any }>(`/activiti/historyFromData/By/${id}`)
}
/** 审批意见框 */
export async function approvalOpeator(deploymentId: string) {
  return request<{ data: any }>(`${url}/getButton/${deploymentId}`)
}
/** 审批操作 */
export async function approvalSave(taskId: string, data: any) {
  return request<{ data: any }>(`${url}/formDataSave/${taskId}`, {
    method: 'post',
    data,
  })
}
/** 获取流程标识 */
export async function getProcessInfo(instanceId: string) {
  return request<{ data: any }>(`/activiti/processDefinition/getDefinitions/${instanceId}`)
}
/** 获取流程进度 */
export async function getProcessIds(instanceId: string) {
  return request<{ data: any }>(`/activiti/activitiHistory/gethighLine`, {
    params: { instanceId },
  })
}
/** 获取审批流程详情 */
export async function processApprovalDetail(instanceId: string) {
  return request(`/activiti/processDefinition/getDefinitionXML`, {
    params: { instanceId },
  })
}

export async function addCredit(data: any) {
  return request<{ data: any[] }>(`/activiti/sxsp/startProcessRuntime`, {
    method: 'post',
    data,
  })
}
