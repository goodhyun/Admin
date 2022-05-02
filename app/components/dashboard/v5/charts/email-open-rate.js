import Component from '@glimmer/component';
import {action} from '@ember/object';
import {inject as service} from '@ember/service';

export default class EmailOpenRate extends Component {
    @service dashboardStats;
    @service feature;

    /**
     * Call this method when you need to fetch new data from the server. 
     */
    @action
    loadCharts() {
        // The dashboard stats service will take care or reusing and limiting API-requests between charts
        this.dashboardStats.loadEmailOpenRateStats();
    }
    
    get currentOpenRate() {
        if (this.dashboardStats.emailOpenRateStats === null || this.dashboardStats.emailOpenRateStats.length === 0) {
            return '-';
        }

        return this.dashboardStats.emailOpenRateStats[this.dashboardStats.emailOpenRateStats.length - 1].openRate;
    }

    get loading() {
        return this.dashboardStats.emailOpenRateStats === null;
    }

    get chartType() {
        return 'bar';
    }

    get chartData() {
        const stats = this.dashboardStats.emailOpenRateStats;
        const labels = stats.map(stat => stat.subject);
        const data = stats.map(stat => stat.openRate);

        return {
            labels,
            datasets: [{
                data,
                fill: false,
                backgroundColor: '#14B8FF',
                cubicInterpolationMode: 'monotone',
                barThickness: 18,
                minBarLength: 4
            }]
        };
    }

    get chartOptions() {
        return {
            responsive: true,
            maintainAspectRatio: false,
            title: {
                display: false
            },
            legend: {
                display: false
            },
            hover: {
                onHover: function (e) {
                    e.target.style.cursor = 'pointer';
                }
            },
            tooltips: {
                intersect: false,
                mode: 'index',
                displayColors: false,
                backgroundColor: '#15171A',
                xPadding: 7,
                yPadding: 7,
                cornerRadius: 5,
                caretSize: 7,
                caretPadding: 5,
                bodyFontSize: 12.5,
                titleFontSize: 12,
                titleFontStyle: 'normal',
                titleFontColor: 'rgba(255, 255, 255, 0.7)',
                titleMarginBottom: 3
            },
            scales: {
                yAxes: [{
                    gridLines: {
                        drawTicks: false,
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        display: false,
                        maxTicksLimit: 5,
                        fontColor: '#7C8B9A',
                        padding: 8,
                        precision: 0
                    }
                }],
                xAxes: [{
                    gridLines: {
                        color: this.feature.nightShift ? 'rgba(200, 204, 217, 0.25)' : 'rgba(200, 204, 217, 0.85)',
                        borderDash: [4,4],
                        display: true,
                        drawBorder: true,
                        drawTicks: false,
                        zeroLineWidth: 1,
                        zeroLineColor: this.feature.nightShift ? 'rgba(200, 204, 217, 0.25)' : 'rgba(200, 204, 217, 0.85)',
                        zeroLineBorderDash: [4,4]
                    },
                    ticks: {
                        display: false,
                        maxTicksLimit: 5,
                        autoSkip: true,
                        maxRotation: 0,
                        minRotation: 0
                    }
                }]
            }
        };
    }

    get chartHeight() {
        return 125;
    }
}
