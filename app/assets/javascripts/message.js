$(function(){ 
    function createImage(message){
      if(message.image.url == null){
        return ``
      } else {
        return `<img class="lower-message__image" src='${message.image.url}'></img>`
      }
    }
     function buildHTML(message){
         image = message.image ? '<img src= ${message.image} >' : ""
         var html =
          `<div class="message" data-message-id=${message.id}>
             <div class="upper-message">
               <div class="upper-message__user-name">
                 ${message.user_name}
               </div>
               <div class="upper-message__date">
                 ${message.date}
               </div>
             </div>
             <div class="lower-message">
               <p class="lower-message__content">
                 ${message.content}
               </p>
             </div>
             ${createImage(message)}
           </div>`
         return html;
       };
    $('#new_message').on('submit', function(e){
      e.preventDefault();
      var formData = new FormData(this);
      var url = $(this).attr('action')
      $.ajax({
        url: url,
        type: "POST",
        data: formData,
        dataType: 'json',
        processData: false,
        contentType: false
      })
      .done(function(data){
        var html = buildHTML(data);
        $('.messages').append(html);
        $('.messages').animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');   
        $('form')[0].reset();
      })
      .fail(function(){
        alert('messageか画像を入力してください');
      });
      return false;
    });
    
    var reloadMessages = function() {
      if (window.location.href.match(/\/groups\/\d+\/messages/)){
        last_message_id = $('.message:last').data('id');
        $.ajax({
          url: "api/messages",
          type: 'get',
          dataType: 'json',
          data: {id: last_message_id}
        })
        .done(function(messages) {
          var insertHTML = '';
          messages.forEach(function (message) {
          insertHTML = buildHTML(message);
          $('.messages').append(insertHTML); 
          $('div').animate({scrollTop: $('.messages').height()})
          })
        })
        .fail(function() {
          alert('更新に失敗しました');
        });
      };
    }
    setInterval(reloadMessages, 5000);
});