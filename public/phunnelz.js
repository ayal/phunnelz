$('body').append($('<div id="playlist"></div>'));

function onYouTubePlayerReady(playerId) {
    ytplayer = document.getElementById(playerId);
    console.log(playerId, 'ready!');
    ytplayer.addEventListener('onStateChange', '(function(state) { return playerState(state, "' + playerId + '"); })' );
    
 }

function playerState(state, playerId) {
    console.log(state, playerId);
    if (state === 0) { // done
	var next = $("#" + playerId).next();
	console.log(next);
	next[0].playVideo();
    }
}

window.fbAsyncInit = function() {
    
  FB.init({ appId: cfg.appId, 
	    status: true, 
	    cookie: true,
	    xfbml: true,
	    oauth: true});
    
    function embed(id, name, fid, daysago) {
	var template = '<span style="float:left">'
	    + '<div><a href="/#' + fid + '">' + name + '</a></div>'
	    + '<object width="200" height="200">'
	    + '  <param name="movie"'
	    + '         value="http://www.youtube.com/v/' + id + '?version=3&autohide=1&showinfo=0"></param>'
	    + '  <param name="allowScriptAccess" value="always"></param>'
	    + '  <embed src="http://www.youtube.com/v/' + id + '?version=3&autohide=1&showinfo=1"'
	    + '         type="application/x-shockwave-flash"'
	    + '         allowscriptaccess="always"'
	    + '         width="200" height="200"></embed>'
	    + '</object>'
	    +'</span>';
	return $(template);
    }
    
    function embedswf(id, name, fid, daysago){
	
	var tempId = 'ytapiplayer_' + id;
	var playerId = "my_" + tempId;
	$('#playlist').append('<div style="float:left">'  + name + '<div id="' + tempId + '"><img src="' + 'http://img.youtube.com/vi/'  + id +'/1.jpg' + '"></img></div>');
	$('#' + tempId).click(
	    function(){
		
		var params = {allowScriptAccess: "always" };
		
		var atts = {id: playerId};
		
		swfobject.embedSWF("http://www.youtube.com/e/" + id + "?enablejsapi=1&playerapiid=" + playerId,
				   tempId, "200", "200", "8", null, null, params, atts);
	    });
	
    }
    
    function getId(url){
	var regex = /v[=\/]([\w|-]{11})/;
	try{
	    var id = url.match(regex)[1]; // id = 'Ahg6qcgoay4'
	    return id;

	} catch (x) {
	    console.log('Error: ', url);
	    return null;
	}
    }

    function updateButton(response) {
	var button = document.getElementById('fb-auth');
	console.log(button);
	if (response.authResponse) {
	    FB.api('/me/friends', function(resp)
	    {
		var resp = {
			   data: [{id: '100001083158634', name: 'gugugu'}]
		       };
		       
		$(resp.data).each(function(i, frnd) {
				      //					     var url = '/' + frnd.id + '/home';
				      var url = '/me/home';
//					     console.log(frnd.id);
					     if (!window.location.hash || (window.location.hash && ('#' + frnd.id) === window.location.hash)){

						 FB.api(url, function(fd){
				//			    console.log(fd);
//							    console.log(fd.data);
							    if (fd.data) {
								
								$.each(fd.data, function(j, msg){
									   var days = (new Date() - (new Date(msg.updated_time))) / 1000 / 60 / 60 / 24;
									   // msg.comments && msg.comments.data && msg.comments.data.length > 2
									   if (msg.link && msg.link.indexOf('youtube') > -1){
									       var vid = getId(msg.link);
				//					       console.log(vid);
									       $('body').append(embedswf(vid, frnd.name, frnd.id, days));
									       
//									   console.log(frnd.name, j, msg.link);   
									   }
									   else if (msg.source && msg.source.indexOf('youtube') > -1){
									       var vid = getId(msg.source);
				//					       console.log(vid);
									       $('body').append(embedswf(vid, frnd.name, frnd.id, days));

									       console.log('no youtube');
									   }
									   else {
									       console.log('no youtube');
									   }
								       });
							    }
								  
							    else {
								       
								console.log('no data', frnd.name, fd.data);
							    }
							
						       });
	 
					     }
				    });
		   });

	    //user is already logged in and connected
	    button.onclick = function() {
		FB.logout(function(response) {
			      var userInfo = document.getElementById('user-info');
			      userInfo.innerHTML="";
			  });
	    };
	} else {
	    //user is not connected to your app or logged out
	    button.innerHTML = 'Login';
	    button.onclick = function() {
		FB.login(function(response) {
			     if (response.authResponse) {
			     } else {
				 //user cancelled login or did not grant authorization
			     }
			 }, {scope:'read_stream'});  
	    };
	}
    }

  // run once with current status and whenever the status changes
  FB.getLoginStatus(updateButton);
//    FB.Event.subscribe('auth.statusChange', updateButton);
};

(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol 
    + '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());
