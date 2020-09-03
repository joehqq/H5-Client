<template>

	<view class="container999" @touchstart="refreshStart" @touchmove="refreshMove" @touchend="refreshEnd">
		<!-- 刷新组件需搭配scroll-view使用，并在pages.json中添加 "disableScroll":true-->
		<refresh ref="refresh" @isRefresh='isRefresh'></refresh>
		<view class='nav'>
			<!-- #ifdef H5
				<view style="height: 44px;width: 100%;">边距盒子</view>
			#endif -->
			<!-- 搜索 -->
			<!-- <view class='searchInput999'>
				<view class='searchBox999'>
					<image src='/static/icon-search.png' class='search999'></image>
				</view>
				<input class='input999' placeholder="输入关键词"></input>
			</view> -->
			<!-- 导航栏 agents导航栏标题 -->
			<navTab ref="navTab" :tabTitle="tabTitle" @changeTab='changeTab'></navTab>
		</view>
		<!-- swiper切换 swiper-item表示一页 scroll-view表示滚动视窗 -->
		<swiper v-if="flangs" style="min-height: 100vh;" :current="currentTab" @change="swiperTab">
			<swiper-item v-for="(listItem,listIndex) in list" :key="listIndex">
				<scroll-view style="height: 100%;" scroll-y="true" @scrolltolower="lower1" scroll-with-animation :scroll-into-view="toView">
					<view :id="'top'+listIndex" style="width: 100%;height: 135upx;">边距盒子</view>
					<view class='content'>
						<view class='card' v-for="(item,index) in listItem" v-if="listItem.length > 0" :key="index" @click="toDetails(item.id,item.type)">
							<view class="xq">
								{{item.type==0?'审批':'查看'}}
							</view>
							<view :class="['blue',item.type==0?'':'reds']">
								<view>
									{{item.type==0?'待审':'已审'}}
								</view>
							</view>
							<view class="texbox">

								<!-- <view class="ddbh" v-if="item.orderid">待办号:{{item.orderid}}</view> -->
								<!-- <view class="bigtext"> -->
								<view class="texts">
									<!-- <text class="gs" v-if="item.object_name">{{}}</text> -->
									<view class="dz" v-if="(item.info.objectMap!=null)&&(item.info.objectMap.pcid)">
										审批单号: {{item.info.objectMap.pcid}}
									</view>
									<view class="dz" v-if="(item.info.objectMap!=null)&&(item.info.objectMap.uuid)">
										结算单号: {{item.info.objectMap.uuid}}
									</view>
									
									<view class="dz" v-if="(item.info.objectMap!=null)&&(item.info.objectMap.pcamount)">
										放款额: {{item.info.objectMap.pcamount}}
									</view>
									<view class="dz" v-if="(item.info.objectMap!=null)&&(item.info.objectMap.amount)">
										结算总额: {{item.info.objectMap.amount}}
									</view>
										<view class="dz" v-if="(item.info.configList)&&(item.info.configList[0])">
											当前节点: {{item.info.configList[0].node_name }}
										</view>
									<!-- <view class="dz" v-if="item.object_code">
										提交人: {{item.object_code}}
									</view> -->
									<view v-if="item.cur_handler_name==0?false:true">
										<view class="dz" v-if="item.cur_handler_name">
											处理人: {{item.cur_handler_name}}
										</view>
									</view>
									
									<!-- <view class="qxr" v-if="item.updatetime">
										上次修改日期: {{item.updatetime}}
									</view> -->
									<view class="qxr" v-if="item.createtime">
										发起日期: {{item.createtime}}
									</view>
									<view class="dz" v-if="item.bak_col">
										金额: {{item.bak_col}}
									</view>
									<!-- 		<view class="dz" v-if="item.zt">
										在途笔数:
										<text style="color: #F0AD4E;">
											{{item.zt}}
										</text>

									</view> -->
									
									
									<!-- <view class="qxr" v-if="item.createtime">
										发起日期:{{item.createtime}}
									</view> -->
								</view>
							</view>
							<view :class="['round',item.type==0?'':'rounds']">
									<view @click="toDetails(item.id,item.type)" :class="['trres',item.type==0?'':'trress']">
										{{item.object_name}}
									</view>
								<!-- <text class="rqs">发起日期:{{item.createtime}}</text> -->
							</view>
						</view>
					</view>
					<view class='noCard' v-if="listItem.length===0">
						暂无任务
					</view>
					<view style="width: 100%;height: 100upx;opacity:0;">底部占位盒子</view>
				</scroll-view>
			</swiper-item>
		</swiper>
	</view>
