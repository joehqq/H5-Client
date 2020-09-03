<template>
	<view class="app">
	<view class="card" v-for="(item,index) in list" :key="index">
		<view :class="['reddian',item.stry==0?'reddins':'']">
			
		</view>
		<view :class="['imgbox',item.type==1?'imgboxs':'']">
		<!-- <image v-if="item.type==0?false:true" src="../../../static/icon/qian.png" mode=""></image>
		<image v-if="item.type==1?false:true" src="../../../static/icon/car.png" mode=""></image> -->
		</view>
		<view class="head">
			<view class="tz">
				[{{item.tz}}]
			</view>
			<text>
				{{item.text}}
			</text>
		</view>
		<view class="timer">
			{{item.time}}
		</view>
	</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				list:[
					{  
						stry:0,
						type:0,
						tz:'物流通知',
						text:'客户在广州完成交车',
						time:'2018-02-14'
					},
					{
						stry:1,
						type:1,
						tz:'放款通知',
						text:'客户在广州完成交车',
						time:'2018-02-14'
					},
					{   
						stry:0,
						type:0,
						tz:'物流通知',
						text:'客户在广州完成交车',
						time:'2018-02-14'
					},
				]
			};
		},
		methods:{
		
		}
	}
</script>

<style lang="scss">
	.timer{
		font-size: 28rpx;
		color: RGB(170,170,170);
		margin-right: 30rpx;
	}
	.head{
		line-height: 50rpx
		view{
			font-size: 32rpx;
		}
		text{
			font-size: 28rpx;
		}
	}
	.imgboxs{
		background-color: RGB(255,141,13) !important;
		
	}
	.imgbox{
		width: 100rpx;
		height: 100rpx;
		background-color: RGB(93,155,255);
		border-radius: 6rpx;
		display: flex;
		justify-content: center;
		align-items: center;
		image{
			width: 80rpx;
			height: 80rpx;
		}
	}
	.reddins{
		background-color: #FFFFFF !important;
		
	}
	.reddian{
		width: 20rpx;
		height: 20rpx;
		border-radius: 50%;
		background-color: red;
		    margin-left: 30rpx;
	}
.card{
	position: relative;
	overflow: hidden;
    padding: 20rpx 10rpx 20rpx 0;
	width: 95%;
	height: 150rpx;
	background-color: white;
	margin: 0 auto 10rpx auto;
	background: #FFFFFF;
	box-shadow: 0 0 6rpx 0 RGB(93, 157, 255);
	border-radius: 10rpx;
	display: flex;
	flex-wrap: wrap;
	box-sizing: border-box;
	justify-content: space-between;
	    align-items: center;
}
</style>