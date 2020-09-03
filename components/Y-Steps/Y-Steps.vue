<template>
	<!-- 获取一个数组，结构为[{date:'时间',info:'内容内容'}] -->
	<!-- @click事件返回点击标签元素的索引值 第一项为0 -->
	<view class="bg">
		<view class="steps">
			<view class="steps_item" v-for="(i, index) in infoList">
				<view v-if="index != 0" :style="{backgroundColor:color}"></view>
				<text :style="{backgroundColor:color}">{{ infoList.length -index }}</text>
			</view>
		</view>
		<view class="info_list">
			<view class="info_item" v-for="(i, index) in infoList" :style="{ animation: 'info ' + (index * 0.2 + 1) + 's' }"
			 @tap="topage(index)">
				<view class="namet">
					<text class="name">{{ i.handler_name }}({{i.config_name}}) </text>
					<text class="timer">{{ i.createtime }}</text>
				</view>
				
				<view class="fj" @click="fj(i.annex)" v-if="i.annex"> 审批附件 : <text class="fjtext">{{ i.annex |anne }}</text></view>
				<view class="yj"> 审批意见 : {{ i.opinion }}</view>
				<view class="types">{{ i.action |actdo }}</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'YSteps',
		props: {
			infoList: {
				type: Array,
				default: []
			},
			color: {
				type: String,
				default: '#ff3838'
			}
		},
		data() {
			return {};
		},
		mounted() {
			 // const query = uni.createSelectorQuery().in(this);
			 //            query.select('.').boundingClientRect(data => {
			 //                console.log(data)
			 //            }).exec();
		},
		filters:{
			anne(val){
				  if (val != null) {
				        let strs = val.substring(val.lastIndexOf("/") + 1);
				        const a = strs.indexOf("$$");
				        return strs.substring(0, a);
				      } else {
				        return "暂无数据";
				      }
				      return;
			},
			actdo(val){
				if(val==-1){
					return '已提交'
				}else if(val==0){
					return '回退'
				}else if(val==1){
					return '通过'
				}else if(val==2){
					return '拒绝'
				}else if(val==3){
					return '转交'
				}else{
					return null
				}
			}
		},
		onLoad(e) {
			//获取列表
		},
		methods: {
			fj(e){
				window.open(e)
			},
			topage(e) {
				this.$emit('click', e);
			}
		}
	};
</script>

<style lang="scss">
	.fjtext{
		font-size: 28rpx !important;
		color: RGB(18, 179, 255) !important;
	}
	.fj{
		height: 100rpx;
		width: 400rpx;
		 white-space:nowrap !important;
		 overflow:hidden !important ;
		 -o-text-overflow: ellipsis !important; /* for Opera */
		 text-overflow:ellipsis !important; /* for IE */
		    
		     display: block !important;
	}
	.types {
		position: absolute !important;
		top: -9rpx !important;
		font-size: 26rpx !important;
		right: 20rpx !important;
		color: RGB(18, 179, 255) !important;
	}

	.yj {
		font-size: 26rpx !important;
		color: #909399 !important;
	}

	.timer {
		font-size: 24rpx !important;
		color: #909399 !important;
	}

	.name {
		font-size: 28rpx !important;
		margin-right: 20rpx !important;
		display: black;
	}

	.namet {
		margin-top: 20rpx !important;
		overflow: initial !important;
	}

.yj{
	    word-wrap: break-word;
		display: block !important;
	    width: 180px !important;
	    height: 100%;
	    overflow: inherit !important;
	    white-space: normal !important;
}
	@keyframes info {
		0% {
			transform: translate(100px, 0);
		}

		60% {
			transform: translate(-10px, 0);
		}

		100% {
			transform: translate(0, 0);
		}
	}

	page {
		background-color: #f2f2f2;
	}

	.bg {
		margin-top: 20upx;
		background-color: #fff;
		display: flex;
	}

	.steps {
		display: flex;
		flex-direction: column;
		width: 60upx;
		margin: 0 30upx;
		margin-top: 100upx;

		.steps_item {
			display: flex;
			flex-direction: column;
			align-items: center;

			view {
				height: 200upx;
				width: 5upx;
			}

			text {
				display: flex;
				flex-direction: column;
				align-items: center;
				width: 40upx;
				line-height: 40upx;
				height: 40upx;
				border-radius: 50%;
				background-color: #ff3838;
				color: #ffffff;
				font-size: 10px;
			}
		}
	}

	.info_list {
		display: flex;
		flex-direction: column;
		flex: 1;

		.info_item {
			position: relative;
			background-color: #fff;
			height: 200upx;
			margin: 20upx 0;
			margin-right: 30upx;
			border-radius: 10upx;
			display: flex;
			flex-direction: column;
			// justify-content: center;
			padding: 0 30upx;

			text {
				font-size: 18px;
				font-family: PingFangSC-Medium, PingFang SC;
				font-weight: 500;
				color: rgba(51, 51, 51, 1);
				line-height: 25px;
			}

			view {
				font-size: 14px;
				font-family: PingFangSC-Regular, PingFang SC;
				font-weight: 400;
				color: rgba(102, 102, 102, 1);
				line-height: 20px;
				overflow: hidden;
				text-overflow: ellipsis;
				display: -webkit-box;
				-webkit-line-clamp: 2;
				flex-direction: column;
			}
		}

		.info_item:active {
			opacity: 0.6;
		}
	}
</style>
