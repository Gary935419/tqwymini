//app.js
App({
  taskapi: 'http://www.task.com/index.php/api', //正式接口测试
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    //navigationBar自动计算高度
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.statusBarHeight = res.statusBarHeight
      }
    })
  },
  globalData: {
    statusBarHeight: '',
    //小程序获取的微信用户信息
    userInfo: [],
    openid: '',
    //商城用户信息
    memberInfo: [],
    token: [],
	//类型id(首页跳转到任务大厅)
	tid1: 0,
	//关键字(首页跳转到任务大厅)
	keywords: 0,
	//排序
	order: 0,
	//订单状态
	ostate:0,
	//推荐人id
	sharemid:0,
  },
 
})