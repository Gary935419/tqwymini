const app = getApp();
const config = app.globalData;
var main = require("../../main.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      title: '授权登录', //页面标题
      back: true, //是否有返回按钮
      home: true, //是否有首页按钮
    },
	id:0,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //默认不显示授权页面
    flag: false,
    path: 'index',
  },

  /**
   * 用户点击授权登录
   */
  bindGetUserInfo: function(e) {
    var that = this;
	if (that.data.id == 1) {
	  wx.showToast({
		title: '请勿重复提交!',
		icon: 'none',
		duration: 3000
	  })
	  return false;
	}
    //用户按了允许授权按钮
    if (e.detail.userInfo) {
      wx.showLoading({
        title: '正在登录',
      })
      config.userInfo = e.detail.userInfo;
	  // that.setData({
	  //   id:1,
	  // })
      //获取用户信息
      that.getuserinfo();
    } else {
      //用户按了拒绝按钮
      wx.showModal({
        title: '温馨提示',
        content: '拒绝授权，将无法享受小程序的部分功能，请授权之后再进入呦!',
        showCancel: false,
        confirmText: '返回授权',
		confirmColor: '#111111',//确定文字的颜色
		success: res => {
		    wx.hideLoading();
		    
		    console.log(res);
		    that.setData({
		        userInfo: res.data.result
		    })
		},
		fail: err => {
		    console.log(err);
		}
      })
    }
  },
  bindGetUserInfoback: function(e) {
       wx.switchTab({
			url: '/pages/index/index',
	   })
  },
  /**
   * 获取用户信息
   */
  getuserinfo: function() {
    var that = this;
	console.log(app.globalData.sharemid);
    //调用微信登录接口
    wx.login({
      success: function(loginCode) {
        //调用request请求api转换登录凭证 获取poenid
        wx.request({
          url: app.taskapi + '/Login/register',
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          method: 'post',
          data: {
            loginCode: loginCode.code,
            nickname: config.userInfo.nickName,
            avatarurl: config.userInfo.avatarUrl,
            gender: config.userInfo.gender,
			cityname: that.data.cityname,
			sharemid:app.globalData.sharemid,
          },
          success: function(res) {
            if (!res.data) {
              wx.showToast({
                title: '加载错误',
                icon: 'loading',
                duration: 10000
              })
            }
            if (res.data.errcode == '200') {
              main.set_storage('UserLogin', res.data.data);
              main.set_storage('token', res.data.data.token);
              // main.dologin(res);
              if (that.data.path == 'search_goods' || that.data.path == 'my' || that.data.path == 'share' || that.data.path == 'wallet' || that.data.path == 'yin' || that.data.path == 'task' || that.data.path == 'commission' || that.data.path == 'integral' || that.data.path == 'news' || that.data.path == 'personal') {
                wx.switchTab({
                  url: '/pages/' + that.data.path + '/' + that.data.path,
                });
              }else {
                wx.redirectTo({
                  url: '/pages/' + that.data.path + '/' + that.data.path,
                })
              }
            } else {
			that.setData({
			  flag: true,
			})
            wx.hideLoading();
			wx.showToast({
				title: res.data.errmsg,
				icon: 'none',
				duration: 3000
			})
            }
          },
		  fail: err => {
		      console.log(err);
		  }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    if (typeof(options.path) != "undefined") {
      that.setData({
        path: options.path,
      })
    }
    //判断是否已经授权
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.showLoading({
            title: '正在登录',
          })
          // 已经授权直接登录
          that.tologin();
        } else {
          that.setData({
            flag: true,
          })
        }
      },
	  fail: err => {
	      console.log(err);
	  }
    })
  },

  /**
   * 未登录去登录
   */
  tologin: function() {
    var that = this;
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        config.userInfo = res.userInfo
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (this.userInfoReadyCallback) {
          this.userInfoReadyCallback(res)
        }
        //如果已经授权，直接去登录
        that.getuserinfo();
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})