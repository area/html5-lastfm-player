<? session_start();
require 'apiDetails.php';
?>

<html>
  <head>
     <meta http-equiv="Content-Type" content="text/html;charset=utf-8" />

    <link rel="stylesheet" type="text/css" href="css/ui-darkness/jquery-ui-1.8.10.custom.css"/>
<link rel="stylesheet" type="text/css" href="css/jplayer/jplayer.blue.monday.css"/>
    <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js"></script>
<script type="text/javascript" src="js/lastfm.api.md5.js"></script>
<script type="text/javascript" src="js/lastfm.api.js"></script>
<script type="text/javascript" src="js/jquery.jplayer.min.js"></script>
<script type="text/javascript" src="js/jQuery.xml2json.pack.js"></script>
<script type="text/javascript">

//   $('button,.button').button();
<? print "var api_key = '$apikey';\n";
print "var session = '$_SESSION[sessionKey]';";
?>

var lastfm = new LastFM({apiKey:api_key});
var tracks = null;
var stationUrl = 'lastfm://artist/Meat+Loaf/similar'; 
var station = { 
tune: function(callback, stationUrl) {
    console.log("tuning into station with url " + stationUrl);
    console.log("callback is " + callback);
    /* Load some artist info. */
      lastfm.radio.tune({
	station: stationUrl,
	sk:session
      },session,{
	success: function(cb) {
	  console.log('pie');
	  console.log(cb);
          callback(cb);
        }, 
        error: function(code, message){
          alert("tag.getTopTags failed: " + code + " " + message);
        }
      });
},
getPlaylist: function(callback) {
    /* Load some artist info. */
      lastfm.radio.getPlaylist({
	speed_multiplier:"2.0",
	sk:session
      },session,{
	success: function(cb) {
          callback(cb);
        }, 
        error: function(code, message){
          alert("tag.getTopTags failed: " + code + " " + message);
        }
      });
}
};

function loadPlayer() {
  $('.jp-audio').fadeIn();
  $('#jpId').jPlayer({
    swfPath: 'js',
    solution: 'html, flash',
    supplied: 'mp3',
    preload:'none',
    volume: 0.8,
    muted: false,
    backgroundColor: '#000000',
    errorAlerts: false,
    warningAlerts: false,

    ready: function () {
      console.log("ready");
      station.tune(onTune, stationUrl);
    },

    ended: function () {
    console.log("Playback ended");
    playNext();
    }
  });
}
function onTune(args) {
console.log("tuned in");
$("#currentStation").text(args.station.name);
  station.getPlaylist(onPlaylistFetched);
}

function onPlaylistFetched(args) {
  if (tracks === null) {
    tracks = args.playlist.trackList.track;
    playNext();
    return;
  }
  tracks.push(args.playlist.trackList.track);
}

function getNextTrack() {
  var track = tracks.shift();
  if (tracks.length < 2) {
    station.getPlaylist();
  }
  $(".np").text(track.creator + " - " + track.title);
  return track;
}

function playNext() {
  var track = getNextTrack();
  $("#jpId").jPlayer("setMedia", {mp3:track.location} );
  $("#jpId").jPlayer("play");
  window.startTime = Math.round(new Date().getTime() / 1000);
console.log("playing next track " + track.location);
console.log(track);
lastfm.track.updateNowPlaying({
	track: track.title, 
	artist: track.creator, 
	album: track.album, 
	sk:session});
   window.scrobbled = false;
   window.track = track;
}

$(document).ready(function() {
  $(".jp-audio").css({display:"none"});
  $("#okStationUrl").click( function() {
    stationUrl = $("#stationUrl").val();
    loadPlayer(); 
  });
  /* Bind the timeEvent so we can scrobble appropriately */
  $("#jpId").bind($.jPlayer.event.timeupdate, function(event) { 
	if ( window.scrobbled == false && event.jPlayer.status.currentPercentAbsolute > 50)
	{
		console.log("Scrobble");
		window.scrobbled = true;
		lastfm.track.scrobble({
			timestamp: window.startTime,
			album: window.track.album,
			artist: window.track.creator,
			track: window.track.title,
			streamId: window.track.identifier,
			chosenByUser: 0,
			sk: session
		});
	} });
  window.scrobbled = false;
});
</script>
  </head>
  <body><div>
<input type="text" size="30" id="stationUrl" value="lastfm://artist/Meat+Loaf/similar"></input><button id="okStationUrl">OK</button></div>
<div>Current station: <span id="currentStation"></span></div>
<div id="jpId"></div>
<div class="jp-audio">
    <div class="jp-type-single">
      <div id="jp_interface_1" class="jp-interface">
        <ul class="jp-controls">
          <li><a href="#" class="jp-play" tabindex="1">play</a></li>
          <li><a href="#" class="jp-pause" tabindex="1">pause</a></li>
          <li><a href="#" class="jp-stop" tabindex="1">stop</a></li>
          <li><a href="#" class="jp-mute" tabindex="1">mute</a></li>
          <li><a href="#" class="jp-unmute" tabindex="1">unmute</a></li>
        </ul>
        <div class="jp-progress">
          <div class="jp-seek-bar">
            <div class="jp-play-bar"></div>
          </div>
        </div>
        <div class="jp-volume-bar">
          <div class="jp-volume-bar-value"></div>
        </div>
        <div class="jp-current-time"></div>
        <div class="jp-duration"></div>
      </div>
      <div id="jp_playlist_1" class="jp-playlist">
        <ul>
          <li class="np">Title of media</li>
        </ul>
      </div>
    </div>
    </div>
  </div>
</body>
</html>
