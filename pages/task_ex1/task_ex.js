var app = getApp();
var main = require("../../main.js");
var WxParse = require('../../wxParse/wxParse.js');
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    yincang1: false,
	ostate: 1,
	oid:"",
	taskdetails:"",
  },
  bakbtn1: function (e) {
    this.setData({
      yincang1: true,
      bottom: -100,
    })
  },
	//完成任务
	go_tasksendimg: function(e) {
		var that = this;
		wx.navigateTo({
			url: '/pages/wan/wan?oid='+that.data.oid,
		});
	},

  //获得任务详情
  getTaskorderdetails:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Task/taskorderdetails',
  	    method: 'post',
  	    data: { 
  	      token: main.get_storage('token'),
  		  oid: that.data.oid,
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
  	  	  	  taskdetails: res.data.data.taskdetails,
			  ostate: res.data.data.taskdetails.ostate,
  	  	  	}),
			//商品描述富文本编辑器
			WxParse.wxParse('article', 'html', that.data.taskdetails.otatips, that, 5);
			WxParse.wxParse('article1', 'html', that.data.taskdetails.orequirement, that, 5);
			WxParse.wxParse('article2', 'html', that.data.taskdetails.otacontents, that, 5);
  	  	    console.log(res.data.data.taskdetails)
  	      } else {
			wx.hideLoading();
			wx.showModal({
			  title: '温馨提示',
			  content: res.data.errmsg,
			  showCancel: false,
			  success: function(res) {
				if (res.confirm) {
				  wx.switchTab({
					url: '/pages/task/task',
				  })
				}
			  }
			});
  	      }
  	    }
  	  })
  },
go_copy(e){
	var that = this;
    wx.showToast({
      title: '复制成功',
    })
	that.setData({
	 url: e.currentTarget.dataset.url,     
	})
    wx.setClipboardData({
      data: that.data.url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log(res.data) // data
          }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
		var that = this;
		that.setData({                             
		oid: options.oid,     
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
  that.getTaskorderdetails();
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
      wx.reLaunch({
       url: '/pages/order/order',
      })
	  // wx.switchTab({
	  //   url: '/pages/task/task',
	  // });
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