const app = getApp();
const apis = app.apis;
const utils = app.utils;
Page({
    data:{
      showAd:getApp().globalData.showAd,
      questionList:[],
        historys:[],
        searchVal:'',
        label:'题库',
        pages:0,
        size:10,
        type:1,
        totalSize:0,
    },
    onLoad( ){ 
      this.init( );
      this.selectCategory();
      this.reloadHistory();
    },
    selectCategory(){
      let selectCategory = wx.getStorageSync('selectCategory') ;
      this.setData({
        selectCategory:selectCategory?selectCategory:'暂无'
      })
    },
    init( ){
      this.setData({
        totalSize:0,
        pages:0,
        questionList:[]
      })
    },
    actionSearch( ){
        const keyword = this.selectComponent('#searchText')
        let val = keyword.data.value;
        this.search(val);
    },
    onCofirmSearch(e){
        let val = e.detail;
        this.search(val);
    },
    reloadHistory: function() {
        try {
          var historys = wx.getStorageSync('historys' )
          if (historys) {
            this.setData({
              historys: JSON.parse(historys)
            });
          }
        } catch (e) {
        }
      },
    search(val){
      val = val.trim();
      if (!val) {
        utils.showWxToast('请输入搜索关键词');
        return;
      }
        let hs = [val.trim()];
        for (let h of this.data.historys) {
          if (h !== val ) {
              hs.push(h);
          }
          
        }
        wx.setStorageSync('historys' , JSON.stringify(hs));
        this.reloadHistory();
        this.searchData(0, val);
    },
    searchData(page, val,  emptyText){
      //console.log(val,this.data.searchVal)
      if (val==this.data.searchVal && page==this.data.pages ) {
         return;
      }else if(val!=this.data.searchVal){
        this.init();
        this.setData({
          searchVal: val,
        });
      }
      let pid = utils.getAnswerPid();
      let cid = utils.getAnswerCid();
      if (cid < 0) {
        utils.showWxToast('请先选择题库');
        return ;
      }
      wx.showLoading({
        title: '正在搜索请稍候',
      })
      
       
      let that = this;  
        let data = {
          pid: pid,
          cid: cid,
          uid: utils.getUserId(),
          keywords:val,
          page:page,
          size:this.data.size
        }
        apis.searchQuestion(data).then(res=>{
          wx.hideLoading( );
          let list = res.list;
          //console.log('search question res',res)
          if(list){
            that.setData({
              ['questionList[' + page + ']']
              :list,
              totalSize:res.totalSize,
              pages:page
          })
          }else if(emptyText){
            utils.showWxToast(emptyText);
          }
        })
       
    },
    onReachBottom(){
      if (!this.data.searchVal) {
        return;
      }
      let page = this.data.pages;
      page++;
      this.searchData(page,this.data.searchVal,'没有更多数据了')
      //console.log('reach bottom');
   },
    onTapHistory: function(e) {
        let val = e.detail; 
        this.searchData(0, val);
      },
      goQuestion(e){
        let id = e.currentTarget.dataset.id;
        //console.log(id)
        wx.navigateTo({
          url: '/pages/share/index?show=0&type=5&qid='+id,
        })
      },
    onShow(){ 
        if (typeof this.getTabBar === 'function' &&
            this.getTabBar()) {
              
            this.getTabBar().setData({
              active: 1,
            })
        }
        this.selectCategory();
      },
      onShareAppMessage(){
        return {
            title:'亲爱的，来这里答题喽',
            imageUrl:'',//图片样式
            path:''//链接
        }
    },
})