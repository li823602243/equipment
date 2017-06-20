// junfeipage/working/submitaudit/submitaudit.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const indexHref = require('../../../utils/util.js').indexHref;
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();
Page({
  data: {
    date: "",
    index: 0,
    projectname: "",
    projectnum: "",
    projectid: "",
    schoolname: "",
    schoolid: "",
    hasschoolurl: false,
    outdate: false,
    isnopass: false,
    examine: false,
    isnopassComment: "",
    prComment: "",
    outdateComment: "",
    auditid: "",
    schoolsstatus: "",
    overconent: "",
    examineComment: ""

  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast()
    //加载的时候清除之前key的缓存值
    wx.removeStorageSync('projectnum');
    wx.removeStorageSync('projectname');
    wx.removeStorageSync('projectid');
    wx.removeStorageSync('SchoolName');
    wx.removeStorageSync('schoolid');

  },
  onShow: function () {
    var that = this;
    that.setData({
      projectnum: wx.getStorageSync('projectnum'),
      projectname: wx.getStorageSync('projectname'),
      projectid: wx.getStorageSync('projectid'),
      schoolname: wx.getStorageSync('SchoolName'),
      schoolid: wx.getStorageSync('schoolid'),
      schoolsstatus: "-4"
    })
    var chooseSchooldata = {
      key: "",
      projectId: that.data.projectid,
      sessionId: wx.getStorageSync('sessionid'),
      statuz: "-4"

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
        if (that.data.schoolid) {
          var getprojectsummarydata = {
            projectItemId: that.data.schoolid,
            SessionId: wx.getStorageSync('sessionid')
          }
          console.log("学校信息", getprojectsummarydata);
          requiredata.getprojectsummary(requireUrl.getprojectsummaryUrl, getprojectsummarydata, function (res) {
            if (res.data.flag == "1") {
              console.log("自验", res.data)

              if (JSON.parse(res.data.data.footer).Statuz == "41") {
                that.setData({
                  isnopass: true,
                  isnopassComment: JSON.parse(res.data.data.footer).Comment

                })
              }
              // if (JSON.parse(res.data.data.footer)) {
              //   that.setData({
              //     examine: true,
              //     examineComment: JSON.parse(res.data.data.footer).Comment

              //   })
              // }

              if (res.data.data.header == "已超期") {
                that.setData({
                  outdate: true

                })
              }
              that.setData({
                auditid: JSON.parse(res.data.data.rows)[0].Id,
                prComment: JSON.parse(res.data.data.rows)[0].Content,
                outdateComment: JSON.parse(res.data.data.rows)[0].ExtensionReason
              })
              console.log("auditid", that.data.auditid)
            } else if (res.data.flag == "-1") {
              timeout(that, "../../login/index")
            } else {
              that.wetoast.toast({
                title: res.data.msg,
                duration: 1000
              });
            }
          }, function (res) {
            console.log("失败")
          })
        }
      }, function (res) {
        console.log("失败", res);
      })

    }
  },
  formSubmit: function (e) {
    var that = this;
    var applyacceptancedata = {
      Id: that.data.auditid,
      ProjectId: that.data.projectid,
      ProjectItemId: that.data.schoolid,
      Content: e.detail.value.prTextarea.replace(/ /g, ''),
      ExtensionReason: e.detail.value.outdateTextarea.replace(/ /g, ''),
      SessionId: wx.getStorageSync('sessionid'),
      FormId: e.detail.formId
    }
    console.log("提交验收传的数据", applyacceptancedata)
    if (e.detail.value.prTextarea.replace(/ /g, '') == "") {
      that.wetoast.toast({
        title: '请填全选项',
        duration: 1000
      });
    } else {
      requiredata.applyacceptance(requireUrl.applyacceptanceUrl, applyacceptancedata, function (res) {
        console.log("提交验收信息", res.data)
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
      }, function (res) {
        console.log("失败")
      })
    }
  }



})