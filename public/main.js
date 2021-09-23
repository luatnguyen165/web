var socket = io();
$('dv-none').show();
$('#dv-chat').hide();

socket.on('DANG_KY_THAT_BAI',data=>{
  alert('Dang ky that bai')
})
socket.on('DANH_SACH_DANG_KY',data=>{
  $('#dv-chat').show();
  $('dv-none').hide();
  data.forEach(element => {
    $('#user-online').append(`<li id=${element.peerId}>${element.username}</li>`)
  });
});
socket.on('CO_NGUOI_MOI',user=>{
  $('#dv-chat').show();
  $('dv-none').hide();
    $('#user-online').append(`<li id=${user.peerId}>${user.username}</li>`)
});

$('#user-online').on('click','li',function(){
  const id = $(this).attr('id');
  onpenStream().then(stream=>{
    playStream('localStream',stream)
    const call = peer.call(id,stream)
    call.on('stream', remoteStream=> {
        playStream('remoteStream',remoteStream)
      });
})
})
function onpenStream(){
    const config = {audio:true,video:false}
    return navigator.mediaDevices.getUserMedia(config)
}


function playStream(idVideoTag,stream){
    const video = document.getElementById(idVideoTag);
    video.srcObject=stream;
    video.play();
}
// onpenStream().then(stream=>playStream('localStream',stream))

var peer = new Peer(); 
peer.on('open',id=>{
  $('#my-peer').append(id)
  console.log(id);
  $('#btnSigut').click(function(){
    const user = $('#txtUsername').val();
    console.log(user);
    socket.emit('USER_DANG_KY',{username:user,peerId:id})

  })
})
$('#btnCall').click(function(){
    const id = $(this).attr('id');
   onpenStream().then(stream=>{
    playStream('localStream',stream)
    const call = peer.call(id,stream)
    call.on('stream', remoteStream=> {
        playStream('remoteStream',remoteStream)
      });
})
})

peer.on('call', function(call) {
    onpenStream().then(stream=>{
        playStream('localStream',stream)
      call.answer(stream); // Answer the call with an A/V stream.
      call.on('stream', function(remoteStream) {
        playStream('remoteStream',remoteStream)
      });
    })
})
    