// index.js
// 获取应用实例
const app = getApp()
const apis = app.apis;
const utils = app.utils;
var selector = require('../../components/selector/index.js')
import Dialog from '../../components/vant/dialog/dialog';
var show = false;
var item = {};
Page({
  data: {
    questionCount: 0,
    changeCategory: '切换题库',
    selectCategory: '',
    showNoMore: false,
    noMoreTips: "很抱歉给您带来困扰，目前不能继续为您提供服务",
    item: {
      show: show
    },
    selectData: {
      province: '',
      city: '',
      country: '',
      firstId: 0,
      secondId: 0,
      thirdId: 0
    }
  },
  // 事件处理函数
  onReady: function (e) {
    var that = this;
    apis.getQuestionMenu(0).then(res => {
      console.log('menu info ', res);
      selector.updateAreaData(that, 0, e, res);
      let selectData = wx.getStorageSync('selectData')
      if(selectData) {

      } else {
        // {"code":0,"data":[{"children":[{"children":[{"children":[],"id":5,"name":"風險及保險"},{"children":[],"id":6,"name":"法律原則"},{"children":[],"id":7,"name":"保險原則"},{"children":[],"id":8,"name":"保險公司的主要功能"},{"children":[],"id":9,"name":"香港保險業結構"},{"children":[],"id":10,"name":"保險業規管架構"},{"children":[],"id":11,"name":"職業道德及其他有關問題"}],"id":3,"name":"卷一"},{"children":[],"id":4,"name":"卷三"}],"id":1,"name":"香港保险考题"},{"children":[],"id":2,"name":"大陆保险考题"}],"message":"success"}
        let selectData = {
          province: "香港保险考题",
          city: "卷一",
          country: "全部",
          firstId: 1,
          secondId: 3,
          thirdId: 0
        }
    
        wx.setStorageSync('selectData', selectData)
        this.confirmSelect();
      }
    });
  },
  hiddenFloatView: function (e) {
    selector.animationEvents(this, 200, false, 400);
  },
  initQuestionCount(pid, cid) {
    if (cid < 0) {
      return;
    }
    let that = this;
    let data = {
      pid: pid,
      cid: cid
    }
    apis.getQuestionCount(data).then(res => {
      res = res || 0;
      that.setData({
        questionCount: res
      })
    })
  },
  confirmSelect: function (e) {
    console.log(e);
    selector.animationEvents(this, 200, false, 400);
    let selectData = wx.getStorageSync('selectData')
    console.log(selectData)
    //wx.removeStorageSync('selectData')
    let cid = 0;
    let pid = 0;
    if (selectData.thirdId >= 0) {
      cid = selectData.thirdId;
      pid = selectData.secondId;
    } else if (selectData.secondId) {
      cid = selectData.secondId;
      pid = selectData.secondId;
    } else {
      cid = selectData.firstId;
      pid = selectData.firstId;
    }
    let selectCategory = '';
    if (selectData.firstId) {
      selectCategory = selectData.province;
    }
    if (selectData.secondId) {
      selectCategory += '>' + selectData.city;
    }
    if (selectData.thirdId >= 0) {
      selectCategory += '>' + selectData.country;
    }
    utils.showWxToast(selectCategory);
    if (selectCategory) {
      wx.setStorageSync('selectCategory', selectCategory)
      this.setData({
        selectCategory: selectCategory
      })
    }

    console.log(pid + " " + cid);
    if (cid >= 0) {
      wx.setStorageSync('cid', cid);
      this.initQuestionCount(pid, cid);
    }
    if (pid) {
      wx.setStorageSync('pid', pid);
    }
  },
  bindChange: function (e) {
    selector.updateAreaData(this, 1, e);
    item = this.data.item;
    console.log(item)
    let first = item.provinces[item.value[0]];
    let second = item.citys[item.value[1]] || {};
    let third = item.countys[item.value[2]] || {};
    utils.showWxToast(third.name);
    let selectData = {
      province: first.name,
      city: second.name,
      country: third.name,
      firstId: first.id,
      secondId: second.id,
      thirdId: third.id
    }

    wx.setStorageSync('selectData', selectData)
  },
  onLoad(options) {
    options = options || {}
    let inviteUid = options.uid || 0;
    this.init(inviteUid);
    this.initNotice();
    this.initShowAd();
  },
  init(inviteUid) {
    let changeCategory = '';
    let selectCategory = wx.getStorageSync('selectCategory');
    if (selectCategory) {
      changeCategory = '切换题库';
    } else {
      changeCategory = '选择题库';
      selectCategory = '暂无';
    }
    this.setData({
      selectCategory: selectCategory,
      changeCategory: changeCategory
    })

    let uid = this.getUserId();
    if (uid) {
      this.initUserInfo(uid);
    } else {
      this.initUserId(inviteUid);
    }
    this.initQuestionCount(utils.getAnswerPid(), utils.getAnswerCid());
  },
  initUserInfo(uid) {
    let data = {
      uid: uid
    }
    const vm = this;
    console.log(data)
    apis.getUserInfo(data).then(res => {
      wx.setStorageSync('userInfo', res)
      vm.checkCellphone();
    })
  },
  checkCellphone() {
    const vm = this;
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo) {
      return;
    }
    if(this.data.showNoMore) {
      return;
    }
    // get cellphone
    if(userInfo.cellphone && userInfo.cellphone != "") {
        
    } else {
        // request mobile
        Dialog.confirm({
            context: vm,
            selector: '#van-dialog',
            title: '港险刷题',
            message: '为了数据安全及个性化题库，需要用户手机号，请前往下方“我的”绑定手机号',
            confirmButtonText: '去绑定',
            cancelButtonText: '取消',
        })
            .then(() => {
                // on confirm
                wx.switchTab({
                    url: "/pages/my/index"
                });
            })
            .catch(() => {
                // on cancel
                this.setData({
                    noMoreTips: "很抱歉给您带来困扰，目前不能继续为您提供服务",
                    showNoMore: true
                });
            });
      }
  },
  onCloseNoMore() {

  },
  onHide:function() {
    this.setData({
        showNoMore: false
    })
  },
  initShowAd() {
    let data = { uid: utils.getUserId() }
    apis.initShowAd(data).then(res => {
      let showAd = res || 0;
      utils.setShowAd(showAd);
    })
  },
  initNotice() {
    let data = { uid: utils.getUserId() }
    apis.getNotifyInfo(data).then(res => {
      let showConfirmButton = 1;
      if (res) {
        let currentIndex = utils.getNotifyIndex();
        let newIndex = res.id;
        if (!res.stopService && !res.forbidden && currentIndex >= newIndex) {
          return false;
        }
        utils.setNotifyIndex(newIndex);
        if (res.stopService || res.forbidden) {
          showConfirmButton = 0;
        }

        Dialog.alert({
          title: res.title,
          message: res.message,
          showConfirmButton: showConfirmButton,
          theme: 'round-button'
        }).then((e) => {

        });

      }
    })

  },
  goQuestion(type) {
    let cid = wx.getStorageSync('cid');
    if (cid >= 0) {
      this.setAnswerType(type)
      if (this.data.questionCount == 0) {
        utils.showWxToast('题库题数量为0，请切换题库。');
        return false;
      }
      //跳转
      // type 1 答题 2 错题  3 收藏 4 模拟考试
      if (type == 4) {
        this.go('confirm');
      } else if(type == 7) {
        this.go('confirm');
      } else if (type == 3) {
        this.go('favorite');
      } else if (type == 2) {
        this.go('wrong');
      } else {
        this.go('question');
      }
    } else {
      utils.showWxToast('暂未选择题库，请先选择。');

      return false
    }
  },
  startAnswer() {
    this.goQuestion(1);
  },
  setAnswerType(type) {
    return utils.setAnswerType(type);
  },
  wrongCollect() {
    this.goQuestion(2);
  },
  favoriteShow() {
    this.goQuestion(3);
  },
  chooseCategory() {
    selector.animationEvents(this, 0, true, 400);
  },
  startExam() {
    let _this = this;
    let userInfo = this.getUserInfo();
    if (userInfo) {
      // this.goQuestion(4);
      this.goQuestion(7);
    } else {
      wx.showModal({
        title: '温馨提示',
        content: '模拟考试需要完善资料，完善资料后可以使用答题排名同步信息等功能',
        success(res) {
          //如果用户点击了确定按钮
          if (res.confirm) {
            _this.gotoProfile();
          } else if (res.cancel) {
            //如果用户点击了取消按钮
            //console.log(3);
            wx.showToast({
              title: '您拒绝了请求,不能正常使用小程序',
              icon: 'error',
              duration: 2000
            });
            return;
          }
        }
      });
    }
  },
  gotoProfile() {
    wx.navigateTo({
      url: '/pages/my/profile',
    })
  },
  initUserProfile() {
    let _this = this;
    wx.getUserProfile({
      desc: '获取您的昵称、头像',
      success: res => {
        let userInfo = res.userInfo;
        _this.setData({ userInfo: userInfo });

        wx.setStorageSync("userInfo", userInfo)
        userInfo.uid = _this.getUserId();
        apis.updateUser(userInfo).then(res => {
          //console.log('updateUser', res);
          if (res) {
            utils.showWxToast('授权成功');
          } else {
            utils.showWxToast('授权失败，请去关于我们页面联系管理员');
          }
        })
      },
      fail: res => {
        //拒绝授权
        wx.showToast({
          title: '您拒绝了请求,不能答题排名等功能',
          icon: 'error',
          duration: 2000
        });
        return;
      }
    });
  },

  initUserId(inviteUid) {
    //console.log('准备登录')
    const vm = this;
    wx.showLoading({
      'title': '正在初始化，请稍候...',
      'mask': true
    });
    wx.login({
      success(res) {
        console.log(res)
        let data = {
          inviteUid: inviteUid,
          code: res.code,
          appId: app.appId
        }
        if (res.code) {
          apis.userLogin(data).then(res => {
            wx.hideLoading();
            wx.setStorageSync('uid', res.userId)
            wx.setStorageSync('userToken', res.token)
            wx.setStorageSync('userInfo', res.userInfo)
            vm.checkCellphone();
          });
        }
      },
      fail(res) {
        wx.hideLoading();
        console.log(res)
      }
    });
  },
  // 跳转
  go(url, params) {
    let gourl = '';
    if (params) {
      gourl = '/pages/' + url + '/index?' + params;
    } else {
      gourl = '/pages/' + url + '/index';
    }
    wx.navigateTo({
      url: gourl
    });
  },
  signin() {
    this.go('signin')
  },
  getUserId() {
    let uid = wx.getStorageSync('uid');
    return uid;
  },
  getUserInfo() {
    let userInfo = wx.getStorageSync('userInfo');
    return userInfo;
  },
  showExamRank() {
    this.go('rank');
  },
  onShareAppMessage() {
    return {
      title: '亲爱的，来这里答题喽',
      imageUrl: '',//图片样式
      path: ''//链接
    }
  },
  onShow() {
    this.checkCellphone();
    if (typeof this.getTabBar === 'function' &&
      this.getTabBar()) {

      this.getTabBar().setData({
        active: 0,
      })
    }
  },
  todayQuestion() {
    wx.navigateTo({
      url: '/pages/share/index?type=6&show=0&qid=1',
    })
  }
})
