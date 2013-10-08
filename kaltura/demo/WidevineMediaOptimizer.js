var WidevinePlugin;

var widevineDownload = "http://cs.video.gogoinflight.com/media";

	var emm_url;
    //var emm_url     = "https://fcpstage.shibboleth.tv/widevine/cypherpc/cgi-bin/GetEMMs.cgi";
	

var widevine = function() {

//	alert("widvine function");
	
    var debug = false;


    var debug_flags = "";
   

    var auto_install_upgrade = true;
    var prompt_upgrade = true;

    var windows_chrome_installer_exe = "installer/widevinemediaoptimizerchrome.exe";
    var windows_activex_installer_exe = widevineDownload+"/static/installer/widevinemediaoptimizerie.exe";
    var windows_activex_location_cab = widevineDownload+"/static/installer/WidevineMediaTransformer.cab";
    var windows_activex_location_xp_cab = widevineDownload+"/static/installer/WidevineMediaTransformer_xp.cab";
    var windows_firefox_location = widevineDownload+"/static/installer/widevinemediaoptimizer_win.xpi";
    var macintosh_firefox_location = widevineDownload+"/static/installer/widevinemediaoptimizer.dmg";
    var safari_location = widevineDownload+"/static/installer/widevinemediaoptimizer.dmg";

    //var version ="5.0.0.000";
	var version ="5.0.0.5284";
    var ie_version ="5,0,0,000";

    //var signon_url = "https://staging.shibboleth.tv/widevine/cypherpc/cgi-bin/SignOn.cgi";
    //var log_url = "https://staging.shibboleth.tv/widevine/cypherpc/cgi-bin/LogEncEvent.cgi";
    //var emm_url = "https://staging.shibboleth.tv/widevine/cypherpc/cgi-bin/GetEMMs.cgi";

    var signon_url = "https://fcpstage.shibboleth.tv/widevine/cypherpc/cgi-bin/SignOn.cgi";
    var log_url = "https://fcpstage.shibboleth.tv/widevine/cypherpc/cgi-bin/LogEncEvent.cgi";
    //var emm_url = "https://fcpstage.shibboleth.tv/widevine/cypherpc/cgi-bin/GetEMMs.cgi";
    var emm_url = "http://107.22.231.108/widevine/voddealer/cgi-bin/GetEMMs.cgi";
	
//    var signon_url = "https://fcpstage.shibboleth.tv/widevine/cypherpc/cgi-bin/SignOn.cgi";
//    var log_url = "https://fcpstage.shibboleth.tv/widevine/cypherpc/cgi-bin/LogEncEvent.cgi";
// 	emm_url     = "http://video.gogoinflight.com/video/WidevineProxy/"+cacheId;
//	alert("URL: " + emm_url);
	emm_url = encodeURI(emm_url);
	 




   // var portal = "ideanova";
    var portal = "aircell";



    xpi_mac={'Widevine Media Transformer Plugin':macintosh_firefox_location};
    xpi_win={'Widevine Media Transformer Plugin':windows_firefox_location};

    function doDetect( type, value  ) {
        return eval( 'navigator.' + type + '.toLowerCase().indexOf("' + value + '") != -1' );
    }

    var java_installed = false;
    var current_ver = true;
    var no_upgrade = false;

    function detectMac()     { return doDetect( "platform", "mac" );}
    function detectWin32()   { return doDetect( "platform", "win32" );}
    function detectIE()      { return doDetect( "userAgent", "msie" ); }
    function detectFirefox() { return doDetect( "userAgent", "firefox" ); }
    function detectSafari()  { return doDetect( "userAgent", "safari" ); }
    function detectChrome()  { return doDetect( "userAgent", "chrome" ); }

    function detectVistaOrWindows7()   { return doDetect( "userAgent", "windows nt 6" ); }

    function getCookie(c_name)
    {
        if (document.cookie.length>0)
            {
                var c_start=document.cookie.indexOf(c_name + "=")
                    if (c_start!=-1)
                        {
                            c_start=c_start + c_name.length+1;
                            c_end=document.cookie.indexOf(";",c_start);
                            if (c_end==-1) c_end=document.cookie.length;
                            return unescape(document.cookie.substring(c_start,c_end))
                        }
            }
        return ""
    }

	function getInstallationPath()
	{
		if (detectWin32())
		{
			if (detectIE()) return windows_activex_installer_exe;
			if (detectFirefox()) return /*windows_firefox_location*/ "javascript:widevine.installFFWin()";
			//if (detectFirefox()) return windows_firefox_location;
			if (detectChrome()) return windows_chrome_installer_exe;
		}
		else
		{
			if (detectSafari()) return safari_location;
			if (detectFirefox()) return "javascript:widevine.installFFMac()";
		}
	}

			
    function setCookie(c_name,value,expireseconds)
    {
        var exdate=new Date();
        exdate.setSeconds(exdate.getSeconds()+expireseconds);
        document.cookie=c_name+ "=" +escape(value)+
            ((expireseconds==null) ? "" : ";expires="+exdate.toGMTString())
    }








    function xpinstallCallback(url, status)
    {
        var bPluginExists = false;

        if (status == 0){
            msg = "XPInstall Test:   PASSED\n";
        }else{
            alert("Installation Failed");
            msg = "XPInstall Test:   FAILED\n";
        }
    }
    
    function writeDebugCell( name, bold ) {
        if ( bold ) {
            return "<td><b>" + name + "</b></td>";
        } else {
            return "<td><s>" + name + "</s></td>";
        }
    }
    
    function writeDebugMimeArray( values ){
        var result = "";
        for ( value in values ) {
            if ( values[value] ) {
                result += "<td><table><tr><td>" + values[value].description + "</td></tr><tr><td>"+values[value].type+"</td></tr><tr><td>"+values[value].enabledPlugin+"</td></tr></table></td>";
            }
        }
        return result;
    }
    
    function DebugInfo() {
        var result = "";
        result += "<table border=1>";
            
        result += "<tr><td>Platform</td>";
        result += writeDebugCell( "Macintosh", detectMac() );
        result += writeDebugCell( "Windows", detectWin32() );
        if ( detectWin32() ) {
            result += writeDebugCell( "Vista/Windows7", detectVistaOrWindows7() );
        }
        result += "</tr>";
            
        result += "<tr><td>Browser</td>";
        result += writeDebugCell( "IE", detectIE() );
        result += writeDebugCell( "Firefox", detectFirefox() );
        result += writeDebugCell( "Safari", detectSafari() );
        result += writeDebugCell( "Chrome", detectChrome() );
        result += "</tr>";
            
        if ( !detectIE() ) {
            result += "<tr><td>MIME types</td>";
            result += writeDebugMimeArray( navigator.mimeTypes );
            result += "</tr>";
        }

        result += "<tr><td>Installed</td><td>";
        if ( navigator.mimeTypes['application/x-widevinemediaoptimizer'] ) {
            var aWidevinePlugin = document.getElementById('WidevinePlugin');
            if ( aWidevinePlugin ) {
                result += aWidevinePlugin.GetVersion();
            } else {
                result += "MIME type exists but could not load plugin";
            }
        } else {
            result += "MIME Type Not Found";
        }
        result += "</td></tr>";
            
        result += "</table>";
        return result;
    }







    function AddDiv( html , divId) {
        var div = document.createElement( "div" );
		if (divId != "") div.id = divId;
        document.body.appendChild( div );
        div.innerHTML = html;
        return div;
    }









    function InsertIE8InstallText(show_refresh) {
	//alert("IE PC");
	
        var installDiv = document.createElement("div");
        installDiv.style.width = '100%';
        installDiv.style.height = '100%';
        installDiv.style.backgroundColor = '#3f3f3f';
        installDiv.style.border = 'none 0px';		
        //installDiv.style.left = document.body.clientWidth / 4;
		installDiv.style.left = 0;
		//installDiv.style.left = document.body.clientWidth;
        installDiv.style.top = 0;
        installDiv.style.position = 'absolute';
        installDiv.style.zIndex = '10';
        installDiv.style.textAlign = 'center';
		installDiv.margin = 'auto, 0';
		installDiv.padding = '0';
		installDiv.background = '#3f3f3f; !important';

		installDiv.id="popDiv";
        installDiv.style.filter = 'alpha(opacity=95)';

	var table_width = "50%";
	if (show_refresh){
		table_width = "33%"
	}

	var install_html = 
	'<p class="toplinks"></p>'           
	
	+ '<img src="/static/img/wvpluginfireie.png" usemap = #wvmap border=0>' 
	+ '<map name=wvmap>'
        + '<area shape=Rect Coords=81,187,255,218 href='+getInstallationPath()+'>'
        + '<area shape=Rect Coords==450,38,478,47 href="#" onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>'
        + '<area shape=Rect Coords=231,38,434,47 href=https://custhelp.gogoinflight.com/app/home/c/73>'
        + '<area shape=Rect Coords=82,444,149,474 onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>'
	+ '</map>'     
	+ '<style type="text/css">'
		+ '<!--'
		+ 'body {'
		+ '  margin: 0; padding: 0; position: relative'
		+ '   }'
		+ '-->'
		+ '</style>'
	
		installDiv.innerHTML = install_html;
        document.body.appendChild(installDiv);

    }

    function InsertFFPCInstallText(show_refresh) {
	//alert("FF on PC");
        var installDiv = document.createElement("div");
        installDiv.style.width = '100%';
        installDiv.style.height = '100%';
        installDiv.style.backgroundColor = '#3f3f3f';
        installDiv.style.border = 'none 0px';		
        //installDiv.style.left = document.body.clientWidth / 4;
		installDiv.style.left = 0;
		//installDiv.style.left = document.body.clientWidth;
        installDiv.style.top = 0;
        installDiv.style.position = 'absolute';
        installDiv.style.zIndex = '1000';
        installDiv.style.textAlign = 'center';
		installDiv.margin = 'auto, 0';
		installDiv.padding = '0';
		installDiv.background = '#3f3f3f; !important';

		installDiv.id="popDiv";
        //installDiv.style.filter = 'alpha(opacity=90)';

	var table_width = "50%";
	if (show_refresh){
		table_width = "33%"
	}

	var install_html = 
	'<p class="toplinks"></p>'           
	+ '<style type="text/css">'
	+ '<!--'
	+ 'body {'
    + '  margin: 0; padding: 0; position: relative; !important'
    + '   }'
	+ '-->'
	+ '</style>'

	+ '<img src="/static/img/wvpluginfirefoxpc.png" usemap = #wvmap border=0>' 
	+ '<map name=wvmap>'
	+ '<area shape=Rect Coords=426,223,581,251 href='+getInstallationPath()+'>'  		
	+ '<area shape=Rect Coords=550,26,578,35 onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>' 
	+ '<area shape=Rect Coords=330,25,536,36 href=https://custhelp.gogoinflight.com/app/home/c/73>' 
	//+ '<area shape=Rect Coords=633,31,668,42 href="#" onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>'
	+ '</map>'     
	
		installDiv.innerHTML = install_html;
        document.body.appendChild(installDiv);

    }

    function InsertFFMACInstallText(show_refresh) {
	//alert("FF on MAC");
	
        var installDiv = document.createElement("div");

        installDiv.style.width = '100%';
        installDiv.style.height = '100%';
        installDiv.style.backgroundColor = '#3f3f3f';
        installDiv.style.border = 'none 0px';		
        //installDiv.style.left = document.body.clientWidth / 4;
		installDiv.style.left = 0;
		//installDiv.style.left = document.body.clientWidth;
        installDiv.style.top = 0;
        installDiv.style.position = 'absolute';
        installDiv.style.zIndex = '1000';
        installDiv.style.textAlign = 'center';
		installDiv.margin = 'auto, 0';
		installDiv.padding = '0';
		installDiv.background = '#3f3f3f; !important';

		installDiv.id="popDiv";
        //installDiv.style.filter = 'alpha(opacity=90)';

	var table_width = "50%";
	if (show_refresh){
		table_width = "33%"
	}

	var install_html = 
	'<p class="toplinks"></p>'           
	+ '<style type="text/css">'
	+ '<!--'
	+ 'body {'
    + '  margin: 0; padding: 0; position: relative; !important'
    + '   }'
	+ '-->'
	+ '</style>'
	+ '<img src="/static/img/wvpluginfirefoxmac.png" usemap = #wvmap border=0>' 
	+ '<map name=wvmap>'
	+ '<area shape=Rect Coords=424,222,583,247 href='+getInstallationPath()+'>'  		
	//+ '<area shape=Rect Coords=520,460,660,490 onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>' 
	+ '<area shape=Rect Coords=332,25,537,35 href=https://custhelp.gogoinflight.com/app/home/c/73>' 
	+ '<area shape=Rect Coords=550,24,583,33 href="#" onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>'
	+ '</map>'     

		installDiv.innerHTML = install_html;
        document.body.appendChild(installDiv);

    }	
	function InsertSafariInstallText() {

	//alert("Safari on MAC");
	
        var installDiv = document.createElement("div");
        installDiv.style.width = '100%';
        installDiv.style.height = '100%';
        installDiv.style.backgroundColor = '#3f3f3f';
        installDiv.style.border = 'none 0px';		
        //installDiv.style.left = document.body.clientWidth / 4;
		installDiv.style.left = 0;
		//installDiv.style.left = document.body.clientWidth;
        installDiv.style.top = 0;
        installDiv.style.position = 'absolute';
        installDiv.style.zIndex = '1000';
        installDiv.style.textAlign = 'center';
		installDiv.margin = 'auto, 0';
		installDiv.padding = '0';
		installDiv.background = '#3f3f3f; !important';

		installDiv.id="popDiv";
        //installDiv.style.filter = 'alpha(opacity=90)';

		var table_width = "50%";

		var install_html = 
		'<p class="toplinks"></p>'           
		+ '<style type="text/css">'
		+ '<!--'
		+ 'body {'
		+ '  margin: 0; padding: 0; position: relative; !important'
		+ '   }'
		+ '-->'
		+ '</style>'

		+ '<img src="/static/img/wvpluginsafarimac.png" usemap = #wvmap border=0>' 
		+ '<map name=wvmap>'
		+ '<area shape=Rect Coords=420,232,578,259 href='+getInstallationPath()+'>'  		
		//+ '<area shape=Rect Coords=523,470,657,487 onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>' 
		+ '<area shape=Rect Coords=332,23,537,36 href=https://custhelp.gogoinflight.com/app/home/c/73>' 
		+ '<area shape=Rect Coords=552,25,581,34 href="#" onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>' 
		+ '</map>'     

			installDiv.innerHTML = install_html;
			document.body.appendChild(installDiv);

    }

	function InsertSafariInstallTextOld() {
                var installDiv = document.createElement("div");
                installDiv.style.width = '100%';
                installDiv.style.height = '100%';
                installDiv.style.backgroundColor = 'white';
                installDiv.style.left = '0';
                installDiv.style.top = '0';
                installDiv.style.position = 'absolute';
                installDiv.style.zIndex = '10';
                installDiv.style.textAlign = 'center';
                installDiv.style.filter = 'alpha(opacity=90)';

                var install_html = "<center><table align='center' style='margin-top: 100px; background-image: url(/static/images/widevine/install_image.png); width: 600px; height: 300px; font-size: 16pt; font-family: sans-serif'>"
                + "<td style='padding-top: 30px; text-align: center'>Safari - Please run the dmg file. Page will reload after install/upgrade completes</td></table></center>";
                installDiv.innerHTML = install_html;
                document.body.appendChild(installDiv);

                //WVPluginCheck();
    }


	function InsertChromeInstallText() {
	
        var installDiv = document.createElement("div");
        installDiv.style.width = '100%';
        installDiv.style.height = '100%';
        installDiv.style.backgroundColor = '#3f3f3f';
        installDiv.style.border = 'none 0px';		
        //installDiv.style.left = document.body.clientWidth / 4;
		installDiv.style.left = 0;
		//installDiv.style.left = document.body.clientWidth;
        installDiv.style.top = 0;
        installDiv.style.position = 'absolute';
        installDiv.style.zIndex = '1000';
        installDiv.style.textAlign = 'center';
		installDiv.margin = 'auto, 0';
		installDiv.padding = '0';
		installDiv.background = '#3f3f3f; !important';

		installDiv.id="popDiv";
        //installDiv.style.filter = 'alpha(opacity=90)';


	var table_width = "50%";

	
	var install_html = 

	'<p class="toplinks"></p>'           
	+ '<style type="text/css">'
	+ '<!--'
	+ 'body {'
    + '  margin: 0; padding: 0; position: relative; !important'
    + '   }'
	+ '-->'
	+ '</style>'
	
	+ '<img src="/static/img/wvpluginchrome.png" usemap = #wvmap border=0>' 
	+ '<map name=wvmap>'
	+ '<area shape=Rect Coords=517,240,653,265 href='+getInstallationPath()+'>'  		
	+ '<area shape=Rect Coords==432,28,461,37 href="#" onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>' 
	+ '<area shape=Rect Coords=214,27,416,36 href=https://custhelp.gogoinflight.com/app/home/c/73>' 
	//+ '<area shape=Rect Coords=486,31,520,40 href="#" onclick=\'document.getElementById(\"popDiv\").style.display="none"\'/>'
	+ '</map>'     

	
		installDiv.innerHTML = install_html;
        document.body.appendChild(installDiv);

		//WVPluginCheck();
    }




	function chromeInstallWin(){
	//Install Aircell - remove next line to prevent installation popup
          	InsertChromeInstallText();
			if (detectVistaOrWindows7()){
				//alert("Juraj is on WIN7");
                //window.open(windows_chrome_installer_exe,'_blank');
                  var ifrm = document.createElement("iframe");
                  ifrm.setAttribute("src",windows_chrome_installer_exe ); 
                  ifrm.setAttribute("style","display:none;");
                  document.body.appendChild(ifrm);

			}
			else{
				//alert("Claudia is on XP");
				//Arun N- Commenting below line 
                //window.open(windows_chrome_installer_exe,'_blank');
                //Arun N- Adding  below lines 
                var ifrm = document.createElement("iframe");
                ifrm.setAttribute("src",windows_chrome_installer_exe ); 
                ifrm.setAttribute("style","display:none;");
                document.body.appendChild(ifrm);

			}

	}

	function chromeInstallMac(){
	//Install Aircell - remove next line to prevent installation popup
                InsertChromeInstallText();
                window.open(safari_location,'_blank');

        }

	function safariInstallMac(){
	//Install Aircell - remove next line to prevent installation popup
                InsertSafariInstallText();
                //window.open(safari_location,'_blank');

        }
		
		
		
		
    	function pluginInstalledIE(){
                try{
                        var o = new ActiveXObject("npwidevinemediaoptimizer.WidevineMediaTransformerPlugin");
			o = null;
                       	return true;

                }catch(e){
                        return false;
                }
        }


	function upgradeIEPlugin(){
                try{
                        var o = new ActiveXObject("npwidevinemediaoptimizer.WidevineMediaTransformerPlugin");
                        var ieversion = o.installVersion;
                        return checkVersion(ieversion);
                }catch(e){
                        return false;
                }
        }








	function EmbedText() {
			if ( detectIE() ) {
	    		if (pluginInstalledIE()){	 
				return '<object id="WidevinePlugin" classid=CLSID:defa762b-ebc6-4ce2-a48c-32b232aac64d ' +
                    				'hidden=true style="display:none" height="0" width="0">' +
                    				'<param name="default_url" value="' + signon_url + '">' +
                    				'<param name="emm_url" value="' + emm_url + '">' +
                    				'<param name="log_url" value="' + log_url + '">' +
                    				'<param name="portal" value="' + portal + '">' +
                                                '<param name="user_agent" value="' + navigator.userAgent + '">' +
                    				'</object>' ;
                     	}
        	}
			else 
			{
            		if ( navigator.mimeTypes['application/x-widevinemediaoptimizer'] ) {

                		return( '<embed id="WidevinePlugin" type="application/x-widevinemediaoptimizer" default_url="' + signon_url +
                        		'" emm_url="' + emm_url +
                        		'" log_url="' + log_url +
                        		'" portal="' + portal +
                        		'" height="0" width="0' +
                                        '" user_agent="' + navigator.userAgent +

                        		'">' );
            		} else {
                		return "";
            		}
        	}


    }














    function EmbedUpgrade( div , upgrading) {
        if(!auto_install_upgrade){
            	return "";
        }
	if(upgrading && prompt_upgrade){
		if(!confirm("A new version of the Widevine plugin is available.\nWould you like to upgrade?")){
			if (detectIE()){
				div.innerHTML = '<object id="WidevinePlugin" classid=CLSID:f8eb59ec-35a8-4b59-8f67-b3e19147fed6 ' +
                                        'hidden=true style="display:none" height="0" width="0">' +
                                        '<param name="default_url" value="' + signon_url + '">' +
                                        '<param name="emm_url" value="' + emm_url + '">' +
                                        '<param name="log_url" value="' + log_url + '">' +
                                        '<param name="portal" value="' + portal + '">' +
                                        '<param name="user_agent" value="' + navigator.userAgent + '">' +
                                        '</object>' ;
			}
			no_upgrade = true;
			return "";
		}
	}











        if ( detectIE() ) {
		if(upgradeIEPlugin()){
			/*if (detectVistaOrWindows7() || navigator.appVersion.indexOf("MSIE 8.0") == -1){
                        	var codebase = windows_activex_installer_exe + "#version=" + ie_version;





				//alert("WV Plugin IE if statement");

                            	div.innerHTML = '<object id="WidevinePlugin" classid=CLSID:f8eb59ec-35a8-4b59-8f67-b3e19147fed6 ' +
                                      	'codebase="' + codebase + '" ' +
                                    	'hidden=true style="display:none" height="0" width="0">' +
                                     	'<param name="default_url" value="' + signon_url + '">' +
                                     	'<param name="emm_url" value="' + emm_url + '">' +
                                      	'<param name="log_url" value="' + log_url + '">' +
                                      	'<param name="portal" value="' + portal + '">' +
                                        '<param name="user_agent" value="' + navigator.userAgent + '">' +
                                      	'</object>' ;
                    	}else{
                        	var codebase = windows_activex_installer_exe + "#version=" + ie_version;
				//alert("WV plugin IE else statement");

                            	div.innerHTML = '<object id="WidevinePlugin" classid=CLSID:f8eb59ec-35a8-4b59-8f67-b3e19147fed6 ' +
                                      	'codebase="' + codebase + '" ' +
                                    	'hidden=true style="display:none" height="0" width="0">' +
                                     	'<param name="default_url" value="' + signon_url + '">' +
                                     	'<param name="emm_url" value="' + emm_url + '">' +
                                      	'<param name="log_url" value="' + log_url + '">' +
                                      	'<param name="portal" value="' + portal + '">' +
                                        '<param name="user_agent" value="' + navigator.userAgent + '">' +
                                      	'</object>' ;*/
						
                        	InsertIE8InstallText(true);
                      	//}
		}
	} else if(detectChrome()){
		if(detectWin32()){
                	chromeInstallWin();
		}else{
			chromeInstallMac();
		}
        } else if ( detectSafari() ) {
		if(upgrading){
	//Install Aircell - remove next line to prevent installation popup		
			setTimeout("window.open('" + safari_location + "', '_self');" , 1000);
		}else{	
	//Install Aircell - remove next line to prevent installation popup
			//Do not show pop up image for Android tablets.
			if((navigator.userAgent.match(/Android 3.1/i) != "Android 3.1") && (navigator.userAgent.match(/Android 3.2/i) != "Android 3.2") && (navigator.userAgent.match(/Android 4.0.3/i) != "Android 4.0.3")){
				safariInstallMac();
			}
			//setTimeout("if (confirm('MAC Safari - Would you like to install the Widevine plugin?')){window.open('" + safari_location + "', '_self');}" , 1000);
        	}
	} else if ( detectFirefox() ) {
            if ( detectMac() ) {
			if(upgrading)
				InstallTrigger.install( xpi_mac, xpinstallCallback );
			else{
	//Install Aircell - replace next line to prevent installation popup
				InsertFFMACInstallText(true);
                InstallTrigger.install( xpi_mac, xpinstallCallback );
				}
            } else {
	//Install Aircell - replace next line to prevent installation popup
		if(upgrading)
			InstallTrigger.install( xpi_win, xpinstallCallback );
		else{
			InsertFFPCInstallText(true);
            InstallTrigger.install( xpi_win, xpinstallCallback );
			}
            }
	}
        return "";
    }
 
    function upgradeCheck(installedVersion){
	if (installedVersion == ""){
		return true;
	}else if (!auto_install_upgrade){
		return false;
	}else if (no_upgrade){
		return false;
	}

	return checkVersion(installedVersion);
    }

 	function checkVersion(check_version){
		var currentVer = version.split(".");
        	var installedVer = check_version.split(".");

        	if( currentVer[0] > installedVer[0] ){
                	return true;
        	} else if ( (currentVer[1] > installedVer[1])
                        	&& (parseInt(currentVer[0]) == parseInt(installedVer[0])) ){
                	return true;
        	} else if ( (currentVer[2] > installedVer[2])
                        	&& (parseInt(currentVer[1]) == parseInt(installedVer[1])) ){
                	return true;
        	} else if ( (currentVer[3] > installedVer[3])
                        	&& (parseInt(currentVer[2]) == parseInt(installedVer[2])) ){
                	return true;
        	} else {
                	return false;
		}
	}


    return {


	versionInstalled:function(v){
		return upgradeCheck(v);	
	}

	,
    
	flashVersion:function(){
		return current_ver;
	}
	,

	installText:function()
	{
		InsertIE8InstallText(true);
	}
    ,
    destruct:function() {
		var wdvPlugin = document.getElementById('wdvPlugin');
		if (wdvPlugin != null) document.body.removeChild(wdvPlugin);
	}
    ,
    installFFWin: function()

    {

            InstallTrigger.install( xpi_win, xpinstallCallback );
            
    }
    ,
    installFFMac: function ()
            
    {
                        
        InstallTrigger.install( xpi_mac, xpinstallCallback );
            
    }
    ,

    init:function() {
	   
	   try{
             	var major_ver = 0;
            	var version = GetSwfVer();
           	if(version.indexOf(" ") != -1){
              		version = version.split(" ")[1];
            	}else if (version.indexOf("=") != -1){
			version = version.split(" ")[1];
		}
        	current_ver = version;

          	if(version.indexOf(",") != -1){
                	major_ver = parseInt(version.split(",")[0]);
             	}else if(version.indexOf(".") != -1){
                     	major_ver = parseInt(version.split(".")[0]);
            	}
           	if (major_ver < 10){
                	alert("Please upgrade to Flash 10+ to continue. Current version: " + current_ver);
			return "";
          	}
     	    }catch(e){
		current_ver = "";
			//Do not show this for iPad or Android
			if ( (navigator.userAgent.match(/iPad/i) != "iPad") && ( (navigator.userAgent.match(/Android 3.1/i) != "Android 3.1") && (navigator.userAgent.match(/Android 3.2/i) != "Android 3.2") && (navigator.userAgent.match(/Android 4.0.3/i) != "Android 4.0.3")) )
			{
				alert("Flash not detected. Please install Flash to continue.");
			}
           	
		return "";
            }



		var txt = "";
	    try {

		txt = EmbedText();
		var div = AddDiv(txt , "wdvPlugin");

		if ( debug ) {
		    	AddDiv( DebugInfo() );
		}

	
		if (!detectIE()){
              		var aWidevinePlugin = document.getElementById('WidevinePlugin');	
			if ( aWidevinePlugin == null ){
				EmbedUpgrade( div, false);
			}else if (aWidevinePlugin != null 
				&& (!aWidevinePlugin.GetVersion || upgradeCheck(aWidevinePlugin.GetVersion()))  ){
				EmbedUpgrade( div, true);
			}
		}else{
			if (upgradeIEPlugin()){
				EmbedUpgrade( div, true);
			}
		}
	    }
	    catch(e) {
		alert("widevine.init exception: " + e.message);
	    }
		
		return txt;
	}
    };
}();

