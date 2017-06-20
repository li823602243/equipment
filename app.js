//app.js
const requireUrl = require('config.js');
const requiredata = require('utils/util.js').request_data;
let {WeToast} = require('common/wetoast/wetoast.js')
App({
  WeToast,
  onLaunch: function () {

  },
  onShow: function (options) {
    // var getloginstatuzdata = {
    //   sessionId: wx.getStorageSync('sessionid')
    // }
    // if (wx.getStorageSync('sessionid')) {
    //   requiredata.getloginstatuz(requireUrl.getloginstatuzUrl, getloginstatuzdata, function (res) {
    //     console.log("app.js里的信息", res.data);
    //     if (res.data.flag == "-1") {
    //       wx.redirectTo({
    //         url: 'junfeipage/login/index'
    //       })
    //     }
    //   }, function (res) {

    //   })
    // }

  },
  globalData: {
    userInfo: null,
    code: null,
    projectnum: null,
    projectname: null,
    projectid: null,
    schoolname: null
  }
})