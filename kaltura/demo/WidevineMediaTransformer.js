var WidevinePlugin;
var widevine = function() {

    var debug = false;
    var debug_flags = "";
   
    var auto_install_upgrade = true;
    var prompt_upgrade = true;

    var windows_chrome_installer_exe = "installer/WidevineMediaTransformerChrome.exe";
    var windows_activex_installer_exe = "installer/WidevineMediaTransformer.exe";
    var windows_activex_location_cab = "installer/WidevineMediaTransformer.cab";
    var windows_activex_location_xp_cab = "installer/WidevineMediaTransformer_xp.cab";
    var windows_firefox_location = "installer/WidevineMediaTransformer_windows.xpi";
    var macintosh_firefox_location = "installer/WidevineMediaTransformer_osx.xpi";
    var safari_location = "installer/WidevineMediaTransformer.dmg";

	var version ="4.5.0.3050";
	var ie_version ="4,5,0,3050";
	
    //var version ="5.0.0.000";
    //var ie_version ="5,0,0,000";

    //var signon_url = "https://fcpstage.shibboleth.tv/widevine/cypherpc/cgi-bin/SignOn.cgi";
    //var log_url = "https://fcpstage.shibboleth.tv/widevine/cypherpc/cgi-bin/LogEncEvent.cgi";
    //var emm_url = "https://fcpstage.shibboleth.tv/widevine/cypherpc/cgi-bin/GetEMMs.cgi";

    var signon_url = "https://staging.shibboleth.tv/widevine/cypherpc/cgi-bin/SignOn.cgi";
    var log_url = "https://staging.shibboleth.tv/widevine/cypherpc/cgi-bin/LogEncEvent.cgi";
   // var emm_url = "https://staging.shibboleth.tv/widevine/cypherpc/cgi-bin/GetEMMs.cgi";
   //ideanova server 
   var emm_url = "http://107.22.231.108/widevine/voddealer/cgi-bin/GetEMMs.cgi";

    //var portal = "disney";
	//var portal = "ideanova";
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
    function detectAndroid()  { return doDetect( "userAgent", "android 3." ); }
    function detectiOS()  { return doDetect( "userAgent", "ipad" ); }
    function detectMobile() { return (detectAndroid() || detectiOS());}


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
        if ( navigator.mimeTypes['application/x-widevinemediatransformer'] ) {
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

    function AddDiv( html ) {
        var div = document.createElement( "div" );
        document.body.appendChild( div );
        div.innerHTML = html;
        return div;
    }

    function InsertIE8InstallText(show_refresh) {
        var installDiv = document.createElement("div");
        installDiv.style.width = '100%';
        installDiv.style.height = '100%';
        installDiv.style.backgroundColor = 'black';
        installDiv.style.left = '0';
        installDiv.style.top = '0';
        installDiv.style.position = 'absolute';
        installDiv.style.zIndex = '10';
        installDiv.style.textAlign = 'center';
        //installDiv.style.filter = 'alpha(opacity=90)';

	var table_width = "50%";
	if (show_refresh){
		table_width = "33%"
	}

        var install_html = "<div align='center' style='margin-top: 20px; background-image: url(install_image.png); width: 800px; height: 600px; font-size: 10pt; font-family: sans-serif'>"
                + "<div style='padding-top: 50px'><table style='width: 100%'>"
		+ "<tr><td style='padding-left: 10px; vertical-align: top'><img src='warning_message.png'>"
		+ "<BR>"
		+ "<div style='font-size: 14pt'><b>Important Message</b></div>"
		+ "<div style='width: 200px; font-size: 12pt'>You may see a warning at the top of your browser prompting you to allow running the add-on.</div>"
		+ "<div style='width: 200px; font-size: 12pt; padding-top: 25px'><b>Note:</b> This warning might also appear after install.</div>"
		+ "</td><td><div style='font-size: 14pt'><b>How to Handle Warning</b></div><div style='width: 200px; font-size: 10pt'>Click the warning and select <b>Run Add-on</b>.</div><img src='step1_warning.png'>"
		+ "<div style='width: 200px; font-size: 10pt'>Click <b>Run</b> when the Security dialog appears</div><img src='security_warning.png'>"
		+"</td></tr>"
                + "</table></div>"
		+ "<div style='padding-top: 25px'><b>Proceed with <u>Install Instructions</u> if warning message does not appear.</b></div>"
		+ "<div style='padding-top: 25px'><table width='100%'>"
		+ "<tr><th colspan='3' style='padding-bottom: 10px; font-size: 14pt'><u>Install Instructions</u></th></tr>"
                + "<tr><td style='padding-left: 10px; width:" + table_width + "; vertical-align: top'>1. Download the installer.<BR><a style='font-weight: bold' href='" + windows_activex_installer_exe + "'>Click to Download</a>"
		+ "<BR><P style='font-size: 10pt'>(If a <b>Security Alert</b> appears stating <b>'Your current security settings do not allow this file to be downloaded.'</b>.  <a href='security.html' target='_blank'>Click Here</a>)</P>"
		+ "</td>"
		+ "<td style='width:" + table_width + "; vertical-align: top'>2. Click <b>Run</b> when the security warning appears.<BR><img src='run_dialog.png'></td>";
	    if (show_refresh){
                install_html += "<td style='width:" + table_width + "; vertical-align: top'>3. <span style='color: red; font-weight: bold'>REFRESH</span> the page after install completes.</td>";
	    }
		install_html += "</tr></table></div>";
	 
	    installDiv.innerHTML = install_html;
        document.body.appendChild(installDiv);

    }
	function InsertSafariInstallText() {
                var installDiv = document.createElement("div");
                installDiv.style.width = '100%';
                installDiv.style.height = '100%';
                installDiv.style.backgroundColor = 'black';
                installDiv.style.left = '0';
                installDiv.style.top = '0';
                installDiv.style.position = 'absolute';
                installDiv.style.zIndex = '10';
                installDiv.style.textAlign = 'center';
                installDiv.style.filter = 'alpha(opacity=90)';

                var install_html = "<center><table align='center' style='margin-top: 100px; background-image: url(install_image.png); width: 600px; height: 300px; font-size: 16pt; font-family: sans-serif'>"
                + "<td style='padding-top: 30px; text-align: center'>Please run the dmg file. Page will reload after install/upgrade completes</td></table></center>";
                installDiv.innerHTML = install_html;
                document.body.appendChild(installDiv);

                WVPluginCheck();
    }


	function InsertChromeInstallText() {
        	var installDiv = document.createElement("div");
        	installDiv.style.width = '100%';
        	installDiv.style.height = '100%';
        	installDiv.style.backgroundColor = 'black';
        	installDiv.style.left = '0';
        	installDiv.style.top = '0';
        	installDiv.style.position = 'absolute';
        	installDiv.style.zIndex = '10';
        	installDiv.style.textAlign = 'center';
        	installDiv.style.filter = 'alpha(opacity=90)';

        	var install_html = "<center><table align='center' style='margin-top: 100px; background-image: url(install_image.png); width: 800px; height: 600px; font-size: 16pt; font-family: sans-serif'>"
                + "<td style='padding-top: 30px; text-align: center'>Please save and run the installer in the status bar.</td></table></center>";
        	installDiv.innerHTML = install_html;
       		document.body.appendChild(installDiv);
		WVPluginCheck();
    }



	function chromeInstallWin(){
        	window.open(windows_chrome_installer_exe,'_blank');
          	InsertChromeInstallText();

	}

	function chromeInstallMac(){
                window.open(safari_location,'_blank');
                InsertChromeInstallText();

        }

    	function pluginInstalledIE(){
		try{
			var o = new ActiveXObject("WidevineMediaTransformerInstall.InstallCheck");
			if (o.installVersion != "0.5.0.2148")
				return true;
			else
				return false;
		}catch(e){
			return false;
		}
    	}

	function upgradeIEPlugin(){
                try{
                        var o = new ActiveXObject("WidevineMediaTransformerInstall.InstallCheck");
                        var ieversion = o.installVersion;
                        return checkVersion(ieversion);
                }catch(e){
                        return false;
                }
        }




	function EmbedText() {
        	if ( detectIE() ) {
	    		if (auto_install_upgrade && !pluginInstalledIE()){
				if (detectVistaOrWindows7() || navigator.appVersion.indexOf("MSIE 8.0") == -1){
	            			var codebase = windows_activex_installer_exe + "#version=" + ie_version;
               				 
					return( '<object id="WidevinePlugin" classid=CLSID:f8eb59ec-35a8-4b59-8f67-b3e19147fed6 ' +
                    				'codebase="' + codebase + '" ' +
                    				'hidden=true style="display:none" height="0" width="0">' +
                    				'<param name="default_url" value="' + signon_url + '">' +
                    				'<param name="emm_url" value="' + emm_url + '">' +
                    				'<param name="log_url" value="' + log_url + '">' +
                    				'<param name="portal" value="' + portal + '">' +
                                                '<param name="user_agent" value="' + navigator.userAgent + '">' +
                    				'</object>' );
            			}else{
		        		InsertIE8InstallText(true);
		       			return "";
            			}
			}else if(!auto_install_upgrade || (pluginInstalledIE() && !upgradeIEPlugin()) ){
				return( '<object id="WidevinePlugin" classid=CLSID:f8eb59ec-35a8-4b59-8f67-b3e19147fed6 ' +
                                       	'hidden=true style="display:none" height="0" width="0">' +
                                       	'<param name="default_url" value="' + signon_url + '">' +
                                      	'<param name="emm_url" value="' + emm_url + '">' +
                                      	'<param name="log_url" value="' + log_url + '">' +
                                       	'<param name="portal" value="' + portal + '">' +
                                        '<param name="user_agent" value="' + navigator.userAgent + '">' +
                                     	'</object>' );
			}else{
				return "";
			}
        	} else {
            		if ( navigator.mimeTypes['application/x-widevinemediatransformer'] ) {
                		return( '<embed id="WidevinePlugin" type="application/x-widevinemediatransformer" default_url="' + signon_url +
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
			if (detectVistaOrWindows7() || navigator.appVersion.indexOf("MSIE 8.0") == -1){
                        	var codebase = windows_activex_installer_exe + "#version=" + ie_version;

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
                        	InsertIE8InstallText(true);
                      	}
		}
	} else if(detectChrome()){
		if(detectWin32()){
                	chromeInstallWin();
		}else{
			chromeInstallMac();
		}
        } else if ( detectSafari() ) {
		if(upgrading){
			setTimeout("window.open('" + safari_location + "', '_self');" , 1000);
		}else{	
			setTimeout("if (confirm('Would you like to install the Widevine plugin?')){window.open('" + safari_location + "', '_self');}" , 1000);
        	}
	} else if ( detectFirefox() ) {
            if ( detectMac() ) {
                InstallTrigger.install( xpi_mac, xpinstallCallback );
            } else {
                InstallTrigger.install( xpi_win, xpinstallCallback );
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
    
    init:function() {
 	   if (detectAndroid() || detectiOS())
	   {
	                document.getElementById("flashDiv").innerHTML = '<span class="ui-widget">This page plays WideVine encrypted content vi web, iOS and Android players.<br/><br/><br/> Click on the image to launch the player from: Web, Android, iOS.<br/><br/></span>';

			return;
	   }

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
           	alert("Flash not detected. Please install Flash to continue.");
		return "";
            }



	    try {

		var div = AddDiv( EmbedText() );

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
        return "http://localhost:20001/cgi-bin/";
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
        try {
               return aWidevinePlugin.setEmmUrl(arg);
        }
        catch (err) {
                alert ("Error calling SetEmmURL: " + err.description);
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


widevine.init();