function WVGetURL( arg ) {
	var aWidevinePlugin = document.getElementById('WidevinePlugin');
      	try {
        	transformedUrl = aWidevinePlugin.Translate( arg );
      	}
     	catch (err) {
      		return "Error calling Translate: " + err.description;
     	}
       	return transformedUrl;
}
     
function WVGetCommURL () {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
                return aWidevinePlugin.GetCommandChannelBaseUrl();
        } catch (err) {
                //alert("Error calling GetCommandChannelBaseUrl: " + err.description);
        }
        return "http://127.0.0.1:20001/cgi-bin/";
}

function WVSetPlayScale( arg ) {
	var aWidevinePlugin = document.getElementById('WidevinePlugin');
      	try {
       		return aWidevinePlugin.SetPlayScale( arg );
       	}
       	catch (err) {
       		alert ("Error calling SetPlayScale: " + err.description);
       	}
       	return 0;
}

function WVGetMediaTime( arg ) {
      	var aWidevinePlugin = document.getElementById('WidevinePlugin');
       	try {
         	return aWidevinePlugin.GetMediaTime( arg );
       	} catch (err) {
         	alert("Error calling GetMediaTime: " + err.description);
      	}
       	return 0;
}

function WVGetClientId() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
                return aWidevinePlugin.getClientId();
        }
        catch (err) {
                alert ("Error calling GetClientId: " + err.description);
        }
        return 0;
}


