/**
 * 配置对象片段
 */
export default class ObjectUtil {
  /**
   * 合并两个对象，将newData中的属性合并到originalData中
   * @param originalData
   * @param newData
   */
  static merge(originalData, newData) {
    Object.keys(newData).forEach((key) => {
      const newValue = newData[key]
      if (originalData.hasOwnProperty(key)) {
        if (Array.isArray(newValue)) {
          originalData[key] = newValue
        } else if (
          newValue &&
          typeof newValue === 'object' &&
          Object.keys(newValue).length > 0 &&
          originalData[key] &&
          typeof originalData[key] === 'object' &&
          !!originalData[key]
        ) {
          ObjectUtil.merge(originalData[key], newValue)
        } else {
          originalData[key] = newValue
        }
      } else {
        originalData[key] = newValue
      }
    })
    return originalData
  }

  /**
   * 将字符串转换为js对象
   */
  static stringToJsObj(code) {
    code = code.replace(/[\s+\n]+/g, '').replace(/'/g, '"')
    try {
      return JSON.parse(code)
    } catch (e) {
      return false
    }
  }

  /**
   * 获取原始对象中的属性值
   */
  static getOriginValue(originObj, newObj) {
    function findAndExtract(original, updated) {
      const result = {}
      for (const key in updated) {
        if (typeof updated[key] === 'object' && !Array.isArray(updated[key]) && original[key]) {
          if (original[key]) {
            result[key] = findAndExtract(original[key], updated[key])
          }
        } else {
          result[key] = original[key]
        }
      }
      return result
    }
    return findAndExtract(originObj, newObj)
  }
}
