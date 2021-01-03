// pages/search/search.js
var app = getApp();
var main = require("../../main.js");
var WxParse = require('../../wxParse/wxParse.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      title: '商家详情', //页面标题
      back: true, //是否有返回按钮
      home: true, //是否有首页按钮
    },
	//商家id
	gid:'',
	//商家名臣
	gname:'',
	//商品
    goodsdetails: [],
	//轮播图
	imgUrls: [],
  },
  /**
   * 跳转到下单页面
   */
  goOrder: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/wanorder/wanorder?gid=' + that.data.gid + '&gname=' + that.data.gname,
    })
  },
  /**
   * 获取搜索商品详情
   */
  get_goods_details:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Task/goodsdetails',
  	    method: 'post',
  	    data: { 
  		  gid: that.data.gid,
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
  	        wx.hideLoading();
  	  	  	that.setData({
  	  	  	  goodsdetails: res.data.data.goodsdetails,
			  imgUrls: res.data.data.goodsimglist,
			  gname: res.data.data.goodsdetails.gname,
  	  	  	}),
			//商品描述富文本编辑器
			WxParse.wxParse('article', 'html', that.data.goodsdetails.gcontent, that, 5);
  	  	    console.log(res.data.data.goodsdetails)
  	      } else {
			wx.hideLoading();
			wx.showModal({
			  title: '温馨提示',
			  content: res.data.errmsg,
			  showCancel: false,
			  success: function(res) {
				if (res.confirm) {
				  wx.switchTab({
					url: '/pages/goods_type/goods_type',
				  })
				}
			  }
			});
  	      }
  	    }
  	  })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
      var that = this;
      that.setData({
        gid: options.gid,
      });
      that.get_goods_details();
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
  var that = this;
  //判断是否已经授权
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        
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