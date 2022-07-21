import type { fileListOptionProps } from './base'

// 企业经营信息
export interface companyBusProps {
  id: string
  enterpriseName: string
  businessTypeList: string
  sellProduct: string
  enterpriseDebt: string
  applyQuota: string
  updateTime: string
  businessDetailsList: companyBusinessProps[]
}
// 企业清单信息
export interface companyFileProps {
  id: string
  creditId: string
  lszh: fileListOptionProps[]
  hwqd: fileListOptionProps[]
  cgqd: fileListOptionProps[]
  xykhqd: fileListOptionProps[]
  btobSdqd: fileListOptionProps[]
  jyrsm: fileListOptionProps[]
  btocSdqd: fileListOptionProps[]
  skjt: fileListOptionProps[]
}
// 企业人员信息
export interface companyPeopleProps {
  id: string
  identity: string
  identityType: string
  identityNumber: string
  name: string
}

// 企业经营年度营业额情况
export interface companyBusinessProps {
  year?: string | number
  businessVolume?: string
  businessVolume2?: string
}
