import { Collapse } from 'antd'
import type { CollapseProps } from 'antd'

const ComCollapse = (props: CollapseProps) => {
  return (
    <Collapse {...props} bordered={false} expandIconPosition="right">
      {props.children}
    </Collapse>
  )
}
ComCollapse.Panel = Collapse.Panel

export default ComCollapse