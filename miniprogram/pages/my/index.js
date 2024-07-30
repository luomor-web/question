const app = getApp();
const apis = app.apis;
const utils = app.utils;
Page({
    data: {
        userInfo: {},
        phoneBtnShow: true
    },

    gotoProfile() {
        wx.navigateTo({
            url: '/pages/my/profile',
        })
    },
    // 去登陆
    toLogin() {
        let _this = this
        wx.getUserProfile({
            desc: '获取你的昵称、头像、地区及性别',
            success: res => {
                let userInfo = res.userInfo;
                _this.setData({
                    userInfo: userInfo
                })
                wx.setStorageSync("userInfo", userInfo)
                userInfo.uid = _this.getUserId();
                apis.updateUser(userInfo).then(res => {
                    //console.log('updateUser', res);
                    if (res) {
                        utils.showWxToast('授权成功');
                    } else {
                        utils.showWxToast('授权失败，请去联系管理员');
                    }
                });

            },
            fail: res => {
                //拒绝授权
                wx.showToast({
                    title: '您拒绝了请求,不能使用答题排名等功能',
                    icon: 'error',
                    duration: 2000
                });
                return;
            }
        });
    },
    onLoad() {

    },
    aboutMe() {
        wx.navigateTo({
            url: '/pages/about/index',
        })
    },
    openOther() {
        wx.navigateTo({
            url: '/pages/other/index',
        })
    },
    // 清除缓存
    clearCache() {
        this.setData({ userInfo: {} })
        wx.removeStorageSync("userInfo");
        wx.showToast({
            title: '清除成功',
            icon: 'none',
            duration: 2000
        })
    },
    goIntegral() {
        let data = { uid: utils.getUserId() }
        apis.getMyIntegral(data).then(res => {
            res = res || 0;
            wx.navigateTo({
                url: '/pages/integral/index?integral=' + res,
            })
        })
    },
    // 帮助
    help() {
        wx.navigateTo({
            url: '/pages/help/index'
        })
    },
    getUserId() {
        let uid = wx.getStorageSync('uid');
        return uid;
    },
    onShow() {
        let userInfo = wx.getStorageSync('userInfo');
        this.setData({ userInfo: userInfo })
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {

            this.getTabBar().setData({
                active: 3,
            })
        }
    },
    bindCellphone(e) {
        if (e.detail.errMsg !== "getPhoneNumber:ok") {
            // 拒绝授权
            return;
          }
      
          let uid = utils.getUserId();
          if (!uid) {
            wx.showToast({
              title: '绑定失败：请先登录',
              icon: 'none',
              duration: 2000
            });
            return;
          }
      
          let data = {
            iv: e.detail.iv,
            encryptedData: e.detail.encryptedData,
            uid: uid,
            appId: app.appId
          }
          apis.bindCellphone(data).then(res => {
            console.log(res);
            let userInfo = wx.getStorageSync('userInfo');
            let cellphone = res.cellphone;
            wx.setStorageSync('cellphone', cellphone);
            wx.showToast({
                title: '绑定手机号码成功',
                icon: 'success',
                duration: 2000
            });
          });
    },
    invite() {
        wx.navigateTo({
            url: '/pages/share/invite'
        })
    }
})