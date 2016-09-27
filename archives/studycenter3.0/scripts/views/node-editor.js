;define([
	'jquery',
	'underscore',
	'backbone',
	
	],function($, _, Backbone){
		'use strict';
		var Studycenter = Backbone.View.extend({
			tagName : 'div',
			className : 'node-right-content',
			template : _.template($('#template-node-editor').html()),
			events : {
				'click .node-editor-isOpen-button' : 'isOpen',
			},
			type : '',
			render : function(data){
				this.$el.html(this.template({
					"data" : data
				}));

				return this;
			},
			getThat : function(e){
				return $(e.currentTarget);
			},
			isOpen : function(e){
				var that = CAICUI.iGlobal.getThat(e);
				var thatPrev = that.prev();
				if(that.hasClass('active')){
					that.removeClass('active');
					thatPrev.text('私有');
					CAICUI.render.isPublic = 1;
				}else{
					that.addClass('active');
					thatPrev.text('公开');
					CAICUI.render.isPublic = 0;
				}
			},
		});
		return Studycenter;
	});