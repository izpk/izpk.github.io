define(["jquery","underscore","backbone"],function(e,t,n){"use strict";return n.View.extend({tagName:"div",className:"node-right-content",template:t.template(e("#template-node-editor").html()),events:{"click .node-editor-isOpen-button":"isOpen"},type:"",render:function(e){return this.$el.html(this.template({data:e})),this},getThat:function(t){return e(t.currentTarget)},isOpen:function(e){var t=CAICUI.iGlobal.getThat(e),n=t.prev();t.hasClass("active")?(t.removeClass("active"),n.text("私有"),CAICUI.render.isPublic=1):(t.addClass("active"),n.text("公开"),CAICUI.render.isPublic=0)}})});