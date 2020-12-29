var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  userinfo: [],
	  mid:'',
	  id:'',
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
      url: app.taskapi + '/Index/memberinfos',
      method: 'post',
      data: {
        token: main.get_storage('token'),
		mid: that.data.mid,
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
			userinfo: res.data.data.member,
          })
        } else {
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
   * 用户点击确认绑定
   */
  go_share: function() {
    var that = this;
  	if (that.data.id == 1) {
  	  wx.showToast({
  		title: '请勿重复提交!',
  		icon: 'none',
  		duration: 3000
  	  })
  	  return false;
  	}
    wx.request({
  	     url: app.taskapi + '/Task/updatashare',
  	     method: 'post',
  	     data: {
  	       token: main.get_storage('token'),
  		   mid: that.data.mid,
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
				id:1,
			  })
			  wx.showToast({
				title: res.data.errmsg,
				icon: 'none',
				duration: 2000
			  })
			  setTimeout(function () {
				wx.switchTab({
				  url: '/pages/my/my',
				});
			  }, 2000)
  	       } else {
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var that = this;
	  if (options.scene) {
	  	let scene = decodeURIComponent(options.scene);
		app.globalData.sharemid = scene.split("=")[1];
		that.setData({
		   mid: scene.split("=")[1],     
		})
	  } else if (options.mid && options.mid !== 'undefined' ){//这里为开发环境
	    app.globalData.sharemid = options.mid;
		that.setData({
		   mid: options.mid,     
		})
      }
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
      if (res.authSetting['scope.userInfo']) {
        wx.showLoading({
          title: '加载中',
        }),
        that.get_member_info();
      } else {
		wx.showModal({
		         title: '温馨提示',
		         content: '当前您未授权,是否立即去授权?',
		         showCancel: true,//是否显示取消按钮
		         cancelText:"否",//默认是“取消”
		         cancelColor:'#111111',//取消文字的颜色
		         confirmText:"是",//默认是“确定”
		         confirmColor: '#111111',//确定文字的颜色
		         success: function (res) {
		            if (res.cancel) {
		           
		            } else {
					   wx.navigateTo({
						 url: '/pages/grant_login/grant_login?path=my',
					   })
		            }
		         },
		         // fail: function (res) { },//接口调用失败的回调函数
		         // complete: function (res) { },//接口调用结束的回调函数（调用成功、失败都会执行）
		});
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