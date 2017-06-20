// junfeipage/working/barcode/barcode.js
const requiredata = require('../../../utils/util.js').request_data;
const requireUrl = require('../../../config.js');
const timeout = require('../../../utils/util.js').timeout;
const indexHref = require('../../../utils/util.js').indexHref;
let app = getApp();
function getonesweepData(sno, that) {
  var reg = /^[0-9a-zA-Z]{7}$/;
  if (reg.test(sno)) {
    var getsnoinfodata = {
      key: sno
    }
    requiredata.getbarcodesnoinfo(requireUrl.getbarcodesnoinfoUrl, getsnoinfodata, function (res) {
      console.log("二维码对应信息", res.data)
      if (res.data.flag == "1") {
        that.setData({
          removesave: true,
          scansave: false
        })
        var rows = JSON.parse(res.data.data.rows)
        that.setData({
          barcodeaddrname: rows.Address,
          barcodeaddrid: rows.AdressId,
          barcodedicname: rows.Name
        })

        wx.setStorageSync('addrName', rows.Address)
        wx.setStorageSync('addrId', rows.AdressId)
      } else if (res.data.flag == "-1") {
        timeout(that, "../../../login/index")
      } else {
        that.setData({
          scansave: true,
          removesave: false
        })
      }

    }, function (res) {

    })
  } else {
    that.wetoast.toast({
      title: "请输入七位编码",
      duration: 1000
    });
  }

}
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
    barcodedicname: "",
    schoolnameid: "",
    barcodeaddrname: "",
    barcodeaddrid: "",
    barcodeinputdata: "",
    projectcontaractlistid: "",
    schoolsstatus: "",
    barcodeList: [],
    removesave: false,
    scansave: false
  },
  onLoad: function (options) {
    new app.WeToast();
    //加载的时候清除之前key的缓存值
    wx.removeStorageSync('projectnum');
    wx.removeStorageSync('projectname');
    wx.removeStorageSync('projectid');
    wx.removeStorageSync('SchoolName');
    wx.removeStorageSync('schoolid');
    wx.removeStorageSync('barcodedicname');
    wx.removeStorageSync('schoolnameid');
    wx.removeStorageSync('addrName');
    wx.removeStorageSync('addrId');
    wx.removeStorageSync('projectcontaractlistid');
  },
  onShow: function () {
    var that = this;
    that.setData({
      projectnum: wx.getStorageSync('projectnum'),
      projectname: wx.getStorageSync('projectname'),
      projectid: wx.getStorageSync('projectid'),
      schoolname: wx.getStorageSync('SchoolName'),
      schoolid: wx.getStorageSync('schoolid'),
      barcodedicname: wx.getStorageSync('barcodedicname'),
      schoolnameid: wx.getStorageSync('schoolnameid'),
      barcodeaddrname: wx.getStorageSync('addrName'),
      barcodeaddrid: wx.getStorageSync('addrId'),
      projectcontaractlistid: wx.getStorageSync('projectcontaractlistid'),
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
            hasschoolurl: false,
            schoolnameid: rows[0].SchoolId

          })
          console.log("学校名称", res.data);
        } else {
          that.setData({
            hasschoolurl: true

          })
        }
        //二维码列表展示
        if (that.data.projectcontaractlistid && that.data.schoolid) {
          var getsnoinfosListdata = {
            cid: that.data.projectcontaractlistid,
            pid: that.data.schoolid,
            addressId: 0
          }
          requiredata.getsnoinfosList(requireUrl.getsnoinfosListUrl, getsnoinfosListdata, function (res) {
            var rows = JSON.parse(res.data.data.rows);
            that.setData({
              barcodeList: rows
            })
            console.log("二维码列表", res.data)
          }, function (res) {
            console.log("失败", res);
          })
        }
      }, function (res) {
        console.log("失败", res);
      })

    }
  },
  //扫码
  onesweep: function (e) {
    var that = this;
    wx.scanCode({
      success: (res) => {
        console.log("二维码信息", res.result)
        var scancodename = res.result.substr(-8);
        scancodename = scancodename.replace('/', '');
        console.log(scancodename);
        that.setData({
          barcodeinputdata: scancodename
        })
      }
    })
    getonesweepData(that.data.barcodeinputdata, that)
  },
  devicenametap: function (e) {
    var that = this;
    var projectItemId = that.data.schoolid;
    wx.navigateTo({
      url: '../../working/choosedevicename/choosedevicename?projectItemId=' + projectItemId
    })

  },
  //二维码选择存放地点
  codeaddress: function (e) {
    var that = this;
    var schoolnameid = that.data.schoolnameid;
    wx.navigateTo({
      url: '../../working/address/address?schoolnameid=' + schoolnameid
    })
  },
  //输入二维码编码
  barcodeinput: function (e) {
    var that = this;
    this.setData({
      barcodeinputdata: e.detail.value
    })
    //获取地址
    getonesweepData(e.detail.value, that)
  },
  //二维码保存
  barcodesavetap: function (e) {
    var that = this;
    if (that.data.barcodeinputdata == "" || that.data.projectname == "" || that.data.schoolname == "") {
      that.wetoast.toast({
        title: '请填全选项',
        duration: 1000
      });
    } else {
      var bindsnocompanydata = {
        ProjectItemId: that.data.schoolid,//分项id
        ProjectContractListId: that.data.projectcontaractlistid,//合同清单id
        AddressId: that.data.barcodeaddrid,
        Address: that.data.barcodeaddrname,
        Sno: that.data.barcodeinputdata,
        SessionId: wx.getStorageSync('sessionid')

      }
      console.log("保存二维码", bindsnocompanydata)
      requiredata.bindsnocompany(requireUrl.bindsnocompanyUrl, bindsnocompanydata, function (res) {
        console.log(res.data)
        if (res.data.flag == "1") {
          that.wetoast.toast({
            title: '保存成功',
            duration: 1000
          });
          that.setData({
            barcodeinputdata: "",
          })
          var getsnoinfosListdata = {
            cid: that.data.projectcontaractlistid,
            pid: that.data.schoolid,
            addressId: 0
          }
          requiredata.getsnoinfosList(requireUrl.getsnoinfosListUrl, getsnoinfosListdata, function (res) {
            var rows = JSON.parse(res.data.data.rows);
            that.setData({
              barcodeList: rows
            })
            console.log("二维码列表", res.data)
          }, function (res) {
            console.log("失败", res);
          })
        } else if (res.data.flag == "-1") {
          timeout(that, "../../../login/index")
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
  },
  //解绑
  unbindtap: function (e) {
    var that = this;
    var cancelbinddata = {
      ProjectItemId: that.data.schoolid,
      SessionId: wx.getStorageSync('sessionid'),
      Sno: that.data.barcodeinputdata
    }
    requiredata.cancelbind(requireUrl.cancelbindUrl, cancelbinddata, function (res) {
      if (res.data.flag == "1") {
        that.wetoast.toast({
          title: '解绑成功',
          duration: 1000
        });
        that.setData({
          barcodeaddrname: "",
          barcodeaddrid: "",
          barcodedicname: ""
        })
        if (that.data.projectcontaractlistid) {
          var getsnoinfosListdata = {
            cid: that.data.projectcontaractlistid,
            pid: that.data.schoolid,
            addressId: 0
          }
          requiredata.getsnoinfosList(requireUrl.getsnoinfosListUrl, getsnoinfosListdata, function (res) {
            var rows = JSON.parse(res.data.data.rows);
            that.setData({
              barcodeList: rows
            })
            console.log("二维码列表", res.data)
          }, function (res) {
            console.log("失败", res);
          })
        }
      } else if (res.data.flag == "-1") {
        timeout(that, "../../login/index")
      } else {
        that.wetoast.toast({
          title: res.data.msg,
          duration: 1000
        });
      }
      console.log("解绑二维码", res.data)
    }, function (res) {

    })
  }
})