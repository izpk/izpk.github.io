;define([
	'jquery',
	'underscore',
	'backbone'
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'ac-right',
			template : _.template($('#template-ac-desc').html()),
			events : {
				'click .ac-desc-remove' : 'acRemove',
				'click .ac-list-info-video' : 'acVideoLink'
			},
			type : '',
			render : function(data){
				this.$el.html(this.template({
					'data' : {
						'bbsdetail' : data.data,
						'isme' : data.isme
					}
				}));
				return this;
			},
			acRemove : function(){
				$('body .ac-list-li.active .ac-list-remove').trigger('click');
			},
			acVideoLink : function(e){
				e.stopPropagation(); 
				CAICUI.NavVideo = false;
				CAICUI.domRender = false;
				// if($('body .message-main').hasClass('active')){
				// 	$('body .message-main').removeClass('active');
				// }
				var that = CAICUI.iGlobal.getThat(e);
				window.location.hash = that.attr('link');
			}
		});
		return Studycenter;
	});