var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
	imgs:[],
	imgslist:[],
    taskdetails: [],
	oid:"",
  },
  /**
   * 获取入驻申请信息
   */
  get_shopdetail_info: function() {
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
			  imgs: res.data.data.taskdetails.imgs,
			  imgslist: res.data.data.taskdetails.imgslist
    	  	})
        } else {
			wx.hideLoading();
			wx.showModal({
			  title: '温馨提示',
			  content: res.data.errmsg,
			  showCancel: false,
			  success: function(res) {
				if (res.confirm) {
				  wx.navigateTo({
					url: '/pages/order/order',
				  })
				}
			  }
			});
        }
      }
    })
  },
  // 预览图片
  previewImg(e) {
    //获取当前图片的下标
    let index = e.currentTarget.dataset.index;
    //所有图片
    let imgs = this.data.imgslist;
    wx.previewImage({
      //当前显示图片
      current: imgs[index],
      //所有图片
      urls: imgs
    })
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
	  //判断是否已经授权
	  wx.getSetting({
		success: res => {
			app.globalData.tid = "";
		  if (res.authSetting['scope.userInfo']) {
			that.get_shopdetail_info();
		  } else {
			that.setData({
			  taskdetails: [],
			})
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})