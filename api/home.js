import http from './request.js'
// 待办任务
function instancelist(data){
	return http({
		url: '/flow-instance/list',
		method: 'GET', // 严格区分大小写,必须是大写
		data
	})
}
 function getCodeImg() {
  return request({
    url: '/captchaImage',
    method: 'GET'
  })
}
// 已办任务
function cruds(data){
	return http({
		url: '/crud-template/flow-finshing',
		method: 'GET', // 严格区分大小写,必须是大写
		data
	})
}
export default {
	instancelist,
	cruds
}