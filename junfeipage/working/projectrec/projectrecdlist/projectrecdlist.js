// junfeipage/working/projectrec/projectrecdlist/projectrecdlist.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
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
    list: '',
    show: [true, false, false],
    checked: '',
    id: '',
    imgpath: [],
    UnitTypeid: "",
    recid: "",
    statuz: "",
    list: [],
    previewbackimgpath: [],
    previewimgpath: [],
    backimgpath: []
  },
  onLoad: function (options) {
    var that = this;
    console.log("整改id", options.recid)
    console.log("statuz", options.statuz)
    that.setData({
      recid: options.recid,
      UnitTypeid: wx.getStorageSync('unittype'),
      statuz: options.statuz
    })
    var projectrecinfodata = {
      Id: options.recid,
      sessionId: wx.getStorageSync('sessionid')
    }
    requiredata.projectrecinfo(requireUrl.projectrecinfoUrl, projectrecinfodata, function (res) {
      var rows = JSON.parse(res.data.data.rows);
      console.log("反馈信息", res.data);
      if (rows.Statuz == 3) {
        rows.Statuz = "整改通过";
      } else if (rows.Statuz == 4) {
        rows.Statuz = "整改不通过"
      }
      that.setData({
        list: rows
      })
    }, function (res) {

    })
    //整改事项附件
    getimgList(that, "10", "4000", function (res) {
      console.log("附件列表数据", res.data)
      if (res.data.data.total != 0) {
        var rows = JSON.parse(res.data.data.rows);
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
    //整改反馈
    if (options.statuz != "等待处理") {
      getimgList(that, "10", "5000", function (res) {
        console.log("附件列表数据", res.data)
        var rows = JSON.parse(res.data.data.rows);
        rows[0].PathList.map(function (i) {
          that.data.previewbackimgpath.push("https://wx.demo.cneefix.com" + i.Path)
        })
        that.setData({
          backimgpath: rows[0].PathList,
          previewbackimgpath: that.data.previewbackimgpath
        })
        console.log(that.data.backimgpath)
      })
    }

  },
  toggle: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    that.data.show[idx] = !that.data.show[idx];
    that.setData({
      show: that.data.show
    })
  },
  //预览事项图片
  previewimgpath: function (e) {
    var current = e.currentTarget.dataset.path
    wx.previewImage({
      current: current,
      urls: this.data.previewimgpath
    })
  },
  //整改反馈预览图片
  previewbackimgpath: function (e) {
    var current = e.currentTarget.dataset.path
    wx.previewImage({
      current: current,
      urls: this.data.previewbackimgpath
    })
  }
})