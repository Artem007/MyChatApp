$("#form-join").on("submit", (event) => {

  var name = $("[name=name]").val().trim();
  var room = $("[name=room]").val().trim();
  var nameWarning=$("#name-warning");
  nameWarning.text("");
  var roomWarning=$("#room-warning");

  if ((!name) || (!room)) {
    event.preventDefault();
    if (!name) {
      nameWarning.text("Name is required");
      nameWarning.css("visibility", "visible");
    } else {
      nameWarning.css("visibility", "hidden");
    }
    if (!room) {
      roomWarning.css("visibility", "visible");
    } else {
      roomWarning.css("visibility", "hidden");
    }
    return;
  }

  if (name && room) {
    nameWarning.css("visibility", "hidden");
    roomWarning.css("visibility", "hidden");
  }

  event.preventDefault();

  var request = $.ajax({
    method: "POST",
    url: "https://boiling-fortress-14292.herokuapp.com/checkUser",
    // url:"http://localhost:3000/checkUser",
    contentType: 'application/json',
    data: JSON.stringify({
      name,
      room
    })
  });

  request.done((nameIsTaken) => {
    if (nameIsTaken) {
      nameWarning.text("This name already taken");
      nameWarning.css("visibility", "visible");
    }else{
      $("#form-join").unbind('submit').submit();
    }
  });

  request.fail((err) => {
    event.preventDefault();
    console.log(err);
  });

});
