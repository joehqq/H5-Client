import http from './requsts66.js'
function getCodeImg() {
  return http({
    url: '/captchaImage',
    method: 'GET'
  })
}
// 登录方法
 function login(data) {
  return http({
    url: '/login',
    method: 'POST',
    data
  })
}
// 获取用户详细信息
 function getInfo() {
  return http({
    url: '/getInfo',
    method: 'PSOT'
  })
}
export default {
	getCodeImg,
	login,
	getInfo
}