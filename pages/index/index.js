var app = getApp();
var main = require("../../main.js");
const config = app.globalData;

Page({
  data: {
    width: wx.getSystemInfoSync().windowWidth-35,//图片宽度  
    height: wx.getSystemInfoSync().windowWidth * 8 / 16,//图片高度
	imglist:[],//轮播图
	noticelist:[],//公告
	classlist:[],//分类
	membrenum:0,//会员人数
	inputValue: null,
  },
  clearInputEvent: function(res) {
          this.setData({
            'inputValue': ''
          })
        },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //事件处理函数
  keyInput: function(e) {
  app.globalData.keywords = e.detail.value;
  console.log(app.globalData);
  },
  //跳转到任务大厅
  go_tasklist: function(e) {
	  console.log(e.currentTarget.dataset.id);
	  app.globalData.keywords = "";
      app.globalData.tid1 = e.currentTarget.dataset.id;
	  console.log(app.globalData);
      wx.switchTab({
  		    url: '/pages/task/task',
  	  });
  },
  //跳转到任务大厅(带关键字)
  go_tasklistkey: function() {
	console.log(app.globalData.keywords);
	app.globalData.tid1 = "";
    wx.switchTab({
      	url: '/pages/task/task',
    });
  },
  //获得轮播图
  getAdvertisementlist:function(){
	  var that = this;
	  wx.showLoading({
	    title: '加载中',
	  })
	  wx.request({
	    url: app.taskapi + '/Index/indeximglist',
	    method: 'post',
	    data: {
	      token: main.get_storage('token'),
	    },
	    header: {
	      'content-type': 'application/x-www-form-urlencoded'
	    },
	    success: function(res) {
	      if (!main.checklogin(res, 'index')) {
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
	  	  	  imglist: res.data.data.indeximglist,
	  	  	})
	  	  console.log(res.data.data.indeximglist)
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
  //获得公告
  getNoticelist:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Index/indexnoticelist',
  	    method: 'post',
  	    data: { 
  	      token: main.get_storage('token'),
  	    },
  	    header: {
  	      'content-type': 'application/x-www-form-urlencoded'
  	    },
  	    success: function(res) {
  	      if (!main.checklogin(res, 'index')) {
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
  	  	  	  noticelist: res.data.data.indexnoticelist,
  	  	  	})
  	  	  console.log(res.data.data.indexnoticelist)
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
  //获得会员人数
  getMembernum:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Index/indexmembernum',
  	    method: 'post',
  	    data: { 
  	      token: main.get_storage('token'),
  	    },
  	    header: {
  	      'content-type': 'application/x-www-form-urlencoded'
  	    },
  	    success: function(res) {
  	      if (!main.checklogin(res, 'index')) {
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
  	  	  	  membernum: res.data.data.membernum,
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
  //获得分类
  getClasslist:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Index/indexclasslist',
  	    method: 'post',
  	    data: { 
  	      token: main.get_storage('token'),
  	    },
  	    header: {
  	      'content-type': 'application/x-www-form-urlencoded'
  	    },
  	    success: function(res) {
  	      if (!main.checklogin(res, 'index')) {
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
  onLoad: function () {
    
  },
  //下拉刷新
  onPullDownRefresh: function() {
  
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
	app.globalData.tid1 = "";
	app.globalData.keywords = "";
	app.globalData.order = "";
	app.globalData.ostate = 0;
    //获取首页轮播图与商品列表
    that.getAdvertisementlist();
	that.getNoticelist();
	that.getClasslist();
	that.clearInputEvent();
	that.getMembernum();
  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
  
  },
  
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
  
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
  
  },
})
