// junfeipage/working/projectpro/projectpro.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
let app = getApp();
Page({
  data: {
    date: "",
    Id: "",
    index: 0,
    explaincontent: "",
    otherflag: "",
    projectname: "",
    projectnum: "",
    projectid: "",
    schoolname: "",
    Schoolnameid: "",
    schoolid: "",
    pronodeList: "",
    prodetaillist: [],
    hasschoolurl: false,
    dicvalue: "",
    dicname: "",
    OtherName: "",
    schoolsstatus: "",
    array: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  },
  onLoad: function (options) {
    new app.WeToast()
    //加载的时候清除之前key的缓存值
    wx.removeStorageSync('projectnum');
    wx.removeStorageSync('projectname');
    wx.removeStorageSync('projectid');
    wx.removeStorageSync('SchoolName');
    wx.removeStorageSync('schoolid');
    wx.removeStorageSync('dicvalue');
    wx.removeStorageSync('dicname');
    wx.removeStorageSync('otherflag');
  },
  onShow: function () {
    var that = this;
    that.setData({
      projectnum: wx.getStorageSync('projectnum'),
      projectname: wx.getStorageSync('projectname'),
      projectid: wx.getStorageSync('projectid'),
      schoolname: wx.getStorageSync('SchoolName'),
      schoolid: wx.getStorageSync('schoolid'),
      dicvalue: wx.getStorageSync('dicvalue'),
      Schoolnameid: wx.getStorageSync('schoolnameid'),
      dicname: wx.getStorageSync('dicname'),
      otherflag: wx.getStorageSync('otherflag'),
      schoolsstatus: "-3"
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
            Schoolnameid: rows[0].SchoolId,
            hasschoolurl: false

          })
          console.log("学校名称", res.data);
        } else {
          that.setData({
            hasschoolurl: true

          })
        }
        if (that.data.schoolid) {
          var prjectprodata = {
            projectItemId: that.data.schoolid,
            sessionid: wx.getStorageSync('sessionid')
          }
          requiredata.getprojectitemsections(requireUrl.getprojectitemsectionsUrl, prjectprodata, function (res) {
            if (res.data.flag == "1") {
              console.log("流程", res.data);
              that.setData({
                prodetaillist: JSON.parse(res.data.data.rows)
              })
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
        }
        if (that.data.dicname && that.data.schoolid) {
          var sectiondata = {
            name: wx.getStorageSync('dicname'),
            projectItemId: that.data.schoolid,
            sessionId: wx.getStorageSync('sessionid')
          }
          console.log(sectiondata);
          requiredata.getprojectitemsection(requireUrl.getprojectitemsectionUrl, sectiondata, function (res) {
            if (res.data.flag == "1") {
              var rows = JSON.parse(res.data.data.rows);
              if (res.data.data.total != 0) {
                if (rows.RegTime == '1900-01-01') {
                  that.setData({
                     Id: rows.Id,
                    index: rows.Num,
                    explaincontent: rows.Remark,
                    date: ""
                  })
                } else {
                  that.setData({
                    Id: rows.Id,
                    date: rows.RegTime,
                    index: rows.Num,
                    explaincontent: rows.Remark
                  })
                }

              } else {
                that.setData({
                  date: "",
                  Id: 0
                })
              }
              console.log("流程节点信息", res.data);
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
      }, function (res) {
        console.log("失败", res);
      })
    }

  },
  explaininput: function (e) {
    explaincontent: e.detail.value
  },
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  nodenametap: function (e) {
    var that = this;
    wx.navigateTo({
      url: '../../working/getprojectsection/getprojectsection?objId=' + that.data.schoolid
    })
  },
  nodenameinput: function (e) {
    var that = this;
    that.setData({
      dicname: e.detail.value
    })
  },
  //保存流程节点信息
  savenodeTap: function (e) {
    var that = this;
    var sectionsavedata = {
      Id: that.data.Id,
      SessionId: wx.getStorageSync('sessionid'),
      ProjectItemId: that.data.schoolid,
      BeginDate: that.data.date,
      Name:that.data.dicname,
      Num: that.data.index,
      SchoolName: that.data.schoolname,
      SchoolId: that.data.Schoolnameid
    }
    if (that.data.date == "" || that.data.schoolname == "") {
      that.wetoast.toast({
        title: '请填全选项',
        duration: 1000
      });
    } else {
      console.log("流程id", sectionsavedata)
      requiredata.sectionsave(requireUrl.sectionsaveUrl, sectionsavedata, function (res) {

        if (res.data.flag == "1") {
          console.log("成功", res.data)
          that.wetoast.toast({
            title: '保存成功',
            duration: 1000
          });
          var prjectprodata = {
            projectItemId: that.data.schoolid,
            sessionid: wx.getStorageSync('sessionid')
          }
          requiredata.getprojectitemsections(requireUrl.getprojectitemsectionsUrl, prjectprodata, function (res) {
            if (res.data.flag == "1") {
              console.log("流程", res.data);
              that.setData({
                prodetaillist: JSON.parse(res.data.data.rows)
              })
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

        } else if (res.data.flag == "-1") {
          timeout(that, "../../login/index")
        } else {
          that.wetoast.toast({
            title: res.data.msg,
            duration: 1000
          });
        }

      }, function (res) {
        console.log("失败", res.data)
      })
    }
  }
})