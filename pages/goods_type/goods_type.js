// pages/classify/classify.js
var app = getApp();
var main = require("../../main.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      title: '分类', //页面标题
      back: false, //是否有返回按钮
      home: false, //是否有首页按钮
    },
    //第几页
    page: 1,
    page: 1,
    //分类id
    gc_id: '',
    classifylist: [],
    goods_lists: [],
  },

  /**
   * 获取全部分类
   */
  getClassify: function() {
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
		  console.log(res.data.data.indexclasslist);
		  	that.setData({
		  	  classifylist: res.data.data.indexclasslist,
			  gc_id: res.data.data.indexclasslist[0].tid
		  	})
		  that.getClass_goods();
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
   * 选择分类
   */
  chose_class: function(e) {
    var that = this;
	app.globalData.tid = e.currentTarget.dataset.id,
    that.setData({
      gc_id: e.currentTarget.dataset.id,
      page: 1,
    })
    wx.showLoading({
      title: '加载中',
    })
    that.getClass_goods();
  },


  /**
   * 获取当前一级分类下的全部商品分类
   */
  getClass_goods: function() {
    var that = this;
	//调用接口请求数据
	wx.request({
	   url: app.taskapi + '/Task/goodslisttype',
	  method: 'POST',
	  data: {
	    pageNumber: that.data.page,
	    tid: that.data.gc_id,
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
		  console.log(res.data.data);
	      var goods_data = res.data.data.goodslist;
	      goods_data.forEach((item) => {
	        // item.gname = item.gname.substring(0, 10) + '...'
	      })
	      if (that.data.page == 1) {
	        //没有数据的时候，显示搜索结果为空
	        if (res.data.data.goodslist.length == 0) {
	          wx.showToast({
	            title: '暂无数据',
	            icon: 'none',
	            duration: 1000
	          })
			  that.setData({
			    goods_lists: []
			  })
	        } else {
	          that.setData({
	            goods_lists: goods_data
	          })
	        }
	      } else {
	        if (res.data.data.goodslist.length == 0 && that.data.page > 1) {
	          wx.showToast({
	            title: '已加载全部',
	            icon: 'none',
	            duration: 1000
	          })
	        } else {
	          that.setData({
	            goods_lists: that.data.goods_lists.concat(goods_data),
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
   * 打开详细画面
   */
  godetail: function(e) {
    wx.navigateTo({
      url: '../goods_details/goods_details?gid=' + e.currentTarget.dataset.id,
    })
  },

  //页面滑动到底部
  bindDownLoad: function() {
    var that = this;
    that.setData({
      page: that.data.page + 1
    })
    wx.showLoading({
      title: '加载中',
    })
    that.getClass_goods();
  },
  /**
   * 获取全部分类首页跳转过来
   */
  getClassifys: function() {
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
		  console.log(res.data.data.indexclasslist);
		  	that.setData({
		  	  classifylist: res.data.data.indexclasslist,
		  	})
		  that.getClass_goods();
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log(app.globalData.tid);
    var that = this;
    that.setData({
        gc_id: app.globalData.tid,
    })
	if(app.globalData.tid != ''){
		//获取分类列表
		that.getClassifys();
	}else{
		//获取分类列表
		that.getClassify();
	}
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