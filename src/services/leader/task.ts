import { request } from 'umi'
import type {
  undoneListProps,
  undoneListParamProps,
  leaveListProps,
  leaveListParamProps,
} from '@/services/types'
import { paramsToPageParams } from '@/utils/base'

const url = '/activiti/task'

/** 获取待办列表 */
export async function getUndoneList(params: undoneListParamProps) {
  return request<{ rows: undoneListProps[]; total: number }>(`${url}/list`, {
    params: paramsToPageParams(params),
  })
}

/** 获取请假列表 */
export async function getLeaveList(params: leaveListParamProps) {
  return request<{ rows: leaveListProps[]; total: number }>(`/activiti/leave/listAll`, {
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
export async function leaveDetail(deploymentId: string) {
  return request<{ data: any }>(`${url}/formDataShow/${deploymentId}`)
}
/** 审批意见框 */
export async function approvalOpeator(deploymentId: string) {
  return request<{ data: any }>(`${url}/formDataShow/${deploymentId}`)
}
/** 审批操作 */
export async function approvalSave(deploymentId: string) {
  return request<{ data: any }>(`${url}/formDataSave/${deploymentId}`)
}
