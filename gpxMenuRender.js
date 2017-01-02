function gpxMenu()
{
	this.Menu;
	this.CollapsedTitle;
	this.ResizeWidth;
	this.Code;
	this.CollapsedBackColor;
	this.MainBackColor;
	this.SecondaryBackColor;
	this.FontColor;

	// Databinding for property Menu
	this.SetMenu = function(data)
	{
		///UserCodeRegionStart:[SetMenu] (do not remove this comment.)
		this.Menu=data;		
		
		///UserCodeRegionEnd: (do not remove this comment.)
	}

	// Databinding for property Menu
	this.GetMenu = function()
	{
		///UserCodeRegionStart:[GetMenu] (do not remove this comment.)		
		
		///UserCodeRegionEnd: (do not remove this comment.)
	}

	this.show = function()
	{
		///UserCodeRegionStart:[show] (do not remove this comment.)
		
		if (this.IsPostBack)
			return;

		this.Refresh();		
		
		///UserCodeRegionEnd: (do not remove this comment.)
	}
	///UserCodeRegionStart:[User Functions] (do not remove this comment.)

	this.Refresh = function(){
		var _me = this;
		
		var callback = function(){
			
			_me.jquery( document ).ready(function( $ ){
				console.log("usercontrol.show: " + $.fn.jquery);
				
				var _id = "slimmenu"+(new Date()).getTime();
				
				var menu = _me.processMenu(_me.Menu, true);
				var buffer = new gx.text.stringBuffer();
				buffer.clear();
				buffer.append('<ul class="slimmenu" id="'+_id+'">'+menu+'</ul>');
				_me.getContainerControl().innerHTML = buffer.toString();
				
				$('#'+_id).slimmenu(
				{
					resizeWidth: _me.ResizeWidth,
					collapserTitle: _me.CollapsedTitle,
					animSpeed:'medium',
					indentChildren: true,
					childrenIndenter: '&raquo;'
				});
				
				
				$(".smClick").click(function(event){
						event.preventDefault();
						if (_me.ItemClick){
							var _code = $(this).attr("smcode");
							_me.Code = _code;
							_me.ItemClick()
						}
					}
				);
				
				// Personalización de colores
				var style = document.createElement('style');
				style.type = 'text/css';
				var css  = '#' + _me.ContainerName + ' *{color: '+ _me.FontColor+'}\r';
				    css += '#' + _me.ContainerName + ' .menu-collapser{background-color: '+ _me.CollapsedBackColor+'}\r';
				    css += '#' + _me.ContainerName + ' ul.slimmenu li{background-color: '+ _me.MainBackColor+'}\r';
				    css += '#' + _me.ContainerName + ' ul.slimmenu li ul li{background-color: '+ _me.SecondaryBackColor+'}';	
				style.innerHTML = css;
				document.getElementsByTagName('head')[0].appendChild(style);

			});
			
			if(!window.$)
				console.log("JQuery final: Not defined");
			else
				console.log("JQuery final: " + $.fn.jquery);

		} // callback

		loadJQuery(this, callback);
	}

	this.processMenu = function( menu, first ){
		if (typeof(menu)=="object" && menu.length){
			var items = [];
			for (var i = 0; i<menu.length; i++){
				var o = menu[i];
				
				var hasSubitems = false;
				if (o.SubItems){
					if (o.SubItems.length > 0){
						hasSubitems = true;
					}
				}			
				
				if (o.URL!=''){
					var lt = "";
					if (o.LinkTarget!="")
						lt = ' target="'+o.LinkTarget+'"';
					items.push( '<li><a href="'+o.URL+'" '+lt+'>'+gx.getMessage(o.Title)+'</a>');
				}else{
					if (hasSubitems)
						items.push( '<li><a href="#">'+gx.getMessage(o.Title)+'</a>');
					else
						items.push( '<li><a href="#" class="smClick" smcode="'+o.Code+'" >'+gx.getMessage(o.Title)+'</a>');
				}				

				if (hasSubitems)
					items.push(this.processMenu(o.SubItems, false));
				
			}
			
			if (first)
				return items.join('');
			else
				return '<ul>'+items.join('')+'</ul>';
		}
	}
	
    function loadJQuery(_me, callback) {

    	// Siempre se carga JQuery propio
		var loadjq = true;
		
		/*
		if(!window.jQuery){
			loadjq = true;
			console.log("JQuery default: Not defined load 1.9.1: " + loadjq);
		}else{
			if(jQuery.fn.jquery<"1.9.1")
				loadjq = true;
			console.log("JQuery default: " + jQuery.fn.jquery + " load 1.9.1: " + loadjq);
		}
		*/
			
    	var loadTool = function(){	
    			
			var finish = function(){
				// Si se tuvo que cargar JQuery de forma manual
				// Se deja el que estaba anteriormente
				if (loadjq)
					_me.jquery = $.noConflict(true);
				
				callback();
			};
			
			// Chequeo por slimmenu
			if( jQuery().slimmenu) {
				finish();
			}else
				loadScript( "gpxMenu/resources/jquery.slimmenu.min.js", finish);
    	}
		
		// si es la primera vez que levanta el usercontrol, 
		// revisa versión de jquery
		if (loadjq)
			loadScript( "gpxMenu/resources/jquery-1.9.1.min.js",  loadTool)
		else
			loadTool();
    }
	
    function loadScript(url, callback){
    	var basepath = "";
    	if (gx.basePath!="")
    		basepath = "/"+gx.basePath;
    	basepath += gx.staticDirectory;

    	url = basepath+url;
		console.log("loading: " + url);
		
		var script = document.createElement("script")
		script.type = "text/javascript";

		if (script.readyState) { //IE
			script.onreadystatechange = function () {
				if (script.readyState == "loaded" || script.readyState == "complete") {
					script.onreadystatechange = null;
					callback();
				}
			};
		} else { //Others
			script.onload = function () {
				callback();
			};
		}

		script.src = url;
		document.getElementsByTagName("head")[0].appendChild(script);
    }
	
	
	
	
	
	
	
	
	
	
	///UserCodeRegionEnd: (do not remove this comment.):
}
