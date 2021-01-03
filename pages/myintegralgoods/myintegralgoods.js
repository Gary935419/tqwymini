// pages/search/search.js
var app = getApp();
var main = require("../../main.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    nav: {
      title: '合作申请', //页面标题
      back: true, //是否有返回按钮
      home: true, //是否有首页按钮
    },
    //第几页
    page: 1,
   
    inithidden: false,
    empty_hidden: true,
	inputValue: null,
    //商品
    list: [],
  },

  /**
   * 获取搜索我的兑换商品列表
   */
  get_goods_list: function() {
    var that = this;
    //调用接口请求数据
    wx.request({
       url: app.taskapi + '/Task/mygoodslist',
      method: 'POST',
      data: {
        token: main.get_storage('token'),
        pageNumber: that.data.page,
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