</template>

<script>
	const util = require('../../../util/util.js');
	import homeApis from '../../../api/homes.js';
	import refresh from '../../../components/refresh.vue';
	import navTab from '../../../components/navTab.vue';
	export default {
		components: {
			refresh,
			navTab
		},
		data() {
			return {
				total: 5,
				total1: 5,
				page: {
					size: 5,
					page: 1
				},
				pagese: {
					size: 5,
					page: 1
				},
				flangs: false,
				sx: false,
				usid: '',
				toView: '', //回到顶部id
				tabTitle: [{
					title: '待办',
					num: 0
				}, {
					title: '已办',
					num: 0
				}], //导航栏格式 --导航栏组件
				currentTab: 0, //sweiper所在页
				pages: [0, 0], //第几个swiper的第几页
				list: [
					[{}],
					[{}]
				]
			};
		},
		async onLoad(e) {
			if (e.type == 1) {
				this.currentTab = 0

			} else {
				this.currentTab = 1

			}
			this.$nextTick(function() {
				this.$refs.navTab.longClick(this.currentTab)

			})
			if (e.userId) {
				this.usid = e.userId
			} else {
				let objs = {
					"likeCondition": {},
					"condition": {
						"work_num": e.work_num + ''
					},
					"timeCondition": {},
					"tableInfo": {
						"code": "sys_user"
					}
				}
				await homeApis.cruds(JSON.stringify(objs)).then(ele => {
					this.usid = ele.data.row[0].user_id
				})
			}
			this.getlist(this.usid)
		},
		filters:{
			mg(val){
				return val.node_name?val.node_name:'1111'
			}
		},
		methods: {
			async getlist(val) {
				var arr = []
				var brr = []
				let objs = {
					page: {
						...this.pagese
					},
					tableInfo: {
						code: 'sys_flow_instance'
					},
					condition: {
						cur_handler: this.usid
					}
				}
				await homeApis.cruds(
					JSON.stringify(objs)
				).then(ele => {
					this.tabTitle[0].num = ele.data.total
					this.list[0] = ele.data.row
					this.list[0].map((e, index) => {
						this.list[0][index].type = 0
					})
				})
				let obj = {
					page: {
						...this.page
					},
					tableInfo: {
						code: 'v_user_flowtasks'
					},
					condition: {
						v_handler: this.usid
					}
				}
				await homeApis.cruds(JSON.stringify(obj)).then(el => {
					if (this.sx) {
						uni.showToast({
							icon: 'success',
							title: '刷新成功'
						})
						this.$refs.refresh.endAfter() //刷新结束调用
						this.sx = false
					}
					this.tabTitle[1].num = el.data.total
					this.list[1] = el.data.row
					this.list[1].map((es, inde) => {
						this.list[1][inde].type = 1
					})
					this.flangs = true
				})
			},
			toDetails(val, val2) {
				uni.navigateTo({
					url: `/pages/home/Details/Details?id=${val}&userId=${this.usid}&type=${val2}`
				});
			},
			toTop() {
				this.toView = ''
				setTimeout(() => {
					this.toView = 'top' + this.currentTab
				}, 10)
			},
			changeTab(index) {
				this.currentTab = index;
			},
			// 其他请求事件 当然刷新和其他请求可以写一起 多一层判断。
			isRequest() {
				return new Promise((resolve, reject) => {
					console.log(this.currentTab)
					if (this.currentTab == 1) {
						this.page.page=this.page.page+1
						let obj = {
							page: {
								page: this.page.page,
								size: this.page.size,
							},
							tableInfo: {
								code: 'v_user_flowtasks'
							},
							condition: {
								v_handler: this.usid
							}

						}
						homeApis.cruds(JSON.stringify(obj)).then(el => {
							this.tabTitle[1].num = el.data.total
							resolve(el.data.row)
							uni.hideLoading()
						})
					} else {
						this.pagese.page=this.pagese.page+1
						let objs = {
							page: {
								page: this.pagese.page,
								size: this.pagese.size,
							},
							tableInfo: {
								code: 'sys_flow_instance'
							},
							condition: {
								cur_handler: this.usid
							}
						}
						homeApis.cruds(
							JSON.stringify(objs)
						).then(ele => {
							this.tabTitle[0].num = ele.data.total
							resolve(ele.data.row)
							uni.hideLoading()
						})
					}
					// this.pages[this.currentTab]++
					// var that = this
					// setTimeout(() => {
					// 	uni.showToast({
					// 		icon: 'none',
					// 		title: `请求第${that.currentTab + 1 }个导航栏的第${that.pages[that.currentTab]}页数据成功`
					// 	})
					// 	let newData = ['新数据1', '新数据2', '新数据3']
					// 	resolve(newData)
					// }, 1000)
				})
			},
			// swiper 滑动
			swiperTab: function(e) {
				var index = e.detail.current //获取索引
				this.$refs.navTab.longClick(index);
			},
			// 加载更多 util.throttle为防抖函数
			lower1: util.throttle(function(e) {
				if (this.currentTab == 1) {
					if (this.list[1].length > this.tabTitle[1].num || this.list[1].length == this.tabTitle[1].num) {
						uni.showToast({
							icon: 'none',
							title: '无更多数据'
						})
					} else {
						uni.showLoading({
							title: '加载中',
							mask: true
						})
						this.isRequest().then((res) => {
							let tempList = this.list
							tempList[1] = tempList[1].concat(res)
							this.list = tempList
							this.list[1].map((es, inde) => {
								this.list[1][inde].type = 1
							})
							this.$forceUpdate() //二维数组，开启强制渲染
						})
					}

				} else {
					if (this.list[0].length > this.tabTitle[0].num || this.list[0].length == this.tabTitle[0].num) {
						uni.showToast({
							icon: 'none',
							title: '无更多数据'
						})
					} else {
						uni.showLoading({
							title: '加载中',
							mask: true
						})
						this.isRequest().then((res) => {
							let tempList = this.list
							tempList[0] = tempList[0].concat(res)
							this.list = tempList
							this.list[0].map((es, inde) => {
								this.list[0][inde].type = 0
							})
							this.$forceUpdate() //二维数组，开启强制渲染
						})
					}
				}
				//currentTab表示当前所在页数 根据当前所在页数发起请求并带上page页数


			}, 300),
			// 刷新touch监听
			refreshStart(e) {
				this.$refs.refresh.refreshStart(e);
			},
			refreshMove(e) {
				this.$refs.refresh.refreshMove(e);
			},
			refreshEnd(e) {
				this.$refs.refresh.refreshEnd(e);
			},
			isRefresh() {
				console.log(this.currentTab, 'currentTab')
				// if(this.currentTab==1){

				// }
				this.sx = true
				this.getlist()

			}
		}
	};
