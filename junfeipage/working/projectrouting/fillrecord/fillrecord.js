// junfeipage/working/projectrouting/fillrecord/fillrecord.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
let app = getApp();
var flag = 1;
Page({
  data: {
    date: "",
    imageList: [],
    mattercontent: "",
    recordcontent: "",
    routdetailid: "",
    proitemid: "",
    schoolid: "",
    companyid: "",
    projectid: ""
  },
  onLoad: function (options) {
    console.log(options)
    var that = this;
    new app.WeToast()
    that.setData({
      routdetailid: options.routdetailid,
      proitemid: options.proitemid,
      schoolid: options.schoolid,
      companyid: options.companyid,
      projectid: options.projectid,
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
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
  //预览图片
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
  //巡检记录
  routrecord: function (e) {
    var that = this;
    that.setData({
      recordcontent: e.detail.value
    })

  },
  //巡检事项
  routmatter: function (e) {
    var that = this;
    that.setData({
      mattercontent: e.detail.value
    })

  },
  submittap: function (e) {
    console.log(flag)
    var that = this;
    if (flag != 1) {
      return;
    }
    flag = 0;
    var length = that.data.imageList.length; //总共个数
    var i = 0; //第几个  
    var uploadImgdata = {
      successUp: 0,
      failUp: 0,
      length: length,
      uploadImgUrl: requireUrl.postinspectioninfoUrl
    }
    var formdata = {
      FormId: e.detail.formId,
      projectRegulatorId: that.data.routdetailid,
      projectId: that.data.projectid,
      SessionId: wx.getStorageSync('sessionid'),
      projectItemId: that.data.proitemid,
      schoolId: that.data.schoolid,
      companyId: that.data.companyid,
      Matter: that.data.mattercontent,
      Content: that.data.recordcontent
    }
    if (that.data.imageList == "") {
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
            wx.redirectTo({
              url: '../../projectrouting/projectrouting'
            })
          }
        });

      }, function () {
        console.log("提交失败")
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

  },
})