import $ from 'jquery';
import 'select2';
import 'bootstrap';

$('.select2').select2();
$('.select2-tags').select2({tags: true});
$('#flash-overlay-modal').modal();

var laravel = {
   initialize: function() {
     this.methodLinks = $('a[data-method]');
     this.token = $('a[data-token]');
     this.registerEvents();
   },

   registerEvents: function() {
     this.methodLinks.on('click', this.handleMethod);
   },

   handleMethod: function(e) {
     var link = $(this);
     var httpMethod = link.data('method').toUpperCase();
     var form;

     // If the data-method attribute is not PUT or DELETE,
     // then we don't know what to do. Just ignore.
     if ( $.inArray(httpMethod, ['PUT', 'DELETE']) === - 1 ) {
       return;
     }

     // Allow user to optionally provide data-confirm="Are you sure?"
     if ( link.data('confirm') ) {
       if ( ! laravel.verifyConfirm(link) ) {
         return false;
       }
     }

     form = laravel.createForm(link);
     form.submit();

     e.preventDefault();
   },

   verifyConfirm: function(link) {
     return confirm(link.data('confirm'));
   },

   createForm: function(link) {
     var form =
     $('<form>', {
       'method': 'POST',
       'action': link.attr('href')
     });

     var token =
     $('<input>', {
       'type': 'hidden',
       'name': '_token',
       'value': link.data('token')
       });

     var hiddenInput =
     $('<input>', {
       'name': '_method',
       'type': 'hidden',
       'value': link.data('method')
     });

     return form.append(token, hiddenInput)
                .appendTo('body');
   }
 };

 laravel.initialize();


/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */

require('./bootstrap');

window.Vue = require('vue');

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

Vue.component('example-component', require('./components/ExampleComponent.vue'));

const app = new Vue({
    el: '#app'
});

(function ($, Echo) {
    const selectors = {
            msgForm: '#msg-form',
            msgInput: '#msg-input',
            sendMsgBtn: '#send-msg-btn',
            roomIdInput: '#room-id-input',
            chatListContainer: '.chat-list',
            whisperTyping: '#whisper-typing',
            authUserNameInput: '#auth-user-name-input',
            onlineListContainer: '#online-list-container'
        },
        roomId = $(selectors.roomIdInput).val(),
        authUserName = $(selectors.authUserNameInput).val();

    const joinedRoom = function () {
        Echo.join(`room.${roomId}`)
            .here((users) => {
                let list = '';

                for (let i = 0; i < users.length; i++) {
                    list += `<div><a href="#">${users[i].name}</a></div>`;
                }

                $(selectors.onlineListContainer).append(list);
            })
            .joining((user) => {
                let child = `<div><a href="#">${user.name}</a></div>`;

                $(selectors.onlineListContainer).append(child);
            })
            .leaving((user) => {
                //
            })
            .listen('MessageCreated', (e) => {
                let chat = `<article class="chat-item right">
                <section class="chat-body">
                    <div class="panel b-light text-sm m-b-none">
                    <div class="panel-body">
                        <span class="arrow right"></span>
                        <strong><small class="text-muted"><i class="fa fa-ok text-success"></i>${e.message.user.name}</small></strong>
                        <p class="m-b-none">${e.message.body}</p>
                    </div>
                    </div>
                    <small class="text-muted"><i class="fa fa-ok text-success"></i>${e.message.created_at}</small>
                </section>
                </article>`;

                $(selectors.chatListContainer).append(chat);
            });
    }

    const sendMsg = function () {
        let msg = $(selectors.msgInput).val();

        if (msg) {
            axios.post('/messages/store', {
                body: msg,
                room_id: roomId,
                csrf_token:window.Laravel
            })
                .then(function () {
                    $(selectors.msgInput).val('');

                    let chat = `<article class="chat-item right">
                <section class="chat-body">
                    <div class="panel b-light text-sm m-b-none">
                    <div class="panel-body">
                        <span class="arrow right"></span>
                        <strong><small class="text-muted"><i class="fa fa-ok text-success"></i></small></strong>
                        <p class="m-b-none">${msg}</p>
                    </div>
                    </div>
                    <small class="text-muted"><i class="fa fa-ok text-success"></i>${new Date()}</small>
                </section>
            </article>`;

                    $(selectors.chatListContainer).append(chat);

                })
                .catch(function (error) {
                    //
                });
        }
    }

    const whisper = function () {
        setTimeout(function() {
            Echo.private('message')
                .whisper('typing', {
                    name: authUserName
                });
        }, 300);
    }

    const listenForWhisper = function () {
        Echo.private('message')
            .listenForWhisper('typing', (e) => {
                $(selectors.whisperTyping).text(`${e.name} is typing...`);

                setTimeout(function () {
                    $(selectors.whisperTyping).text('');
                }, 900);
            });
    }

    $(document.body).on('keypress', selectors.msgInput, whisper);
    $(document.body).on('click', selectors.sendMsgBtn, sendMsg);

    $(document).ready(function() {
        joinedRoom();
        listenForWhisper();
    });
})(window.$, window.Echo);
