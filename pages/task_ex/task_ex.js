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
	taid:"",
	taskdetails:"",
	url:'',
  },
  bakbtn1: function (e) {
    this.setData({
      yincang1: true,
      bottom: -100,
    })
  },
  /**
   * 跳转到缴纳押金页面
   */
  go_deposit: function() {
    var that = this;
    wx.navigateTo({
      url: '/pages/wxpay/wxpay?path=task_ex',
    })
  },
//接任务
go_tasksend: function(e) {
	var that = this;
	//判断是否已经授权
	wx.getSetting({
	  success: res => {
	    if (res.authSetting['scope.userInfo']) {
			wx.showModal({
			  title: '温馨提示',
			  content: '你正在进行接任务操作,并会扣除'+e.currentTarget.dataset.id+'押金,您确认操作么?',
			  success(res) {
				if (res.confirm) {
			　　　　　  that.sendtask();
				} else if (res.cancel) {
				   console.log('用户点击取消')
				}
			  }
			});
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
	//接任务操作
	sendtask:function(){
		  var that = this;
		  wx.showLoading({
		    title: '加载中',
		  })
		  wx.request({
		    url: app.taskapi + '/Task/sendtask',
		    method: 'post',
		    data: { 
		      token: main.get_storage('token'),
			  taid: that.data.taid,
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
				  wx.showToast({
						title: '恭喜您!任务已经接到啦!',
						icon: 'none',
						duration: 2000
				     })
				  setTimeout(function () {
					wx.navigateTo({
					  url: '/pages/task_ex1/task_ex?oid='+res.data.data.oid,
					});
				  }, 2000)

		      } else {
				wx.hideLoading();
				wx.showToast({
				  title: res.data.errmsg,
				  icon: 'none',
				  duration: 2000
				})
				setTimeout(function () {
					wx.navigateTo({
					  url: '/pages/wxpay/wxpay',
					});
				}, 2000)
		      }
			  
		    }
		  })
	},
  //获得任务详情
  getTaskdetails:function(){
  	  var that = this;
  	  wx.showLoading({
  	    title: '加载中',
  	  })
  	  wx.request({
  	    url: app.taskapi + '/Task/taskdetails',
  	    method: 'post',
  	    data: { 
  	      token: main.get_storage('token'),
  		  taid: that.data.taid,
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
  	  	  	}),
			//商品描述富文本编辑器
			WxParse.wxParse('article', 'html', that.data.taskdetails.tatips, that, 5);
			//富文本图片放大
			var nodes2 = that.data.taskdetails.tatips;
			if (nodes2.indexOf("src") >= 0) {
			  //正则匹配所有图片路径
			  var imgs2 = [];
			  nodes2 = nodes2.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
			    imgs2.push(capture);
			    that.setData({
			      imgs2: imgs2
			    });
			    return '';
			  });
				that.setData({
				  nodes2: nodes2
				});
			  
			}else{
				that.setData({
				  nodes2: nodes2
				});
				//清除图片后正则匹配清除所有p标签
				// nodes = nodes.replace(/<p(([\s\S])*?)<\/p>/g, function (match, capture){
				//   return '';
				// });
			}
			
			WxParse.wxParse('article1', 'html', that.data.taskdetails.requirement, that, 5);
			//富文本图片放大
			var nodes = that.data.taskdetails.requirement;
			if (nodes.indexOf("src") >= 0) {
			  //正则匹配所有图片路径
			  var imgs = [];
			  nodes = nodes.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
			    imgs.push(capture);
			    that.setData({
			      imgs: imgs
			    });
			    return '';
			  });
				that.setData({
				  nodes: nodes
				});
			  
			}else{
				that.setData({
				  nodes: nodes
				});
				//清除图片后正则匹配清除所有p标签
				// nodes = nodes.replace(/<p(([\s\S])*?)<\/p>/g, function (match, capture){
				//   return '';
				// });
			}

			WxParse.wxParse('article2', 'html', that.data.taskdetails.tacontents, that, 5);
  	  	   //富文本图片放大
  	  	   var nodes1 = that.data.taskdetails.tacontents;
  	  	   if (nodes1.indexOf("src") >= 0) {
  	  	     //正则匹配所有图片路径
  	  	     var imgs1 = [];
  	  	     nodes1 = nodes1.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
  	  	       imgs1.push(capture);
  	  	       that.setData({
  	  	         imgs1: imgs1
  	  	       });
  	  	       return '';
  	  	     });
  	  	   	that.setData({
  	  	   	  nodes1: nodes1
  	  	   	});
  	  	     
  	  	   }else{
  	  	   	that.setData({
  	  	   	  nodes1: nodes1
  	  	   	});
  	  	   	//清除图片后正则匹配清除所有p标签
  	  	   	// nodes = nodes.replace(/<p(([\s\S])*?)<\/p>/g, function (match, capture){
  	  	   	//   return '';
  	  	   	// });
  	  	   }
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
  chooseImg: function (e) {   //预览
    var src = e.currentTarget.dataset.src;
    var urls = [];
    urls[0] = src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接  
      urls: urls
    })
  },
  chooseImg1: function (e) {   //预览
    var src = e.currentTarget.dataset.src;
    var urls = [];
    urls[0] = src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接  
      urls: urls
    })
  },
  chooseImg2: function (e) {   //预览
    var src = e.currentTarget.dataset.src;
    var urls = [];
    urls[0] = src;
    wx.previewImage({
      current: src, // 当前显示图片的http链接  
      urls: urls
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
		taid: options.taid,     
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