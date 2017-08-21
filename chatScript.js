$(function(){
  var socket = io.connect();
  var $messageForm = $("#messageForm");
  var $message = $("#message");
  var $chat = $("#chat");
  var $userForm = $("#userForm");
  var $userFormArea = $('#userFormArea');
  var $username = $('#username');
  var $users = $('#users');
  var $messageArea = $('#messageArea');

  $messageForm.submit(function(e){
    e.preventDefault();

    var newMessage = $('#message').val();
    if(newMessage.replace(/ /g,'') != ""){
    var trimmedmessage = newMessage.trim();

    socket.emit("send message", $message.val());
    $message.val('');
  }
  });

  $userForm.submit(function(e){
    e.preventDefault();

    socket.emit("new user", $username.val(), function(data){
      if(data){
        $userFormArea.hide();
        $messageArea.show();
      }
    });
    $username.val('');
  });

  socket.on('get users', function(data){
    var html = "";
    for(i=0; i < data.length; i++){
      html += '<li class="list-group-item">'+data[i]+'</li>';
    }
    $users.html(html);
  });

  socket.on('new message', function(data){
    $chat.append('<div class="well" id="chatWell"><h5><small><b>'+data.user+'</b> wrote: '+data.time+'</small></h5>'+data.msg+'</div>');
  });

  $( "img" ).click(function(data) {
    var pictureurl = "<img width='150' height='150' src='"+event.target.src+"'/>";
    socket.emit("send message", pictureurl);
  });

});

$(document).ready(function(){
        $('.imagen[src=""]').hide();
        $('.imagen:not([src=""])').show();
    });

//Press enter to send message in the mesageform.
$(function() {
    $("#message").keypress(function (e) {
        if(e.which == 13) {
          e.preventDefault();
            $('#messageForm').submit();
        }
    });
});
//https://api.giphy.com/v1/gifs/search?api_key=03120815a09f42f3b33c80f5c4dc3654&q=&limit=5&offset=0&rating=G&lang=en
function getGiphyResult(e){
  delay(function(){
    var giphySearchUrl = "https://api.giphy.com/v1/gifs/search?api_key=03120815a09f42f3b33c80f5c4dc3654&q="+e.value+"&limit=6&offset=0&rating=G&lang=en";
    var response = httpGet(giphySearchUrl);
    var dataArray = $.parseJSON(response).data;
    var gifsrc = [];
    var x = 1;
    for(i = 0; i < 6; i++){
      gifsrc[i] = dataArray[i]["images"]["downsized_medium"];
      console.log(gifsrc[i]["url"]);
      document.getElementById("gif"+x).src=gifsrc[i]["url"];
      x++;
    }
  }, 1000 );
}


function httpGet(theUrl)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open( "GET", theUrl, false ); // false for synchronous request
    xmlHttp.send( null );
    return xmlHttp.responseText;
}

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();
