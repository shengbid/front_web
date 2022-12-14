import component from './zh-CN/component'
import globalHeader from './zh-CN/globalHeader'
import menu from './zh-CN/menu'
import settingDrawer from './zh-CN/settingDrawer'
import pages from './zh-CN/pages'
import sysManage from './zh-CN/sysManage'
import customer from './zh-CN/customer'
import credit from './zh-CN/credit'

export default {
  'navBar.lang': '语言',
  'layout.user.link.help': '帮助',
  'layout.user.link.privacy': '隐私',
  'layout.user.link.terms': '条款',
  'app.copyright.produced': '蚂蚁集团体验技术部出品',
  'app.preview.down.block': '下载此页面到本地项目',
  'app.welcome.link.fetch-blocks': '获取全部区块',
  'app.welcome.link.block-list': '基于 block 开发，快速构建标准页面',
  ...pages,
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...component,
  ...sysManage,
  ...customer,
  ...credit,
}
