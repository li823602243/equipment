// junfeipage/working/projectrouting/proroutlistdetail/proroutlistdetail.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const indexHref = require('../../../../utils/util.js').indexHref;
const timeout = require('../../../../utils/util.js').timeout;
let app = getApp();
function getimgList(that, moduleId, category, sucess) {
  var getattachmentlistdata = {
    objId: that.data.recid,
    moduleId: moduleId,
    sessionId: wx.getStorageSync('sessionid'),
    category: category
  }
  requiredata.getattachmentlist(requireUrl.getattachmentlistUrl, getattachmentlistdata, function (res) {
    sucess(res)
  },
    function (res) {

    })
}
Page({
  data: {
    imgpath: [],
    proroutlistdetail: [],
    previewimgpath: [],
    routdate: ""
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      recid: options.id
    })
    console.log(options.id);
    new app.WeToast()
    var routdetaildata = {
      Id: options.id,
      sessionId: wx.getStorageSync('sessionid')
    }
    requiredata.getproroutdetail(requireUrl.getproroutdetailUrl, routdetaildata, function (res) {
      var rows = JSON.parse(res.data.data.rows);
      if (res.data.flag == "1") {
        that.setData({
          proroutlistdetail: rows,
          routdate: rows.RegTime.substring(0, 10)
        })
      } else if (res.data.flag == "-1") {
        timeout(that, "../../../login/index")
      } else {
        that.wetoast.toast({
          title: res.data.msg,
          duration: 1000
        });
      }
      console.log(res.data);
    }, function (res) {

    })
    getimgList(that, "10", "6000", function (res) {
      console.log("附件列表数据", res.data)
      var rows = JSON.parse(res.data.data.rows);
      if (res.data.data.total != 0) {
        rows[0].PathList.map(function (i) {
          that.data.previewimgpath.push("https://wx.demo.cneefix.com" + i.Path)
        })
        that.setData({
          imgpath: rows[0].PathList,
          previewimgpath: that.data.previewimgpath
        })
        console.log(that.data.imgpath)
      }

    })
  },
  previewimgpath: function (e) {
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.previewimgpath
    })
  }

})