// junfeipage/working/getprojectsection/getprojectsection.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
 const timeout=require('../../../utils/util.js').timeout;
let app = getApp();

Page({
  data: {
    wxSearchData: [],
    isloading: true
  },
  onLoad: function (options) {
    console.log("流程名称列表");
    var that = this;
    new app.WeToast()
    //初始化项目流程选择列表  
    requiredata.getprojectsection(requireUrl.getprojectsectionUrl, function (res) {
      if (res.data.flag == "1") {
        console.log("流程名称列表", res.data);
        var rows = JSON.parse(res.data.data.rows);
        that.setData({
          wxSearchData: rows,
          isloading: false
        });
        console.log("流程名称列表", res.data.data);
      } else if (res.data.flag == "-1") {
        timeout(that, "../../login/index")
      } else {
        that.wetoast.toast({
          title: res.data.msg,
          duration: 1000
        });
      }

    }, function (res) {
      console.log("失败", res);
    })

  },
  //跳回到上个页面
  prnumtap: function (event) {
    var that = this;
    var dicvalue = event.currentTarget.dataset.dicvalue;
    var dicname = event.currentTarget.dataset.dicname;
    wx.setStorageSync('dicvalue', dicvalue);
    wx.setStorageSync('dicname', dicname);
    wx.setStorageSync('otherflag', "0");
    wx.navigateBack({
      delta: 1 // 回退前 delta(默认为1) 页面

    })

  },
  otherprnum: function (e) {
    wx.setStorageSync('otherflag', "1");
    wx.removeStorageSync('dicname');
    wx.navigateBack({
      delta: 1 // 回退前 delta(默认为1) 页面

    })
  }

})
