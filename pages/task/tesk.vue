<template>
	<view class="app">

		<view class="heads">
			<!-- 	<view class="ovfl">
				<view class="sear">
					<view>
						<image src="../../static/icon/ss.png" mode=""></image>

					</view>
					<input type="text" placeholder="订单号/公司名称" placeholder-style='color:#bfbfbf' />
				</view>
			</view> -->
			<view class="ydsp">

				移动审批
			</view>
			<view class="head-card">
				<!-- <image class="atve" src="../../static/icon/tx.png" mode=""></image> -->
				<view class="dbbox">
					<!-- <image class="tz" src="../../static/icon/rw.png" mode=""></image> -->
					<!-- <view class="num-tz" @click="Notice">
						通知
						<view class="cu-tag badge">99</view>
					</view> -->
				</view>
				<view class="hname">
					{{username}},欢迎您登录融资租赁售后回租审批平台
				</view>
				<view class="fistbox one" @click="cdxq(1)">
					<image class="img" src="../../static/icon/dbsx.png" mode=""></image>
					<view class="db dbtext">
						<view>
							待 办
						</view>
						<text>{{dbnum}} 条</text>
					</view>
				</view>
				<view class="fistbox tow" @click="cdxq(2)">
					<view class="db">
						<view>
							已 办
						</view>
						<text>{{ybnum}} 条</text>
					</view>
					<image class="img dbtext" src="../../static/icon/ybsx.png" mode=""></image>
				</view>
				<view class="fistbox sree" @click="openweb">
					<view class="fkbox">
						<view class="fk">
							<view class="text">
								融资总额
							</view>
							<view class="text1">
								{{formdata.rzAmount}}元
							</view>
						</view>
						<view class="fk">
							<view class="text">
								逾期订单总额
							</view>
							<view class="text1">
								{{formdata.overdueAmount}}元
							</view>
						</view>
					</view>
					<view class="fkbox">
						<view class="fk">
							<view class="text">
								客群总数
							</view>
							<view class="text1">
								{{formdata.customer}}
							</view>
						</view>
						<view class="fk">
							<view class="text">
								在途金额
							</view>
							<view class="text1">
								{{formdata.hkLoanAmount}}元
							</view>
						</view>
					</view>
				</view>
				<view class="all">
					<view>
						在途订单 : 20条
					</view>
					<view>
						在途总额 : 20万
					</view>
				</view>
			</view>

		</view>

		<u-button @click="back" class="custom-style" type="primary" shape="square" size="mini" :plain="true" plain :ripple="true">退出登录</u-button>
	</view>
</template>

<script>
	import homeApi from '../../api/homes.js'
	export default {
		data() {
			return {
				username: '',
				usid:'',
				formdata:{
					amount:0,
					overdueamount:0,
					customer:0,
					hkloanamount:0
				},
				dbnum:'',
				ybnum:''
			};
		},
		created() {
			// this.getlist()
		},
		onLoad(e) {
			// 换脸
			homeApi.fornums().then(res=>{
				this.formdata=res.data
			})
			
			// 换脸
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
				 homeApi.cruds(JSON.stringify(objs)).then(ele => {
					this.usid = ele.data.row[0].user_id
				})
			}
			this.getlist(this.usid)
		},
		methods: {
			openweb(){
				// uni.navigateTo({
				// 	url: '/pages/forzt/forzt'
				// });
				window.open('http://172.16.5.111/mobile/operation/hkej?view=ongoinginfo&target=1')
			},
			back() {
				uni.reLaunch({
					url: '/pages/login/login'
				});
			},
			getlist(val) {
				const bal = JSON.parse(uni.getStorageSync('urse')).user
				this.username = bal.nickName
				let objs = {
					
					tableInfo: {
						code: 'sys_flow_instance'
					},
					condition: {
						cur_handler: this.usid
					}
				}
				homeApi.cruds(
					JSON.stringify(objs)
				).then(ele => {
					// 待办
					this.dbnum=ele.data.total
					// console.log(ele)
				})
				let obj = {
					
					tableInfo: {
						code: 'v_user_flowtasks'
					},
					condition: {
						v_handler: this.usid
					}
				}
				homeApi.cruds(JSON.stringify(obj)).then(el => {
					this.ybnum=el.data.total
				})
			},
			Notice() {
				// Notice
				uni.navigateTo({
					url: '/pages/home/Notice/Notice'
				});

			},
			cdxq(val) {
				// 代办
				// if(val==1){
					
				// }else{
				// 	// 已办
				// }
				uni.navigateTo({
					url: `/pages/home/home/home?userId=${this.usid}&type=${val}`
				});
			}
		}
	}
