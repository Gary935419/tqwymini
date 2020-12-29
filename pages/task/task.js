var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tid:'',//类型id
	classlist:[],//分类
	order:0,//排序
	keywords:"",//排序
	tasklist:[],//分类
	//第几页
	page: 1,
  },
  //分类更新当前页面
  go_tasklist: function(e) {
		var that = this;
		that.setData({
		  tid: e.currentTarget.dataset.id,
		  page: 1,
		}),
		app.globalData.tid1 = e.currentTarget.dataset.id;
		that.getClasslist();
		that.getTasklist();
  },
  //排序更新当前页面
  go_taskorder: function(e) {
  		var that = this;
		app.globalData.order = e.currentTarget.dataset.id;
  		that.setData({
  		  order: e.currentTarget.dataset.id,
		  page: 1,
  		}),
  		that.getClasslist();
		that.getTasklist();
  },
  //跳转到任务详情
  go_taskdetail: function(e) {
    wx.navigateTo({
      url: '../task_ex/task_ex?taid=' + e.currentTarget.dataset.id,
    })
  },
  //获得分类
  getClasslist:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Task/indexclasslists',
  	    method: 'post',
  	    data: { 
  	      token: main.get_storage('token'),
  	    },
  	    header: {
  	      'content-type': 'application/x-www-form-urlencoded'
  	    },
  	    success: function(res) {
  	      if (!main.checklogin(res, 'task')) {
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
  	  	  	  classlist: res.data.data.indexclasslist,
  	  	  	})
  	  	  console.log(res.data.data.indexclasslist)
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
  //获得任务
  getTasklist:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Task/tasklist',
  	    method: 'post',
  	    data: { 
  	      token: main.get_storage('token'),
		  tid: that.data.tid,
		  order: that.data.order,
		  keywords: that.data.keywords,
		  pageNumber: that.data.page,
  	    },
  	    header: {
  	      'content-type': 'application/x-www-form-urlencoded'
  	    },
  	    success: function(res) {
  	      if (!main.checklogin(res, 'task')) {
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
			    tasklist: res.data.data.tasklist,
			  })
			} else {
			  if (res.data.data.tasklist.length == 0 && that.data.page > 1) {
			    wx.showToast({
			      title: '已加载全部',
			      icon: 'none',
			      duration: 1000
			    })
			  } else {
			    that.setData({
			      tasklist: that.data.tasklist.concat(res.data.data.tasklist),
			    })
			  }
			}
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
		console.log(app.globalData.tid1);
		console.log(app.globalData.keywords);
		console.log(app.globalData.order);
		app.globalData.ostate = 0;
		var that = this;
		that.setData({
		    tid: app.globalData.tid1,
			keywords: app.globalData.keywords,
			order: app.globalData.order,
		}),
		that.getClasslist();
		that.getTasklist();
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
	  that.getClasslist();
	  that.getTasklist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})