import component from './zh-TW/component'
import globalHeader from './zh-TW/globalHeader'
import menu from './zh-TW/menu'
import settingDrawer from './zh-TW/settingDrawer'
import sysManage from './zh-TW/sysManage'
import customer from './zh-TW/customer'
import credit from './zh-TW/credit'
import pages from './zh-TW/pages'

export default {
  'navBar.lang': '語言',
  'layout.user.link.help': '幫助',
  'layout.user.link.privacy': '隱私',
  'layout.user.link.terms': '條款',
  'app.preview.down.block': '下載此頁面到本地項目',
  ...globalHeader,
  ...menu,
  ...settingDrawer,
  ...component,
  ...sysManage,
  ...customer,
  ...credit,
  ...pages,
}