</script>

<style lang="scss">
	/deep/#top2,
	#top1,
	#top0 {
		height: 120rpx !important;
	}

	.xq {
		position: absolute;
		top: 8rpx;
		right: 10rpx;
		color: RGB(151, 192, 255);
		font-size: 24rpx;
		padding: 20rpx;
	}

	// .bigtext{
	// 	    display: flex;
	// 	    justify-content: space-between;
	// 	    width: 100%;
	// 	    align-items: center;
	// }
	.qxr {
		font-size: 24rpx;
		margin-bottom: 8rpx
	}

	.dz {
		font-size: 24rpx;
		margin-bottom: 8rpx;
	}

	.gs {
		font-size: 32rpx;
		display: block;
		width: 100% !important;
		margin-bottom: 20rpx;
	}

	.rounds {
		border: 6rpx solid RGB(252, 163, 67) !important;
	}

	.scendrounds {
		border: 2rpx solid RGB(252, 163, 67) !important;
	}

	.trress {
		color: RGB(252, 163, 67) !important;
	}

	.trres {
		width: 110rpx;
		text-align: center;
		position: absolute;
		top: 50%;
		color: RGB(101, 161, 255);
		left: 50%;
		position: relative;
		font-size: 26rpx;
		background-color: #FFFFFF;
		transform: translate(-50%, -50%);
	}

	.scendround {
		position: relative;
		width: 100rpx;
		height: 100rpx;
		border: 2rpx solid RGB(101, 161, 255);
		border-radius: 50%;
		margin: 20rpx auto;
	}

	.round {
		position: absolute;
		top: 60rpx;
		right: 40rpx;
		width: 160rpx;
		height: 160rpx;
		border-radius: 50%;
		border: 6rpx solid RGB(101, 161, 255);

		.rqs {
			color: #999999;
			display: block;
			width: 100%;
			margin-top: 40rpx;
		}

	}


	.ddbh {
		height: 40rpx;
		font-size: 24rpx;
		margin-bottom: 20rpx;
	}

	.reds {
		border-color: transparent transparent RGB(252, 163, 67) !important;
	}

	.blue {
		position: absolute;
		top: -10rpx;
		left: -40rpx;

		width: 0;
		height: 0;
		border-width: 0 60rpx 60rpx;
		border-style: solid;
		border-color: transparent transparent RGB(93, 157, 255);
		transform: rotate(-45deg);

		view {
			font-size: 22rpx;
			color: #fff;
			-webkit-transform: rotate(0deg);
			transform: rotate(0);
			width: 52rpx;
			position: absolute;
			top: 20rpx;
			left: -24rpx;
		}
	}

	.container999 {
		width: 100vw;
		font-size: 28upx;
		min-height: 100vh;
		overflow: hidden;
		color: #6B8082;
		position: relative;
		background: RGB(238, 245, 255);
	}

	.content {
		width: 100%;
	}

	.card {
		position: relative;
		overflow: hidden;
		padding: 28rpx 0px 20rpx 60rpx;
		width: 97%;
		min-height: 250rpx;
		background-color: white;
		margin: 0 auto 10rpx auto;
		background: #FFFFFF;
		box-shadow: 0 0 6rpx 0 RGB(93, 157, 255);
		border-radius: 10rpx;
		display: flex;
		flex-wrap: wrap;
		// align-items: center;
		box-sizing: border-box;

		text {
			width: 50%;
			color: rgba(0, 0, 0, 0.85);
			font-weight: 500;
		}
	}

	.noCard {
		width: 97%;
		height: 200upx;
		margin: auto;
		background-color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #999999;
		box-shadow: 0 0 10upx 0 rgba(0, 0, 0, 0.10);
		border-radius: 10upx;
	}


	.nav {
		position: fixed;
		left: 0;
		top: 0;
		color: white;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-start;
		font-size: 24upx;
		background-image: linear-gradient(45deg, #0081ff, #1cbbb4);
		z-index: 996;
	}

	.searchInput999 {
		width: 90%;
		margin: 0 auto;
		background: white;
		border-radius: 30upx;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 56upx;
	}

	.search999 {
		width: 32upx;
		height: 32upx;
	}

	.searchBox999 {
		width: 56upx;
		height: 56upx;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.input999 {
		color: #999;
		width: 80%;
	}
</style>