function WVSetDeviceId(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setDeviceId(arg);
        }
        catch (err) {
                alert ("Error calling SetDeviceId: " + err.description);
        }
        return 0;
}

function WVSetStreamId(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setStreamId(arg);
        }
        catch (err) {
                alert ("Error calling SetStreamId: " + err.description);
        }
        return 0;
}

function WVSetClientIp(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setClientIp(arg);
        }
        catch (err) {
                alert ("Error calling SetClientIp: " + err.description);
        }
        return 0;
}

function WVSetEmmURL(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
		if (aWidevinePlugin == null) {widevine.installText(); return 0;}
        try {
               return aWidevinePlugin.setEmmUrl(arg);
        }
        catch (err) {
                //alert ("Error calling SetEmmURL: " + err.description);
				widevine.installText();
//                alert ("The video player add-on install is starting.  Please follow the steps below to complete the installation.  Enjoy the movie!:\n " +
//		"1.  Please wait until you see the add-on install message below your browser toolbar then click ok in this window and follow the intructions in your browser to install the add-on.\n 2.  This message will pop up again signaling the start of the add-on install.  Please allow the program to make changes to your computer.  This allows the actual add-on to be installed.\n 3.   Once the add-on is installed Windows Firewall may ask to allow this program to run.  Make sure you allow access so the add-on can run and you can view the movie." );

        }
        return 0;
}


