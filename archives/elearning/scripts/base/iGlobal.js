define([],function(){
	'user strict';
	return {
    timer : function(){
      clearInterval(CAICUI.timer.interVal);

      CAICUI.timer.time = 0;
      CAICUI.timer.interVal = setInterval(function(){
        CAICUI.timer.time++;
      },1000)
    },
    clearTimer : function(){
      clearInterval(CAICUI.timer.interVal);
    },
		getThat : function(e){
			return $(e.currentTarget);
		},
    getTemplate : function(obj,data){
      var compiled = _.template(obj);
      if(data){
        return compiled(data);
      }else{
        return compiled({"data": ''});
      }
    },
    getTemplateCourseNav : function(obj,data){
      var templateHtml = $('#template-course-nav').html();
      var addHtml = CAICUI.iGlobal.getTemplate(templateHtml,data);
      $(obj).html(addHtml);
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
    addLiveAnimate : function(callback){
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      $('body').prepend('<div id="animate" style="background-color:#ddd;width:'+windowWidth+'px;"></div>');
      $('#animate').animate({
        'height' : windowHeight,
        'top' : '0'
      },300,function(){
        if(callback){callback();};
      })
    },
    addAnimate : function(callback){
      var windowWidth = $(window).width();
      var windowHeight = $(window).height();
      $('body').prepend('<div id="animate" style="width:'+windowWidth+'px;"></div>');
      $('#animate').animate({
        'height' : windowHeight,
        'top' : '0'
      },300,function(){
        if(callback){callback();};
      })
    },
    addDomAnimate : function(title,templateName,callback){
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();
        var helpVideoTemp = _.template($('#'+templateName).html());
        $('body').append(helpVideoTemp({
          "title" : title
        }));
        $('.studycenter-video-close').on('click',function(){
          CAICUI.render.$this.removeAnimate();
        })
        $('#animate').animate({
          'height' : windowHeight,
          'top' : '0'
        },300,function(){
          if(callback){callback();};
        })
      },
      removeAnimate : function(callback){
        $('#animate').animate({
          'height' : '0',
          'top' : '50%'
        },300,function(){
          $('#animate').remove();
          if(callback){callback();};
        })
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
      var format = '';
      if(connector && connector == '-'){
        format = 'yyyy-MM-dd'
      }else{
        format = 'yyyy/MM/dd';
      }
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
    formatSeconds:function(value,type) {
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
        if(type == 'h'){
          if(theTime > 9) {
              result = parseInt(theTime)+"s";
          }else if(theTime > 0) {
              result = "0"+parseInt(theTime)+"s";
          }else{
              result = "0"+"s";
          }
          if(theTime1 > 9) {
              result = parseInt(theTime1)+"m"+result;
          }else if(theTime1 > 0) {
              result = "0"+parseInt(theTime1)+"m"+result;
          }else{
              result = "0"+"m"+result;
          }
          // if(theTime > 0) {
          //     result = parseInt(theTime)+"s"+result;
          // }
          // if(theTime1 > 0) {
          //     result = parseInt(theTime1)+"m"+result;
          // }
          // if(theTime2 > 0) {
          //     result = parseInt(theTime2)+"h"+result;
          // }
          if(theTime2 > 9) {
              result = parseInt(theTime2)+"h"+result;
          }else if(theTime2 > 0) {
              result = parseInt(theTime2)+"h"+result;
          }else{
              result = "0"+"h"+result;
          }
        }else{
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
        }
        
        return result;
    },
    canvasRound : function(dom,str){
    	var canvas = document.getElementById(dom);
    	if(canvas && canvas.getContext){
    		var width = canvas.width;
    		var height = canvas.height;
    		var progress = canvas.getAttribute('data-progress');
    		if(progress==0){
    			progress = 0.01;
    		}
    		var cxt=canvas.getContext("2d");
        var canvasTimerTotal = 20;
        var canvasNum = 1;

				var canvasTimer = setInterval(function(){
					if(canvasNum>canvasTimerTotal){
						clearInterval(canvasTimer);
					}else{
            cxt.clearRect(0, 0, width, height)
            if(str && str.bg){
              cxt.beginPath();
              cxt.arc(width/2,height/2,(width/2)-1,1.5*Math.PI,100,false);
              if(str && str.bgBorderWidth){
                cxt.lineWidth=str.bgBorderWidth;
              }else{
                cxt.lineWidth=1;
              }
              if(str && str.bgBorderColor){
                  cxt.strokeStyle=str.bgBorderColor;
              }else{
                  cxt.strokeStyle='#fff';
              }
              cxt.stroke();
            }
            if(progress){


						var endRad = Math.PI*(( ( (progress/canvasTimerTotal)*canvasNum ) /100)*2-0.5);
            //if(endRad && endRad>0){
              cxt.beginPath();
              cxt.arc(width/2,height/2,(width/2)-1,1.5*Math.PI,endRad,false);
              if(str && str.borderWidth){
                cxt.lineWidth=str.borderWidth;
              }else{
                cxt.lineWidth=2;
              }

              if(str && str.borderColor){
                  cxt.strokeStyle=str.borderColor;
              }else{
                  cxt.strokeStyle='#fff';
              }
              cxt.stroke();
            }
						
						cxt.closePath();
					//}
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
            $_return_string = Math.ceil(parseInt($_reste/(3600*24*30*12)))+'年前';
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
    },
    isChineseChar : function (str){   
       var reg = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
       return reg.test(str);
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
    stringToEntity : function(str){
      var newStr = '';
      var arrEntities={'lt':'<','gt':'>','nbsp':' ','amp':'&','quot':'"','#39':"'"};
      newStr = str.replace(/&(lt|gt|nbsp|amp|quot|#39);/ig,function(all,t){return arrEntities[t];});
      return newStr.replace(/<[^>]+>/g,"").replace(/(^\s+)|(\s+$)/g,"").replace(/(\r)|(\n)|(\t)/g,'');
    },
    bytesToSize: function(bytes) {  
           if (bytes === 0) return '0 B';  
      
            var k = 1024;  
      
            sizes = ['B','KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];  
      
            i = Math.floor(Math.log(bytes) / Math.log(k));  
          return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
        // return (bytes / Math.pow(k, i)) + ' ' + sizes[i]; 
           //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                              //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];  
    },
    getPercentage : function(progress, total, type){
      var taskprogress = progress ? parseInt(progress) : 0;
      var taskTotal = total ? parseInt(total) : 0;
      var percentage = 0;
      var lastProgress = progress;
      if(taskprogress && taskTotal){
        var a = taskprogress/taskTotal;
        if(a>0 && a<0.01){
          a = 0.01
        }
        percentage = parseInt(a*100);
      }else if(lastProgress){
        percentage = 1;
      }
      var percentageProgress = percentage;
      if(percentage >= 100){
        percentageProgress = 100;
      }
      return percentageProgress;
    },
    fileUpload : function(payload, callback){
      var formData = '';
      if(payload.formData){

        formData = payload.formData;
      }else{
        formData = new FormData($("#"+payload.formClass)[0]);
      }
      $.ajax({  
        url: CAICUI.Common.fileUpload,  
        type: 'POST',  
        data: formData,  
        async: false,  
        cache: false,  
        contentType: false,  
        processData: false,  
        success: function (returndata) {  
          if(callback){
            callback(returndata)
          }
        },  
        error: function (returndata) {
            //alert(returndata);  
        }  
      });
    },
    fileUploadAddList : function(dom, returndata){
      var data = returndata.data;
      if(data && data.length && CAICUI.render.imgPathArray){
        var imgPath = data[0].storeFileUrl;
        CAICUI.render.imgPathArray.push(imgPath);
        var $list = $('<div class="add-photo-show"><img class="add-photo-img" src="'+ CAICUI.Common.host.img + imgPath +'"><a class="add-photo-remove" data-src="'+imgPath+'" href="javascript:;"><i class="icon icon-add-remove"></i></a></div>'),
          $img = $list.find('img');
        $('body #'+dom).val('');
        
        $('body #'+dom).before( $list );

        if($('body .add-photo-show').length >= 5){
          $('body #'+dom).hide();
        }
      }
      
    }
	};
});