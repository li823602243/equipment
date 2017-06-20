// 过程材料js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();
var flag = 1;
function getimgList(that, moduleId, category, sucess) {
  var getattachmentlistdata = {
    objId: that.data.schoolid,
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
    imageList: [],
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
    attachmentList: [],
    imgcontentlist: [],
    disabled: false
  },
  onLoad: function (options) {

    var that = this;
    new app.WeToast()
    wx.removeStorageSync('projectnum');
    wx.removeStorageSync('projectname');
    wx.removeStorageSync('projectid');
    wx.removeStorageSync('SchoolName');
    wx.removeStorageSync('schoolid')
    wx.removeStorageSync('attachment');
    wx.removeStorageSync('enname')
  },
  onShow: function () {
    var that = this;
    that.setData({
      projectnum: wx.getStorageSync('projectnum'),
      projectname: wx.getStorageSync('projectname'),
      projectid: wx.getStorageSync('projectid'),
      schoolname: wx.getStorageSync('SchoolName'),
      schoolid: wx.getStorageSync('schoolid'),
      attachment: wx.getStorageSync('attachment'),
      schoolsstatus: "-3",
      imgcontentlist:[],
      enname: wx.getStorageSync('enname').replace(/[^0-9]+/g, '')
    })
    var chooseSchooldata = {
      key: "",
      projectId: that.data.projectid,
      sessionId: wx.getStorageSync('sessionid'),
      statuz: "-3"

    }
    if (that.data.projectid) {
      console.log(that.data.projectid)
      requiredata.chooseSchool(requireUrl.chooseSchoolUrl, chooseSchooldata, function (res) {
        var rows = JSON.parse(res.data.data.rows);
        if (rows.length == 1) {
          console.log(rows);
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
        if (that.data.schoolid && that.data.attachment) {
          getimgList(that, "3", that.data.enname, function (res) {
            console.log("附件列表数据", res.data)
            if (res.data.flag == "1") {
              if (res.data.data.total != 0) {
                var rows = JSON.parse(res.data.data.rows);
                rows[0].PathList.map(function (i) {
                  that.data.imgcontentlist.push("https://wx.demo.cneefix.com" + i.Path)
                })
                that.setData({
                  attachmentList: rows[0].PathList,
                  imgcontentlist: that.data.imgcontentlist
                })
              }else{
                  that.setData({
                  attachmentList: [],
                  imgcontentlist: []
                })
              }
              console.log(that.data.attachmentList)
            } else if (res.data.flag == "-1") {
              timeout(that, "../../login/index")
            } else {
              that.wetoast.toast({
                title: res.data.msg,
                duration: 1000
              });
            }

          })
        }
      }, function (res) {
        console.log("失败", res);
      })
    }

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
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  //删除上传图片
  deleteimgtap: function (e) {
    var that = this;
    var imageList = that.data.imageList;
    //获取点击条目的索引
    var index = e.currentTarget.dataset.index;
    console.log("33333", index)
    imageList.splice(index, 1);
    that.setData({
      imageList: imageList
    })

  },
  //删除已上传图片
  deleteimgcontenttap: function (e) {
    var that = this;
    var attachmentList = that.data.attachmentList;
    var imgcontentlist=that.data.imgcontentlist
    //获取点击条目的索引
    var index = e.currentTarget.dataset.index;
    var imageid = e.currentTarget.dataset.imageid;
    var deletefiledata = {
      Id: imageid,
      SessionId: wx.getStorageSync('sessionid')
    }
    requiredata.deletefile(requireUrl.deletefileUrl, deletefiledata, function (res) {
      if (res.data.flag == "1") {
        attachmentList.splice(index, 1);
        imgcontentlist.splice(index, 1);
        console.log(attachmentList)
        that.setData({
          attachmentList: attachmentList,
          imgcontentlist:imgcontentlist
        })
        that.wetoast.toast({
          title: '删除成功',
          duration: 1000
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

    })

  },
  previewcontentImage: function (e) {
    var current = e.target.dataset.path
    wx.previewImage({
      current: current,
      urls: this.data.imgcontentlist
    })
  },
  //点击上传内容
  attachmenttap: function (event) {
    var that = this;
    var objId = that.data.schoolid;
    console.log("objid", objId)
    wx.navigateTo({
      url: '../../../junfeipage/working/getattachment/getattachment?objId=' + objId
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
      uploadImgUrl: requireUrl.uploadUrl
    }
    var formdata = {
      ProjectItemId: that.data.schoolid,
      Category: wx.getStorageSync('enname').replace(/[^0-9]+/g, ''),
      SessionId: wx.getStorageSync('sessionid')
    }
    console.log(that.data.imageList);
    if (that.data.imageList == "" || that.data.projectname == "" || that.data.schoolname == "") {
      console.log("3333")
      that.wetoast.toast({
        title: '请填全选项',
        duration: 1000
      });
      flag = 1;
    } else {
      console.log(that.data.enname);
      requiredata.uploadImg(that.data.imageList, i, uploadImgdata, formdata, function () {
        flag = 1;
        that.wetoast.toast({
          title: '保存成功',
          duration: 1000
        });
        that.setData({
          imageList: []
        })

        getimgList(that, "3", that.data.enname, function (res) {
               that.setData({
              attachmentList: [],
              imgcontentlist: []
            })
          if (res.data.flag == "1") {
            console.log("附件列表数据", res.data)
            var rows = JSON.parse(res.data.data.rows);
            rows[0].PathList.map(function (i) {
              that.data.imgcontentlist.push("https://wx.demo.cneefix.com" + i.Path)
            })
            that.setData({
              attachmentList: rows[0].PathList,
              imgcontentlist: that.data.imgcontentlist
            })
            console.log(that.data.attachmentList)
          } else if (res.data.flag == "-1") {
            timeout(that, "../../login/index")
          } else {
            that.wetoast.toast({
              title: res.data.msg,
              duration: 1000
            });
          }

        })
      }, function () {
        flag = 1;
        console.log(uploadImgdata.successUp)
        if (uploadImgdata.successUp == "-1") {
          timeout(that, "../../login/index")
        }
        that.wetoast.toast({
          title: '保存失败',
          duration: 1000
        });
      })
    }

  }
})