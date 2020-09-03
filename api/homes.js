import http from './requsts.js'
function cruds(data){
	return http({
		url: '/crud-template/flow-finshing',
		method: 'POST', // 严格区分大小写,必须是大写
		data
	})
}
function info(data){
	return http({
		
		url: '/flow/info',
		method: 'GET', // 严格区分大小写,必须是大写
		data
	})
}
// 首页4数据
function fornums(data){
	return http({
		
		url: '/flow/template/index',
		method: 'GET', // 严格区分大小写,必须是大写
		data
	})
}
function action(data){
	return http({
		
		url: '/flow/action',
		method: 'POST', // 严格区分大小写,必须是大写
		data
	})
}
function users(data){
	return http({
		url: '/flow/users',
		method: 'GET', // 严格区分大小写,必须是大写
		data
	})
}
export default {
	cruds,
	info,
	users,
	action,
	fornums
}