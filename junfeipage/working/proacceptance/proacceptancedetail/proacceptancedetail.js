// junfeipage/working/proacceptance/proacceptancedetail/proacceptancedetail.js
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
    startlist: [0, 1, 2, 3, 4],
    startsrc: "../../../../images/start.png",
    startselectedsrc: "../../../../images/startselected.png",
    key1: 0,
    key2: 0,
    key3: 0,
    key4: 0,
    key5: 0,
    key6: 0,
    items: [
      { name: '4', value: '通过' },
      { name: '41', value: '不通过' },
    ],
    Statuz: "",
    pritemid: "",
    projectid: "",
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
    hasnofile: false
  },
  onLoad: function (options) {
    console.log(options.projectid)
    var that = this;
    that.setData({
      pritemid: options.pritemid,
      projectid: options.projectid
    })
    new app.WeToast()
    // 页面初始化 options为页面跳转所带来的参数
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
        if (rows.Statuz != 3) {
          that.wetoast.toast({
            title: "该项目已经验收",
            duration: 1000,
            success(data) {
              wx.redirectTo({
                url: '../../proacceptance/proacceptance'
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
  startlist1: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key1: key

    })
    console.log(key)
  },
  startlist2: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key2: key

    })
  },
  startlist3: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key3: key

    })
  },
  startlist4: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key4: key

    })
  },
  startlist5: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key5: key

    })
  },
  startlist6: function (e) {
    var key = e.currentTarget.dataset.key
    this.setData({
      key6: key

    })
  },
  radioChange: function (e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    this.setData({
      Statuz: e.detail.value
    })
  },
  formSubmit: function (e) {
    var that = this;
    var fId = e.detail.formId;
    var proacceptdata = {
      ProjectId: that.data.projectid,
      Statuz: that.data.Statuz,
      Equipment: that.data.key1,
      Construction: that.data.key2,
      Service: that.data.key3,
      Period: that.data.key4,
      UserTraining: that.data.key5,
      Civilization: that.data.key6,
      ProjectItemId: that.data.pritemid,
      Comment: e.detail.value.Comment,
      SessionId: wx.getStorageSync('sessionid'),
      FormId: fId
    }
    console.log("save", proacceptdata)
    requiredata.schoolevaluate(requireUrl.schoolevaluateUrl, proacceptdata, function (res) {
      if (res.data.flag == "1") {
        indexHref(that, "评价成功", "../../../working/index")
      } else if (res.data.flag == "-1") {
        timeout(that, "../../../login/index")
      } else {
        that.wetoast.toast({
          title: res.data.msg,
          duration: 1000
        });
      }

      console.log("评价成功", res.data)
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