var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
		isGrant: false,
		userinfo: [],
		back_path: 'my', //点击返回按钮返回的页面名称
		init_hidden: true, //初始化页面隐藏
  },

  /**
   * 获取个人账户信息
   */
  get_member_info: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Index/memberinfo',
      method: 'post',
      data: {
        token: main.get_storage('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if (!main.checklogin(res, 'my')) {
          return;
        }
        if (!res.data) {
          wx.showToast({
            title: '加载错误',
            icon: 'loading',
            duration: 10000
          })
        }
        if (res.data.errcode == '200') {
          wx.hideLoading();
          that.setData({
            isGrant: true,
			userinfo: res.data.data.member,
            init_hidden: false
          })
		  console.log(res.data.data.member.avater)
        } else {
			that.setData({
			  init_hidden: false
			}),
			  wx.showToast({
				title: res.data.errmsg,
				icon: 'none',
				duration: 3000
			  })
        }
      }
    })
  },
  
  /**
   * 跳转到授权登录页面
   */
  bind_grantlogin: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/grant_login/grant_login?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到消息列表页面
   */
  go_news: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/news/news?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到我的积分明细列表页面
   */
  go_integral: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/integral/integral?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到我的钱包明细列表页面
   */
  go_wallet: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/wallet/wallet?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到我的客服二维码页面
   */
  go_customercode: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/customer/customer?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到积分商城页面
   */
  go_integralgoods: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/search_goods/search_goods?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到我的兑换页面
   */
  go_myintegralgoods: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/myintegralgoods/myintegralgoods?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到我的佣金明细列表页面
   */
  go_commission: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/commission/commission?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到我的押金提现列表页面
   */
  go_withdrawal: function() {
    var that = this;
	console.log(that.data.userinfo);
	// if (that.data.userinfo.state == 1) {
		wx.navigateTo({
		  url: '/pages/withdrawal/withdrawal?path=' + that.data.back_path,
		})
	// }else{
	// 	wx.showToast({
	// 		title: '抱歉!该权限没有开通!',
	// 		icon: 'none',
	// 		duration: 3000
	// 	})
	// 	return false;
	// }

  },
  /**
   * 跳转到我的佣金提现列表页面
   */
  go_walletcommission: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/withdrawalcom/withdrawalcom?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到我的个人设置页面
   */
  go_set: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/personal/personal?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到缴纳押金页面
   */
  go_deposit: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/wxpay/wxpay?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到任务列表页面
   */
  go_tasklist: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/task/task?path=' + that.data.back_path,
    })
  },
  /**
   * 跳转到任务列表页面
   */
  go_bankcard: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/yin/yin?path=' + that.data.back_path,
    })
  },
  //跳转到订单待处理
  go_handle: function(e) {
      app.globalData.ostate = 1;
  	  console.log(app.globalData);
      wx.switchTab({
  		    url: '/pages/order/order',
  	  });
  },
  //跳转到订单审核中
  go_examine: function(e) {
      app.globalData.ostate = 2;
  	  console.log(app.globalData);
      wx.switchTab({
  		    url: '/pages/order/order',
  	  });
  },
  //跳转到订单已通过
  go_adopt: function(e) {
      app.globalData.ostate = 3;
  	  console.log(app.globalData);
      wx.switchTab({
  		    url: '/pages/order/order',
  	  });
  },
  //跳转到订单未通过
  go_adoptno: function(e) {
      app.globalData.ostate = 4;
  	  console.log(app.globalData);
      wx.switchTab({
  		    url: '/pages/order/order',
  	  });
  },
  //微信扫一扫
  getScancode: function() {
      var _this = this;
      // 允许从相机和相册扫码
      wx.scanCode({
        success: (res) => {
        }
      })
    },
	/**
	 * 跳转到我的推荐列表页面
	 */
	go_share: function() {
	  var that = this;
	  wx.navigateTo({
	    url: '/pages/recommend/recommend?path=' + that.data.back_path,
	  })
	},
	/**
	 * 跳转到我的会员等级介绍页
	 */
	jumpgrade: function() {
	  var that = this;
	  wx.navigateTo({
	    url: '/pages/gradeinfo/gradeinfo?gid=' + that.data.userinfo.gid,
	  })
	},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  var that = this;
  //判断是否已经授权
  wx.getSetting({
    success: res => {
		app.globalData.tid1 = "";
		app.globalData.keywords = "";
		app.globalData.order = "";
		app.globalData.ostate = 0;
      if (res.authSetting['scope.userInfo']) {
        //获取个人账户信息
        that.get_member_info();
      } else {
        that.setData({
          isGrant: false,
          init_hidden: false,
          userinfo: [],
        })
      }
    }
  })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})