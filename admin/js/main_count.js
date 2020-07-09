// 发送ajax请求获取总文章数 新增文章 评论数
$.ajax({
    type: "get",
    url: "http://localhost:8089/api/v1/admin/data/info",
    success: function (backdata) {
        // console.log(backdata);
        $(".totalArticle em").text(backdata.totalArticle);
        $(".dayArticle em").text(backdata.dayArticle);
        $(".dayComment em").text(backdata.dayComment);
        $(".totalComment em").text(backdata.totalComment);
    }
})

// 发送ajax请求获取折线图的真实数据
$.ajax({
    type: "get",
    url: "http://localhost:8089/api/v1/admin/data/article",
    success: function (backdata) {
        // console.log(backdata);
        loadEchars(backdata);
    }
})


// var json = '{"code":200,"msg":"获取成功","date":[{"date":"2019-05-20","count":23},{"date":"2019-05-21","count":19},{"date":"2019-05-22","count":29},{"date":"2019-05-23","count":24},{"date":"2019-05-24","count":28},{"date":"2019-05-25","count":28},{"date":"2019-05-26","count":19},{"date":"2019-05-27","count":25},{"date":"2019-05-28","count":25}]}';
// var obj = JSON.parse(json);
// loadEchars(obj);

function loadEchars(obj) {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('curve_show'));

    var data = [];
    var date = [];
    for (var i = 0; i < obj.date.length; i++) {
        data.push(obj.date[i].count);
        date.push(obj.date[i].date);
    }

    option = {
        tooltip: {
            trigger: 'axis',
            position: function (pt) {
                return [pt[0], '10%'];
            }
        },
        title: {
            left: 'center',
            text: '月新增文章数',
        },

        xAxis: {
            name: '日',
            type: 'category',
            boundaryGap: false,
            data: date
        },
        legend: {
            data: ['新增文章'],
            top: '40'
        },
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                dataView: {
                    readOnly: false
                },
                magicType: {
                    type: ['line', 'bar']
                },
                restore: {},
                saveAsImage: {}
            },
            right: 50
        },
        yAxis: {
            type: 'value',
            boundaryGap: [0, '100%'],
            max: 40
        },
        series: [{
            name: '日增文章',
            type: 'line',
            smooth: true,
            // symbol: 'none',
            sampling: 'average',
            itemStyle: {
                color: '#f80'
            },
            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: 'rgba(255,136,0,0.39)'
                    }, {
                        offset: .34,
                        color: 'rgba(255,180,0,0.25)'
                    },
                    {
                        offset: 1,
                        color: 'rgba(255,222,0,0.00)'
                    }
                ])
            },
            data: data
        }],
    }
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
}
// 发送ajax请求各类型文章数量统计

new Promise((resolve, reject) => {

    $.ajax({
        type: "get",
        url: "http://localhost:8089/api/v1/admin/data/category",
        success: function (backdata) {
            // console.log(backdata);
            if (backdata.code == 200) {
                resolve(backdata.date);
                return;
            }
        }
    })
}).then((data) => {
    let dataList = [];
    let arrList = [];
    data.map((v) => {
        dataList.push(v.name)
    });
    data.map((v) => {
        v.value = v.articles
        delete v.articles
        arrList.push(v);
    })
    // console.log(dataList);
    // console.log(arrList);
    // 使用刚指定的配置项和数据显示图表。
    option1 = {
        title: {
            left: 'center',
            text: '分类文章数量比',
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
            type: 'scroll',
            orient: 'horizontal',
            top: 40,
            right: 20,
            left: 20,
            x: 'center',
            data: dataList,
        },
        color: ['#ffdb5c', '#ff9f7f', '#37a2da', '#32c5e9', '#67e0e3', "#fb7293", "#f66bbf",
            "#e690d1"
        ],
        series: [{
            name: '分类名称',
            type: 'pie',
            radius: ['28%', '55%'],
            center: ['50%', '58%'],
            avoidLabelOverlap: false,
            label: {
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
            data: arrList
        }]
    };
    myChart1.setOption(option1);
})

// 基于准备好的dom，初始化echarts实例
var myChart1 = echarts.init(document.getElementById('pie_show'));

// 基于准备好的dom，初始化echarts实例
var myChart2 = echarts.init(document.getElementById('column_show'));

// 发送ajax请求
$.ajax({
    type: "get",
    url: "http://localhost:8089/api/v1/admin/data/visit",
    success: function (backdata) {
        console.log(backdata);
        let mouthArr = [];
        let mouthVal = [];
        for (let key in backdata.data) {
            mouthArr.push(key);
            mouthVal.push(backdata.data[key])
        }
        option2 = {
            title: {
                left: 'center',
                text: '最近一周日访问量',
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: { // 坐标轴指示器，坐标轴触发有效
                    type: 'line' // 默认为直线，可选为：'line' | 'shadow'
                },

            },
            legend: {
                // data: ['爱生活', '趣美味', '爱旅行', '爱电影', '爱游泳'],
                top: 30
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [{
                type: 'category',
                data: mouthArr
            }],
            yAxis: [{
                type: 'value'
            }],
            color: ['#5885e8', '#13cfd5', '#00ce68', '#ff9565', '#20ff19'],
            series: [{
                data:mouthVal,
                type:"bar"
            }]
        };
        // 使用刚指定的配置项和数据显示图表。
        myChart2.setOption(option2);
    }
})