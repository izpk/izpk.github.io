define([],function(){
	'user strict';
	return {

		getThat : function(e){
			return $(e.currentTarget);
		},
    getTemplate : function(obj,data){
      var compiled = _.template(obj);
      return compiled(data);
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
		loading : function(dom,args){
			var style = '';
			if(args){
				for(var i in args){
					style += i +':' + args[i] + ';'
				}
			}
			$(dom).html('<div class="loader-box" style="'+style+'"><div class="loader">加载中。。。</div></div>');
			
		},
		iScroll : function(dom){
			if($(dom).length){
				var myScroll = new IScroll(dom, {
					probeType: 3,
					mouseWheel: true,
					//speedRatioY : 200,
					scrollbars: 'custom',
					interactiveScrollbars: true,
					shrinkScrollbars: 'scale',
					//fadeScrollbars: true
				});
				var scrollShadow = true;
				myScroll.on('scroll', function(){
					if(this.y){
						if(scrollShadow){
							$(dom).append('<span class="wrapper-shadow"></span>');
							scrollShadow = false;
						}
						
					}else{
						$(dom).find('.wrapper-shadow').remove();
						scrollShadow = true;
					}
					//console.log(this)
					// console.log(this)
					// console.log(this.currentPage)
					// console.log(this.y)
					// this.scrollBy(0, 50);
				});
				// myScroll.on('scrollEnd', function(){
				// 	console.log(this)
				// });
				// myScroll.on('scrollEnd', function () {
				// 	console.log(this.hasVerticalScroll)
				//   console.log(this.options.invertWheelDirection)
				// });
				return myScroll;
			}
			
			// window.CAICUI.myScroll = new IScroll('body #wrapper', { 
			// 	probeType: 3,
			// 	mouseWheel: true,
			// 	scrollbars: 'custom',
			// });
			// window.CAICUI.myScroll.on('scroll', function(){
			// 	console.log(this.y)
			// });
			// myScroll.on('scrollEnd', updatePosition);
			//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
		},
		getDate : function(str,connector){
			if(str == null){
			    return '';
			}
			var timestamp = str.toString();
			if(timestamp.length > 11){
			    timestamp = timestamp.substring(0,10);
			}
			var format = 'yyyy/MM/dd';
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
			return format;
		},
		getLocalTime:function (str,connector){
            if(str == null){
                return '';
            }
            var timestamp = str.toString();
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
        canvasRound : function(dom){
        	var canvas = document.getElementById(dom);
        	if(canvas && canvas.getContext){
        		var width = canvas.width;
        		var height = canvas.height;
        		var progress = canvas.getAttribute('data-progress');
        		if(progress==0){
        			return false;
        		}
        		var cxt=canvas.getContext("2d");
    				var canvasTimerTotal = 20;
    				var canvasNum = 1;
    				var canvasTimer = setInterval(function(){
    					if(canvasNum>canvasTimerTotal){
    						clearInterval(canvasTimer);
    					}else{
    						cxt.clearRect(0, 0, width, height) 
    						var endRad = Math.PI*(( ( (progress/canvasTimerTotal)*canvasNum ) /100)*2-0.5);
    						cxt.beginPath();
    						cxt.arc(width/2,height/2,(width/2)-1,1.5*Math.PI,endRad,false);
    						cxt.lineWidth = 2;
    						cxt.strokeStyle='#fff';
    						cxt.stroke();
    						cxt.closePath();
    					}
    					canvasNum++;
    				},40);
    				
        	}
        },
        stringData : function ($_data){
            $_data = parseInt($_data);
            var $_return_string = '1分钟前';
            var $_timestamp=parseInt(new Date().getTime()/1000);
            var $_reste = $_timestamp - $_data;
            if($_reste<0){
            	$_reste = 1;
            }
            // if($_reste<60){
            //     $_return_string = $_reste+'秒前';
            // }else 
           	// if($_reste>=60 && $_reste <3600){
           	if($_reste <3600){
                $_return_string = Math.ceil($_reste/60)+'分钟前';
            }else if($_reste>=3600 && $_reste <(3600*24)){
                $_return_string = Math.ceil($_reste/3600)+'小时前';
            }else if($_reste>=(3600*24) && $_reste <(3600*24*30)){
                $_return_string = Math.ceil($_reste/(3600*24))+'天前';
            }else if($_reste>=(3600*24*30) && $_reste <(3600*24*30*12)){
                $_return_string = Math.ceil($_reste/(3600*24*30))+'月前';
            }else{
                $_return_string = Math.ceil($_reste/3600)+'年前';
            }
            return $_return_string;
        },
        filterImages : function(content){
            var patt = /<img.*?src=(?:"|')?([^ "']*)/ig;
            var r, i=0;
            var imgSrcArray = '';
            while(r = patt.exec(content)){
                console.log(r[1])
                imgSrcArray+=r[1] + ','
                i++;
                if(i>3)break;
            }
            return imgSrcArray;
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
            //str=this.filterHtml(str);
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
        }
	};
});