</script>

<style lang="scss">
	.custom-style {
		position: fixed;
		bottom: 66rpx;
		right: 20rpx;
	}

	.dbtext {
		margin-right: 60rpx;
	}

	.ydsp {
		font-size: 90rpx;
	}

	.ovfl {
		overflow: hidden;
	}

	.sear {
		width: 75%;
		background-color: RGB(230, 230, 230, 0.4);
		margin: 80rpx auto 0;
		border-radius: 14rpx;
		height: 50rpx;
		line-height: 50rpx;
		color: #fff;
		display: flex;
		align-items: center;
		text-align: initial;

		image {
			width: 70rpx;
			height: 70rpx;
		}
	}

	.db {
		line-height: 1;
		flex-wrap: wrap;
		display: flex;
		align-items: center;
		width: 170rpx;
		justify-content: center;

		text {
			font-size: 34rpx;
		}

		view {
			margin-bottom: 10rpx;
		}
	}

	.img {
		width: 100rpx;
		height: 100rpx;
	}

	.one {
		background-image: -webkit-linear-gradient(45deg, #67D8FF, #37BAFF) !important;
	}

	.tow {
		background-image: -webkit-linear-gradient(45deg, #FFB861, #FFBD8C) !important;
	}

	.sree {
		// padding: 10rpx 0 ;
		// box-sizing: border-box;
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		height: 330rpx !important;
		// background-image: -webkit-linear-gradient(45deg, #6C8DFF, #8B9DFD) !important;
		background: #FFFFFF !important;

		.fkbox {
			width: 100%;
			height: 48%;
			display: flex;
			justify-content: space-between;

			.fk {
				width: 49%;
				height: 100%;
				padding: 40rpx 0 4rpx 0;
				box-sizing: border-box;
				border-radius: 6rpx;
				background-image: -webkit-linear-gradient(45deg, #6C8DFF, #8B9DFD) !important;

				.text {
					margin: 0 auto 24rpx;
					font-size: 32rpx;
					font-weight: 600;
					text-align: center;
				}

				.text1 {
					margin: 0 auto;
					text-align: center;
					font-size: 28rpx;
				}
			}
		}

	}

	.all {
		color: #595959;
		font-family: auto;
		font-size: 32rpx;
		margin-bottom: 20rpx;
		line-height: 44rpx;
	}

	.fistbox {
		width: 100%;
		height: 170rpx;
		display: flex;
		align-items: center;
		justify-content: space-around;
		line-height: 1;
		border-radius: 10rpx;
		font-family: auto;
		margin-bottom: 20rpx;
	}

	.dbbox {
		margin-top: 10rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.num-tz {

		color: #1296db;
		font-size: 34rpx;
		font-family: auto;
		line-height: 32rpx;
		width: 80rpx;
		display: flex;
		position: relative;

		.cu-tag {
			position: absolute;
			top: -10rpx;
			right: -20rpx;
		}

	}

	uni-page-body {
		height: 100%;
	}

	.tz {
		width: 64rpx;
		height: 64rpx;
		border-radius: 64rpx;
		box-shadow: 0 6rpx 18rpx #ccc;
	}

	.app {
		height: 100%;
	}

	.heads {
		width: 100%;
		font-family: cursive;
		height: 100%;
		background-image: -webkit-linear-gradient(45deg, #5BB0FF, #6263FF);
		background-image: linear-gradient(45deg, #5BB0FF, #6263FF);
		color: #fff;
		text-align: center;
		line-height: 200rpx;
		font-size: 70rpx;
	}

	.hname {
		color: #595959;
		font-family: auto;
		font-size: 24rpx;
		height: 50rpx;
		line-height: 40rpx;
		text-align: center;
		margin-bottom: 20rpx;
	}

	.head-card {
		position: relative;
		width: 90%;
		box-sizing: border-box;
		margin-top: 50rpx;
		box-shadow: 0 2rpx 10rpx #67D8FF;
		padding: 6rpx 34rpx;
		margin: 30rpx auto 0;
		background-color: #fff;
		border-radius: 10rpx;

		.atve {
			position: absolute;
			top: -60rpx;
			left: 50%;
			transform: translateX(-50%);
			width: 120rpx;
			height: 120rpx;
			overflow: hidden;
			border-radius: 120rpx;
			overflow: hidden;
			border-radius: 120rpx;

		}
	}
</style>
