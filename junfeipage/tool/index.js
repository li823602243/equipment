// junfeipage/tool/index.js
Page({
  data: {},
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onesweep: function (e) {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log("二维码信息", res.result)
        var scancodename = res.result.substr(-8);
        scancodename = scancodename.replace('/', '');
        console.log(scancodename);
        wx.navigateTo({
          url: '../working/Equipinfo/Equipinfo?param=' + scancodename,
        })
      }
    })
  },
  barcodeinput: function (e) {
    wx.navigateTo({
      url: '../working/Equipinfo/Equipinfo?param=' + e.detail.value,
    })
  }
})