function WVSetEmmAckURL(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setEmmAckUrl(arg);
        }
        catch (err) {
                alert ("Error calling SetEmmAckUrl: " + err.description);
        }
        return 0;
}

function WVSetHeartbeatUrl(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setHeartbeatUrl(arg);
        }
        catch (err) {
                alert ("Error calling SetHeartbeatUrl: " + err.description);
        }
        return 0;
}


function WVSetHeartbeatPeriod(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setHeartbeatPeriod(arg);
        }
        catch (err) {
                alert ("Error calling SetHeartbeatPeriod: " + err.description);
        }
        return 0;
}



function WVSetOptData(arg) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.setOptData(arg);
        }
        catch (err) {
                alert ("Error calling SetOptData: " + err.description);
        }
        return 0;
}

function WVGetDeviceId() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getDeviceId();
        }
        catch (err) {
                alert ("Error calling GetDeviceId: " + err.description);
        }
        return 0;
}

function WVGetStreamId() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getStreamId();
        }
        catch (err) {
                alert ("Error calling GetStreamId: " + err.description);
        }
        return 0;
}

function WVGetClientIp() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getClientIp();
        }
        catch (err) {
                alert ("Error calling GetClientIp: " + err.description);
        }
        return 0;
}


function WVGetEmmURL() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getEmmUrl();
        }
        catch (err) {
                alert ("Error calling GetEmmURL: " + err.description);
        }
        return "";
}


