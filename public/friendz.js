$('body').append($('<div id="playit">PLAY</div>'));

window.fbAsyncInit = function() {
    
    
    
  FB.init({ appId: cfg.appId, 
	    status: true, 
	    cookie: true,
	    xfbml: true,
	    oauth: true});

    function getSince(url){
	var regex = /since=(\d+)/;
	try{
	    var id = url.match(regex)[1]; // id = 'Ahg6qcgoay4'
	    return id;

	} catch (x) {
	    console.log('Error: ', url);
	    return null;
	}
    }    

    
    function getId(url){
	console.log(url);
	var regex = /[=\/]([\w|-]{11})/;
	try{
	    var id = url.match(regex)[1]; // id = 'Ahg6qcgoay4'
	    console.log('ID:', id);
	    return id;

	} catch (x) {
	    console.log('Error: ', url);
	    return null;
	}
    }

    alll = {data: {}};

    $('#playit').click(function(){
			   console.log(JSON.stringify(alll));
			   $(this).append('<a>PLAYYY</a>').attr('href', 'http://3.bigrbox1.appspot.com/box/party?party=true#' + encodeURIComponent(JSON.stringify(alll)));
		       });

    function afterInit(response) {
	var button = document.getElementById('fb-auth');

	if (response.authResponse) {

	    (function iterateFeed(url){
		 
		 cb = function(fd) {
			    if (fd.data) {
			
				console.log(fd);
				$.each(fd.data, function(j, msg){
					   console.log(msg.from.name);
					   $('#' + msg.from).css('width', ($('#' + msg.from).width() + 10) + 'px')
					   .css('height', ($('#' + msg.from).height() + 10) + 'px');
					   var days = (new Date() - (new Date(msg.updated_time))) / 1000 / 60 / 60 / 24;
					   
					   var vid = null;
					   if (msg.link && msg.link.indexOf('youtu') > -1){
					       vid = getId(msg.link);    
					   }
					   if (msg.source && msg.source.indexOf('youtu') > -1){
					       vid = getId(msg.source);    
					   }
					   
					   if (vid) {
					       alll.data[vid] = {
						   host: 'yt',
						   url: msg.link
					       };
					   }
				       });

				if ($('#playlist').size() < 10 && fd.paging) {
				    iterateFeed(fd.paging.next);
				}
			    }
			    
			    else {
				
				console.log('no data', 'gu', fd.data);
			    }
			    
		 };

		 if (!url){
		     FB.api('/me/friends', function(resp) {
				$.each(resp.data, function(i, frnd){
					   $('<div></div>').attr('id', frnd.id).append('<img src="' + frnd.picture + '">').click(function(){
											  
										      });
					   FB.api('/' + frnd.id + '/feed', cb);		   
				       });
			    });
		 } 
		 else {
		     console.log(url);
		     $.ajax({
				url: url,
				dataType: 'jsonp',
				jsonp: 'callback',
				success: cb
			    });
        
		 }

	     })();
	    


	    
	    
	    //user is already logged in and connected
	    $(button).text('Logout');
	    button.onclick = function() {
		FB.logout(function(response) {
			      button.text('Login');
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
    FB.getLoginStatus(afterInit);
    FB.Event.subscribe('auth.statusChange', function(status){console.log(status);});
};

(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol 
    + '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());
