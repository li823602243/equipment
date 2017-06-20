// junfeipage/working/acceptancesub/acceptancesub.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const indexHref = require('../../../utils/util.js').indexHref;
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();

Page({
  data: {
    reportList: [],
    detailedList: [],
    AssetsList: [],
    date: "",
    projectname: "",
    projectnum: "",
    projectid: "",
    schoolname: "",
    schoolid: "",
    attachment: "",
    enname: "",
    hasschoolurl: false,
    schoolsstatus: "",
    overconent: ""
  },
  onLoad: function (options) {

    var that = this;
    new app.WeToast()
    wx.removeStorageSync('projectnum');
    wx.removeStorageSync('projectname');
    wx.removeStorageSync('projectid');
    wx.removeStorageSync('SchoolName');
    wx.removeStorageSync('schoolid')
  },
  onShow: function () {
    var that = this;
    that.setData({
      projectnum: wx.getStorageSync('projectnum'),
      projectname: wx.getStorageSync('projectname'),
      projectid: wx.getStorageSync('projectid'),
      schoolname: wx.getStorageSync('SchoolName'),
      schoolid: wx.getStorageSync('schoolid'),
      schoolsstatus: "-2"
    })
    var chooseSchooldata = {
      key: "",
      projectId: that.data.projectid,
      sessionId: wx.getStorageSync('sessionid'),
      statuz: "-2"

    }
    if (that.data.projectid) {
      console.log(that.data.projectid)
      requiredata.chooseSchool(requireUrl.chooseSchoolUrl, chooseSchooldata, function (res) {
        var rows = JSON.parse(res.data.data.rows);
        if (rows.length == 1) {
          console.log(rows);
          wx.setStorageSync('schoolid', rows[0].Id)
          that.setData({
            schoolname: rows[0].SchoolName,
            schoolid: rows[0].Id,
            hasschoolurl: false

          })
          console.log("学校名称", res.data);
        } else {
          that.setData({
            hasschoolurl: true

          })
        }
      }, function (res) {
        console.log("失败", res);
      })
    }

  },
  //验收报告
  reportImage: function () {
    var that = this;
    var successUp = 0; //成功个数
    var failUp = 0; //失败个数

    var i = 0; //第几个  
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          reportList: that.data.reportList.concat(res.tempFilePaths)
        })
        var length = res.tempFilePaths.length; //总共个数
        requiredata.postacceptimg(res.tempFilePaths, "11", that.data.schoolid, successUp, failUp, i, length, function () {
          that.wetoast.toast({
            title: "上传成功",
            duration: 1000
          });

        }, function () {
          that.wetoast.toast({
            title: "上传失败",
            duration: 1000
          });
        })

      }
    })
  },
  //验收清单
  detailedListImage: function () {
    var that = this;
    var successUp = 0; //成功个数
    var failUp = 0; //失败个数

    var i = 0; //第几个  
    wx.chooseImage({
       count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          detailedList: res.tempFilePaths
        })
        var length = res.tempFilePaths.length; //总共个数
        requiredata.postacceptimg(res.tempFilePaths, "12", that.data.schoolid, successUp, failUp, i, length, function () {
          that.wetoast.toast({
            title: "上传成功",
            duration: 1000
          });

        }, function () {
          that.wetoast.toast({
            title: "上传失败",
            duration: 1000
          });
        })
      }
    })
  },
  //资产调拨
  AssetsImage: function () {
    var that = this;
    var successUp = 0; //成功个数
    var failUp = 0; //失败个数

    var i = 0; //第几个  
    wx.chooseImage({
       count: 1,
      success: function (res) {
        console.log(res)
        that.setData({
          AssetsList: res.tempFilePaths
        })
        var length = res.tempFilePaths.length; //总共个数
        requiredata.postacceptimg(res.tempFilePaths, "26", that.data.schoolid, successUp, failUp, i, length, function () {
          that.wetoast.toast({
            title: "上传成功",
            duration: 1000
          });

        }, function () {
          that.wetoast.toast({
            title: "上传失败",
            duration: 1000
          });
        })
      }
    })
  },
  //预览大图
  previewreportImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.reportList
    })
  },
  previewListImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.detailedList
    })
  },
  previewAssetsImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.AssetsList
    })
  },
  //提交审核form
  formSubmit: function (e) {
    var that = this;
    var projectitemaduitdata = {
      ProjectId: wx.getStorageSync('projectid'),
      ProjectItemId: that.data.schoolid,
      FormId: e.detail.formId,
      SessionId: wx.getStorageSync('sessionid')
    }
    requiredata.projectitemaduit(requireUrl.projectitemaduitUrl, projectitemaduitdata, function (res) {
      if (res.data.flag == "1") {
        indexHref(that, "提交成功", "../../working/index")
      } else if (res.data.flag == "-1") {
        timeout(that, "../../login/index")
      } else {
        that.wetoast.toast({
          title: res.data.msg,
          duration: 1000
        });
        that.setData({
          overconent: JSON.parse(res.data.data.rows)
        })
      }

      console.log("提交审核form", res.data)
    }, function (res) {
      console.log("失败")
    })
  }

})