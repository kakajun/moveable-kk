/**
 * 统计信息
 */
export interface Statistic {
  //元素个数
  count?: number
  //历史记录
  history?: any
}

/**
 * 基础样式
 */
export interface BaseStyle {
  //内边距
  padding?: string
  //背景颜色
  backgroundColor?: string
  //边框
  border?: string
  //边框样式
  borderStyle?: string
  //边框颜色
  borderColor?: string
  //边框圆角
  borderRadius?: string
  //边框宽度
  borderWidth?: string
}

export interface APIConfig {
  //地址
  url?: string
  //请求方式
  method?: 'get' | 'post' | 'put' | 'delete'
  //请求头
  header?: any
  //请求参数
  params?: any
  //刷新频率
  flashFrequency?: number
}

/**
 * 静态数据配置
 */
export interface StaticConfig {
  //数据
  data?: any
}

/**
 * 数据配置项
 */
export interface DataConfigType {
  //数据来源方式
  dataSource?: 'static' | 'api' | 'database' | 'excel'
  //静态数据(除了存放静态数据外，该属性还有动态数据的中转站的作用），其他动态数据获取到后统一都存放在静态数据中，需要使用到的时候再从静态数据中获取
  staticData?: StaticConfig
  apiData?: APIConfig
  databaseData?: any
  excelData?: any
}

/**
 * 存储类型
 */
export enum SaveType {
  //本地存储(indexedDB)
  LOCAL = '0',
  //服务器存储
  SERVER = '1'
}

/**
 * 项目状态
 */
export enum ProjectState {
  //草稿
  DRAFT = '0',
  //发布
  PUBLISH = '1',
  //封存
  SEALED = '2'
}

/**
 * 项目配置
 */
export interface ProjectConfig {
  //项目名称
  name?: string
  //项目描述
  des?: string
  //项目状态
  state?: ProjectState
  //创建时间
  createTime?: string
  //更新时间
  updateTime?: string
  //存储类型
  saveType?: SaveType
  //项目截图
  screenshot?: string
}

/**
 * 激活元素
 */
export interface ActiveElem {
  //元素id
  id?: string
  //元素类型
  type?: string
}

/**
 * 画布配置
 */
export interface CanvasConfig {
  //开启栅格化
  rasterize?: boolean
  //栅格化拖拽步长
  dragStep?: number
  //栅格化缩放步长
  resizeStep?: number
  //画布宽
  width?: number
  //画布高
  height?: number
}

/**
 * 组件基础信息
 */
export interface BaseInfoType {
  /**
   * 组件显示名称
   */
  compName: string
  /**
   * 组件标识
   */
  compKey: string
  /**
   * 类型名称
   */
  type: string
  /**
   * 类型标识
   */
  typeKey: string
  /**
   * 组件描述
   */
  desc: string
}

/**
 * lc设计器配置
 */
export interface ProjectDataType {
  //项目id
  id?: string
  //画布设置
  canvasConfig?: CanvasConfig
  //图层信息
  layerConfigs?: { [key: string]: ILayerItem }
}

export interface ILayerItem {
  //唯一标识
  id?: string | undefined
  //组件名称
  name?: string | undefined
  //组件类型
  type?: string | undefined
  config: {
    //是否锁定
    lock?: boolean
  }
  //坐标
  style?: {
    left?: number
    top?: number
    width?: number
    height?: number
    zIndex?: number
    rotate?: number
  }
  //是否隐藏
  hide?: boolean
  //父图层id
  parent?: string
  //子图层列表
  children?: ILayerItem[]
  //子图层id
  childIds?: string[]
}
