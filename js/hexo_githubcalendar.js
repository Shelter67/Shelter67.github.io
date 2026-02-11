function GithubCalendar(git_githubapiurl, git_color, git_user) {
    if (document.getElementById('github_container')) {
        var github_canlendar = (git_user, git_githubapiurl, git_color) => {
            var git_fixed = 'fixed';
            var git_px = 'px';
            var git_month = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
            var git_monthchange = [];
            var git_oneyearbeforeday = '';
            var git_thisday = '';
            var git_amonthago = '';
            var git_aweekago = '';
            var git_weekdatacore = 0;
            var git_datacore = 0;
            var git_total = 0;
            var git_datadate = '';
            var git_git_data = [];
            var git_positionplusdata = []; // 提示框坐标数组
            var git_firstweek = [];
            var git_lastweek = [];
            var git_beforeweek = [];
            var git_thisweekdatacore = 0;
            var git_mounthbeforeday = 0;
            var git_mounthfirstindex = 0;
            var git_crispedges = 'crispedges';
            var git_thisdayindex = 0;
            var git_amonthagoindex = 0;
            var git_amonthagoweek = [];
            var git_firstdate = [];
            var git_first2date = [];
            var git_montharrbefore = [];
            var git_monthindex = 0;

            var retinaCanvas = (canvas, context, ratio) => {
                if (ratio > 1) {
                    var canvasWidth = canvas.width;
                    var canvasHeight = canvas.height;
                    canvas.width = canvasWidth * ratio;
                    canvas.height = canvasHeight * ratio;
                    canvas.style.width = '100%';
                    canvas.style.height = canvasHeight + 'px';
                    context.scale(ratio, ratio);
                }
            }

            var responsiveChart = () => {
                if (document.getElementById("gitcanvas")) {
                    var git_tooltip_container = document.getElementById('git_tooltip_container');
                    var ratio = window.devicePixelRatio || 1
                    var git_x = '';
                    var git_y = '';
                    var git_span1 = '';
                    var git_span2 = '';
                    var github_calendar_c = document.getElementById("gitcanvas");
                    github_calendar_c.style.width = '100%';
                    github_calendar_c.style.height = '';
                    var github_calendar_ctx = github_calendar_c.getContext("2d");
                    
                    var box = document.getElementById("gitcalendarcanvasbox");
                    width = github_calendar_c.width = box.offsetWidth;
                    // 稍微增加高度比例，为日期留出垂直空间
                    height = github_calendar_c.height = 10 * 0.96 * github_calendar_c.width / git_data.length;
                    
                    retinaCanvas(github_calendar_c, github_calendar_ctx, ratio)
                    var linemaxwitdh = height / 10;
                    var lineminwitdh = 0.8 * linemaxwitdh;

                    // 【优化1】调整起始位置，Y轴预留更多空间给月份
                    var startY = 0.05 * width; 
                    var setposition = { x: 0.02 * width, y: startY };
                    
                    // 【优化2】核心：每次重绘前必须清空旧坐标，否则鼠标检测会乱跳
                    git_positionplusdata = []; 

                    for (var week in git_data) {
                        weekdata = git_data[week];
                        for (var day in weekdata) {
                            var dataitem = { date: weekdata[day].date, count: weekdata[day].count, x: setposition.x, y: setposition.y };
                            git_positionplusdata.push(dataitem);

                            github_calendar_ctx.fillStyle = git_thiscolor(git_color, weekdata[day].count);
                            // 绘制格子
                            github_calendar_ctx.fillRect(setposition.x, setposition.y, lineminwitdh, lineminwitdh);
                            setposition.y = setposition.y + linemaxwitdh
                        }
                        setposition.y = startY;
                        setposition.x = setposition.x + linemaxwitdh;
                    }

                    // 【优化3】月份与周几文字的精准定位
                    if (document.body.clientWidth > 700) {
                        github_calendar_ctx.font = "500 12px -apple-system, sans-serif";
                        github_calendar_ctx.fillStyle = '#999';
                        github_calendar_ctx.textBaseline = "top";
                        
                        // 周几
                        github_calendar_ctx.fillText("日", 0, startY + 0 * linemaxwitdh);
                        github_calendar_ctx.fillText("二", 0, startY + 2 * linemaxwitdh);
                        github_calendar_ctx.fillText("四", 0, startY + 4 * linemaxwitdh);
                        github_calendar_ctx.fillText("六", 0, startY + 6 * linemaxwitdh);

                        // 月份文字位置上移，避免被格子挡住
                        var monthindexlist = github_calendar_c.width / 24;
                        for (var index in git_monthchange) {
                            github_calendar_ctx.fillText(git_monthchange[index], monthindexlist, 0.1 * linemaxwitdh);
                            monthindexlist = monthindexlist + github_calendar_c.width / 12.5;
                        }
                    }

                    // 【优化4】鼠标交互检测逻辑
                    var getMousePos = (canvas, event) => {
                        var rect = canvas.getBoundingClientRect();
                        // 修正 Canvas 缩放后的坐标转换
                        var x = (event.clientX - rect.left) * (canvas.width / rect.width) / ratio;
                        var y = (event.clientY - rect.top) * (canvas.height / rect.height) / ratio;
                        
                        for (var item of git_positionplusdata) {
                            if (x > item.x && x < item.x + lineminwitdh && y > item.y && y < item.y + lineminwitdh) {
                                git_span1 = item.date;
                                git_span2 = item.count;
                                git_x = event.clientX - 100;
                                git_y = event.clientY - 70;
                                var html = tooltip_html(git_x, git_y, git_span1, git_span2);
                                append_div_gitcalendar(git_tooltip_container, html);
                                return; // 找到后立即退出循环
                            }
                        }
                    }

                    github_calendar_c.onmousemove = function (event) {
                        git_tooltip_container.innerHTML = "";
                        getMousePos(github_calendar_c, event);
                    };
                }
            }

            // --- 核心逻辑函数保持插件原始结构 ---
            var addlastmonth = () => {
                if (git_thisdayindex === 0) {
                    [52, 51, 50, 49, 48].forEach(idx => thisweekcore(idx));
                    git_thisweekdatacore += git_firstdate[6].count;
                    git_amonthago = git_firstdate[6].date;
                } else {
                    [52, 51, 50, 49].forEach(idx => thisweekcore(idx));
                    thisweek2core();
                    git_amonthago = git_first2date[git_thisdayindex - 1].date;
                }
            }

            var thisweek2core = () => {
                for (var i = git_thisdayindex - 1; i < git_first2date.length; i++) {
                    git_thisweekdatacore += git_first2date[i].count
                }
            }

            var thisweekcore = (index) => {
                if(git_data[index]) {
                    for (var item of git_data[index]) {
                        git_thisweekdatacore += item.count
                    }
                }
            }

            var addlastweek = () => {
                for (var item of git_lastweek) {
                    git_weekdatacore += item.count
                }
            }

            var addbeforeweek = () => {
                for (var i = git_thisdayindex; i < git_beforeweek.length; i++) {
                    git_weekdatacore += git_beforeweek[i].count
                }
            }

            var addweek = (data) => {
                if (git_thisdayindex === 6) {
                    git_aweekago = git_lastweek[0].date;
                    addlastweek()
                } else {
                    var lastweek_data = data.contributions[51];
                    git_aweekago = lastweek_data[git_thisdayindex + 1].date;
                    addlastweek();
                    addbeforeweek();
                }
            }

            fetch(git_githubapiurl).then(res => res.json()).then(data => {
                if (document.getElementById('github_loading')) {
                    document.getElementById('github_loading').remove()
                };
                git_data = data.contributions;
                git_total = data.total;
                git_first2date = git_data[48];
                git_firstdate = git_data[47];
                git_firstweek = data.contributions[0];
                git_lastweek = data.contributions[52];
                git_beforeweek = data.contributions[51];
                git_thisdayindex = git_lastweek.length - 1;
                git_thisday = git_lastweek[git_thisdayindex].date;
                git_oneyearbeforeday = git_firstweek[0].date;
                git_monthindex = parseInt(git_thisday.substring(5, 7));
                
                var tempMonth = [...git_month];
                git_montharrbefore = tempMonth.splice(git_monthindex % 12, 12);
                git_monthchange = git_montharrbefore.concat(tempMonth).slice(0, 12);
                
                addweek(data);
                addlastmonth();
                var html = github_main_box(git_monthchange, git_data, git_user, git_color, git_total, git_thisweekdatacore, git_weekdatacore, git_oneyearbeforeday, git_thisday, git_aweekago, git_amonthago);
                append_div_gitcalendar(github_container, html);
                responsiveChart()
            }).catch(e => console.error(e));

            window.onresize = () => responsiveChart();
            
            var git_thiscolor = (color, x) => {
                if (x === 0) return color[0];
                if (x < 2) return color[1];
                if (x < 20) return color[Math.min(parseInt(x / 2), 9)];
                return color[9];
            };

            var tooltip_html = (x, y, span1, span2) => {
                return `<div class="gitmessage" style="top:${y}px;left:${x}px;position:fixed;z-index:10000">
                    <div class="angle-wrapper"><span>${span1}&nbsp;</span><span>${span2} 次上传</span></div>
                </div>`;
            };

            var github_canvas_box = () => {
                return '<div id="gitcalendarcanvasbox"><canvas id="gitcanvas"></canvas></div>';
            };

            var github_info_box = (user, color) => {
                return `<div id="git_tooltip_container"></div>
                <div class="contrib-footer clearfix mt-1 mx-3 px-3 pb-1">
                    <div class="float-left text-gray">数据来源 <a href="https://github.com/${user}" target="blank">@${user}</a></div>
                    <div class="contrib-legend text-gray">Less <ul class="legend">
                        ${[0,2,4,6,8].map(i => `<li style="background-color:${color[i]}"></li>`).join('')}
                    </ul> More </div>
                </div>`;
            };

            var github_main_box = (monthchange, git_data, user, color, total, thisweek, week, start, end, aweek, amonth) => {
                var style = github_main_style();
                return `<div class="position-relative">
                    <div class="border py-2 graph-before-activity-overview">
                        <div class="js-gitcalendar-graph mx-md-2 mx-3 d-flex flex-column pt-1 graph-canvas gitcalendar-graph text-center">
                            ${github_canvas_box()}
                        </div>
                        ${github_info_box(user, color)}
                    </div>
                </div>
                <div class="contrib-stats-box">
                    <div class="contrib-column table-column"><span class="text-muted">过去一年提交</span><span class="contrib-number">${total}</span><span class="text-muted">${start} - ${end}</span></div>
                    <div class="contrib-column table-column"><span class="text-muted">最近一月提交</span><span class="contrib-number">${thisweek}</span><span class="text-muted">${amonth} - ${end}</span></div>
                    <div class="contrib-column table-column"><span class="text-muted">最近一周提交</span><span class="contrib-number">${week}</span><span class="text-muted">${aweek} - ${end}</span></div>
                </div>${style}`;
            };

            var github_main_style = () => {
                return `<style>
                    #github_container{text-align:center;width:100%;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Arial,sans-serif;}
                    .contrib-legend{float:right;font-size:11px;}
                    .legend{display:inline-block;list-style:none;margin:0 5px;padding:0;}
                    .legend li{display:inline-block;width:10px;height:10px;border-radius:2px;margin:0 1px;}
                    .contrib-stats-box{display:flex;width:100%;padding-top:10px;border-top:1px solid #eee;}
                    .contrib-column{flex:1;padding:15px 10px;text-align:center;position:relative;}
                    .contrib-column::before{content:"";position:absolute;top:20%;left:0;height:60%;width:1px;background:linear-gradient(to bottom, transparent, #d1d5da, transparent);}
                    .contrib-column:first-child::before{display:none;}
                    .contrib-number{font-weight:600;font-size:22px;display:block;color:#24292e;margin:2px 0;}
                    .text-muted{font-size:11px;color:#6a737d;display:block;}
                    .angle-wrapper{background:rgba(255,255,255,0.98);box-shadow:0 4px 12px rgba(0,0,0,0.15);border:1px solid #e1e4e8;border-radius:6px;padding:8px 12px;color:#24292e;font-size:12px;}
                </style>`;
            };
        };

        var append_div_gitcalendar = (parent, text) => {
            var temp = document.createElement('div');
            temp.innerHTML = text;
            while (temp.firstChild) parent.appendChild(temp.firstChild);
        };

        github_canlendar(git_user, git_githubapiurl, git_color);
    }
}