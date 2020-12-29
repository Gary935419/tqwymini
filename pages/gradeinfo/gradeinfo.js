var app = getApp();
var main = require("../../main.js");
var WxParse = require('../../wxParse/wxParse.js');
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
	gid:"",
	gradedetails:"",
	url:'',
  },

  //获得等级详情
  getTaskdetails:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Task/gradedetails',
  	    method: 'post',
  	    data: { 
  	      token: main.get_storage('token'),
  		  gid: that.data.gid,
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
  	  	  	  gradedetails: res.data.data.gradedetails,
  	  	  	}),
			//商品描述富文本编辑器
			WxParse.wxParse('article', 'html', that.data.gradedetails.gcontent, that, 5);
  	  	    console.log(res.data.data.gradedetails)
  	      } else {
			wx.hideLoading();
			wx.showModal({
			  title: '温馨提示',
			  content: res.data.errmsg,
			  showCancel: false,
			  success: function(res) {
				if (res.confirm) {
				  wx.switchTab({
					url: '/pages/my/my',
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
  onLoad: function (options) {
		var that = this;
		that.setData({                             
		gid: options.gid,     
		})
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
  that.getTaskdetails();
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