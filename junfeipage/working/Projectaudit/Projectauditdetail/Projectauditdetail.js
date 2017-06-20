// junfeipage/working/Projectaudit/Projectauditdetail/Projectauditdetail.js
const requiredata = require('../../../../utils/util.js').request_data;
const requireUrl = require('../../../../config.js');
const indexHref = require('../../../../utils/util.js').indexHref;
const timeout = require('../../../../utils/util.js').timeout;
let app = getApp();
function getimgList(objId, moduleId, category, sucess) {
  var getattachmentlistdata = {
    objId: objId,
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
    items: [
      { name: '1', value: '通过', checked: 'true' },
      { name: '0', value: '不通过' },
    ],
    projectid: "",
    pritemid: "",
    rountlist: [],
    tenderList: [],
    tenderimglist: [],
    settleList: [],
    settleimglist: [],
    list: '',
    show: [true, false, false, false, false],
    checked: '',
    id: '',
    attachmentList: [],
    imglist: [],
    prodate: "",
    overdate: true,
    UnitTypeid: "",
    hasnodata: false,
    hasnofile:false
  },
  onLoad: function (options) {
    var that = this;
    new app.WeToast()
    that.setData({
      pritemid: options.pritemid,
      projectid: options.projectid
    })
    if (options.pritemid && options.projectid) {
      //过程材料
      console.log(options.pritemid, options.projectid)
      getimgList(that.data.pritemid, "3", "0", function (res) {
        console.log("附件列表数据", res.data)
        var rows = JSON.parse(res.data.data.rows);
        rows.map(function (item) {
          item.PathList.map(function (i) {
            that.data.imglist.push("https://wx.demo.cneefix.com" + i.Path)
          })
        })

        that.setData({
          attachmentList: rows,
          imglist: that.data.imglist
        })
        console.log(that.data.attachmentList)
      })
      getimgList(that.data.projectid, "1", "0", function (res) {
        console.log("招标文件附件列表数据", res.data)
        var rows = JSON.parse(res.data.data.rows);
        rows.map(function (item) {
          item.PathList.map(function (i) {
            that.data.tenderimglist.push("https://wx.demo.cneefix.com" + i.Path)
          })
        })

        that.setData({
          tenderList: rows,
          tenderimglist: that.data.tenderimglist
        })
        console.log(that.data.tenderimglist)
      })
      getimgList(that.data.pritemid, "4", "0", function (res) {
        console.log("结算材料列表数据", res.data)
        var rows = JSON.parse(res.data.data.rows);
        if (res.data.data.total == 0) {
          that.setData({
            hasnofile: true
          })
        }
        rows.map(function (item) {
          item.PathList.map(function (i) {
            that.data.settleimglist.push("https://wx.demo.cneefix.com" + i.Path)
          })
        })

        that.setData({
          settleList: rows,
          settleimglist: that.data.settleimglist
        })
        console.log(that.data.settleimglist)
      })
      //项目详情
      var getprodetaildata = {
        Id: options.pritemid,
        SessionId: wx.getStorageSync('sessionid')
      }
      requiredata.getprodetail(requireUrl.getprodetailUrl, getprodetaildata, function (res) {
        console.log("项目详情", res.data);
        var rows = JSON.parse(res.data.data.rows);
        if (rows.Statuz != 11) {
          that.wetoast.toast({
            title: "该项目已经审核",
            duration: 1000,
            success(data) {
              wx.redirectTo({
                url: '../../Projectaudit/Projectaudit'
              })
            }
          });

        }
        if (rows.SurplusDayNum < 0) {
          rows.overdata = Math.abs(rows.SurplusDayNum)
          that.setData({
            overdate: false
          })

        }
        that.setData({
          list: rows
        })
      }, function (res) {

      })

      //获取项目完成情况信息列表
      var param = {
        Id: options.pritemid,
        sessionid: wx.getStorageSync('sessionid')
      }
      requiredata.getprojectitemfulfilment(requireUrl.getprodurationinfoUrl, param, function (res) {
        var rows = JSON.parse(res.data.data.rows);
        for (var i = 0; i < rows.length; i++) {
          rows[i].SectionDate = rows[i].SectionDate.substr(5, rows[i].SectionDate.length);
        }
        that.setData({
          itemfulfilment: rows
        })
      }, function () {

      })
    }
  },
  formSubmit: function (e) {
    var fId = e.detail.formId;
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    var that = this;
    var projectreviewdata = {
      Statuz: e.detail.value.radiogroup,
      Remark: e.detail.value.Remark,
      SessionId: wx.getStorageSync('sessionid'),
      ProjectItemId: that.data.pritemid,
      ProjectId: that.data.projectid,
      FormId: fId
    }
    console.log("save", projectreviewdata)
    requiredata.projectreview(requireUrl.projectreviewUrl, projectreviewdata, function (res) {
      console.log("审核成功", res.data);
      if (res.data.flag == "1") {
        indexHref(that, "审核成功", "../../../working/index")
      } else if (res.data.flag == "-1") {
        timeout(that, "../../../login/index")
      } else {
        that.wetoast.toast({
          title: res.data.msg,
          duration: 1000
        });
      }

    }, function (res) {
      console.log("失败", res.data)
    })
  },
  toggle: function (e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    if (idx == 4) {
      // 巡检记录列表
      var prorecorddetaildata = {
        start: 0,
        pageLength: 50,
        projectItemId: that.data.pritemid,
        sessionId: wx.getStorageSync('sessionid')
      }
      requiredata.prorecorddetail(requireUrl.prorecorddetailUrl, prorecorddetaildata, function (res) {
        console.log("巡检记录", res.data);
        var rowlist = JSON.parse(res.data.data.rows)
        if (res.data.data.total == 0) {
          that.setData({
            hasnodata: true
          })
        }
        that.setData({
          rountlist: rowlist
        })
      }, function (res) {

      })
    }
    that.data.show[idx] = !that.data.show[idx];
    that.setData({
      show: that.data.show
    })
  },
  //过程材料预览图片
  previewImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.imglist
    })
  },
  //招标文件预览图片
  previewtenderImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.tenderimglist
    })
  },
  previewsettleImage: function (e) {
    var current = e.target.dataset.src
    wx.previewImage({
      current: current,
      urls: this.data.settleimglist
    })
  }
})