function WVGetEmmAckURL() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getEmmAckUrl();
        }
        catch (err) {
                alert ("Error calling GetEmmAckUrl: " + err.description);
        }
        return "";
}

function WVGetHeartbeatUrl() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getHeartbeatUrl();
        }
        catch (err) {
                alert ("Error calling GetHeartbeatUrl: " + err.description);
        }
        return "";
}



function WVGetHeartbeatPeriod() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getHeartbeatPeriod();
        }
        catch (err) {
                alert ("Error calling GetHeartbeatPeriod: " + err.description);
        }
        return "";
}


function WVGetOptData() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.getOptData();
        }
        catch (err) {
                alert ("Error calling GetOptData: " + err.description);
        }
        return "";
}


function WVAlert( arg ) {
	alert(arg);
     	return 0;
}







function WVPDLCancel(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_Cancel(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_Stop: " + err.description);
        }
        return "";
}
function WVPDLGetProgress(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetProgress(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_GetProgress: " + err.description);
        }
        return "";
}



function WVPDLGetTotalSize(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetTotalSize(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_GetTotalSize: " + err.description);
        }
        return "";
}











function WVPDLFinalize(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_Finalize(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_Finalize: " + err.description);
        }
        return "";
}

function WVPDLCheckHasTrickPlay(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_CheckHasTrickPlay(pdlPath);
        }
        catch (err) {
               //alert ("Error calling PDL_CheckHasTrickPlay: " + err.description);
        }
        return "";
}






