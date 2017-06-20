// junfeipage/working/projectrec/creatprorec/creatprorec.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const timeout = require('../../../../utils/util.js').timeout;
let app = getApp();
var flag = 1;
Page({
  data: {
    projectid: "",
    projectnum: "",
    Require: "",
    Matter: "",
    imageList: [],
    UnitTypeid: "",
    schoolid: "",
    schoolname: "",
    hasschoolurl: ""
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast();
    that.setData({
      UnitTypeid: wx.getStorageSync('unittype')
    })
  },
  onShow: function () {
    var that = this;
    that.setData({
      projectnum: wx.getStorageSync('projectnum'),
      projectid: wx.getStorageSync('projectid'),
      schoolname: wx.getStorageSync('schoolareaname'),
      schoolid: wx.getStorageSync('schoolareaid')
    })
    var getschoolareadata = {
      projectId: that.data.projectid,
      sessionId: wx.getStorageSync('sessionid'),
      start: "0",
      pageLength: "100"
    }
    if (that.data.projectid) {
      console.log("区县项目id", that.data.projectid)
      requiredata.getschoolarea(requireUrl.getschoolareaUrl, getschoolareadata, function (res) {
        if (res.data.flag == "1") {
          console.log("区县学校名称", res.data);
          var rows = JSON.parse(res.data.data.rows);
          if (rows.length == 1) {
            console.log(rows);
            that.setData({
              schoolname: rows[0].SchoolNameNew,
              schoolid: rows[0].SchoolId,
              hasschoolurl: false

            })

          } else {
            that.setData({
              hasschoolurl: true

            })
          }
        } else if (res.data.flag == "-1") {
          timeout(that, "../../../login/index")
        }

      }, function (res) {
        console.log("失败", res);
      })
    }
  },
  pronumchoose: function (e) {
    wx.navigateTo({
      url: '../../../working/projectnumber/projectnumber',

    })
  },
  //区县，市级选择学校
  proschoolchoose: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../../../working/chooseSchool/chooseSchool?projectid=' + that.data.projectid

    })
  },
  //整改事项
  recprocontent: function (e) {
    var that = this;
    that.setData({
      Matter: e.detail.value.replace(/ /g,'')
    })
  },
  //整改要求
  requirecontent: function (e) {
    var that = this;
    
    that.setData({
      Require:  e.detail.value.replace(/ /g,'')
    })

  },
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
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imageList
    })
  },
  //删除上传图片
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
      uploadImgUrl: requireUrl.submitprorecUrl
    }
    var formdata = {
      FormId: e.detail.formId,
      ProjectId: that.data.projectid,
      Matter: that.data.Matter,
      Require: that.data.Require,
      SessionId: wx.getStorageSync('sessionid'),
      SchoolId: that.data.schoolid
    }
    console.log(that.data.imageList);
    if (that.data.Require == ""||that.data.imageList==""||that.data.Matter=="") {
      console.log("3333")
      that.wetoast.toast({
        title: '请填全选项',
        duration: 5000
      });
      flag = 1;
    } else {
      requiredata.uploadImg(that.data.imageList, i, uploadImgdata, formdata, function () {
        flag = 1;
        that.wetoast.toast({
          title: '提交成功',
          duration: 1000,
          success(data) {
            wx.switchTab({
              url: '../../../working/index'
            })
          }
        });

      }, function () {
        flag = 1;
        console.log(uploadImgdata.successUp)
        if (uploadImgdata.successUp == "-1") {
          timeout(that, "../../../login/index")
        } else {
          that.wetoast.toast({
            title: '提交失败',
            duration: 1000
          });
        }

      })
    }

  }
})