$(function(){ 
     function buildHTML(message){
         imgurl = `<img class="lower-message__image" src="${message.image_url}" >`;
         image = message.image_url ? message.content ? imgurl : imgurl : "";
         var html =
          `<div class="message" data-id=${message.id}>
             <div class="upper-message">
               <div class="upper-message__user-name">
                 ${message.user_name}
               </div>
               <div class="upper-message__date">
                 ${message.created_at}
               </div>
             </div>
             <div class="lower-message">
               <p class="lower-message__content">${message.content}</p>
               ${image}
             </div>  
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
          var insertHTML = ""; 
          messages.forEach(function(message) {
            if (message.id > last_message_id) {
              insertHTML = buildHTML(message);
            }
          $('.messages').append(insertHTML); 
          $('.messages').stop().animate({scrollTop: $('.messages')[0].scrollHeight}, 'fast');
          });
        })
        .fail(function() {
          alert('更新に失敗しました');
        })
      }
    }
    setInterval(reloadMessages, 5000);
});