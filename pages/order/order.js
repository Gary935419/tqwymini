var app = getApp();
var main = require("../../main.js");
const config = app.globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ostate: 0,
	orderall:[],
	orderostate1:[],
	orderostate2:[],
	orderostate3:[],
	orderostate4:[],
	init_hidden: true, //初始化页面隐藏
	//第几页
	page: 1,
  },
  changeTabbar(e) {
    var that = this;
    that.setData({
      ostate: e.currentTarget.dataset.id,
      page: 1,
    }),
    console.log(e.currentTarget.dataset.id);
    app.globalData.ostate = e.currentTarget.dataset.id;
    that.getorderlist();
  },
  //跳转到任务大厅
  go_tasklist: function(e) {
      wx.switchTab({
  		    url: '/pages/wan/wan',
  	  });
  },
  //跳转到订单详情
  go_taskorderdetail: function(e) {
  wx.navigateTo({
    url: '/pages/wandetal/wandetal?oid='+e.currentTarget.dataset.id,
  });
  },
  //获得任务
  getorderlist:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Task/taskorder',
  	    method: 'post',
  	    data: { 
  	      token: main.get_storage('token'),
		  pageNumber: that.data.page,
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
			if (that.data.ostate == 0) {
				if (res.data.data.orderall.length == 0) {
					if (that.data.orderall == '') {
						that.setData({
						  init_hidden: false,
						});
					}
				}else{
					that.setData({
					  init_hidden: true,
					});
				}
			}
			if(that.data.ostate == 2){
				if (res.data.data.orderostate2.length == 0) {
					if (that.data.orderostate2 == '') {
						that.setData({
						  init_hidden: false,
						});
					}
				}else{
					that.setData({
					  init_hidden: true,
					});
				}
			}
			if(that.data.ostate == 3){
				if (res.data.data.orderostate3.length == 0) {
					if (that.data.orderostate3 == '') {
						that.setData({
						  init_hidden: false,
						});
					}
				}else{
					that.setData({
					  init_hidden: true,
					});
				}
			}
			if(that.data.ostate == 4){
				if (res.data.data.orderostate4.length == 0) {
					if (that.data.orderostate4 == '') {
						that.setData({
						  init_hidden: false,
						});
					}
				}else{
					that.setData({
					  init_hidden: true,
					});
				}
			}
			if (that.data.page == 1) {
			  that.setData({
			    orderall: res.data.data.orderall,
			    orderostate2: res.data.data.orderostate2,
			    orderostate3: res.data.data.orderostate3,
			    orderostate4: res.data.data.orderostate4,
			  });
			} else {
				if(that.data.ostate == 0){
					if (res.data.data.orderall.length == 0 && that.data.page > 1) {
					  wx.showToast({
						title: '已加载全部',
						icon: 'none',
						duration: 1000
					  })
					} else {
					  that.setData({
					  orderall: that.data.orderall.concat(res.data.data.orderall),
					  orderostate2: res.data.data.orderostate2,
					  orderostate3: res.data.data.orderostate3,
					  orderostate4: res.data.data.orderostate4,
					  })
					}
				}
				if(that.data.ostate == 2){
					if (res.data.data.orderostate2.length == 0 && that.data.page > 1) {
					  wx.showToast({
						title: '已加载全部',
						icon: 'none',
						duration: 1000
					  })
					} else {
					  that.setData({
					  orderall: res.data.data.orderall,
					  orderostate2: that.data.orderostate2.concat(res.data.data.orderostate2),
					  orderostate3: res.data.data.orderostate3,
					  orderostate4: res.data.data.orderostate4,
					  })
					}
				}
				if(that.data.ostate == 3){
					if (res.data.data.orderostate3.length == 0 && that.data.page > 1) {
					  wx.showToast({
						title: '已加载全部',
						icon: 'none',
						duration: 1000
					  })
					} else {
					  that.setData({
					  orderall: res.data.data.orderall,
					  orderostate2: res.data.data.orderostate2,
					  orderostate3: that.data.orderostate3.concat(res.data.data.orderostate3),
					  orderostate4: res.data.data.orderostate4,
					  })
					}
				}
				if(that.data.ostate == 4){
					if (res.data.data.orderostate4.length == 0 && that.data.page > 1) {
					  wx.showToast({
						title: '已加载全部',
						icon: 'none',
						duration: 1000
					  })
					} else {
					  that.setData({
					  orderall: res.data.data.orderall,
					  orderostate2: res.data.data.orderostate2,
					  orderostate3: res.data.data.orderostate3,
					  orderostate4: that.data.orderostate4.concat(res.data.data.orderostate4),
					  })
					}
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
  var that = this;
  //判断是否已经授权
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        wx.showLoading({
          title: '加载中',
        }),
		that.setData({
		  ostate: app.globalData.ostate,
		}),
        that.getorderlist();
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
	  that.getorderlist();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})