function WVPDLGetTrackBitrate(pdlPath, trackNumber) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetTrackBitrate(pdlPath, trackNumber);
        }
        catch (err) {
               //alert ("Error calling PDL_GetTrackBitrate: " + err.description);
        }
        return "";
}

function WVPDLGetTrackCount(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetTrackCount(pdlPath);
        }
        catch (err) {
                //alert ("Error calling PDL_GetTrackCount: " + err.description);
        }
        return "";
}

function WVPDLGetDownloadMap(pdlPath) {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.PDL_GetDownloadMap(pdlPath);
        }
        catch (err) {
                //alert ("Error calling PDL_GetDownloadMap: " + err.description);
        }
        return "";
}
function WVGetLastError() {
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.GetLastError();
        }
        catch (err) {
               //alert ("Error calling GetLastError: " + err.description);
        }
        return "";
}

function WVRegisterAsset(assetPath, requestLicense){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.RegisterAsset(assetPath, requestLicense);
        }
        catch (err) {
               //alert ("Error calling RegisterAsset: " + err.description);
        }
        return "";

}


function WVQueryAsset(assetPath){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.QueryAsset(assetPath);
        }
        catch (err) {
               //alert ("Error calling QueryAsset: " + err.description);
        }
        return "";

}

function WVQueryAllAssets(){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.QueryAllAssets();
        }
        catch (err) {
               //alert ("Error calling QueryAllAssets: " + err.description);
        }
        return "";

}



