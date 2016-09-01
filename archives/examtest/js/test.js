$(function(){
	var today = new Date();
	var activeTime = new Date(2016,8,21,0,0,0);
	if(today.getTime()-activeTime.getTime()>=0){
		$("body").html("<h1 style='color:#f00;font-size:25px'>挑战赛已经结束</h1>");
		return;
	}
	var test = {
		init : function(){		
			this.time = null;
			this.exam = {};
			this.flag = false;
			this.total = 0;
			this.token = "";
			this.index = this.getCookie("qid") ? parseInt(this.getCookie("qid")) : 0;
			this.times = this.getCookie("qtime") ? parseInt(this.getCookie("qtime")) : 0;
			this.login();
			// this.initDom();
			// this.initEvent();
			//
		},
		login : function(){
			var _this = this;
			var serverip="http://api.caicui.com";
			var cook = {
				"nickname":_this.getCookie("nickname"),
				"nickschool":_this.getCookie("nickschool"),
				"nickmajor":_this.getCookie("nickmajor"),
				"nickemail":_this.getCookie("nickemail"),
				"nickqq":_this.getCookie("nickqq"),
				"phone":_this.getCookie("phone")
			}
			cook.nickname ? $("input[name=nickname]").val(cook.nickname) : null;
			cook.nickschool ? $("input[name=nickschool]").val(cook.nickschool) : null;
			cook.nickemail ? $("input[name=nickemail]").val(cook.nickemail) : null;
			cook.nickmajor ? $("input[name=nickmajor]").val(cook.nickmajor) : null;
			cook.nickqq ? $("input[name=nickqq]").val(cook.nickqq) : null;
			cook.phone ? $("input[name=phone]").val(cook.phone) : null;

			//获取验证码
			 $('#getcode').click(function(){
		       var cardCode = $.trim($("input[name=cardCode]").val());
		       var phone = $.trim($("input[name=phone]").val());
		       var actvCode = $.trim($("input[name=actvCode]").val());
		       var wxCode = $.trim($("input[name=wxCode]").val());
		       if(phone=="" || !isMobile(phone)){
		       	$("#error").empty();
		           $("#error").append("请输入正确手机号！");
		           return false;
		       }
		      /* if(!checkPhone(phone,cardCode,actvCode,wxCode)){
		    	   return false;
		       } */
		       
				$.ajax({
					url: 'http://www.caicui.com/api/v2.1/getToken',
					async: false,
					type: 'get',
					dataType: 'json',
					contentType: "application/x-www-form-urlencoded",
					data: {
						"appType": "pc",
						"appId": "pcWeb",
						"appKey": "e877000be408a6cb0428e0f584456e03"
					},
					success: function(data) {
						_this.token = data.data.token
						console.log(_this.token)
						var url = "http://www.caicui.com/api/v2.1/msg/code";
						var myinterval;
						var j_captcha = $.trim($("input[name=j_captcha]").val());
						$.ajax({
							type: "POST",
							url: url,
							data: {
								type: "send",
								phone: phone,
								j_captcha: j_captcha,
								token: _this.token
							},
							success: function(msg) {
								if ("success" == msg.state) {
									var i = 60;
									$('#getcode').hide();
									$('#tip').show();
									$('#tip').html("发送成功！");
									$('#j_captcha_div').hide();
									myinterval = setInterval(function() {
										i--;
										$('#tip').html("重新发送(" + i + ")");
										if (i < 1) {
											if (myinterval) {
												window.clearInterval(myinterval);
												myinterval = null
											};
											$('#getcode').show();
											$('#tip').html("");
											$('#tip').hide()
										}
									}, 1000)
								} else if (msg.msg == "3") {
									$('#j_captcha_div').show();
									$("#captchaImage").click()
								} else {
									$("#error").empty();
									$("#error").append("发送短信过于频繁,请您稍后再试！")
								}
							}
						});
					},
					error: function(data) {
						console.log(data)
					}
				})
		       return false;
		    });
			 
		    //点击提交
		    $('#mobileFormCommit').click(function(){
		    	var nickname = $.trim($("input[name=nickname]").val());
		    	 if(nickname==""){
		    		 $("#error").empty();
		             $("#error").append("请输入姓名！");
		             return false;
		    	 }
		    	 
		    	
		    	 var nickschool = $.trim($("input[name=nickschool]").val());
		    	 if(nickschool==""){
		    		 $("#error").empty();
		             $("#error").append("请输入学校！");
		             return false;
		    	 }
		    	 var nickmajor = $.trim($("input[name=nickmajor]").val());
		    	 if(nickmajor==""){
		    		 $("#error").empty();
		             $("#error").append("请输入专业！");
		             return false;
		    	 }
		    	

		    	 var nickemail = $.trim($("input[name=nickemail]").val());
		    	 if(nickemail=="" || !checkEmail(nickemail)){
		    		 $("#error").empty();
		             $("#error").append("请输入正确的邮箱！");
		             return false;
		    	 }
		    	
		    	 var nickqq = $.trim($("input[name=nickqq]").val());
		    	 if(nickqq=="" || !checkQq(nickqq)){
		    		 $("#error").empty();
		             $("#error").append("请输入正确的QQ号！");
		             return false;
		    	 }
		    	 var phone = $.trim($("input[name=phone]").val());
		         if(phone=="" || !isMobile(phone)){
		         	$("#error").empty();
		             $("#error").append("请输入正确的手机号！");
		             return false;
		         }

		        var code = $.trim($("input[name=code]").val());
		         if(code ==""){
		        	 $("#error").empty();
		        	 $("#error").append("请输入验证码!");
		        	 return false;
		         }else if(!checkPhoneCode(code)){
		        	 $("#error").empty();
		        	 $("#error").append("验证码错误！");
		        	 return false;
		         }
		         $(".login").hide();
		         $(".test").show();
		         document.cookie = 'nickname='+nickname;
		    	 document.cookie = 'nickschool='+nickschool;
		    	 document.cookie = 'nickmajor='+nickmajor;
		    	 document.cookie = 'nickemail='+nickemail;
		    	 document.cookie = 'nickqq='+nickqq;
		    	 document.cookie = 'phone='+phone;
					
		        _this.initDom();
				_this.initEvent();

		    });

				

				function isMobile(obj){
				    var regPartton=/1[3-9]+\d{9}/;
				    if(!regPartton.test(obj)){
				        return false;
				    }
				    return true;
				}

				function checkPhoneCode(obj){
					var fv = false;
					 $.ajax({
				         type: "GET",
				         url: "http://www.caicui.com/common/checkPhoneCode",
				         data: {code:obj},
				         async: false,
				         success: function(response){
				        	 if(response=="true"){
				        		 fv = true;
				        	 }
				         }
				     });
					 return fv;
				}

				function checkPhone(phone,cardCode,actvCode,wxCode){
					var fv = false;
					 $.ajax({
				         type: "POST",
				         url: "http://www.caicui.com/api/v2.1/getToken?appType=pc&appId=pcWeb&appKey=e877000be408a6cb0428e0f584456e03 ",
				         data: {phone:phone,cardCode:cardCode,actvCode:actvCode,wxCode:wxCode,type:"send",token:"1462270950470333iPhoneCourse"},
				         async: false,
				         success: function(data){
				        	 if(data.state=="success"){
				                 $("#error").empty();
				                 $("#error").append(data.msg);
				                 fv = false;
				             }else{
				            	 fv = true;
				             }
				         }
				     });
					 return fv;
				}
				function checkEmail(obj){
					var reg = /\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+/;
					if(!reg.test(obj)){
				        return false;
				    }
				    return true;
				}
				function checkQq(obj){
					var reg = /^[1-9]*[1-9][0-9]*$/;
					if(!reg.test(obj)){
				        return false;
				    }
				    return true;
				}
		},
		initDom : function(){
			var _this = this;
			this.flag = false;
			console.log(examData.list.length)
			this.renderTpl($("#tpl"),examData.list[_this.index],$(".test_questions"),_this.index+1);
			this.iCheck();
		    this.test_questions_list = $(".test_questions_list");	
		    clearInterval(_this.time);
		   
			$(".test_time span").text(_this.showTime(_this.times++));
			this.total = examData.list.length;
		   	_this.setTime();
		},
		initEvent : function(){
			var _this = this;				
			var container = $('#container');
			
			$(".test").on("click","#pause",function(){
				 _this.flag = true;
			})
			$("#quit").on("click",function(){
		   		document.cookie = 'qtime='+_this.times;
		    	$(".test").hide();
		    	$(".login").show();			
			})

			$(".study").on("click",function(){
				 _this.flag = false;
			})

			container.on("click","#jump",function(){
				var qid = $("#qid").val();
				if(qid == "") return;
				 _this.go(qid-1);
			})

			/*container.on('ifChecked',"input", function(event){
				var parents = $(this).parents(".test_questions_list"),
					sel = $(this).parent().next(".sel").text(),
					
			  		
			  	if( sel == ans ){
			  		result.text("，回答正确");
			  	}else{
			  		result.text("，回答错误");
			  	}
				parents.find(".answer").show();
			});*/
			container.on("click","#testing",function(){
				var ans = $(this).parent().next(".answer").find("span").text(),
					inp = $("#inp").val().toUpperCase();
					console.log(inp+","+ans)
				if(ans == inp){
					$(".result").text("，回答正确");
				}else{
					$(".result").text("，回答错误");
				}
				$(".answer").show();
			})
			container.on("click",".reset",function(){
				

			})
			container.on("click","#next",function(){
				_this.index++;
				if(_this.index>=_this.total) _this.index = _this.total-1;
				_this.go(_this.index);
			})

			container.on("click","#prev",function(){
				_this.index--;
				if(_this.index<=0) _this.index = 0;
				_this.go(_this.index);
			})

			$("body").on("click","#put",function(){
				clearInterval(_this.time);
	    		 _this.renderTpl($("#tpl"),examData.list[0],$(".test_questions"),1);
				$("#qid").val("");

		   		_this.index = 0;
				_this.times = 0;
				$(".test_time span").text("00:00:00");
				_this.setTime();
		   		document.cookie = 'qid='+_this.index;
		   		document.cookie = 'qtime='+_this.times;
				
								
			})
			$('#myModal').on('show.bs.modal', function (e) {
			  _this.flag = true;
			})
			$('#myModal').on('hidden.bs.modal', function (e) {
			  _this.flag = false;
			})
			
			$('#myModal2').on('show.bs.modal', function (e) {
			  _this.flag = true;
			})
			$('#myModal2').on('hidden.bs.modal', function (e) {
			  _this.flag = false;
			})
		},
		renderTpl : function(tpl,data,box,id){
			var arr=["A","B","C","D","E","F","G","H"];
			
			Handlebars.registerHelper("compare",function(v1,v2,options){
		        return v1[v2]
		    });
			Handlebars.registerHelper("index",function(v1,options){
		        return v1+1;
		    });
		    var tpl   =  tpl.html();
		    var temp = Handlebars.compile(tpl);
		    var context = data;
		    var html = temp({"context":context,"arr":arr,"id":id});
		    box.html(html);
		    this.iCheck();
		},
		go : function(idx){
			this.index = idx;
			this.renderTpl($("#tpl"),examData.list[idx],$(".test_questions"),idx+1);
			$("#qid").val("")
			document.cookie = 'qid='+this.index;
		},
		inpChecked : function(inputs){			
			for(var i=0,len=inputs.length;i<len;i++){
				if($(inputs[i]).hasClass("checked")){
					return true;
				}
			}
			return false;
		},
		showTime : function(times){ 
			var leftsecond = parseInt(times); 
			//console.log(leftsecond)
			//var day1=parseInt(leftsecond/(24*60*60*6)); 
			var day1=Math.floor(leftsecond/(60*60*24)); 
			var hour=Math.floor((leftsecond-day1*24*60*60)/3600); 
			var minute=Math.floor((leftsecond-day1*24*60*60-hour*3600)/60); 
			var second=Math.floor(leftsecond-day1*24*60*60-hour*3600-minute*60); 
			if(hour<10) hour = "0"+hour;
			if(minute<10) minute = "0"+minute;
			if(second<10) second = "0"+second;
			return hour+":"+minute+":"+second;
		},
		iCheck : function(){
			$('input').iCheck({
			    checkboxClass: 'icheckbox_minimal-blue',
			    radioClass: 'iradio_minimal-blue',
			    increaseArea: '20%' // optional
			 })
		},
		setTime : function(){
			var _this = this;
			$(".test_time span").text(_this.showTime(_this.times++));
			this.time = setInterval(function(){
				if(!_this.flag){
					$(".test_time span").text(_this.showTime(_this.times++));
				}
			},1000)
		},
		getCookie : function(name){
			var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
			if(arr=document.cookie.match(reg)){
				return unescape(arr[2]);
			}else{
				return null;
			}						
		}
					
	}
	test.init();
})