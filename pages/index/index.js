var app = getApp();
var main = require("../../main.js");
const config = app.globalData;

Page({
  data: {
	//第几页
	page: 1,
	keycode: '',
	goodslist: [],
	imglist:[],//轮播图
	noticelist:'',//公告
	classlist:[],//分类
	inithidden: false,
	empty_hidden: true,
	//-----------模拟banner图-----------
	indicatorDots: true,
	autoplay: true,
	interval: 2000,
	duration: 1000,	 
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
  /**
   * 打开详细画面
   */
  godetail: function(e) {
    wx.navigateTo({
      url: '../items_details/items_details?gid=' + e.currentTarget.dataset.id,
    })
  },
  //跳转到商品大厅
  go_tasklist: function(e) {
	  console.log(e.currentTarget.dataset.id);
      app.globalData.cid = e.currentTarget.dataset.id;
	  console.log(app.globalData);
      wx.switchTab({
  		    url: '/pages/items_type/items_type'
  	  });
  },
  //跳转到商家入驻
  go_shopinto: function(e) {
      wx.switchTab({
  		    url: '/pages/wan/wan',
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
  /**
   * 获取商品列表
   */
  get_goods_list: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    //调用接口请求数据
    wx.request({
       url: app.taskapi + '/Task/itemslist',
      method: 'POST',
      data: {
        pageNumber: that.data.page,
        keywords: that.data.keycode, //搜索关键词
		status: 1,
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
        //查询数据库成功
        if (res.data.errcode == '200') {
          wx.hideLoading();
          if (that.data.page == 1) {
            that.setData({
              goodslist: res.data.data.goodslist,
            })
            //没有数据的时候，显示搜索结果为空
            if (res.data.data.goodslist.length == 0) {
              that.setData({
                empty_hidden: false,
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
                goodslist: that.data.goodslist.concat(res.data.data.goodslist),
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
  	  	  	  noticelist: res.data.data.indexnotice,
  	  	  	})
  	  	  console.log(res.data.data.indexnotice)
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
  	    url: app.taskapi + '/Index/indexitemsclasslist',
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
	app.globalData.tid = "";
    //获取首页轮播图与商品列表
    that.getAdvertisementlist();
	that.getNoticelist();
	that.getClasslist();
	that.get_goods_list();
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
	console.log("上拉加载")
	var that = this;
	that.setData({
	page: that.data.page + 1
	})
	that.get_goods_list();
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
  
  },
})
