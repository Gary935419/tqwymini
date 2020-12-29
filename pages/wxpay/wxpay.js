var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  userinfo:[],
	  money:0,
	  paynumber:'',
	  id: 0,
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
        if (!main.checklogin(res, 'personal')) {
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
  //微信支付(下单)
  formSubmit: function(e) {
  	   var that = this;
	   if (that.data.id == 1) {
	     wx.showToast({
			title: '请勿重复提交!',
			icon: 'none',
			duration: 3000
	     })
	     return false;
	   }
  	   wx.showLoading({
  	     title: '加载中',
  	   })
	   that.setData({
	     money: e.detail.value.money,
	   })
  	   wx.request({
  	     url: app.taskapi + '/Task/payrechargeorder',
  	     method: 'post',
  	     data: {
  	       token: main.get_storage('token'),
  		   money: that.data.money,
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
			  //调用微信支付接口
			  that.setData({
			    paynumber: res.data.data.paynumber,
				id:1,
			  })
			console.log(that.data.paynumber);
			console.log(that.data.money);
			that.go_pay();
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
   * 调用微信支付接口
   */
  go_pay: function() {
    var that = this;
	wx.showLoading({
	  title: '加载中',
	})
	
   wx.request({
     url: app.taskapi + '/Task/wechatpay',
     method: 'post',
     data: {
       token: main.get_storage('token'),
       money: that.data.money,
	   paynumber: that.data.paynumber,
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
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType, //默认MD5
            paySign: res.data.data.paySign,
            success: function(res) {
              //支付成功修改订单状态
              console.log(res);
			  console.log(666);
			  wx.showToast({
			    title: '支付成功，2s后自动跳转',
			    icon: 'none',
			    duration: 3000
			  })
			  setTimeout(function() {
			    wx.switchTab({
			       url: '/pages/my/my',
			    })
			  }, 2000)
            },
            fail: function(res) {
				console.log(res);
				console.log(888);
              wx.showToast({
                title: '支付失败，2s后自动跳转',
                icon: 'none',
                duration: 3000
              })
              setTimeout(function() {
               wx.switchTab({
                  url: '/pages/my/my',
                })
              }, 2000)
            },
            complete: function(res) {}
          })

       } else {
	   wx.showToast({
		 title: '支付失败，2s后自动跳转',
		 icon: 'none',
		 duration: 3000
	   })
	   setTimeout(function() {
		wx.switchTab({
		   url: '/pages/my/my',
		 })
	   }, 2000)
       }
     }
   })
	
  },
  
  /**
   * 支付成功(暂不用)
   */
  paysuccess: function(paynumber) {
    var that = this;
    wx.request({
      url: app.zhsyapi + '/Task/notify',
      method: 'post',
      data: {
        token: main.get_storage('token'),
        paynumber: paynumber,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
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
          wx.showToast({
            title: '支付成功，2s后自动跳转',
            icon: 'none',
            duration: 3000
          })
          setTimeout(function() {
            wx.switchTab({
               url: '/pages/my/my',
            })
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
		               wx.switchTab({
		                     url: '/pages/my/my',
		                   });
		            } else {
					   wx.navigateTo({
						 url: '/pages/grant_login/grant_login?path=my',
					   })
		            }
		    },
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