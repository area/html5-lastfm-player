/*
 *
 * Copyright (c) 2008-2010, Felix Bruns <felixbruns@web.de>
 *
 */

function LastFM(options){
  /* Set default values for required options. */
  var apiKey    = options.apiKey    || '';
  var apiSecret = options.apiSecret || '';
  var apiUrl    = options.apiUrl    || 'http://ws.audioscrobbler.com/2.0/';
  var cache     = options.cache     || undefined;
  var serverUrl = options.serverUrl || 'proxy.php';
  var useLocalServer = options.useLocalServer || true;
  /* Set API key. */
  this.setApiKey = function(_apiKey){
    apiKey = _apiKey;
  };

  /* Set API key. */
  this.setApiSecret = function(_apiSecret){
    apiSecret = _apiSecret;
  };

  /* Set API URL. */
  this.setApiUrl = function(_apiUrl){
    apiUrl = _apiUrl;
  };

  /* Set cache. */
  this.setCache = function(_cache){
    cache = _cache;
  };

  /* Internal call (POST, GET). */
  var internalCall = function(params, callbacks, requestMethod){
    if(typeof(callbacks) != 'undefined' && typeof(callbacks.success) != 'undefined'){
	    callbackFunction = callbacks.success;
    }
    
    if(requestMethod == 'POST'){
      if (useLocalServer) {
        $.ajax({
          url: serverUrl,
          type: "POST",
          data: params,
          dataType: "json",
          success: function(msg){
            console.log(msg);
	    console.log(callbacks);
            /* Call user callback. */
            if(typeof(callbacks.success) != 'undefined'){
              callbacks.success(msg);
            }
          },
          error: function(e) {
            /* Call user callback. */
            if(typeof(callbacks.error) != 'undefined'){
              callbacks.error(e.status,e.statusText);
            }
          }
        });
          
      
      }
    }	/* Cross-domain GET request (JSONP). */
    else{
 		var url,
			jsonResponse,
			callbackFunction;

params['format']='json';
		var paramArray = [];
		
		for(var param in params){
			paramArray.push(param + "=" + params[param]);
		}

		/* Set script source. */
		url = apiUrl + '?' + paramArray.join('&');	

		$.jsonp({
		    url: url,
			callbackParameter: "callback",
			callback: "jsonp",
			pageCache: true,
			success: callbackFunction
		});
	};
  };

  /* Normal method call. */
  var call = function(method, params, callbacks, requestMethod){
    /* Set default values. */
    params        = params        || {};
    callbacks     = callbacks     || {};
    requestMethod = requestMethod || 'GET';

    /* Add parameters. */
    params.method  = method;
    params.api_key = apiKey;

    /* Call method. */
    internalCall(params, callbacks, requestMethod);
  };

  /* Signed method call. */
  var signedCall = function(method, params, session, callbacks, requestMethod){
    /* Set default values. */
    params        = params        || {};
    callbacks     = callbacks     || {};
    requestMethod = requestMethod || 'GET';

    /* Add parameters. */
    params.method  = method;
    params.api_key = apiKey;

    /* Add session key. */
    if(session && typeof(session.key) != 'undefined'){
      params.sk = session.key;
    }

    /* Get API signature. */
    params.api_sig = auth.getApiSignature(params);

    /* Call method. */
    internalCall(params, callbacks, requestMethod);
  };


  /* Artist methods. */
  this.artist = {
    getCorrection : function(params, callbacks){
      call('artist.getCorrection', params, callbacks);
    },

    getImages : function(params, callbacks){
      call('artist.getImages', params, callbacks);
    },

    getInfo : function(params, callbacks){
      call('artist.getInfo', params, callbacks);
    },


    getSimilar : function(params, callbacks){
      call('artist.getSimilar', params, callbacks);
    },

    getTags : function(params, session, callbacks){
      signedCall('artist.getTags', params, session, callbacks);
    },

    getTopTags : function(params, callbacks){
      call('artist.getTopTags', params, callbacks);
    },

    getTopTracks : function(params, callbacks){
      call('artist.getTopTracks', params, callbacks);
    },

    search : function(params, callbacks){
      call('artist.search', params, callbacks);
    }
  };

  /* Auth methods. */
  this.auth = {
    
    getToken : function(callbacks){
      signedCall('auth.getToken', null, null, callbacks);
    }
  };

  /* Event methods. */
  this.event = {
    attend : function(params, session, callbacks){
      signedCall('event.attend', params, session, callbacks, 'POST');
    },

    getAttendees : function(params, session, callbacks){
      call('event.getAttendees', params, callbacks);
    },

    getInfo : function(params, callbacks){
      call('event.getInfo', params, callbacks);
    },

    getShouts : function(params, callbacks){
      call('event.getShouts', params, callbacks);
    },

    share : function(params, session, callbacks){
      /* Build comma separated recipients string. */
      if(typeof(params.recipient) == 'object'){
        params.recipient = params.recipient.join(',');
      }

      signedCall('event.share', params, session, callbacks, 'POST');
    },

    shout : function(params, session, callbacks){
      signedCall('event.shout', params, session, callbacks, 'POST');
    }
  };


  /* Group methods. */
  this.group = {

    getMembers : function(params, callbacks){
      call('group.getMembers', params, callbacks);
    }
  };

  /* Radio methods. */
  this.radio = {
    getPlaylist : function(params, session, callbacks){
      signedCall('radio.getPlaylist', params, session, callbacks);
    },

    search : function(params, session, callbacks){
      signedCall('radio.search', params, session, callbacks);
    },

    tune : function(params, session, callbacks){
      signedCall('radio.tune', params, session, callbacks, 'POST');
    }
  };

  /* Tag methods. */
  this.tag = {
    getInfo : function(params, callbacks){
      call('tag.getInfo', params, callbacks);
    },

    getSimilar : function(params, callbacks){
      call('tag.getSimilar', params, callbacks);
    },

    getTopAlbums : function(params, callbacks){
      call('tag.getTopAlbums', params, callbacks);
    },

    getTopArtists : function(params, callbacks){
      call('tag.getTopArtists', params, callbacks);
    },

    getTopTags : function(callbacks){
      call('tag.getTopTags', null, callbacks);
    },

    getTopTracks : function(params, callbacks){
      call('tag.getTopTracks', params, callbacks);
    },

    search : function(params, callbacks){
      call('tag.search', params, callbacks);
    }
  };

  /* Track methods. */
  this.track = {

    getCorrection : function(params, callbacks){
      call('track.getCorrection', params, callbacks);
    },

    getInfo : function(params, callbacks){
      call('track.getInfo', params, callbacks);
    },

    getSimilar : function(params, callbacks){
      call('track.getSimilar', params, callbacks);
    },

    getTags : function(params, session, callbacks){
      signedCall('track.getTags', params, session, callbacks);
    },

    getTopTags : function(params, callbacks){
      call('track.getTopTags', params, callbacks);
    },

    search : function(params, callbacks){
      call('track.search', params, callbacks);
    }
  };

  /* User methods. */
  this.user = {
    getArtistTracks : function(params, callbacks){
      call('user.getArtistTracks', params, callbacks);
    },

    getEvents : function(params, callbacks){
      call('user.getEvents', params, callbacks);
    },

    getFriends : function(params, callbacks){
      call('user.getFriends', params, callbacks);
    },

    getInfo : function(params, callbacks){
      call('user.getInfo', params, callbacks);
    },

    getNeighbours : function(params, callbacks){
      call('user.getNeighbours', params, callbacks);
    },

    getRecentStations : function(params, session, callbacks){
      signedCall('user.getRecentStations', params, session, callbacks);
    },

    getRecentTracks : function(params, callbacks){
      call('user.getRecentTracks', params, callbacks);
    },

    getRecommendedArtists : function(params, session, callbacks){
      signedCall('user.getRecommendedArtists', params, session, callbacks);
    },

    getRecommendedEvents : function(params, session, callbacks){
      signedCall('user.getRecommendedEvents', params, session, callbacks);
    },

    getTopArtists : function(params, callbacks){
      call('user.getTopArtists', params, callbacks);
    },

    getTopTags : function(params, callbacks){
      call('user.getTopTags', params, callbacks);
    },

    getTopTracks : function(params, callbacks){
      call('user.getTopTracks', params, callbacks);
    }
  };


  /* Private auth methods. */
  var auth = {
    getApiSignature : function(params){
      var keys   = [];
      var string = '';

      for(var key in params){
        keys.push(key);
      }

      keys.sort();

      for(var index in keys){
        var key = keys[index];

        string += key + params[key];
      }

      string += apiSecret;

      /* Needs lastfm.api.md5.js. */
      return md5(string);
    }
  };
}
