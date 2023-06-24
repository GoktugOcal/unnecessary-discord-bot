const QuickChart = require('quickchart-js');

module.exports = {
    draw_totalDamageBreakdown: async function(stats) {
        const totalDamageChartBreakdown = new QuickChart();
        totalDamageChartBreakdown.setConfig({
            type: 'horizontalBar',
            data: {
                labels: stats["labelName"],
                datasets: [
                    {
                        label: 'Magic',
                        data: stats["magicDamageDealtToChampions"],
                        backgroundColor: 'royalblue'
                    },
                    {
                        label: 'Physical',
                        data: stats["physicalDamageDealtToChampions"],
                        backgroundColor: 'tomato'
                    },
                    {
                        label: 'True',
                        data: stats["trueDamageDealtToChampions"],
                        backgroundColor: 'khaki'
                        
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Total Damage Dealt to Champions'
                },
                responsive: true,
                scales: {
                    xAxes: [{
                    stacked: true // this should be set to make the bars stacked
                    }],
                    yAxes: [{
                    stacked: true // this also..
                    }]
                }
            },
            
        })
        .setWidth(800)
        .setHeight(800);
        const totalDamageChartBreakdownURL = await totalDamageChartBreakdown.getShortUrl();

        return totalDamageChartBreakdownURL
    },

    draw_deadTime: async function(stats) {
        const deadTime = new QuickChart();
        deadTime.setConfig({
            type: 'bar',
            data: {
                labels: stats["labelName"],
                datasets: [
                    {
                        label: 'Alive',
                        data: stats["totalTimeAlive"],
                        backgroundColor: 'lightskyblue'
                    },
                    {
                        label: 'Dead',
                        data: stats["totalTimeSpentDead"],
                        backgroundColor: 'darkorange'
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Total Time Spent Dead'
                },
                responsive: true,
                scales: {
                    xAxes: [{
                    stacked: true // this should be set to make the bars stacked
                    }],
                    yAxes: [{
                    stacked: true // this also..
                    }]
                }
            },
            
        })
        .setWidth(800)
        .setHeight(400);
        const deadTimeURL = await deadTime.getShortUrl();
        
        return deadTimeURL
    },

    draw_CCScore: async function(stats) {
        const CCScore = new QuickChart();
        CCScore.setConfig({
            type: 'bar',
            data: {
                labels: stats["labelName"],
                datasets: [
                    {
                        label: 'CCScore',
                        data: stats["timeCCingOthers"],
                        // backgroundColor: 'lightskyblue'
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'Crowd Control (CC) Score'
                },
                responsive: true,
                scales: {
                    x: {
                        ticks: {
                            fontColor: 'green',
                            color: [
                                'black',
                                'black',
                                'black',
                                'black',
                                'black',
                                'black',
                                'black',
                                'black',
                                'black',
                                'lightGreen',
                            ],
                          font: { size: 15 },
                        },
                      },
                },
                customCanvasBackgroundColor: {
                    color: 'lightGreen',
                },
                legend: {
                    display: false
                },
            },
            
        })
        .setWidth(800)
        .setHeight(400);
        const CCScoreURL = await CCScore.getShortUrl();
        
        return CCScoreURL
    },

    draw_KDAScore: async function(stats) {
        const KDAScore = new QuickChart();
        KDAScore.setConfig({
            type: 'bar',
            data: {
                labels: stats["labelName"],
                datasets: [
                    {
                        data: stats["kda"],
                        backgroundColor: 'BlueViolet'
                    }
                ]
            },
            options: {
                title: {
                    display: true,
                    text: 'KDA Score'
                },
                responsive: true,
                scales: {
                    xAxes: [{
                    stacked: true // this should be set to make the bars stacked
                    }],
                    yAxes: [{
                    stacked: true // this also..
                    }]
                },
                legend: {
                    display: false
                },
            },
            
        })
        .setWidth(800)
        .setHeight(400);
        const KDAScoreURL = await KDAScore.getShortUrl();
        
        return KDAScoreURL
    }
}