function WVUnregisterAsset(assetPath){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.UnregisterAsset(assetPath);
        }
        catch (err) {
               //alert ("Error calling UnregisterAsset: " + err.description);
        }
        return "";
}

function WVUpdateLicense(assetPath){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
               return aWidevinePlugin.UpdateLicense(assetPath);
        }
        catch (err) {
               //alert ("Error calling UpdateAssetLicense: " + err.description);
        }
        return "";
}

function WVCancelAllDownloads(){
        var aWidevinePlugin = document.getElementById('WidevinePlugin');
        try {
                if (aWidevinePlugin){
                        var downloading_list = eval(aWidevinePlugin.PDL_QueryDownloadNames());
                        for(var i = 0; i < downloading_list.length; i++){
                                WVPDLCancel(downloading_list[i]);
                        }
                }
        }
        catch (err) {
               //alert ("Error calling QueryAllAssets: " + err.description);
        }
        return "";
}
function WVReload(){
	window.location.reload();
}











function WVPluginCheck(){
	try{
		navigator.plugins.refresh(false);
		if ( navigator.mimeTypes['application/x-widevinemediatransformer'] ) {
			var cur_ver = WVGetPluginVersionFromEmbed();
			//alert(cur_ver);
			if(!widevine.versionInstalled(cur_ver)){
				window.location.reload();
			}else{
				setTimeout("WVPluginCheck()", 15000);
			}
		}else{
			setTimeout("WVPluginCheck()", 2000);
		}
	}catch(e){
		//alert("WVPluginCheck: " + e.name + " "+ e.message);
	}
}





function WVGetPluginVersionFromEmbed(){
	var tmp_version = "";
	try{
		var tmp_wv = document.createElement('div'); 
		tmp_wv.id = 'tmpWv';
		tmp_wv.innerHTML = '<embed id="tmpWidevinePlugin" type="application/x-widevinemediatransformer" >'
		document.body.appendChild(tmp_wv);
		if(document.getElementById("tmpWidevinePlugin")){
			try{
				tmp_version = document.getElementById("tmpWidevinePlugin").GetVersion();
			}catch(e){
			
			}
			document.body.removeChild(tmp_wv);
		}
	}catch(e){
		//alert("WVGetPluginVersionFromEmbed: " + e.name + "  " + e.message);
	}
	return tmp_version;
	
}

















//widevine.init();






