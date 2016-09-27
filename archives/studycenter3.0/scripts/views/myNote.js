;define([
	'jquery',
	'underscore',
	'backbone',
	'views/node-list',
	'views/node-desc-list',
	'views/node-editor',
	'layer'
	],function($, _, Backbone, NodeList, NodeDescList, NodeEditor, layer){
		'use strict';
		var Studycenter = Backbone.View.extend({
			el : 'body #right',
			template : _.template($('#template-my-note').html()),
			events : {
				'click .node-list-title-a' : 'nodeListToggle',
				'click .node-list-link' : 'addNodeLists',
				'click .node-list-linkssss' : 'addNodedetail',
				'click .node-select-a' : 'nodeSelectA',
				'click .node-option-li' : 'addActive',
				'click .node-desc-show' : 'nodeDescShow',
				'click .node-desc-hide' : 'nodeDescHide',
				'click .node-new' : 'nodeNew',
				'click .option-li' : 'nodeChange',
				'change #uploadForm-file' : 'uploadForm',
				'click .add-photo-remove' : 'addPhotoRemove',
				'click .node-editor-cancel' : 'editorCancel',
				'click .node-editor-confirm' : 'editorConfirm',
				'click .js-pagination-li' : 'paginationChange',
				'click .js-pagination-prev' : 'paginationPrev',
				'click .js-pagination-next' : 'paginationNext',
				'click .node-lsit-editor' : 'nodeEditor',
				'click .node-lsit-remove' : 'nodeRemove',
				'click .node-lately' : 'nodeLately',
				'click .node-list-desc-link' : 'nodeListDescLink',
				'keyup .node-editor-textarea' : 'nodeContent',
				'click .show-photo-li' : 'showPhoto',
				'click .remove-load-confirm' : 'removeLoadConfirm'
			},
			render : function(type){
				// this.$el.html(this.template({
				// 	'type' : type
				// }));
				this.$scroller = this.$('#scroller');
				this.$nodeRight = this.$('.node-right');
				this.$nodeDescContent = this.$('#scroller-node');
				this.$nodeListLi = this.$('.node-list-one-li');
				this.$nodeLately = this.$('.node-lately');
				//this.nodeListRender();
				//this.nodeDescRender();
				this.courseNavPreDefault = 2;
				this.courseNavPre = 2;
				this.courseNavAnimateTime = 150;

				CAICUI.render.courseId = '';
				CAICUI.render.$this = this;

				CAICUI.render.content = '';
				//CAICUI.render.courseId = '';
				CAICUI.render.clientType = 'pc';
				CAICUI.render.title = 'sdf';
				CAICUI.render.isPublic = 1;
				CAICUI.render.subjectId = '';
				CAICUI.render.categoryId = '';
				CAICUI.render.chapterId = '';
				CAICUI.render.subjectName = '';
				CAICUI.render.categoryName = '';
				CAICUI.render.courseName = '';
				CAICUI.render.chapterName = '';
				CAICUI.render.taskId = '';
				CAICUI.render.taskProgress = 0;
				CAICUI.render.taskName = 'sdf';
				CAICUI.render.imgPath = '';
				CAICUI.render.imgPathArray = [];
				CAICUI.render.isLately = true;
				CAICUI.render.noEditor = true;

				CAICUI.render.charpterId = '';
				CAICUI.render.nodeType = 0;
				CAICUI.render.self = 1;
				CAICUI.render.ordertype = 1;
				CAICUI.render.pageNo = 1;
				CAICUI.render.pageSize = 20;
				CAICUI.render.totalCount = 0;
				CAICUI.render.pageTotal = 0;
				CAICUI.render.paginationType = 0;

				CAICUI.render.serverTotal = 1;
				CAICUI.render.serverNum = 0;
				//this.$learningcourse = '';
				//this.learningcourse();

				this.$myallcoursechapternodecount = '';
				this.$myNoteCourseList = '';
				this.myallcoursechapternodecount();

				CAICUI.render.timer = setInterval(function(){
					if(CAICUI.render.serverTotal==CAICUI.render.serverNum){
						clearInterval(CAICUI.render.timer);
						CAICUI.render.$this.$el.html(CAICUI.render.$this.template({
							'data' : {
								'courseId' : CAICUI.render.courseId,
								'myNoteCourseList' : CAICUI.render.$this.$myNoteCourseList,
								'nodelist' : CAICUI.render.$this.$myallcoursechapternodecount
							}
						}));
						window.CAICUI.myScroll = CAICUI.iGlobal.iScroll('body #wrapper');
						if(CAICUI.render.$this.$myallcoursechapternodecount.data){
							$('body .node-lately').trigger('click');
						}
						
					}
				},CAICUI.render.time)

			},
			// learningcourse : function(callback){
			// 	CAICUI.Request.ajax({
			// 		'server' : 'learningcourse',
			// 		'data' : {
			// 			'token' : CAICUI.User.token,
			// 			'pageNo' : 1,
			// 			'pageSize' : CAICUI.defaultPageSize
			// 		},
			// 		done : function(data){
			// 			console.log(data);
			// 			if(callback){
			// 				callback(data.data.courselist);
			// 			}else{
			// 				CAICUI.render.serverNum ++;
			// 				CAICUI.render.courseId = data.data.courselist[0].courseId;
			// 				CAICUI.render.$this.$learningcourse = data.data.courselist;
			// 			}
			// 		}
			// 	})
			// },
			// nodelist : function(callback){
			// 	CAICUI.Request.ajax({
			// 		'server' : 'node-list',
			// 		'data' : {
			// 			'token' : CAICUI.User.token,
			// 		},
			// 		done : function(data){
			// 			console.log(data);
			// 			callback(data);
			// 		}
			// 	})
			// },
			myallcoursechapternodecount : function(callback){
				CAICUI.Request.ajax({
					'server' : 'myallcoursechapternodecount',
					'data' : {
						'token' : CAICUI.User.token
					},
					done : function(data){
						if(callback){
							callback(data);
						}else{
							var myNotecourseList = [];
							_.each(data.data,function(element, index, list){
								if(element.nodeNum){
									myNotecourseList.push({
										"courseId" : element.id,
										"courseName" : element.title
									});
								}
								
							});
							CAICUI.render.serverNum ++;
							CAICUI.render.$this.$myNoteCourseList = myNotecourseList;
							CAICUI.render.$this.$myallcoursechapternodecount = data;
						}
					},
					fail : function(data){
						if(callback){
							callback({});
						}else{
							CAICUI.render.serverNum ++;
							CAICUI.render.$this.$myNoteCourseList = {};
							CAICUI.render.$this.$myallcoursechapternodecount = {};
						}
					}
				})
			},
			addNodelist : function(){
				CAICUI.iGlobal.loading('body #scroller',{'height':$('#wrapper').height()+'px'});
				window.CAICUI.myScroll.refresh();

				var nodeList = new NodeList();
				this.myallcoursechapternodecount(function(data){
					$('body #scroller').html(nodeList.render({
						'data' : {
							'nodelist' : data
						}
					}).el);
					window.CAICUI.myScroll.refresh();
				})
			},
			nodeList : function(callback){
				CAICUI.Request.ajax({
					'server' : 'nodelist',
					'data' : {
						'token' : CAICUI.User.token,
						'charpterid' : CAICUI.render.charpterId,
						'self' : CAICUI.render.self,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize,
						'ordertype' : CAICUI.render.ordertype
					},
					done : function(data){
						CAICUI.render.pageTotal = Math.ceil(data.totalCount/data.pageSize);
						callback(data)
					},
					fail : function(data){
						callback({})
					}
				})
			},
			nodeListCourse : function(callback){
				CAICUI.Request.ajax({
					'server' : 'nodelist',
					'data' : {
						'token' : CAICUI.User.token,
						//'courseid' : CAICUI.render.courseId,
						'self' : CAICUI.render.self,
						'pageNo' : CAICUI.render.pageNo,
						'pageSize' : CAICUI.render.pageSize,
						'ordertype' : CAICUI.render.ordertype
					},
					done : function(data){
						CAICUI.render.pageTotal = Math.ceil(data.totalCount/data.pageSize);
						callback(data)
					},
					fail : function(data){
						callback({})
					}
				})
			},
			courseBaseInfo : function(callback){
				CAICUI.Request.ajax({
					'server' : 'courseBaseInfo',
					'data' : {
						'token' : CAICUI.User.token,
						'courseIds' : CAICUI.render.courseId
					},
					done : function(data){
						var courseBaseInfo = data.data[0];
						CAICUI.render.subjectId = courseBaseInfo.subjectId;
						CAICUI.render.subjectName = courseBaseInfo.subjectName;

						CAICUI.render.categoryId = courseBaseInfo.categoryId;
						CAICUI.render.categoryName = courseBaseInfo.categoryName;

						CAICUI.render.courseName = courseBaseInfo.courseName;

						if(callback){callback()};
					},
					fail : function(data){
						layer.msg('Sorry~ 网络错误，请刷新页面重试。', function() {});
					}
				})
			},
			addNodeLists : function(e){
				CAICUI.render.noEditor = true;
				CAICUI.render.isLately = false;
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo = 1;
				CAICUI.render.paginationType = 1;
				

				//if(!that.hasClass('active')){
					CAICUI.iGlobal.loading('.node-right');
					$('.node-list-link').removeClass('active');
					that.addClass('active');

					CAICUI.render.courseId = that.attr('data-courseid');

					CAICUI.render.chapterId = that.attr('data-chapterid');
					CAICUI.render.chapterName = that.attr('data-chaptername');

					CAICUI.render.charpterId = that.attr('data-chapterid');

					
					this.courseBaseInfo(function(){
						var nodeDescList = new NodeDescList();
						CAICUI.render.$this.nodeList(function(data){
							$('.node-right').html(nodeDescList.render({
									"data" : data.data,
									"type" : CAICUI.render.nodeType,
									'pageNo': data.pageNo,
									'pageSize': data.pageSize,
									'totalCount': data.totalCount
								}
							).el);
							window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
						});
					});
					
				//}
			},
			nodeLately : function(e){
				CAICUI.render.noEditor = false;
				CAICUI.render.isLately = true;
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo = 1;
				CAICUI.render.paginationType = 0;
				//if(!that.hasClass('active')){
					CAICUI.iGlobal.loading('.node-right');
					//that.addClass('active');
					$('body .node-list-link.active').removeClass('active');
					var nodeDescList = new NodeDescList();
					this.nodeListCourse(function(data){
						$('.node-right').html(nodeDescList.render({
								"data" : data.data,
								"type" : CAICUI.render.nodeType,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}
						).el);
						
						window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
					});
				//}
			},
			nodeDetail : function(callback){
				CAICUI.Request.ajax({
					'server' : 'nodedetail',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.nodeId
					},
					done : function(data){
						callback(data);
					},
					fail : function(data){
						callback({});
					}
				})
			},
			delmycontent : function(callback){
				CAICUI.Request.ajax({
					'server' : 'delmycontent',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.nodeId,
						'type' : 'note'
					},
					done : function(data){
						callback(data);
					},
					fail : function(data){
						callback({});
					}
				})
			},
			addNodedetail : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				if(!that.hasClass('active')){
					CAICUI.iGlobal.loading('.node-right');
					$('.node-list-link').removeClass('active')
					that.addClass('active');
					var thatId = that.attr('data-id');
					var nodeDescList = new NodeDescList();
					this.nodedetail(thatId,function(data){
						$('.node-right').html(nodeDescList.render({
								"data" : data,
								"type" : 0
							}).el);
						window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
					});
				}
			},
			getThat : function(e){
				return $(e.currentTarget);
			},
			nodeListRender : function(){
				var nodeList = new NodeList();
				this.$scroller.html(nodeList.render().el);
			},
			nodeDescRender : function(data){
				var nodeDescList = new NodeDescList();
				this.$nodeRight.html(nodeDescList.render(data).el);

				window.CAICUI.nodeScroll = new IScroll('body #wrapper-node', { 
					probeType: 3,
					mouseWheel: true,
					scrollbars: 'custom',
				});
				function updatePosition () {
					console.log(this.y)
				}
				window.CAICUI.nodeScroll.on('scroll', updatePosition);
				// courseAcScroll.on('scrollEnd', updatePosition);

				document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
			},
			nodeEditorRender : function(data){
				var nodeEditor = new NodeEditor();
				this.$('.node-right').html(nodeEditor.render(data).el);
				/*
				var $addPhotoButton = $('#add-photo-button'),
        // 优化retina, 在retina下这个值是2
        ratio = window.devicePixelRatio || 1,

        // 缩略图大小
        thumbnailWidth = 100 * ratio,
        thumbnailHeight = 100 * ratio,

        // Web Uploader实例
        uploader;

		    // 初始化Web Uploader
		    uploader = WebUploader.create({
		    		disableGlobalDnd : true,
		        // 自动上传。
		        //auto: true,
		        // swf文件路径
		        //swf: BASE_URL + '/js/Uploader.swf',
		        // 文件接收服务端。
		        fileNumLimit : 4,
		        server: 'http://www.caicui.com/api/v2.1/commons/fileUpload',
		        method : 'POST',
		        formData : {
		 					'token' : CAICUI.User.token
		        },
		        // 选择文件的按钮。可选。
		        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
		        pick: '#add-photo-button',
		        duplicate : false,
		        // 只允许选择文件，可选。
		        accept: {
		            title: 'Images',
		            extensions: 'gif,jpg,jpeg,bmp,png',
		            mimeTypes: 'image/*'
		        }
		    });

		    // 当有文件添加进来的时候
		    uploader.on( 'fileQueued', function( file ) {
		        // var $li = $(
		        //         '<div id="' + file.id + '" class="file-item thumbnail">' +
		        //             '<img>' +
		        //             '<div class="info">' + file.name + '</div>' +
		        //         '</div>'
		        //         ),
		        //     $img = $li.find('img');
		        var formData = new FormData($( "#uploadForm" )[0]);
		        $.ajax({  
              url: 'http://api.caicui.com/api/v2.1/commons/fileUpload' ,  
              type: 'POST',  
              data: formData,  
              async: false,  
              cache: false,  
              contentType: false,  
              processData: false,  
              success: function (returndata) {
              	// if(CAICUI.render.imgPathArray.length){
              	// 	CAICUI.render.imgPath += ',';
              	// }
              	CAICUI.render.imgPathArray.push(returndata.data.path);

                  //alert(returndata);  
                  var $list = $('<div class="add-photo-show"><img class="add-photo-img"><a class="add-photo-remove" data-id="'+file.id+'" href="javascript:;"><i class="icon icon-add-remove"></i></a></div>'),
                  	$img = $list.find('img');
                  $addPhotoButton.before( $list );
                  // 创建缩略图
                  uploader.makeThumb( file, function( error, src ) {
                      if ( error ) {
                          $img.replaceWith('<span>不能预览</span>');
                          return;
                      }
                      $img.attr( 'src', src );
                  }, thumbnailWidth, thumbnailHeight );
                  if($('body .add-photo-show').length >= 5){
          	    		$('body .add-photo-button').hide();
          	    	}
              },  
              error: function (returndata) {  
                  //alert(returndata);  
              }  
           	});
		    });

		    // 文件上传过程中创建进度条实时显示。
		    uploader.on( 'uploadProgress', function( file, percentage ) {
		        var $li = $( '#'+file.id ),
		            $percent = $li.find('.progress span');

		        // 避免重复创建
		        if ( !$percent.length ) {
		            $percent = $('<p class="progress"><span></span></p>')
		                    .appendTo( $li )
		                    .find('span');
		        }

		        $percent.css( 'width', percentage * 100 + '%' );
		    });

		    // 文件上传成功，给item添加成功class, 用样式标记上传成功。
		    uploader.on( 'uploadSuccess', function( file ) {
		        $( '#'+file.id ).addClass('upload-state-done');
		    });

		    // 文件上传失败，现实上传出错。
		    uploader.on( 'uploadError', function( file ) {
		        var $li = $( '#'+file.id ),
		            $error = $li.find('div.error');

		        // 避免重复创建
		        if ( !$error.length ) {
		            $error = $('<div class="error"></div>').appendTo( $li );
		        }

		        $error.text('上传失败');
		    });

		    // 完成上传完了，成功或者失败，先删除进度条。
		    uploader.on( 'uploadComplete', function( file ) {
		        $( '#'+file.id ).find('.progress').remove();
		    });
		    this.$uploader = uploader;
		    */
			},
			uploadForm : function(e){
				var formData = new FormData($( "#uploadForm" )[0]);
        $.ajax({  
          url: 'http://api.caicui.com/api/v2.1/commons/fileUpload' ,  
          type: 'POST',  
          data: formData,  
          async: false,  
          cache: false,  
          contentType: false,  
          processData: false,  
          success: function (returndata) {  

          	CAICUI.render.imgPathArray.push(returndata.data.path);

            var $list = $('<div class="add-photo-show"><img class="add-photo-img" src="'+ CAICUI.Common.host.img + returndata.data.path +'"><a class="add-photo-remove" data-src="'+returndata.data.path+'"  href="javascript:;"><i class="icon icon-add-remove"></i></a></div>'),
            	$img = $list.find('img');

            $('body #uploadForm').before( $list );

            if($('body .add-photo-show').length >= 5){
    	    		$('body #uploadForm').hide();
    	    	}
          },  
          error: function (returndata) {
              //alert(returndata);  
          }  
       	});
				// var file = e.target.files[0];  
		    //     if(window.FileReader) {  
		    //       var fr = new FileReader();  
		    //       fr.onloadend = function(e) {  
		    //       	console.log(e.target.result)
		    //       	$('body #upload-img').attr('src',e.target.result)
		    //       };  
		    //       fr.readAsDataURL(file);  
		    //     }
			},
			addPhotoRemove : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				
				var thatPrev = that.prev();
				var thatPrevSrc = that.attr('data-src');
				for(var i=0; i<CAICUI.render.imgPathArray.length; i++){
					if(CAICUI.render.imgPathArray[i] == thatPrevSrc){
						CAICUI.render.imgPathArray.splice(i,1);
						break;
					}
				}
				var parent = that.parent();
				parent.remove();
        if($('body .add-photo-show').length < 5){
	    		$('body #uploadForm').show();
	    	}
			},
			nodeListToggle : function(e){
				var that = this.getThat(e);
				var parent = that.parent();
				parent.toggleClass('active');
				window.CAICUI.myScroll.refresh();
			},
			addActive : function(e){
				var that = this.getThat(e);
				that.siblings().removeClass('active');
				that.addClass('active');
			},
			nodeSelectA : function(e){
				var that = this.getThat(e);
				that.toggleClass('active');
				that.next().toggleClass('active');
			},
			nodeListLink : function(e){
				var that = this.getThat(e);
				if(!that.hasClass('active')){
					$('.node-list-link').removeClass('active')
					that.addClass('active');
					this.nodeDescRender(that.parent().index());
				}
			},
			nodeDescShow : function(e){
				var that = this.getThat(e);
				var parentsLi = that.parents('li');
				CAICUI.render.nodeId = parentsLi.attr('data-id');
				this.nodeDetail(function(data){
					parentsLi.addClass('active');
					window.CAICUI.nodeScroll.refresh();
				});
			},
			nodeDescHide : function(e){
				var that = this.getThat(e);
				var parentsLi = that.parents('li');
				parentsLi.removeClass('active');
				window.CAICUI.nodeScroll.refresh();
			},
			nodeNew : function(e){
				var that = this.getThat(e);
				this.nodeEditorRender();
			},
			nodeEditor : function(e){
				var that = this.getThat(e);
				var parentsLi = that.parents('.node-desc-li');

				var updateTime = parentsLi.attr('data-updateTime');
				var taskprogress = parentsLi.attr('data-taskprogress');
				var contentSummary = parentsLi.attr('data-contentSummary');
				CAICUI.render.content = contentSummary;
				var imgPath = parentsLi.attr('data-imgPath');
				if(imgPath.length){
					CAICUI.render.imgPathArray = imgPath.split(',');
				}else{
					CAICUI.render.imgPathArray = [];
				}
				var isPublic = +parentsLi.attr('data-isPublic');  
				CAICUI.render.isPublic = isPublic;
				CAICUI.render.nodeId = parentsLi.attr('data-id');
				CAICUI.render.charpterId = parentsLi.attr('data-charpterId');
				this.nodeEditorRender({
					"time" : updateTime,
					"videoTime" : taskprogress,
					"content" : contentSummary,
					"imgPath" : CAICUI.render.imgPathArray,
					"isPublic" : isPublic
				});
			},
			editorConfirm : function(e){
				//this.$uploader.upload();
				CAICUI.render.imgPath = '';
				if(CAICUI.render.imgPathArray.length){
					for(var i=0;i<CAICUI.render.imgPathArray.length;i++){
						i ? CAICUI.render.imgPath += ',' + CAICUI.render.imgPathArray[i] : CAICUI.render.imgPath += CAICUI.render.imgPathArray[i];
					}
				}else{
					CAICUI.render.imgPath = '';
				}
				CAICUI.Request.ajax({
					'server' : 'nodesave',
					'data' : {
						'token' : CAICUI.User.token,
						'id' : CAICUI.render.nodeId,
						'content' : CAICUI.render.content,
						'courseId' : CAICUI.render.courseId,
						'clientType' : CAICUI.render.clientType,
						'title' : CAICUI.render.title,
						'isPublic' : CAICUI.render.isPublic,
						'subjectId' : CAICUI.render.subjectId,
						'categoryId' : CAICUI.render.categoryId,
						'chapterId' : CAICUI.render.chapterId,
						'subjectName' : CAICUI.render.subjectName,
						'categoryName' : CAICUI.render.categoryName,
						'courseName' : CAICUI.render.courseName,
						'chapterName' : CAICUI.render.chapterName,
						'taskName' : CAICUI.render.taskName,
						'imgPath' : CAICUI.render.imgPath
					},
					done : function(data){
						var linkActive = $('body .node-list-link.active');
						// if(!CAICUI.render.isPublic){
						// 	var linkActiveNodeNum = +linkActive.attr('data-nodenum')+1;
						// 	linkActive.attr('data-nodenum',linkActiveNodeNum);
						// 	linkActive.find('.node-list-num').text('['+linkActiveNodeNum+']');
						// }
						if(CAICUI.render.isLately){
							$('body .node-lately').trigger('click');
						}else{
							linkActive.trigger('click');
						}
					},
					fail : function(data){
						layer.msg('Sorry~ 笔记保存失败', function() {});
					}
				})
			},
			nodeContent : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.content = that.val();
			},
			editorCancel : function(e){
				if($('body .node-list-link.active').length){
					$('body .node-list-link.active').trigger('click');
				}else{
					$('body .node-lately').trigger('click');
				}
			},
			nodeRemove : function(e){
				var that = this.getThat(e);
				CAICUI.render.removeNodeDescLi = that.parents('.node-desc-li');
				CAICUI.render.nodeRemoveLoad = layer.load(1, {
					type : 1,
					title : false,
					content: $('#remove-load'),
					closeBtn : 0,
				  shade: [0.5,'#000'] //0.1透明度的白色背景
				});
				$('.remove-load-cancel').on('click',function(){
					layer.close(CAICUI.render.nodeRemoveLoad);
				})
				
			},
			removeLoadConfirm : function(e){
				CAICUI.render.nodeId = CAICUI.render.removeNodeDescLi.attr('data-id');
				CAICUI.render.$this.delmycontent(function(data){
					CAICUI.render.removeNodeDescLi.remove();
					var linkActive = $('body .node-list-link.active');
					var linkActiveNodeNum = +linkActive.attr('data-nodenum')-1;

					linkActive.attr('data-nodenum',linkActiveNodeNum);
					linkActive.find('.node-list-num').text('['+linkActiveNodeNum+']');

					var parentUl = linkActive.parent().parent();
					var parentUlPrev = parentUl.prev();
					var parentUlPrevNodeNum = +parentUlPrev.attr('data-nodenum')-1;
					parentUlPrev.attr('data-nodenum',parentUlPrevNodeNum);
					parentUlPrev.find('.node-list-num').text('['+parentUlPrevNodeNum+']');
					layer.close(CAICUI.render.nodeRemoveLoad);
					if(linkActiveNodeNum){
						window.CAICUI.nodeScroll.refresh();

					}else{
						linkActive.trigger('click');
					}
				});
			},
			nodeChange : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatText = that.find('.option-a').text();
				
				that.siblings().removeClass('active');
				that.addClass('active');
				that.parent().removeClass('active');
				that.parent().prev().removeClass('active');
				that.parent().prev().find('.node-select-text').text(thatText);


				CAICUI.render.courseId = that.find('.option-a').attr('data-courseid');
				$('.node-list-one-li').addClass('hide');
				if(CAICUI.render.courseId){
					$('#node-list-'+CAICUI.render.courseId).removeClass('hide');
				}else{
					$('.node-list-one-li').removeClass('hide');
				}
				window.CAICUI.myScroll.refresh();

				//this.addNodelist();
			},
			paginationChange : function(e){
				CAICUI.iGlobal.loading('.node-right');
				var that = CAICUI.iGlobal.getThat(e);
				CAICUI.render.pageNo =that.attr('data-pageno');
				if(CAICUI.render.paginationType){
					this.nodeList(function(data){
					var nodeDescList = new NodeDescList();
						$('.node-right').html(nodeDescList.render({
								"data" : data.data,
								"type" : CAICUI.render.nodeType,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}
						).el);
						window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
				});
				}else{
					var nodeDescList = new NodeDescList();
					this.nodeListCourse(function(data){
						$('.node-right').html(nodeDescList.render({
								"data" : data.data,
								"type" : 0,
								'pageNo': data.pageNo,
								'pageSize': data.pageSize,
								'totalCount': data.totalCount
							}
						).el);
						window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
					});
				}
			},
			paginationPrev : function(e){
				if(CAICUI.render.pageNo>1){
					CAICUI.iGlobal.loading('.node-right');
					CAICUI.render.pageNo = +CAICUI.render.pageNo-1;
					if(CAICUI.render.paginationType){
						this.nodeList(function(data){
						var nodeDescList = new NodeDescList();
							$('.node-right').html(nodeDescList.render({
									"data" : data.data,
									"type" : CAICUI.render.nodeType,
									'pageNo': data.pageNo,
									'pageSize': data.pageSize,
									'totalCount': data.totalCount
								}
							).el);
							window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
					});
					}else{
						var nodeDescList = new NodeDescList();
						this.nodeListCourse(function(data){
							$('.node-right').html(nodeDescList.render({
									"data" : data.data,
									"type" : 0,
									'pageNo': data.pageNo,
									'pageSize': data.pageSize,
									'totalCount': data.totalCount
								}
							).el);
							window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
						});
					}
				}
			},
			paginationNext : function(e){
				if(CAICUI.render.pageNo<=CAICUI.render.pageTotal-1){
					CAICUI.iGlobal.loading('.node-right');
					CAICUI.render.pageNo = +CAICUI.render.pageNo+1;
					if(CAICUI.render.paginationType){
						this.nodeList(function(data){
							var nodeDescList = new NodeDescList();
								$('.node-right').html(nodeDescList.render({
										"data" : data.data,
										"type" : CAICUI.render.nodeType,
										'pageNo': data.pageNo,
										'pageSize': data.pageSize,
										'totalCount': data.totalCount
									}
								).el);
								window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
						});
					}else{
						var nodeDescList = new NodeDescList();
						this.nodeListCourse(function(data){
							$('.node-right').html(nodeDescList.render({
									"data" : data.data,
									"type" : 0,
									'pageNo': data.pageNo,
									'pageSize': data.pageSize,
									'totalCount': data.totalCount
								}
							).el);
							window.CAICUI.nodeScroll = CAICUI.iGlobal.iScroll('body #wrapper-node');
						});
					}
				}
			},
			nodeListDescLink : function(e){
				e.stopPropagation();
				CAICUI.NavVideo = false;
				CAICUI.domRender = false;
				var that = CAICUI.iGlobal.getThat(e);
				//storage.setsingle('playlist-index'+CAICUI.render.courseId,"c|"+that.attr("data-index"));
		    window.location.hash = that.attr('link');
			},
			showPhoto : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatSrc = that.find('img').attr('src');
				var thatBigPhoto = $('body .show-photo-img-big');
				that.siblings().removeClass('active');
				that.addClass('active');
				thatBigPhoto.attr('src',thatSrc);
				window.CAICUI.nodeScroll.refresh();
			}
		})
		return Studycenter;
	});