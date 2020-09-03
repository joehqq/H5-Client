<template>
	<view class="app">
		<view class="card3">
			<view class="kh" @click="jt">
				<image src="../../../static/icon/xh.png" mode=""></image>
				审批记录
				<image :class="[jtflang?'img':'imgs']" src="../../../static/jt.png" mode=""></image>
			</view>

		</view>
		<view class="card6">
			<scroll-view scroll-x class="bg-white padding response cu-steps steps-bottom" :scroll-into-view="'scroll-' + scroll"
			 scroll-with-animation>
				<view class="cu-item padding-lr-xl" :class="index>scroll?'':'text-blue'" v-for="(item,index) in configList" :key="index"
				 :id="'scroll-' + index">
					{{ item.node_name }} <text class="num" :data-index="index + 1"></text>
				</view>
			</scroll-view>


			<!-- <uni-steps :options="configList" :active="activs"></uni-steps> -->
		</view>
		<view v-if="mobile_url==null?false:true">
			<web-view ref='web' :class="[!fjleng?'box':'fjlengbox']" :webview-styles="webviewStyles" :src="mobile_url"></web-view>
		</view>
		<!-- <iframe src="" frameborder="0"></iframe> -->
		<view :class="[mobile_url==null?'':'bigfistbox']">

			<view v-if="!mobile_url">
				<view class="card">
					<view class="blue">
						<view>
							{{instance.cur_handler_name==0?'已办结':instance.cur_handler_name}}
						</view>
					</view>
					<view class="kh khone">
						<image src="../../../static/icon/fh.png" mode=""></image>
						流程名称 : <text> {{instance.object_name}} </text>
					</view>
					<view class="textbox">
						<view class="text-box1" style="width: 100%;" v-for="(item,index) in objform" :key='index'>
							<view>
								{{item.cn }}
							</view>
							<text class="crntertext">
								: {{item.en | xlk(item.type,item.exp)}}
							</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="card5" v-if="fjleng">
			<view class="cardbox">
				<view class="kh">
					<image src="../../../static/icon/fj.png" mode=""></image>
					审批附件({{Listfj.length}})
				</view>
				<!-- <view class="look" @click="wjflang=!wjflang">
					查看
				</view> -->
			</view>
			<view class="spfj" v-if="wjflang" v-for="(item,index) in Listfj" :key='index'>
				<view class="fj">
					<image src="../../../static/icon/fj.png" mode=""></image>
					<view class="fjtext" @click="wpriven(item.url)">
						{{item.en | itenurl}}
					</view>
				</view>
			</view>
		</view>

		<view class="cu-load load-modal" v-if="loadModal">
			<!-- <view class="cuIcon-emojifill text-orange"></view> -->
			<image src="../../../static/logo.png" mode="aspectFit"></image>
			<view class="gray-text">提交中...</view>
		</view>




		<view class="btnbox" v-if="types">
			<button class="cu-btn bg-yellow shadow" @click="sub(0)">回退</button>
			<button class="cu-btn bg-red shadow" @click="sub(2)">拒绝</button>
			<button class="cu-btn bg-olive shadow" @click="sub(1)">通过</button>
			<button class="cu-btn bg-cyan shadow" @click="sub(3)">委托</button>
		</view>
		<view class="cu-modal" :class="modalName=='DialogModal1'?'show':''">
			<view class="cu-dialog">
				<view class="cu-bar bg-white justify-end">
					<view class="content">{{titles.title}}</view>
					<view class="action" @tap="hideModal">
						<text class="cuIcon-close text-red"></text>
					</view>
				</view>
				<view class="padding-xl">
					<view>
						<view class="cardred">
							<view class="cu-form-group margin-top" v-if="jdflang">
								<view class="xlktext">
									<view class="title">指定节点</view>

									<u-select v-model="shows" :list="lists" @confirm="confirms"></u-select>
									<image @click="showes" class="jtleft" src="../../../static/jt.png" mode=""></image>
									<!-- <u-button >打开</u-button> -->
									<view class="clr">
										{{form.pickers}}
									</view>
								</view>
							</view>
							<view class="cu-form-group margin-top" v-if="xlkflang">

								<view class="xlktext">
									<view class="title">下一处理人</view>
									<u-select v-model="show" :list="list" @confirm="confirm"></u-select>
									<image @click="showres" class="jtleft" src="../../../static/jt.png" mode=""></image>
									<!-- <u-button >打开</u-button> -->
									<view class="clr">
										{{form.picker}}
									</view>
								</view>
							</view>
							<!-- <view class="kh">
									<image src="../../../static/icon/yjs.png" mode=""></image>
									审批意见
								</view> -->
							<view class="cu-form-group yjwbk align-start">
								<view class="title">审批意见</view>
								<textarea  v-model="form.opinion" @input="textareaAInput"
								 maxlength="128" placeholder="请输入审批意见"></textarea>
							</view>

							<!-- <view class="yjbox">
								</view> -->

							<view class="cu-form-group wjscs">
								<fileUploader ref='wUpload' @fileSuccess='fileSuccess' @updateImgList='updateImgList' :uploadfileUrl='uploadfileUrl'></fileUploader>
							</view>

						</view>

					</view>
				</view>
				<view class="cu-bar bg-white justify-end">
					<view class="action">
						<button class="cu-btn line-green text-green" @tap="hideModal">取消</button>
						<button class="cu-btn bg-green margin-left" @tap="subend">确定</button>

					</view>
				</view>
			</view>
		</view>
		<u-popup v-model="jtflang" mode="left">
			<view>
				<Steps v-if='jtflang' :infoList="List" color='RGB(39,183,253)'></Steps>
			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	import Steps from '@/components/Y-Steps/Y-Steps.vue';
	import uniSteps from '@/components/uni-steps/uni-steps.vue'
	import fileUploader from '@/components/xiaoshaoxin-fileUploader/fileUploader.vue'
	import homeApis from '../../../api/homes.js';
	export default {
		filters: {
			itenurl(ele) {
				let strs = ele.substring(ele.lastIndexOf("/") + 1);
				const a = strs.indexOf("$$");
				return strs.substring(0, a);

			},
			xlk(val, val1, val2) {
				console.log(val, 66)
				if (val1 == '下拉框' && val != null && val != undefined) {
					const lable = JSON.parse(val2)
					const index = lable.findIndex(ele => ele.dictValue == val)
					if (index != -1) {
						return lable[index].dictLabel
					} else {
						return null
					}
				} else {
					return val
				}
			}
		},
		components: {
			uniSteps,
			Steps,
			fileUploader 
		},
		data() {
			return {
				scroll: 0,
				// http://172.16.32.14:8080
				uploadfileUrl: '/common/upload',
				// uploadfileUrl: '/common/upload',
				webflang: false,
				loadModal: false,
				fjsrc: '',
				fjsrc1: '../../../static/icon/car.png',
				lists: [],
				shows: false,
				jdflang: false,
				show: false,
				fjleng: false,
				webviewStyles: {
					progress: {
						color: '#FF3333'
					}
				},
				mxflang: false,
				wjflang: true,
				Listfj: [],
				list: [],
				titles: {
					title: '',
					data: ''
				},
				instance: {},
				form: {
					pickers: '',
					picker: '',
					opinion: '',
					annex: ''
				},
				jtflang: false,
				List: [],
				starttime: '点击右侧',
				endtime: '点击右侧',
				xlkflang: true,
				optionses: [{
						text1: '2018/12/12',
						text2: '申请请假',
						text3: '还可以，明天开始休息吧',
						text4: '同意',
						text5: '小明'
					},
					{
						text1: '2028/12/12',
						text2: '费用报销',
						text3: '情况属实，批准',
						text4: '同意',
						text5: '小阿'
					}
				],
				// mobile_url:null,
				// mobile_url:'https://www.uviewui.com/components/color.html',
				mobile_url: null,
				configList: [],
				index: -1,
				modalName: '',
				iswt: true,
				usid: '',
				objectFiles: [],
				objectMap: {},
				objform: [],
				types: true,
				item: {
					name: '请假单申请',
					ren: '李建明',
					isren: '李铭间',
					upren: '李铭件',
					dowren: '李健鸣',
					times: '2020/6/29',
					id: 18
				},
				flang: '',
				datas: {
					role_id: '',
					nodeId: ''
				}
			};
		},
		onLoad(option) {
			this.usid = option.userId
			this.instid = option.id
			this.getlist(option.id)
			this.types = option.type == 0 ? true : false

		},

		onShow() {},
		mounted() {
			// uni.getSystemInfo({
			// 　　success: function(res) { // res - 各种参数
			// 　　   console.log(res.windowWidth); // 屏幕的宽度 

			// 　　    let info = uni.createSelectorQuery().select(".wcnm");
			// 　　　  　info.boundingClientRect(function(data) { //data - 各种参数
			// 　　　  　console.log(data,666)  // 获取元素宽度
			// 　　    }).exec()
			//        }
			// });
			// const query = uni.createSelectorQuery().in(this);
			//            query.select('.').boundingClientRect(data => {
			//                console.log(data)
			//            }).exec();
		},
		onHide() {},
		methods: {

			showes() {
				this.shows = true
			},
			subend() {
				if(this.form.opinion==''){
					return this.$refs.uToast.show({
						title: '请填写审批意见',
						type: 'error',
					})
				}
				if (this.form.picker == '' && this.xlkflang == true) {
					return this.$refs.uToast.show({
						title: '请选择审批人',
						type: 'error',
					})

				}
				this.loadModal = true;
				const ind = this.configList.findIndex(
					o => o.num_order == parseInt(this.instance.next_node) + 1
				);
				const aer = this.configList.findIndex(
					es => es.num_order == this.instance.cur_node
				);
				console.log(this.instance.cur_node,'this.instance.cur_node')
				let nextder = "";
				let nextid = "";
				try {
					if (ind === -1) {
						nextder = null;
						nextid = null;
					} else {
						nextder = this.configList[ind].num_order;
						nextid = this.configList[ind].role_id;
					}
				} catch (e) {
					console.log(1)
				}
				let obj = {}
				console.log(aer,8888888888);
				let objsone = {
					
					config_name: this.configList[aer].node_name,
					instance_id: this.instance.id,
					node_id: this.instance.cur_node,
					next_node_id: '',
					next_handler_name: this.datas.cur_node_name,
					next_handler: this.datas.cur_node,
					handler: this.instance.cur_handler,
					handler_name: this.instance.cur_handler_name,
					action: this.flang == "8" ? "0" : this.flang,
					opinion: this.form.opinion,
					annex: this.form.annex
				}
				console.log(this.datas, 'this.datas')
				if (this.flang == 0) {
					this.titles.title = '回退操作'
					const inds = this.configList.findIndex(
						o => o.num_order == this.datas.num_order + 1
					);
					
					obj = {
						pre_node: this.instance.cur_node,
						pre_handler: this.instance.cur_handler,
						pre_handler_name: this.instance.cur_handler_name,
						cur_node: this.datas.num_order,
						cur_handler: this.datas.cur_node ? this.datas.cur_node : null,
						cur_handler_name: this.datas.cur_node_name ? this.datas.cur_node_name : null,
						next_node: inds === -1 ? null : this.configList[inds].num_order,
						next_role_id: inds === -1 ? null : this.configList[inds].role_id,
						id: this.instance.id,
						object_name: this.instance.object_name,
						object_code: this.instance.object_code,
						object_id: this.instance.object_id,
						flow_id: this.instance.flow_id
					};
				} else if (this.flang == 2) {
					this.titles.title = '拒绝操作'
					obj = {
						pre_node: this.instance.cur_node,
						pre_handler: this.instance.cur_handler,
						pre_handler_name: this.instance.cur_handler_name,
						cur_node: null,
						cur_handler_name: 0,
						cur_handler: 0,
						next_node: null,
						next_role_id: null,
						id: this.instance.id,
						object_name: this.instance.object_name,
						object_code: this.instance.object_code,
						object_id: this.instance.object_id,
						flow_id: this.instance.flow_id
					}
				} else if (this.flang == 8) {
					const indse = this.configList.findIndex(
						o => o.numOrder == 1
					);
					console.log(indse,888888888)
					obj = {
						pre_node: this.instance.cur_node,
						pre_handler: this.instance.cur_handler,
						pre_handler_name: this.instance.cur_handler_name,
						cur_node: 0,
						cur_handler: 0,
						cur_handler_name: this.instance.object_code,
						next_node: 0,
						next_role_id: 1,
						id: this.instance.id,
						object_name: this.instance.object_name,
						object_code: this.instance.object_code,
						object_id: this.instance.object_id,
						flow_id: this.instance.flow_id
					};
				} else if (this.flang == 1) {
					this.titles.title = '同意操作'
					obj = {
						pre_node: this.instance.cur_node,
						pre_handler: this.instance.cur_handler,
						pre_handler_name: this.instance.cur_handler_name,
						cur_node: this.instance.next_node,
						cur_handler_name: this.datas.cur_node_name ? this.datas.cur_node_name : null,
						next_node: nextder,
						next_role_id: nextid,
						cur_handler: this.datas.cur_node ? this.datas.cur_node : null,
						id: this.instance.id,
						object_name: this.instance.object_name,
						object_code: this.instance.object_code,
						object_id: this.instance.object_id,
						flow_id: this.instance.flow_id
					}

					if (this.instance.next_node === 0) {
						obj.cur_node = null;
						obj.next_node = null;
						obj.cur_handler_name = null;
						obj.cur_handler = null;
					}
				} else {
					// 委托
					obj = {
						pre_node: this.instance.cur_node,
						pre_handler: this.instance.cur_handler,
						pre_handler_name: this.instance.cur_handler_name,
						cur_node: this.instance.cur_node,
						cur_handler_name: this.datas.cur_node_name,
						cur_handler: this.datas.cur_node,
						next_node: this.instance.next_node,
						next_role_id: this.instance.next_role_id,
						id: this.instance.id,
						object_name: this.instance.object_name,
						object_code: this.instance.object_code,
						object_id: this.instance.object_id,
						flow_id: this.instance.flow_id
					};
				}
				if (this.flang == 8) {
					objsone.next_node_id = 0;
				} else if (this.instance.next_node == 0) {
					objsone.next_node_id = null;
				} else {
					objsone.next_node_id = obj.cur_node;
				}
				const endobj = {
					flowInstance: obj,
					flowLog: objsone
				};
				console.log(endobj)
				homeApis.action(JSON.stringify({ ...endobj
				})).then(res => {
					if (res.status == 100) {
						this.datas={
							role_id: '',
							nodeId: ''
						}
						this.form.picker=''
						this.form.pickers=''
						this.modalName = null
						uni.showToast({
							title: '操作成功',
							duration: 1000,
							icon: 'none'
						});

						this.loadModal = false
						uni.redirectTo({
							url: `/pages/home/home/home?userId=${this.usid}`
						});
					} else {
						uni.showToast({
							title: '操作失败',
							duration: 1000,
							icon: 'none'
						});
						this.datas={
							role_id: '',
							nodeId: ''
						}
						this.form.picker=''
						this.form.pickers=''
						this.modalName = null
						this.loadModal = false
					}
				})
			},
			confirm(val) {
				this.datas.cur_node_name = val[0].label
				this.datas.cur_node = val[0].value
				this.form.picker = val[0].label
			},
			confirms(val) {
				console.log(val,9999999999999)
				this.datas.next_name = val[0].label
				this.datas.next_node = val[0].value
				this.datas.num_order = val.extra?val.extra:val[0].extra
				this.form.pickers = val[0].label
				this.form.picker = ''
				let objs = {
					roleId: val[0].value
				}
				homeApis.users(objs).then(e => {
					this.list = []
					e.data.map(res => {
						const obj = {
							value: res.user_id,
							label: res.nick_name
						}
						this.list.push(obj)
					})
				})
			},
			showres() {
				if (this.flang == 0) {
					if (this.form.pickers && this.flang == 0) {
						this.show = true
					} else {
						uni.showToast({
							title: '请先选择节点',
							duration: 1000,
							icon: 'none'
						});
					}
				} else {
					this.show = true
				}
			},

			// da(){
			// 	window.location.href='http://192.168.130.66:8080/profile/upload/1594620855470角色数据$$5db2d12fdd61f612126cf7e59fdca723.xlsx'
			// },
			async sub(val) {

				let objs = {
					roleId: ''
				}
				this.getroles()
				this.flang = val
				if (val == 0) {

					if (this.scroll == 0) {
						this.jdflang = false
						this.xlkflang = false
						 this.flang = 8;
					} else {
						this.jdflang = true
						this.xlkflang = true
					}

					this.titles.title = '回退操作'
					this.titles.data = '确认回退?'
					this.modalName = 'DialogModal1'
				} else if (val == 2) {
					objs.roleId = ''
					this.jdflang = false
					this.xlkflang = false
					this.titles.title = '拒绝操作'
					this.titles.data = '确认拒绝?'
					await homeApis.users(objs).then(e => {
						this.list = []
						e.data.map(res => {
							const obj = {
								value: res.user_id,
								label: res.nick_name
							}
							this.list.push(obj)
						})
						// e.data.map(ine=>{
						// 	this.form.picker.push(ine.dept_name)
						// })
						this.modalName = 'DialogModal1'
					})
				} else if (val == 3) {
					if (this.iswt) {
						this.jdflang = false
						// objs.roleId = this.configList[this.activs].role_id
						this.xlkflang = true
						this.titles.title = '委托操作'
						this.titles.data = '确认委托?'
						this.modalName = 'DialogModal1'
						// await	homeApis.users(objs).then(e => {
						// 		this.list = []

						// 		e.data.map(res => {
						// 			const obj = {
						// 				value: res.user_id,
						// 				label: res.nick_name
						// 			}
						// 			this.list.push(obj)
						// 		})
						// 		console.log(e.data.length,'888')
						// 		if (e.data.length ==1) {
						// 			this.iswt = false
						// 			uni.showToast({
						// 				title: '无法委托',
						// 				duration: 1000,
						// 				icon: 'none'
						// 			});
						// 		}else{
						// 			this.modalName = 'DialogModal1'
						// 		}
						// 		// e.data.map(ine=>{
						// 		// 	this.form.picker.push(ine.dept_name)
						// 		// })
						// 	})
					} else {
						uni.showToast({
							title: '无法委托',
							duration: 1000,
							icon: 'none'
						});
					}

				} else {

					try {
						objs.roleId = this.instance.next_role_id
					} catch (e) {
						console.log(e)
					}
					this.xlkflang = true
					if (this.instance.next_node == null) {
						this.xlkflang = false
					}
					this.jdflang = false
					this.titles.title = '同意操作'
					this.titles.data = '确认同意?'
					homeApis.users(objs).then(e => {
						this.list = []
						e.data.map(res => {
							const obj = {
								value: res.user_id,
								label: res.nick_name
							}
							this.list.push(obj)
						})
						if (e.data.length < 2) {
							this.iswt = false
						}
						// e.data.map(ine=>{
						// 	this.form.picker.push(ine.dept_name)
						// })
						this.modalName = 'DialogModal1'
					})
				}

				// }

			},
			getroles() {


			},
			async getwt() {
				let objs = {
					roleId: ''
				}
				try {
					objs.roleId = this.configList[this.scroll].role_id
				} catch (e) {
					console.log(e)
				}
				try {
					let userid = uni.getStorageSync('urse')
					this.mobile_url = this.configList[0].mobile_url
					this.mobile_url = this.mobile_url.replace(/&amp;/gi, "&");
					this.mobile_url = this.mobile_url.replace(/#{id}/i, this.instid);
					this.mobile_url = this.mobile_url.replace(/#{userId}/i, userid.user.userId);
					// this.mobile_url = this.mobile_url.replace(/#{token}/i, token);

				} catch (e) {
					//TODO handle the exception
					console.log(e)
				}
				await homeApis.users(objs).then(e => {
					this.list = []

					e.data.map(res => {
						const obj = {
							value: res.user_id,
							label: res.nick_name
						}
						this.list.push(obj)
					})

					if (e.data.length < 1 || e.data.length == 1) {
						this.iswt = false
						// uni.showToast({
						// 	title: '无法委托',
						// 	duration: 1000,
						// 	icon: 'none'
						// });
					} else {
						this.iswt = true
					}
					// e.data.map(ine=>{
					// 	this.form.picker.push(ine.dept_name)
					// })
				})
			},
			getlist(val) {
				const obj = {
					instanceId: val
				}
				homeApis.info(obj).then(ele => {
					if(ele.status==200){
						
						return  uni.showToast({
							title: '该审批详情对应的数据不存在',
							duration: 1000,
							icon: 'none'
						});
					}
					this.objectFiles = ele.data.objectFiles
					this.objectMap = ele.data.objectMap
					this.objform = []
					this.Listfj = []
					this.objectFiles.map(es => {
						if (es.type == '文件上传' || es.type == '图片上传') {
							ele.data.logList.map(el => {

								if (el[es.en] != null && el[es.en] != '') {
									const fjobj = {
										en: el[es.en],
										url: el[es.en],
										type: es.type
									}
									this.Listfj.push(fjobj)

								}
							})
						}

						for (const item in this.objectMap) {

							if (es.en == item && es.type != '文件上传' && es.type != '图片上传') {
								const objobj = {
									cn: es.cn,
									en: this.objectMap[item],
									type: es.type,
									exp: es.exp
								}
								this.objform.push(objobj)

							}
						}
					})
					console.log(this.Listfj, 'Listfj')
					this.fjleng = this.Listfj.length > 0 ? true : false
					this.instance = ele.data.instance
					this.configList = ele.data.configList
					this.scroll = ele.data.configList.findIndex(es => ele.data.instance.cur_node == es.num_order) == -1 ? 100 : ele.data
						.configList.findIndex(es => ele.data.instance.cur_node == es.num_order)

					this.configList.map(el => {
						if (el.num_order < this.instance.cur_node) {
							const obj = {
								value: el.role_id,
								label: el.node_name,
								extra: el.num_order
							}
							this.lists.push(obj)
						} else {
							this.flang = 8
							this.jdflang = false
							this.xlkflang = false
						}
					})
					this.List = ele.data.logList
					this.getwt()
				})

			},
			// 打开上传文件弹窗
			uploadOpen() {
				this.$refs.wUpload.uploadOpen();
			},
			// 下载预览文件/图片
			wpriven(url) {
				window.location.href = url
			},
			// 删除返回的文件数组
			updateFileList(val) {
				console.log(val, '删除成功后的文');
			},
			// 删除数组
			updateImgList() {
				this.form.annex = ''
			},
			// 返回图片上传成功后的图片信息
			imgSuccess(val) {
				console.log(val, '上传成功图片');

			},

			// 返回文件/图片上传成功后的文件信息
			fileSuccess(val) {
				console.log(val, '上传成功文件');
				let wjdata = JSON.parse(val.data)
				this.form.annex = wjdata.url
			},
			PickerChange(e) {
				if (e.detail.value == -1) {
					this.index = 0
				} else {
					this.index = e.detail.value
				}
			},
			hideModal(e) {
				this.datas={
					role_id: '',
					nodeId: ''
				}
				this.form.picker=''
				this.form.pickers=''
				this.modalName = null
			},
			showModal(e) {
				this.datas={
					role_id: '',
					nodeId: ''
				}
				this.form.picker=''
				this.form.pickers=''
				this.modalName = e.currentTarget.dataset.target
			},


			textareaAInput() {

			},
			jt() {
				this.jtflang = !this.jtflang
			},
			islc() {},
			DateChange1(val) {
				this.form.starttime = val.target.value
			},
			DateChange(val) {
				this.form.endtime = val.target.value
			},
		}
	};
</script>

<style lang="scss">
	.khone {
		margin-top: 0 !important;
		margin-bottom: 10rpx !important;
	}

	.yjwbk {
		text-align: left;
	}

	uni-page-wrapper {

		background: #f2f2f2 !important;

	}

	page {

		background: #f2f2f2 !important;

	}

	// .app{
	// 	padding-bottom: ;
	// }
	.bigfistbox {
		// margin-top: 760rpx;
	}

	.fj {
		margin-bottom: 6rpx;
		display: flex;
		align-items: center;
		width: 100%;

		image {
			width: 26rpx;
			height: 26rpx;
			margin-right: 10rpx;
		}
	}

	.margin-top {
		margin-top: 0px !important;
		position: relative;
	}

	.looks {
		position: absolute;
		right: 30rpx;
		text-align: right;
		color: RGB(18, 179, 255) !important;
		font-size: 26rpx !important;
		top: 24rpx;
	}

	.spfj {
		width: 100%;
		margin-left: 20rpx;
		font-size: 26rpx;
	}

	.look {
		color: RGB(18, 179, 255) !important;
		font-size: 26rpx;
		margin-right: 20rpx;
	}

	.card5 {
		height: 200rpx !important;
		display: flex !important;
		overflow: auto !important;
		align-items: center !important;

		.cardbox {
			margin-bottom: 10rpx !important;
		}

		.kh {
			margin-top: 0 !important;
		}
	}

	.clr {
		font-size: 30rpx !important;
		padding-right: 20rpx;
	}

	.crntertext {
		color: #606266;
	}

	.app {
		padding-bottom: 100rpx;
	}

	.btnbox {
		color: #fff !important;
		position: fixed;
		bottom: 0px;
		display: flex;
		justify-content: space-around;
		margin-top: 30rpx;
		width: 100%;
		z-index: 999;
		height: 90rpx;
		align-items: center;
		background: rgba(10, 10, 10, .1);
		border-radius: 30rpx 30rpx 0 0;
	}

	.cardred {
		position: relative;
		overflow: hidden;
		padding: 28rpx 10rpx 20rpx 0;
		width: 95%;
		height: 100%;
		margin: 0;
		background: #fff;
		border-radius: 10rpx;
		display: -webkit-box;
		display: -webkit-flex;
		display: flex;
		-webkit-flex-wrap: wrap;
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	.card4 {
		padding-top: 0px !important;

		uni-textarea {
			padding-top: 0px !important;
			margin-top: 0 !important;
			margin-bottom: 50rpx !important;
		}

		.margin-top {
			margin-top: 0 !important;
		}
	}

	.xlktext {
		display: flex;
		justify-content: space-between;
		width: 100%;
		align-items: center;
	}

	.cardbox {
		width: 100%;
		display: flex;
		justify-content: space-between;
	}

	.padding-xl {
		padding: 0;
		background: #fff;
	}

	.card3 {
		position: fixed !important;
		bottom: 110rpx;
		left: 50%;
		transform: translateX(-50%);
		z-index: 999;
		background: #f2f2f2 !important;
		box-shadow: none !important;
		height: 50rpx !important;
		padding: 0 !important;

		.kh {
			position: relative;
		}

		.imgs {
			transform: rotate(-180deg);
			position: absolute;
			top: 0;
			right: 0;
			display: block;
		}

		.img {

			display: none;
		}
	}

	.cu-form-group {
		width: 100%;
		font-size: 28rpx;

		uni-input {
			font-size: 28rpx;
		}
	}

	.card2 {
		height: 100% !important;
		width: 100% !important;
		background: red !important;
		padding: 0 !important;
	}

	.card1 {
		margin-top: 0 !important;
		padding-top: 0 !important;
		height: 100% !important;

		.kh {
			margin-left: 16rpx;
			justify-content: end;
			margin-bottom: 18rpx;
		}

		.textbox {
			height: 110rpx;
			margin-top: 40rpx;

			.text-box1 {
				view {
					color: black !important;
					width: 180rpx;
					text-align-last: justify;
				}
			}
		}
	}

	.jtleft {
		position: absolute;
		width: 30rpx;
		height: 30rpx;
		right: 0;
		transform: translateY(-50%) rotate(-180deg);
		top: 50%;
	}

	.text-box1 {
		width: 50%;
		display: flex;
		align-items: center;

		view {
			width: 160rpx;
			font-size: 30rpx;
			text-align-last: justify;
			text-align: justify;
			color: #C0C0C0;
		}

		text {
			font-size: 24rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	}

	.card {
		height: 100% !important;

		.textbox {
			margin: 0 auto 0;

			.text-box1 {
				margin-top: 10rpx !important;

				view {
					font-size: 26rpx;
					color: black !important;
				}

				text {
					font-size: 26rpx;
				}
			}
		}
	}

	.cu-modal {
		z-index: 9999 !important;
	}

	.box {
		//    position: absolute;
		//    display: block;
		//    border: 0px;
		top: 180rpx;
		bottom: 176rpx;
		//    /* bottom: 667.2px; */
		// z-index: 9999;
		width: 100%;
		// height: 760rpx;
	}

	.fjlengbox {
		top: 110rpx;
		bottom: 176rpx;
		//    /* bottom: 667.2px; */
		// z-index: 9999;
		width: 100%;
	}

	.textbox {
		width: 90%;
		// height: 170rpx;
		display: flex;
		align-items: center;
		flex-flow: wrap;
		margin: 40rpx auto 0;
	}

	.khs {
		width: 85%;
		margin-left: 16rpx;
		margin-top: 20rpx;
		margin-bottom: 15rpx;
		height: 30rpx;
		font-size: 28rpx;
		display: flex;
		align-items: center;
		justify-content: end;

		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}

		text {
			width: 340rpx;
			font-size: 24rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			color: #C0C0C0;

		}
	}

	.cu-load.load-modal {
		z-index: 999999999;
	}

	.kh {
		width: 85%;
		margin-left: 16rpx;
		margin-top: 20rpx;
		height: 30rpx;
		font-size: 30rpx;
		display: flex;
		align-items: center;
		justify-content: end;

		image {
			width: 30rpx;
			height: 30rpx;
			margin-right: 10rpx;
		}

		text {
			width: 340rpx;
			font-size: 30rpx;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;

		}
	}

	.blue {
		position: absolute;
		top: -20rpx;
		right: -80rpx;
		width: 0;
		height: 0;
		border-width: 0 120rpx 120rpx;
		border-style: solid;
		border-color: transparent transparent RGB(18, 179, 255);
		-webkit-transform: rotate(-45deg);
		transform: rotate(45deg);

		view {
			font-size: 22rpx;
			color: #fff;
			-webkit-transform: rotate(0deg);
			transform: rotate(0deg);
			width: 110rpx;
			text-align: center;
			position: absolute;
			top: 56rpx;
			left: -50rpx;
		}
	}



	.uni-steps__row-title {
		font-size: 26rpx !important;
	}

	.card6 {
		height: 150rpx !important;
		display: block !important;
		margin-top: 10rpx !important;
		margin-bottom: 10rpx !important;
		padding: 0 !important;

	}

	.card,
	.card1,
	.card2,
	.card3,
	.card5,
	.card6,
	.card4 {
		position: relative;
		overflow: hidden;
		padding: 28rpx 10rpx 20rpx 0;
		width: 95%;
		height: 300rpx;
		// background-color: white;
		margin: 0 auto 10rpx auto;
		background: #FFFFFF;
		box-shadow: 0 0 6rpx 0 RGB(93, 157, 255);
		border-radius: 10rpx;
		display: flex;
		flex-wrap: wrap;
		box-sizing: border-box;
	}

	.card1 {}
</style>
