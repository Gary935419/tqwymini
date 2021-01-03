// pages/search/search.js
var app = getApp();
var main = require("../../main.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      title: '商品搜索', //页面标题
      back: true, //是否有返回按钮
      home: true, //是否有首页按钮
    },
    //第几页
    page: 1,
    keycode: '',
    empty_hidden: true,
	inputValue: null,
    //商品
    list: [],
  },

  /**
   * 获取搜索关键词
   */
  keyInput: function(e) {
	  var that = this;
	  that.setData({
	    keycode: e.detail.value
	  })
  },

  /**
   * 查询按钮绑定事件
   */
  searchgoods: function() {
    var that = this;
    //设置搜索记录
    if (that.data.keycode != '') {
      //加载样式显隐
      that.setData({
        page: 1
      })
      that.get_goods_list();
    }else{
		that.setData({
		  keycode: ''
		})
		that.get_goods_list();
	}
  },

  /**
   * 打开详细画面
   */
  godetail: function(e) {
    wx.navigateTo({
      url: '../goods_details/goods_details?gid=' + e.currentTarget.dataset.id,
    })
  },

  /**
   * 获取搜索商品列表
   */
  get_goods_list: function() {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    //调用接口请求数据
    wx.request({
       url: app.taskapi + '/Task/goodslist',
      method: 'POST',
      data: {
        pageNumber: that.data.page,
        keywords: that.data.keycode, //搜索关键词
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
              list: res.data.data.goodslist,
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
                list: that.data.list.concat(res.data.data.goodslist),
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
        that.setData({
          inithidden: true,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    //获取已经搜索过的历史记录
    that.get_goods_list();
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
  onShareAppMessage: function() {

  }
})