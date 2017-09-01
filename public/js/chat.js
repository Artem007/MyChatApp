var socket = io();

function autoScroll() {

  var messages=$("#messages");
  var clientHeight = messages.prop("clientHeight");
  var scrollTop = messages.prop("scrollTop");
  var scrollHeight = messages.prop("scrollHeight");
  var lastMsgHeight=messages.children("li:last-child").prev().innerHeight();
  var newMsgHeight=messages.children("li:last-child").innerHeight();

  if(clientHeight+scrollTop+lastMsgHeight+newMsgHeight>=scrollHeight){
    messages.scrollTop(scrollHeight);
  }
}

function addRoom(room){
  $(".chat__sidebar	#chat__sidebar_room").text("");
  var room_template=$("#room-template").html();
  var room_html=Mustache.render(room_template,{room});
  $(".chat__sidebar	#chat__sidebar_room").append(room_html);
}

socket.on("connect", () => {
  console.log("Connected to server");

  console.log(window.location.search);
  var userData=jQuery.deparam(window.location.search);

  addRoom(userData.room);

  socket.emit('join',userData);

  socket.on("usersUpdate",(names)=>{
    console.log(names);
    var users=$("#users");
    users.empty();
    names.forEach((name)=>{
      var li=$("<li></li>");
      li.text(name);
      users.append(li);
    });
  });

  socket.on("newMsg", (msg) => {
    var template = $('#msg-template').html();
    var html = Mustache.render(template, {
      text: msg.text,
      from: msg.from,
      createdAt: moment(msg.createdAt).format("h:mm a")
    });
    $("#messages").append(html);
    autoScroll();
  });

  $("#message-form").on("submit", (event) => {
    event.preventDefault();

    var text = $("[name=message]").val();

    if (!text) {
      return
    }

    socket.emit("createMsg", {
      from: "User",
      text
    }, () => {
      $("#message-form input").val("");
    });

  });

  socket.on("newLocationMsg", (locationMsg) => {

    var template=$("#location-msg-template").html();
    var html=Mustache.render(template,{
      from:locationMsg.from,
      url:locationMsg.text,
      createdAt: moment(locationMsg.createdAt).format("h:mm a")
    });
    $("#messages").append(html);
    autoScroll();
  });

  $("#send-location").on("click", () => {

    if (!navigator.geolocation) {
      return alert("Cant get geolocation data");
    }

    navigator.geolocation.getCurrentPosition(function(position) {
      $("#send-location").attr('disabled', 'disabled');
      $("#send-location").html('Sending..');
      socket.emit("createLocationMsg", {
        lat: position.coords.latitude,
        long: position.coords.longitude
      },()=>{
        $("#send-location").removeAttr('disabled');
        $("#send-location").html('Send location');
      });

    });
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from server");
  });
});
