import { request } from 'umi'
import type { roleParamProps, roleListProps } from '@/services/types'
import { paramsToPageParams } from '@/utils/base'

const url = '/system/role'

/** 获取角色列表 */
export async function getRoleList(params: roleParamProps) {
  return request<{ rows: roleListProps[]; total: number }>(`${url}/list`, {
    params: paramsToPageParams(params),
  })
}

/** 新增编辑角色 */
export async function addRole(data: roleListProps) {
  return request(`${url}`, {
    method: data.roleId ? 'put' : 'post',
    data,
  })
}
/** 删除角色 */
export async function deleteRole(id: number | string) {
  return request(`${url}/${id}`, {
    method: 'delete',
  })
}

/** 获取角色详情 */
export async function roleDetail(id: number) {
  return request<{ data: roleListProps }>(`${url}/${id}`)
}

/** 改变角色状态 */
export async function changeRoleStatus(data: { status: string; roleId: number }) {
  return request(`${url}/changeStatus`, {
    data,
    method: 'put',
  })
}
/** 分配权限 */
export async function addDataPerms(data: roleListProps) {
  return request(`${url}/dataScope`, {
    data,
    method: 'put',
  })
}

/** 获取角色用户列表 */
export async function getRoleUserList(params: roleParamProps) {
  return request<{ rows: roleListProps[]; total: number }>(`${url}/authUser/allocatedList`, {
    params: paramsToPageParams(params),
  })
}
/** 取消授权 */
export async function cancelAuthor(data: { userId: number | string; roleId: number }) {
  return request(`${url}/authUser/cancel`, {
    data,
    method: 'put',
  })
}
