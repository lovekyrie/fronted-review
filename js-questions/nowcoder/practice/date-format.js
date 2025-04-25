// 按所给的时间格式输出指定的时间
function formatDate(date, format) {
  const o = {
    yyyy: date.getFullYear().toString(),
    yy: date.getFullYear().toString().slice(-2),
    MM: (`0${date.getMonth() + 1}`).slice(-2),
    M: (date.getMonth() + 1).toString(),
    dd: (`0${date.getDate()}`).slice(-2),
    d: date.getDate().toString(),
    HH: (`0${date.getHours()}`).slice(-2),
    H: date.getHours().toString(),
    hh: (`0${date.getHours() % 12 || 12}`).slice(-2),
    h: (date.getHours() % 12 || 12).toString(),
    mm: (`0${date.getMinutes()}`).slice(-2),
    m: date.getMinutes().toString(),
    ss: (`0${date.getSeconds()}`).slice(-2),
    s: date.getSeconds().toString(),
    w: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
  }

  for (const key in o) {
    const reg = new RegExp(key)
    if (reg.test(format)) {
      format = format.replace(reg, o[key])
    }
  }
  return format
}

// 测试用例
console.log(formatDate(new Date('2014.09.05 13:14:20'), 'yyyy-MM-dd HH:mm:ss')) // 2014-09-05 13:14:20
console.log(formatDate(new Date('2014.09.05 13:14:20'), 'yy-M-d H:m:s')) // 14-9-5 13:14:20
console.log(formatDate(new Date('2014.09.05 13:14:20'), 'yyyy年MM月dd日 HH时mm分ss秒')) // 2014年09月05日 13时14分20秒
console.log(formatDate(new Date('2014.09.05 13:14:20'), 'yyyy.MM.dd HH:mm:ss 星期w')) // 2014.09.05 13:14:20 星期五
console.log(formatDate(new Date('2014.09.05 13:14:20'), 'hh:mm:ss')) // 01:14:20
