;(function(){
	'use strict';
var iMobile = {
    contant : {
        
    },
    constant : {

    },
    nav : {

    },
	loadDelay:function(obj,callback){
        var clear = setInterval(function(){
            if(typeof obj != "undefined"){
                callback();
                clearInterval(clear);
            }
        },1);
    },
    getUrlPara:function(strName){
        var strHref =  location.href;
        var intPos = strHref.indexOf("?");
        var strRight = strHref.substr(intPos + 1);
        var arrTmp = strRight.split("&");
        for(var i = 0; i < arrTmp.length; i++) {
            var arrTemp = arrTmp[i].split("=");
            if(arrTemp[0].toUpperCase() == strName.toUpperCase()) return decodeURI(arrTemp[1]);
        }
        return "";
    },
    progress : function (){
        var proDiv = $('.progress-list');
        proDiv.each(function(){
            var proWidth = $(this).find('.progress-x').data('proWidth');
            var proColor = $(this).find('.progress-x').data('proColor');
            $(this).find('.progress-x').css('background-color',proColor).animate({
                width:proWidth+'%'
            },1000);
            $(this).find('.pull-right').children('span').text(proWidth);
        })
        $('.internal').each(function(){
            var $width = $(this).data('scrollWidth');
            if($width>=100){
                $width=100;
            }
            $(this).animate({
                width:$width+'%'
            })
        })
        var studyDiv =$('.Course-schedule');
        studyDiv.each(function(){
            var proWidth = $(this).find('.progress-x').data('proWidth');
            var proColor = $(this).find('.progress-x').data('proColor');
            $(this).find('.progress-x').css('background-color',proColor).animate({
                width:proWidth+'%'
            },1000);
            $(this).children('.schedule').children('span').text(proWidth);
        })
    },
    include:function(id,url,data){
        $.ajax({
            async: false,
            dataType: 'html',
            type: 'get',
            url: url+"?ver="+ver,
            success: function (data){
                $("#"+id+"Include").html(data);
            }
        });
        this.template(id,data);
    },
    template:function(id,data){
        $("#"+id+"HTML").html( _.template($("#"+id+"JS").html(),data));
    },
    getLocalTime:function (nS){
//        var timestamp = nS.toString();
//        if(timestamp.length > 11){
//            timestamp = timestamp.substring(0,10);
//        }
//        return new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ").replace(/上午/g,'').replace(/下午/g,'').replace(/\//g,'-');
        if(nS == null){
            return '';
        }
        var timestamp = nS.toString();
        if(timestamp.length > 11){
            timestamp = timestamp.substring(0,10);
        }
        var format = 'yyyy-MM-dd h:m:s';
        var newDate = new Date(parseInt(timestamp) * 1000);
        var date = {
            "M+": newDate.getMonth() + 1,
            "d+": newDate.getDate(),
            "h+": newDate.getHours(),
            "m+": newDate.getMinutes(),
            "s+": newDate.getSeconds(),
            "q+": Math.floor((newDate.getMonth() + 3) / 3),
            "S+": newDate.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(("" + date[k]).length));
            }
        }
        var formatArr = format.split(" ");
        var time = formatArr[0]+' ';
        var formatArrs = formatArr[1].split(":");
        for(var i=0;i<formatArrs.length;i++){
            if(i>0){
                time+=':';
            }
            if(formatArrs[i].length == 1){
                time+='0'+formatArrs[i];
            }else{
                time+=formatArrs[i];
            }
        }
        return time;
    },
    getOpenCourseTime:function (nS){
        if(nS == null){
            return '';
        }
        var timestamp = nS.toString();
        if(timestamp.length > 11){
            timestamp = timestamp.substring(0,10);
        }
        var format = 'MM-dd h:m';
        var newDate = new Date(parseInt(timestamp) * 1000);

        var date = {
            "M+": newDate.getMonth() + 1,
            "d+": newDate.getDate(),
            "h+": newDate.getHours(),
            "m+": newDate.getMinutes(),
            "s+": newDate.getSeconds(),
            "q+": Math.floor((newDate.getMonth() + 3) / 3),
            "S+": newDate.getMilliseconds()
        };
        if (/(y+)/i.test(format)) {
            format = format.replace(RegExp.$1, (newDate.getFullYear() + '').substr(4 - RegExp.$1.length));
        }
        for (var k in date) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ('00' + date[k]).substr(("" + date[k]).length));
            }
        }
        var formatArr = format.split(" ");
        var format1 = formatArr[0].split("-");
        var time = format1[0] + "月" + format1[1] + "日" + ' ';
        var formatArrs = formatArr[1].split(":");
        for(var i=0;i<formatArrs.length;i++){
            if(i>0){
                time+=':';
            }
            if(formatArrs[i].length == 1){
                time+='0'+formatArrs[i];
            }else{
                time+=formatArrs[i];
            }
        }
        return time;
    },
    fnDate : function(){
        var date=new Date();
        var year=date.getFullYear();//当前年份
        var month=date.getMonth();//当前月份
        var data=date.getDate();//天
        var hours=date.getHours();//小时
        var minute=date.getMinutes();//分
        var second=date.getSeconds();//秒
        return year+"-"+this.fnW((month+1))+"-"+this.fnW(data)+" "+this.fnW(hours)+":"+this.fnW(minute)+":"+this.fnW(second);
    },
    fnW : function(str){
        var num;
        str>10?num=str:num="0"+str;
        return num;
    },
    filterHtml:function(str){
        var start_ptn = /<\/?[^>]*>/g;      //过滤标签开头      
        var end_ptn = /[ | ]*\n/g;            //过滤标签结束  
        var space_ptn = /&nbsp;/ig;          //过滤标签结尾
        var trim_ptn = /(^\s*)|(\s*$)/g     //过滤前后空格

        var c1 = str.replace(start_ptn,"").replace(end_ptn,"").replace(space_ptn,"").replace(trim_ptn,"");
        return c1;
    },
    cutstr:function (str, len){
        str=this.filterHtml(str);
        var str_length = 0;
        var str_len = 0;
        var str_cut = new String();
        str_len = str.length;
        for(var i = 0;i<str_len;i++)
        {
            var a = str.charAt(i);
            str_length++;
            if(escape(a).length > 4)
            {
                //中文字符的长度经编码之后大于4
                str_length++;
            }
            str_cut = str_cut.concat(a);
            if(str_length>=len)
            {
                str_cut = str_cut.concat("...");
                return str_cut;
            }
        }
        //如果给定字符串小于指定长度，则返回源字符串；
        if(str_length<len){
            return str;
        }
    },
    errorMsg:function(msg){
        if(msg == 'nologin'){
            //layer.msg(msg, function(){});
            $.cookie('User','',{expires: -1});
            $.cookie('token','',{expires: -1});
            window.location.href = '/login?loginRedirectUrl='+window.location.href;
        }else{
            layer.msg(msg, function(){});
        }
    },
    getChar:function(i){
        if(i >= 0 && i <= 26){
            return String.fromCharCode(65 + i);
        } else {
            alert('请输入数字');
        }
    },
    formatTime:function(second) {
        var str = [parseInt(second / 60 / 60), second / 60 % 60, second % 60].join(":").replace(/\b(\d)\b/g, "0$1");
        return str.substring(0,str.indexOf('.'));
    },
    formatSeconds:function(value) {
        var theTime = parseInt(value);// 秒
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        if(theTime > 60) {
            theTime1 = parseInt(theTime/60);
            theTime = parseInt(theTime%60);
            if(theTime1 > 60) {
                theTime2 = parseInt(theTime1/60);
                theTime1 = parseInt(theTime1%60);
            }
        }
        var result = "";
        if(theTime > 9) {
            result = parseInt(theTime);
        }else if(theTime > 0) {
            result = "0"+parseInt(theTime);
        }else{
            result = "00";
        }

        if(theTime2>0){
            theTime1=theTime1+theTime2*60;
        }

        if(theTime1 > 9) {
            result = parseInt(theTime1)+":"+result;
        }else if(theTime1 > 0) {
            result = "0"+parseInt(theTime1)+":"+result;
        }else{
            result = "00"+":"+result;
        }

        /*if(theTime1 > 0) {
            result = ""+parseInt(theTime1)+":"+result;
        }*/

        /*if(theTime2 > 0) {
            result = ""+parseInt(theTime2)+":"+result;
        }*/
        return result;
    },
    predata_Click:function(num)
    {
        var now = new Date();
        var n0=now.getYear()
        var y0=now.getMonth()+1
        var d0=now.getDate()
        var h0="0"+now.getHours();
        var m0="0"+now.getMinutes();
        var s0="0"+now.getSeconds();
        if(h0>9){h0=now.getHours()}
        if(m0>9){m0=now.getMinutes()}
        if(s0>9){s0=now.getSeconds()}
        var DaysToAdd=0;
        var DaysToAdd=DaysToAdd+1;
        var newdate=new Date(n0,y0,d0,h0,m0,s0);
        var newtimems=newdate.getTime()+(DaysToAdd*24*60*60*1000);
        newdate.setTime(newtimems);
        var xdate=newdate
        var newh="0"+xdate.getHours()
        var newm="0"+xdate.getMinutes()
        var news="0"+xdate.getSeconds()
        if(newh>9){newh=xdate.getHours()}
        if(newm>9){newm=xdate.getMinutes()}
        if(news>9){news=xdate.getSeconds()}
        //document.form.tb1.value=xdate.getYear()+"-"+xdate.getMonth()+"-"+xdate.getDate()+" "+newh+":"+newm+":"+news
        return xdate.getDate();
    },
    passdata_Click:function (num)
    {
        var now = new Date();
        var n0=now.getYear()
        var y0=now.getMonth()+1;
        var d0=now.getDate()
        var h0="0"+now.getHours();
        var m0="0"+now.getMinutes();
        var s0="0"+now.getSeconds();
        if(h0>9){h0=now.getHours()}
        if(m0>9){m0=now.getMinutes()}
        if(s0>9){s0=now.getSeconds()}
        var DaysToAdd=0;
        var DaysToAdd=DaysToAdd+num;
        var newdate=new Date(n0,y0,d0,h0,m0,s0);
        var newtimems=newdate.getTime()+(DaysToAdd*24*60*60*1000);
        newdate.setTime(newtimems);
        var xdate=newdate
        var newh="0"+xdate.getHours()
        var newm="0"+xdate.getMinutes()
        var news="0"+xdate.getSeconds()
        if(newh>9){newh=xdate.getHours()}
        if(newm>9){newm=xdate.getMinutes()}
        if(news>9){news=xdate.getSeconds()}
        return xdate.getDate();
        //document.form.tb1.value=xdate.getYear()+"-"+xdate.getMonth()+"-"+xdate.getDate()+" "+newh+":"+newm+":"+news
        // frame2.src="./search/yuliangmview.asp"
    },
    getDateStr:function(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        //return y+"-"+m+"-"+d;
        return d;
    },
    html_encode:function(str){
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&/g, "&amp;");
        s = s.replace(/</g, "&lt;");
        s = s.replace(/>/g, "&gt;");
        s = s.replace(/ /g, "&nbsp;");
        s = s.replace(/\'/g, "&#39;");
        s = s.replace(/\"/g, "&quot;");
        s = s.replace(/\n/g, "<br/>");
        return s;
    },
    html_decode:function(str){
        if(!str){
            return ""
        }
        var s = "";
        if (str.length == 0) return "";
        s = str.replace(/&amp;/g, "&");
        s = s.replace(/&lt;/g, "<");
        s = s.replace(/&gt;/g, ">");
        s = s.replace(/&nbsp;/g, " ");
        s = s.replace(/&#39;/g, "\'");
        s = s.replace(/&quot;/g, "\"");
        s = s.replace(/<br\/>/g, "\n");
        s = s.replace(/问题补充/ig,"<br/>问题补充:");
        return s;
    },
    accAdd:function(arg1, arg2) {
         var r1, r2, m, c;
         try {
                 r1 = arg1.toString().split(".")[1].length;
            }
         catch (e) {
                 r1 = 0;
             }
         try {
                 r2 = arg2.toString().split(".")[1].length;
             }
         catch (e) {
                 r2 = 0;
             }
         c = Math.abs(r1 - r2);
         m = Math.pow(10, Math.max(r1, r2));
         if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                         arg1 = Number(arg1.toString().replace(".", ""));
                         arg2 = Number(arg2.toString().replace(".", "")) * cm;
                     } else {
                       arg1 = Number(arg1.toString().replace(".", "")) * cm;
                        arg2 = Number(arg2.toString().replace(".", ""));
                     }
            } else {
                 arg1 = Number(arg1.toString().replace(".", ""));
                 arg2 = Number(arg2.toString().replace(".", ""));
             }
         return (arg1 + arg2) / m;
    },
    timeTurner:function(time){
        time = time.toString();
        if(time.indexOf(':') > 0 ){
            var times =  time.split(':');
            time = 0;
            if(times.length == 2){
                time = parseInt(times[1])+parseInt(times[0])*60;
            }else if(times.length == 3){
                time = parseInt(times[2])+parseInt(times[1])*60+parseInt(times[0])*60*60;
            }

        }else{
            time = parseInt(time);
        }
        return time;
    }
    
	}
	window.iMobile = iMobile;
})();