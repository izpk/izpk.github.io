"undefined"==typeof FileReader&&console.log("FileReader undefined."),$.fn.srcLocalFile=function(e){return this.each(function(){var t=this;if(window.URL)this.src=window.URL.createObjectURL(e);else{var o=new FileReader;o.addEventListener("load",function(){t.src=this.result}),o.readAsDataURL(e)}})};var FileUploader=function(e,t,o){this.fileinput=e,this.posturl=t,this.postdata=o||{}};FileUploader.prototype.fileinput=null,FileUploader.prototype.selectedfiles=null,FileUploader.prototype.posturl=null,FileUploader.prototype.postdata=null,FileUploader.prototype.filename="upfile",FileUploader.prototype.filetype="image/jpg",FileUploader.prototype.thumb_width=800,FileUploader.prototype.onprogress=function(e,t){console.log("onprogress files: %o, %d",e,t)},FileUploader.prototype.onselected=function(e){console.log("selected files: %o",e)},FileUploader.prototype.oncomplete=function(e,t){console.log("oncomplete, code:%d, files: %o",e,t)},FileUploader.prototype.ononce=function(e,t){console.log("ononce: file: %o, e: %s",e,t)},FileUploader.prototype.onerror=function(e,t){console.log("onerror: file: %o, e: %s",e,t)},FileUploader.prototype.onabort=function(e,t){console.log("onabort: file: %o, e: %s",e,t)},FileUploader.prototype.init=function(e){var t=this;e?t.selectedfiles=e:(t.file_input_change=function(e){t.fileinput.value&&(t.selectedfiles=this.files,t.onselected(this.files))},t.fileinput.removeEventListener("change",t.file_input_change,!1),t.fileinput.addEventListener("change",t.file_input_change,!1))},FileUploader.prototype.start=function(e,t,o){if(!this.selectedfiles)return alert("Please select file!");e&&(this.posturl=e),t&&(this.postdata=t),o&&(this.filename=o);for(var n=this,i=[],l=0;l<this.selectedfiles.length;l++){var a=n.selectedfiles[l];+function(e){i.push(function(t){var o=function(e,o){var i=new XMLHttpRequest;i.open("POST",n.posturl,!0),i.setRequestHeader("X-Requested-With","XMLHttpRequest"),i.upload.onprogress=function(t){if(t.lengthComputable){var o=Math.round(100*t.loaded/t.total);n.onprogress(e,o)}};var l=new FormData;l.append(n.filename,o);for(k in n.postdata)l.append(k,n.postdata[k]);i.send(l),i.addEventListener("abort",function(t){n.onabort(e,t)}),i.addEventListener("error",function(t){n.onerror(e,t)}),i.addEventListener("load",function(o){n.ononce(e,o),t(null,e)})},i=new FileReader;i.onload=function(t){var i=t.target.result;if(n.thumb_width>0&&"data:image"==substr(i,0,10)&&"data:image/gif"!=substr(i,0,14)){var l=new Image;l.onload=function(){var t=document.createElement("canvas");if(l.width>n.thumb_width)var a=n.thumb_width,r=Math.ceil(n.thumb_width/l.width*l.height);else var a=l.width,r=l.height;t.width=a,t.height=r;var s=t.getContext("2d");s.clearRect(0,0,t.width,t.height),s.drawImage(l,0,0,l.width,l.height,0,0,a,r);var d=t.toDataURL(n.filetype,1);d.length>i.length&&(d=i);var p=d.substring(d.indexOf(",")+1),c={name:e.name,width:a,height:r,data:p};o(e,json_encode(c))},l.src=i}else{var a=i,r=a.substring(a.indexOf(",")+1),s={name:e.name,width:0,height:0,data:r};o(e,json_encode(s))}},i.onerror=function(e){console.log(e)},i.readAsDataURL(e)})}(a)}async.series(i,function(e,t){n.fileinput.value="",e?n.oncomplete(-1,t):n.oncomplete(0,t)})};