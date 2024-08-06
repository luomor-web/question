Page({
    data: {
        showAd: getApp().globalData.showAd,
        examTime: '29分59秒',
        examScore: 0,
        resultScore: 100,
        resultText: "通过",
        resultColor: "#07c160",// #ee0a24
        fullScore: 75,
        passScore: 53
    },
    onLoad(options) {
        //console.log(options);
        let pid = wx.getStorageSync('pid');
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
        let score = options.score;
        let cTime = options.time;
        let min = Math.floor(cTime / 60) < 10 ? '0' + Math.floor(cTime / 60) : Math.floor(cTime / 60) || 0;
        let s = (cTime % 60) < 10 ? '0' + cTime % 60 : cTime % 60 || 0;
        if(score >= this.data.passScore) {
            this.setData({
                resultText: "通过",
                resultColor: "#07c160",
            })
        } else {
            this.setData({
                resultText: "不通过",
                resultColor: "#ee0a24",
            })
        }
        this.setData({
            examScore: score,
            examTime: min + '分' + s + '秒'
        })
    },
    examAgain() {
        wx.redirectTo({
            url: '/pages/confirm/index',
        })
    },
    showExamRank() {
        wx.redirectTo({
            url: '/pages/rank/index',
        })
    }

})