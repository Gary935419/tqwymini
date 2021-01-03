var app = getApp();
var main = require("../../main.js");
var WxParse = require('../../wxParse/wxParse.js');
const config = app.globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
	content:'', //详细说明
	email:'', //邮箱地址
	gname:'', //商家名称
	mobile:'', //电话号码
	truename:'', //真实姓名
	gid:'',
	id:0
  },
  //失去焦点获得文本域里的内容
  bzInput:function(e){
	  var that = this;
	  that.setData({
		  content:e.detail.value
	  })
	  console.log(e.detail.value);
  },
  emailInput:function(e){
  	  var that = this;
  	  that.setData({
  		  email:e.detail.value
  	  })
  	  console.log(e.detail.value);
  },
  mobileInput:function(e){
  	  var that = this;
  	  that.setData({
  		  mobile:e.detail.value
  	  })
  	  console.log(e.detail.value);
  },
  truenameInput:function(e){
  	  var that = this;
  	  that.setData({
  		  truename:e.detail.value
  	  })
  	  console.log(e.detail.value);
  },
 //点击上传图片
gouploadimage() {
   let page = this
 	if (page.data.id == 1) {
 	  wx.showToast({
 		title: '请勿重复提交!',
 		icon: 'none',
 		duration: 3000
 	  })
 	  return false;
 	}
	if (page.data.truename == '') {
	  wx.showToast({
		title: '请填写您的联系姓名!',
		icon: 'none',
		duration: 3000
	  })
	  return false;
	}
	if (page.data.mobile == '') {
	  wx.showToast({
		title: '请填写您的联系电话!',
		icon: 'none',
		duration: 3000
	  })
	  return false;
	}
	if (page.data.gname == '') {
	  wx.showToast({
		title: '请填写您的商家名称!',
		icon: 'none',
		duration: 3000
	  })
	  return false;
	}
	if (page.data.email == '') {
	  wx.showToast({
		title: '请填写您的邮箱地址!',
		icon: 'none',
		duration: 3000
	  })
	  return false;
	}
 	if (page.data.content == '') {
 	  wx.showToast({
 		title: '请填写您的合作事宜!',
 		icon: 'none',
 		duration: 3000
 	  })
 	  return false;
 	}
	if (!main.isMobile(page.data.mobile)) {
	  wx.showToast({
		title: '请输入正确的手机号!',
		icon: 'none',
		duration: 3000
	  })
	  return false;
	}
	if (!main.isEmail(page.data.email)) {
	  wx.showToast({
		title: '请输入正确的邮箱地址!',
		icon: 'none',
		duration: 3000
	  })
	  return false;
	}
    wx.request({
	  url: app.taskapi + '/task/sendgoods',
	  method: 'post',
	  data: {
		   token: main.get_storage('token'),
		   truename: page.data.truename,
		   mobile: page.data.mobile,
		   shopname: page.data.gname,
		   email: page.data.email,
		   content: page.data.content,
		   gid: page.data.gid,
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
		  page.setData({
			id:1,
		  });
			wx.showToast({
				title: '您的合作意向已提交，我们工作人员会在12小时内跟您联系！',
				icon: 'none',
				duration: 2000
			})
			setTimeout(function () {
				wx.navigateTo({
				  	url: '/pages/myintegralgoods/myintegralgoods',
				});
			}, 3000)
		} else {
			  wx.showToast({
				title: res.data.errmsg,
				icon: 'none',
				duration: 2000
			  })
			  setTimeout(function () {
			  	wx.switchTab({
			  	  	url: '/pages/index/index',
			  	});
			  }, 3000)
		}
	  }
	})
 },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	var that = this;
	that.setData({                             
		gid: options.gid,
		gname: options.gname,
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