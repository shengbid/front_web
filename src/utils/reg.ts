import zhRule from '@/locales/zh-CN/rules'
import enRule from '@/locales/zh-CN/rules'
import twRule from '@/locales/zh-CN/rules'
import { getLocale } from 'umi'

const RegObj = {
  'zh-CN': zhRule,
  'en-US': enRule,
  'zh-TW': twRule,
}
const RegText = RegObj[getLocale()]

export const REGS = {
  // 手机号正则表达式
  TELEPHONE_REG: /^1[3-9]\d{9}$/,
  // 六位校验码
  CHECK_CODE: /^[0-9]{6}$/,
  // 银行卡号
  BANK_CARD_REG: /^\d+$/,
  // 同时支持18位和15位社会信用代码
  CREDITCODE_REG: /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/,
  // 公司名称
  COMPANY_NAME_REG: /^[\u4e00-\u9fa5\(\)（）\da-zA-Z&]{2,50}$/,
  // 名字
  NAME_REG: /[\u4e00-\u9fa5]/,
  // 邮箱正则表达式
  EMAIL_REG: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
  // 密码验证 (数字大小写, 8-16位)
  PASS_WORD: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/,
  // 身份证校验
  ID_CARD_REG:
    /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/,
}
console.log(RegText, getLocale())
// 身份证正则的验证
export const idCardReg = {
  message: RegText.idCard,
  pattern: REGS.ID_CARD_REG,
}

// 数字正则的验证
export const numReg = {
  message: RegText.number,
  pattern: /^\d{0,11}(\.\d{0,4})?$/,
}

// 整数验证
export const integerReg = {
  message: RegText.integer,
  // pattern: /^[0-9]\d{0,14}$/
  pattern: /^(\d{0,11})$/,
}

// 电话号码验证
export const phoneReg = {
  message: RegText.phone,
  pattern: REGS.TELEPHONE_REG,
}

// 邮箱验证
export const emailReg = {
  message: RegText.email,
  pattern: REGS.EMAIL_REG,
}

// 密码验证
export const passwordReg = {
  message: RegText.password,
  pattern: REGS.PASS_WORD,
}

// 银行卡号验证
export const bankCardReg = {
  message: RegText.bankCard,
  pattern: REGS.BANK_CARD_REG,
}
