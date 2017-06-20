// 上传内容
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();

Page({
  data: {
    wxSearchData: [],
    isloading: true
  },
  onLoad: function (options) {
    var that = this;
    console.log("objId", options.objId)
    new app.WeToast()
    var getattachmentdata = {
      classId: "2",
      objId: options.objId,
      objType: "2",
      sessionId: wx.getStorageSync('sessionid')

    }
    //初始化上传内容列表
    if (options.objId) {
      requiredata.getattachment(requireUrl.getattachmentUrl, getattachmentdata, function (res) {
          console.log("上传内容列表", res.data);
        if (res.data.flag == "1") {
          that.setData({
            wxSearchData: JSON.parse(res.data.data.rows),
            isloading: false
          });
        
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
    }
  },
  //点击上传内容的，跳回到上个页面
  prnumtap: function (event) {
    var that = this;
    var attachment = event.currentTarget.dataset.attachment;
    var enname = event.currentTarget.dataset.enname;
    wx.setStorageSync('attachment', attachment);
    wx.setStorageSync('enname', enname);
    wx.navigateBack({
      delta: 1 // 回退前 delta(默认为1) 页面

    })

  }

})
