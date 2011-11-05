$('body').append('<div id="friends"></div>');
$('body').append('<div id="priends"></div>');

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

    function draw(){
	$.each($('#friends').children(), function(i, el){
		   var id = $(el).attr('id');
		   if ($('#r' + id).size() === 0) {
		       var prnd = $(el).clone();
		       prnd.detach();
		       prnd.attr('id', 'r' + id);
		       prnd.click = $(el).click;
		       prnd.removeClass('friend');
		       prnd.addClass('priend');
		       $('#priends').append(prnd);
		   }
		   var el  = $(el);
		   var elpos = el.position();
		   
		   if ($('#r' + id).width() !== el.width() &&
		       $('#r' + id).position().top !== elpos.top &&
		       $('#r' + id).position().left !== elpos.left) {
		       
		       $('#r' + id).animate({'width': el.width() + 'px',
					     'height': el.height() + 'px',
					     'top': elpos.top + 'px',
					     'left': elpos.left + 'px'}, function(){
						 $('#r' + id)
						     .css('width', el.width() + 'px')
						     .css('height', el.height() + 'px')
						     .css('top', elpos.top + 'px')
						     .css('left', elpos.left + 'px');
					     });

		   }
	       });
    }

    setInterval(draw, 5000);

    
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

    alll = {};
    track = {};

    $('#playit').click(function(){
		       });

    function reposition (id) {
	var p = $(id).parent();
	var that = $(id);
	var w = that.width() * 2;
	var h = that.height() * 2;
	
	$.each(p.children(), function(i, c){
		   if ($(c).width() < that.width() * 2) {
                       that.detach();
		       $(c).before(that);
		       return false;
		   }
	       });


/*	$(id).animate({
			  'width': w,
			  'height': h
		      }, function() {*/
			  $(id)
			      .css('width', w * 2)
			      .css('height', h * 2);
//		      });
	
    }
    
    function afterInit(response) {
	var button = document.getElementById('fb-auth');

	if (response.authResponse) {

	    (function iterateFeed(url){
		 
		 cb = function(fd) {
			    if (fd.data) {
			
				console.log(fd);
				$.each(fd.data, function(j, msg){
					   console.log(msg.from.name);

					   var days = (new Date() - (new Date(msg.updated_time))) / 1000 / 60 / 60 / 24;
					   
					   var vid = null;
					   if (msg.link && msg.link.indexOf('youtu') > -1){
					       vid = getId(msg.link);    
					   }
					   if (msg.source && msg.source.indexOf('youtu') > -1){
					       vid = getId(msg.source);    
					   }
					   
					   if (vid && (!alll[msg.from.id] || !alll[msg.from.id].data[vid])) {
//					       $('#' + msg.from.id).show();
					       track[msg.from.id] = track[msg.from.id] || 0;
					       track[msg.from.id]++;
					       if (track[msg.from.id] !== 0 && (track[msg.from.id] % 10) === 0) {
						   reposition('#' + msg.from.id);
					       }
					       if (!alll[msg.from.id]){
						   alll[msg.from.id] = {data:{}};
					       }
					       alll[msg.from.id].data[vid] = {
						   host: 'yt',
						   url: msg.link
					       };
					   }
				       });

				if (fd.paging) {
				    setTimeout(function(){
						   iterateFeed(fd.paging.next);
					       }, 100);
				}
			    }
			    
			    else {
				
				console.log('no data', 'gu', fd.data);
			    }
			    
		 };

		 if (!url){
		     FB.api('/me/friends?fields=picture', function(resp) {
				$.each(resp.data, function(i, frnd){
					   $('<div></div>')
					       .addClass('friend')
					       .attr('id', frnd.id).append($('<img src="' + frnd.picture + '">')
										       .css('width', '100%')
										       .css('width', '100%'))
					       .click(function(){
							  var url = 
							      'http://3.bigrbox1.appspot.com/box/party?party=true#' +
							      encodeURIComponent(JSON.stringify(alll[frnd.id]));
							  window.open(url, 'mywin','left='+50+',top='+0+',width=1024,height=768,toolbar=0,resizable=0,scrollbars=0');   
						      }).appendTo('#friends');
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
    FB.Event.subscribe('auth.statusChange', function(status){
			   console.log(status);
			   afterInit(status);
		       });
};

(function() {
  var e = document.createElement('script'); e.async = true;
  e.src = document.location.protocol 
    + '//connect.facebook.net/en_US/all.js';
  document.getElementById('fb-root').appendChild(e);
}());
