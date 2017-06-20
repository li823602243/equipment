// junfeipage/working/projectrec/projectrecdetail/projectrecdetail.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const indexHref = require('../../../../utils/util.js').indexHref;
const timeout = require('../../../../utils/util.js').timeout;
let app = getApp();
var flag = 1;
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
    prorecdetail: "",
    imageList: [],
    imgpath: [],
    backimgpath: [],
    recid: "",
    reccontent: "",
    UnitTypeid: "",
    Statuz: "",
    Result: "",
    previewimgpath: [],
    previewbackimgpath: []
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast()
    that.setData({
      recid: options.recid,
      UnitTypeid: wx.getStorageSync('unittype')
    })
    var projectrecinfodata = {
      Id: options.recid,
      sessionId: wx.getStorageSync('sessionid')
    }
    requiredata.projectrecinfo(requireUrl.projectrecinfoUrl, projectrecinfodata, function (res) {
      var rows = JSON.parse(res.data.data.rows);
      console.log("反馈信息", res.data);
      if (rows.Statuz != 1 && wx.getStorageSync('unittype') == 4) {
        that.wetoast.toast({
          title: "该项目已经反馈",
          duration: 1000,
          success(data) {
            wx.redirectTo({
              url: '../../projectrec/projectrec'
            })
          }
        });
      }
      if (rows.Statuz != 2 && wx.getStorageSync('unittype') == 3) {
        that.wetoast.toast({
          title: "该项目已经确认",
          duration: 1000,
          success(data) {
            wx.redirectTo({
              url: '../../projectrec/projectrec'
            })
          }
        });
      }
      that.setData({
        prorecdetail: rows
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
    //整改反馈事项附件
    if (that.data.UnitTypeid == "3") {
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
  //选择附件
  chooseImage: function () {
    var that = this;
    wx.chooseImage({
      success: function (res) {
        console.log(res)
        that.setData({
          imageList: that.data.imageList.concat(res.tempFilePaths)
        })
      }
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
  },
  //选择
  previewImage: function (e) {
    var current = e.currentTarget.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  //删除图片
  deleteimgtap: function (e) {
    var that = this;
    var imageList = that.data.imageList;
    //获取点击条目的索引
    var index = e.currentTarget.dataset.index;
    imageList.splice(index, 1);
    that.setData({
      imageList: imageList
    })

  },
  //整改反馈内容填写
  recContent: function (e) {
    var that = this;
    that.setData({
      reccontent: e.detail.value.replace(/ /g, '')
    })

  },
  submittap: function (e) {
    console.log(flag)
    var that = this;
    if (flag != 1) {
      return;
    }
    flag = 0;
    var successUp = 0; //成功个数
    var failUp = 0; //失败个数
    var length = that.data.imageList.length; //总共个数
    var i = 0; //第几个  
    var uploadImgdata = {
      successUp: 0,
      failUp: 0,
      length: length,
      uploadImgUrl: requireUrl.rectificationUrl
    }
    var formdata = {
      FormId: e.detail.formId,
      Feedback: that.data.reccontent,
      Id: that.data.recid,
      SessionId: wx.getStorageSync('sessionid')
    }
    console.log(that.data.imageList);
    if (that.data.imageList == "" || that.data.reccontent == "") {
      that.wetoast.toast({
        title: '请填全选项',
        duration: 5000
      });
      flag = 1;
    } else {
      requiredata.uploadImg(that.data.imageList, i, uploadImgdata, formdata, function () {
        console.log("提交成功", uploadImgdata, formdata)
        flag = 1;
        that.wetoast.toast({
          title: '提交成功',
          duration: 1000,
          success(data) {
            wx.switchTab({
              url: '../../../working/index',
            })
          }
        });

      }, function () {
        flag = 1;
        console.log("提交失败")
        that.wetoast.toast({
          title: '提交失败',
          duration: 5000
        });
      })
    }

  },
  radioChange: function (e) {
    this.setData({
      Statuz: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  confirminput: function (e) {
    this.setData({
      Result: e.detail.value
    })
  },
  schoolsubmittap: function (e) {
    var that = this;
    var confirmationcdata = {
      FormId: e.detail.formId,
      Id: that.data.recid,
      Statuz: that.data.Statuz,
      Result: that.data.Result,
      SessionId: wx.getStorageSync('sessionid')
    }
    requiredata.confirmationc(requireUrl.confirmationcUrl, confirmationcdata, function (res) {
      if (res.data.flag == "1") {
        console.log("学校整改", res.data)
        indexHref(that, "提交成功", "../../../working/index")
      } else if (res.data.flag == "-1") {
        timeout(that, "../../../login/index")
      }

    }, function (res) {

    })
  }

})