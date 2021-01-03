var app = getApp();
var main = require("../../main.js");
var WxParse = require('../../wxParse/wxParse.js');
const config = app.globalData;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgs: [],
    upload_picture_list: [],
	content:'', //详细说明
	address:'', //详细地址
	email:'', //邮箱地址
	shopname:'', //商家名称
	mobile:'', //电话号码
	truename:'', //真实姓名
	id:0,
  },
  //失去焦点获得文本域里的内容
  bzInput:function(e){
	  var that = this;
	  that.setData({
		  content:e.detail.value
	  })
	  console.log(e.detail.value);
  },
  addressInput:function(e){
  	  var that = this;
  	  that.setData({
  		  address:e.detail.value
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
  shopnameInput:function(e){
  	  var that = this;
  	  that.setData({
  		  shopname:e.detail.value
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
  //选择图片方法
  uploadpic: function (e) {
    let that = this //获取上下文
    let upload_picture_list = that.data.upload_picture_list
    //选择图片
    wx.chooseImage({
      count: 9, // 默认9，这里显示一次选择相册的图片数量 
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) { // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片 
	  
        let tempFiles = res.tempFiles
        //把选择的图片 添加到集合里
        for (let i in tempFiles) {
          tempFiles[i]['upload_percent'] = 0
          tempFiles[i]['path_server'] = ''
          upload_picture_list.push(tempFiles[i])
        }
        //显示
        that.setData({
          upload_picture_list: upload_picture_list,
        });
		that.uploadimages();
      },
    });
  },
  //点击上传图片
  uploadimages() {
    let page = this
    let upload_picture_list = page.data.upload_picture_list
  	var jsonLength = 0;
  	for (var i in upload_picture_list) {
  		jsonLength++;
  	}
    //循环把图片上传到服务器 并显示进度       
    for (let j in upload_picture_list) {
      if (upload_picture_list[j]['upload_percent'] == 0) {
        //上传图片后端地址
        upload_file_server(app.taskapi + '/Uploads/pushFIle', page, upload_picture_list, j,jsonLength)
      }
    }
    let imgs = wx.setStorageSync('imgs', upload_picture_list);
  	page.setData({
  	  upload_picture_list: upload_picture_list,
  	});
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
	if (page.data.shopname == '') {
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
	if (page.data.address == '') {
	  wx.showToast({
		title: '请填写您的详细地址!',
		icon: 'none',
		duration: 3000
	  })
	  return false;
	}
 	if (page.data.content == '') {
 	  wx.showToast({
 		title: '请填写您的详细说明!',
 		icon: 'none',
 		duration: 3000
 	  })
 	  return false;
 	}
 	if (page.data.upload_picture_list == '') {
 	  wx.showToast({
 		title: '请上传资质图片!',
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
	  url: app.taskapi + '/task/sendexamine',
	  method: 'post',
	  data: {
		   token: main.get_storage('token'),
		   truename: page.data.truename,
		   mobile: page.data.mobile,
		   shopname: page.data.shopname,
		   email: page.data.email,
		   address: page.data.address,
		   content: page.data.content,
		   upload_picture_list: JSON.stringify(page.data.upload_picture_list),
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
				title: '您的申请已提交，我们工作人员会在12小时内跟您联系！',
				icon: 'none',
				duration: 2000
			})
			setTimeout(function () {
				app.globalData.ostate = 2;
				wx.redirectTo({
				  	url: '/pages/order/order',
				});
			}, 3000)
		} else {
			  wx.showToast({
				title: res.data.errmsg,
				icon: 'none',
				duration: 2000
			  })
			  setTimeout(function () {
			  	wx.reLaunch({
			  	  	url: '/pages/wan/wan',
			  	});
			  }, 3000)
		}
	  }
	})
 },
  // 点击删除图片
  deleteImg(e) {
    let upload_picture_list = this.data.upload_picture_list;
    let index = e.currentTarget.dataset.index;
    upload_picture_list.splice(index, 1);
    this.setData({
      upload_picture_list: upload_picture_list
    });
  },
  // 预览图片
  previewImg(e) {
    //获取当前图片的下标
    let index = e.currentTarget.dataset.index;
    //所有图片
    let imgs = this.data.imgs;
	console.log(imgs);
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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})
/**
 * 上传图片方法
 */
function upload_file_server(url, that, upload_picture_list, j,jsonLength) {
  //上传返回值
  const upload_task = wx.uploadFile({
    // 模拟https
    url: url, //需要用HTTPS，同时在微信公众平台后台添加服务器地址  
    filePath: upload_picture_list[j]['path'], //上传的文件本地地址    
    name: 'file',
    formData: {
      'num': j
    },
    //附近数据，这里为路径     
    success: function(res) {
      var data = JSON.parse(res.data);
	   // console.log(data);
      // //字符串转化为JSON  
      if (data.errcode == '200') {
        var filename = data.data.src //存储地址 显示
        upload_picture_list[j]['path_server'] = filename
      } else {
        upload_picture_list[j]['path_server'] = filename
      }
      that.setData({
        upload_picture_list: upload_picture_list
      });
	   console.log(j);
	   // wx.showLoading({
	   //   title: '加载中',
	   // })
    }
  })
  //上传 进度方法
  upload_task.onProgressUpdate((res) => {
    upload_picture_list[j]['upload_percent'] = res.progress
    that.setData({
      upload_picture_list: upload_picture_list
    });
  });
}