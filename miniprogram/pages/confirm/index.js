Page({
    data: {
        showAd: getApp().globalData.showAd,
        selectCategory: '',
        questionNum: 75,
        fullScore: 75,
        passScore: 53
    },
    onLoad() {
        //TODO 关于题库不足100题时答题提示的问题
        this.init();
    },

    init() {
        let selectCategory = wx.getStorageSync('selectCategory');
        /*
        if (selectCategory.indexOf('>') > -1 ) {
            selectCategory=selectCategory.substring(selectCategory.indexOf('>')+1);
        }
        if (selectCategory.indexOf('>') > -1 ) {
            selectCategory=selectCategory.substring(selectCategory.indexOf('>')+1);
        }
        */
        let pid = wx.getStorageSync('pid');
        this.setData({ selectCategory: selectCategory })
        if(pid == 3) {
            this.setData({
                questionNum: 75,
                fullScore: 75,
                passScore: 53,
            })
        } else if(pid == 4) {
            this.setData({
                questionNum: 50,
                fullScore: 50,
                passScore: 30,
            })
        } else {
            this.setData({
                questionNum: 100,
                fullScore: 100,
                passScore: 60,
            })
        }
    },
    startExam() {
        let cid = wx.getStorageSync('pid');
        this.go('question', 'cid=' + cid + '&type=7');
    },
    go(url, params) {
        wx.redirectTo({
            url: '/pages/' + url + '/index?' + params
        });
    },
    exportExam() {
        this.go('exportq', 'type=1')
    }


})