/**
 * 正则校验工具函数
 * 主要参考 any-rule: https://github.com/any86/any-rule
 */

// 验证不能包含字母
export const isNoWord = value => /^[^A-Z]*$/i.test(value)

// 验证中文和数字
export const isCHNAndEN = value => /^([\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|(\d))+$/.test(value)

// 验证邮政编码(中国)
export const isPostcode = value => /^(0[1-7]|1[0-356]|2[0-7]|3[0-6]|4[0-7]|5[1-7]|6[1-7]|7[0-5]|8[013-6])\d{4}$/.test(value)

// 验证微信号，6至20位，以字母开头，字母，数字，减号，下划线
export const isWeChatNum = value => /^[a-z][-\w]{5,19}$/i.test(value)

// 验证16进制颜色
export const isColor16 = value => /^#?([a-f0-9]{6}|[a-f0-9]{3})$/i.test(value)

// 验证火车车次
export const isTrainNum = value => /^[GCDZTSPKXLY1-9]\d{1,4}$/.test(value)

// 验证手机机身码(IMEI)
export const isIMEI = value => /^\d{15,17}$/.test(value)

// 验证必须带端口号的网址(或ip)
export const isHttpAndPort = value => /^((ht|f)tps?:\/\/)?[\w-]+(\.[\w-]+)+:\d{1,5}\/?$/.test(value)

// 验证网址(支持端口和"?+参数"和"#+参数)
export const isRightWebsite = value => /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-]*[\w@?^=%&/~+#-])?$/.test(value)

// 验证统一社会信用代码
export const isCreditCode = value => /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/.test(value)

// 验证迅雷链接
export const isThunderLink = value => /^thunderx?:\/\/[a-zA-Z\d]+=$/.test(value)

// 验证ed2k链接(宽松匹配)
export const isEd2k = value => /^ed2k:\/\/\|file\|.+\|\/$/.test(value)

// 验证磁力链接(宽松匹配)
export const isMagnet = value => /^magnet:\?xt=urn:btih:[0-9a-fA-F]{40}.*$/.test(value)

// 验证子网掩码
export const isSubnetMask = value => /^(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])(?:\.(?:\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){3}$/.test(value)

// 验证linux"文件夹"路径
export const isLinuxFolderPath = value => /^(\/[^/]+)+\/?$/.test(value)

// 验证linux"文件"路径
export const isLinuxFilePath = value => /^(\/[^/]+)+$/.test(value)

// 验证window"文件夹"路径
export const isWindowsFolderPath = value => /^[a-z]:\\(?:\w+\\?)*$/i.test(value)

// 验证window下"文件"路径
export const isWindowsFilePath = value => /^[a-z]:\\(?:\w+\\)*\w+\.\w+$/i.test(value)

// 验证股票代码(A股)
export const isAShare = value => /^(s[hz]|S[HZ])(000\d{3}|002\d{3}|300\d{3}|600\d{3}|60\d{4})$/.test(value)

// 验证版本号格式必须为X.Y.Z
export const isVersion = value => /^\d+(?:\.\d+){2}$/.test(value)

// 验证视频链接地址（视频格式可按需增删）
export const isVideoUrl = value => /^https?:\/\/(.+\/)+.+(\.(swf|avi|flv|mpg|rm|mov|wav|asf|3gp|mkv|rmvb|mp4))$/i.test(value)

// 验证图片链接地址（图片格式可按需增删）
export const isImageUrl = value => /^https?:\/\/(.+\/)+.+(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(value)

// 验证银行卡号（10到30位, 覆盖对公/私账户, 参考微信支付）
export const isAccountNumber = value => /^[1-9]\d{9,29}$/.test(value)

// 验证中文姓名
export const isChineseName = value => /^[\u4E00-\u9FA5·]{2,16}$/.test(value)

// 验证英文姓名
export const isEnglishName = value => /(^[a-z][a-z\s]{0,20}[a-z]$)/i.test(value)

// 验证车牌号(新能源)
export const isLicensePlateNumberNER = value => /[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z][A-HJ-NP-Z]((\d{5}[DF])|([DF][A-HJ-NP-Z0-9]\d{4}))$/.test(value)

// 验证车牌号(非新能源)
export const isLicensePlateNumberNNER = value => /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z][A-HJ-NP-Z][A-Z0-9]{4}[A-Z0-9挂学警港澳]$/.test(value)

// 验证车牌号(新能源+非新能源)
export const isLicensePlateNumber = value => /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z][A-HJ-NP-Z](?:\d{5}[DF]|[DF][A-HJ-NP-Z0-9]\d{4})|[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领 A-Z][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9 挂学警港澳]$/.test(value)

// 验证手机号中国(严谨), 根据工信部2019年最新公布的手机号段
export const isMPStrict = value => /^(?:(?:\+|00)86)?1(?:3\d|4[5-7|9]|5[0-3|5-9]|6[5-7]|7[0-8]|8\d|9[1|89])\d{8}$/.test(value)

// 验证手机号中国(宽松), 只要是13,14,15,16,17,18,19开头即可
export const isMPRelaxed = value => /^(?:(?:\+|00)86)?1[3-9]\d{9}$/.test(value)

// 验证email(邮箱)
export const isEmail = value => /^[\w.!#$%&'*+/=?^`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i.test(value)

// 验证座机电话(国内),如: 0341-86091234
export const isLandlineTelephone = value => /\d{3}-\d{8}|\d{4}-\d{7}/.test(value)

// 验证身份证号(1代,15位数字)
export const isIDCardOld = value => /^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$/.test(value)

// 验证身份证号(2代,18位数字),最后一位是校验位,可能为数字或字符X
export const isIDCardNew = value => /^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}[\dX]$/i.test(value)

// 验证身份证号, 支持1/2代(15位/18位数字)
export const isIDCard = value => /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}([\dX])$)/i.test(value)

// 验证护照（包含香港、澳门）
export const isPassport = value => /(^[EKGDSPH]\d{8}$)|(^((E[a-f])|([DSP]E)|(KJ)|(MA)|(1[45]))\d{7}$)/i.test(value)

// 验证帐号是否合法(字母开头，允许5-16字节，允许字母数字下划线组合
export const isWebAccount = value => /^[a-z]\w{4,15}$/i.test(value)

// 验证中文/汉字
export const isChineseCharacter = value => /^(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/.test(value)

// 验证小数
export const isDecimal = value => /^\d+\.\d+$/.test(value)

// 验证数字
export const isNumber = value => /^\d+$/.test(value)

// 验证qq号格式
export const isQQNum = value => /^[1-9]\d{4,10}$/.test(value)

// 验证数字和字母组成
export const isNumAndStr = value => /^[A-Z0-9]+$/i.test(value)

// 验证英文字母
export const isEnglish = value => /^[a-z]+$/i.test(value)

// 验证大写英文字母
export const isCapital = value => /^[A-Z]+$/.test(value)

// 验证小写英文字母
export const isLowercase = value => /^[a-z]+$/.test(value)
