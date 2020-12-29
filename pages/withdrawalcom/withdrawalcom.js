var app = getApp();
var main = require("../../main.js");
var WxParse = require('../../wxParse/wxParse.js');
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
	  hidden: true, //正常情况
	  hidden1: true, //消息空
	  hidden2: true, //正常情况
	  hidden3: false, //消息空
	  list: [], //消息列表
	  id:0,
	  //第几页
	  page: 1,
	  setinfo: [],
	  imgUrl:'',
	  imgUrl1:'',
  },

  /**
   * 获取个人账户信息
   */
  get_set_info: function() {
	  
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Index/customercode',
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
			setinfo: res.data.data.setinfo,
			imgUrl:res.data.data.setinfo.customercode,
			imgUrl1:res.data.data.setinfo.sharecode
          })
		  //商品描述富文本编辑器
		  WxParse.wxParse('article', 'html', that.data.setinfo.contentnew, that, 5);
        } else {
			  wx.showToast({
				title: res.data.errmsg,
				icon: 'none',
				duration: 3000
			  })
        }
      },
	  fail: function(res) {
           that.get_set_info();
      },
    })
  },
  previewImg:function(){
        var imgUrl = this.data.imgUrl;
        wx.previewImage({
          urls: [imgUrl], //需要预览的图片http链接列表，注意是数组
          current: '', // 当前显示图片的http链接，默认是第一个
          success: function (res) { },
          fail: function (res) { },
          complete: function (res) { },
        })
    },
	previewImg1:function(){
		  var that = this;
		  var imgUrl1 = this.data.imgUrl1;
		  that.setData({
		    hidden2: false,
		    hidden3: true,
		  }),
		  wx.previewImage({
			urls: [imgUrl1], //需要预览的图片http链接列表，注意是数组
			current: '', // 当前显示图片的http链接，默认是第一个
			success: function (res) { },
			fail: function (res) { },
			complete: function (res) { },
		  })
	  },
  /**
   * 获取个人提现信息
   */
  get_withdrawal_list: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.taskapi + '/Task/withdrawallist',
      method: 'post',
      data: {
        token: main.get_storage('token'),
		wtype: 2,
		pageNumber: that.data.page,
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
		  if (that.data.page == 1) {
		  			that.setData({
		  			  hidden: false,
		  			  hidden1: true,
		  			  list: res.data.data.withdrawallist,
		  			})
		  } else {
		    if (res.data.data.withdrawallist.length == 0 && that.data.page > 1) {
		  				if(that.data.list == ''){
		  					that.setData({
		  					  hidden: true,
		  					  hidden1: false,
		  					})
		  				}
		  				  wx.showToast({
		  					title: '已加载全部',
		  					icon: 'none',
		  					duration: 1000
		  				  })
		    } else {
		      that.setData({
		  				  hidden: false,
		  				  hidden1: true,
		          list: that.data.list.concat(res.data.data.withdrawallist),
		      })
		    }
		  }
        } else {
			that.setData({
              hidden: true,
			  hidden1: false
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
  //去申请余额提现
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
  	   wx.request({
  	     url: app.taskapi + '/Task/withdrawalwrpricecom',
  	     method: 'post',
  	     data: {
  	       token: main.get_storage('token'),
  		   wrprice: e.detail.value.wrprice,
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
			  setTimeout(function() {
			   that.get_withdrawal_list();
			  }, 2000)
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
  that.setData({
    hidden1: true,
  })
  //判断是否已经授权
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        wx.showLoading({
          title: '加载中',
        }),
		that.get_set_info();
        that.get_withdrawal_list();
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
	  console.log("上拉加载")
	  var that = this;
	  that.setData({
		page: that.data.page + 1
	  })
	  that.get_withdrawal_list();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})