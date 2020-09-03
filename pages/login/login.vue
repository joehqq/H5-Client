<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header">
				<image src="../../static/logo.png"></image>
				<view class="headtext">
					欢迎登录
				</view>
			</view> 
			<!-- 主体表单 -->
			<view class="main">
				<wInput v-model="loginForm.username" type="text" maxlength="11" placeholder="请输入账号"></wInput>
				<wInput v-model="loginForm.password" type="password" maxlength="11" placeholder="密码"></wInput>
				<view class="yzmbox">
			 		<wInput class='yam' v-model="loginForm.code" type="text" maxlength="4" placeholder="验证码"></wInput>
					<view class="login-code">
						<image :src="codeUrl.replace(/[\r\n]/g,'')" mode="" @click="getCode"></image>
					</view>
				</view>
			</view>
			<wButton text="登 录" :rotate="isRotate" @click.native="startLogin()" class="wbutton"></wButton>

			<!-- 其他登录 -->
			<!-- 	<view class="other_login cuIcon">
				<view class="login_icon">
					<view class="cuIcon-weixin" @tap="login_weixin"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-weibo" @tap="login_weibo"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-github" @tap="login_github"></view>
				</view> 
			</view> -->

			<!-- 底部信息 -->
			<!-- 	<view class="footer">
				<navigator url="forget" open-type="navigate">找回密码</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate">注册账号</navigator>
			</view> -->
		</view>
	</view>
</template>

<script>
	var _this;
	import wInput from '../../components/watch-login/watch-input.vue' //input
	import wButton from '../../components/watch-login/watch-button.vue' //button
	import homeApis from '../../api/homes66.js'
	export default {
		data() {
			return {
				loginForm: {
					username: "",
					password: "",
					rememberMe: false,
					code: "",
					uuid: ""
				},
				users:{},
				//logo图片 base64
				codeUrl: '',
				phoneData: '', //用户/电话
				passData: '', //密码
				isRotate: false, //是否加载旋转
			};
		},
		components: {
			wInput,
			wButton,
		},
		mounted() {
			this.getCode();
			
			let objs= JSON.parse(uni.getStorageSync('zhma'))
			if(objs){
				console.log(objs,8888888888)
				this.loginForm.username=objs.username
				this.loginForm.password=objs.password
			}
			_this = this;
		},
		created() {
			
		},
		methods: {
			getCode() {
				homeApis.getCodeImg().then(res => {
					this.codeUrl = "data:image/gif;base64," + res.img;
					this.loginForm.uuid = res.uuid;
					console.log(this.codeUrl)
				});
			},

			isLogin() {
				//判断缓存中是否登录过，直接登录
				// try {
				// 	const value = uni.getStorageSync('setUserData');
				// 	if (value) {
				// 		//有登录信息
				// 		console.log("已登录用户：",value);
				// 		_this.$store.dispatch("setUserData",value); //存入状态
				// 		uni.reLaunch({
				// 			url: '../../../pages/index',
				// 		});
				// 	}
				// } catch (e) {
				// 	// error
				// }
			},
			startLogin() {
				//登录
				if (this.isRotate) {
					//判断是否加载中，避免重复点击请求
					return false;
				}
				if (this.loginForm.username.length == "") {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '用户名不能为空'
					});
					return;
				}
				if (this.loginForm.code.length == "") {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '请输入验证码'
					});
					return;
				}
				if (this.loginForm.password.length < 4) {
					uni.showToast({
						icon: 'none',
						position: 'bottom',
						title: '密码格式不正确'
					});
					return;
				}
				homeApis.login(JSON.stringify({ ...this.loginForm
				})).then(ele => {
					
					if (ele.code == 200) {
					 uni.setStorageSync('token',ele.token);
						homeApis.getInfo().then(res=>{
							if(res.code==200){
								 this.users={
									roles:res.roles,
									user:res.user
								}
								 uni.setStorageSync('urse',JSON.stringify(this.users));
								  uni.setStorageSync('zhma',JSON.stringify(this.loginForm));
								 // uni.redirectTo({
								 // 	   	url: `/pages/home/home/home?userId=${this.users.user.userId}`
								 // });
								 uni.redirectTo({
								 	   	url: `/pages/task/tesk?userId=${this.users.user.userId}`
								 });
								 uni.removeStorageSync('token');
							}
						})
					} else {
						uni.showToast({
							icon: 'none',
							position: 'bottom',
							title: `${ele.msg}`
						});
						if(ele.msg=='验证码已失效'||ele.msg=='验证码错误'||ele.msg=='用户不存在/密码错误'){
							this.getCode()
						}
					}
				})
					
				// uni.reLaunch({
				// 	url: '/pages/home/home/home'
				// });
				// _this.isRotate=true
				// setTimeout(function(){
				// 	_this.isRotate=false
				// },3000)
				// uni.showLoading({
				// 	title: '登录中'
				// });
				// getLogin()
				// .then(res => {
				// 	//console.log(res)
				// 	//简单验证下登录（不安全）
				// 	if(_this.phoneData==res.data.username && _this.passData==res.data.password){
				// 		let userdata={
				// 			"username":res.data.username,
				// 			"nickname":res.data.nickname,
				// 			"accesstoken":res.data.accesstoken,
				// 		} //保存用户信息和accesstoken
				// 		_this.$store.dispatch("setUserData",userdata); //存入状态
				// 		try {
				// 			uni.setStorageSync('setUserData', userdata); //存入缓存
				// 		} catch (e) {
				// 			// error
				// 		}
				// 		uni.showToast({
				// 			icon: 'success',
				// 			position: 'bottom',
				// 			title: '登录成功'
				// 		});
				// 		uni.reLaunch({
				// 			url: '../../../pages/index',
				// 		});
				// 	}else{
				// 		_this.passData=""
				// 		uni.showToast({
				// 			icon: 'error',
				// 			position: 'bottom',
				// 			title: '账号或密码错误，账号admin密码admin'
				// 		});
				// 	}
				// 	uni.hideLoading();
				// }).catch(err => {
				// 	uni.hideLoading();
				// })

			},
			login_weixin() {
				//微信登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_weibo() {
				//微博登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			},
			login_github() {
				//github登录
				uni.showToast({
					icon: 'none',
					position: 'bottom',
					title: '...'
				});
			}
		}
	}
</script>

<style lang="scss">
	.login-code {
		image {
			height: 60rpx;
			will-change: transform;
			width: 220rpx !important;
		}
	}

	.yzmbox {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.headtext {
		text-align: center;
		font-size: 36rpx;
		font-weight: 600;
		letter-spacing: 4rpx;
	}

	@import url("../../components/watch-login/css/icon.css");
	@import url("./css/main.css");
</style>
