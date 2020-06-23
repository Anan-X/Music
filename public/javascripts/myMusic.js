   $("#mylovemusic").click(function () {
    let username = $('#user').text()
       $.get("/getmylovemusic/?username="+username, function (data, status) {
           //    console.log(data)
           musicTbody(data, status);
       })
   })
   //   感性
   $("#sensitivemusic").click(function () {
    let username = $('#user').text()
       $.get("/getsensitivemusic/?username="+username, function (data, status) {
        musicTbody(data, status);
       })
   })
//    进入页面加载
   $(function () {
    let username = $('#user').text()
    // console.log(username+'lalal')
    //    let search = window.location.search  //获取url的参数
       $.get("/getmylovemusic/?username="+username, function (data, status) {
           //    console.log(data)
           musicTbody(data, status);
       })
   });

   
   // 播放或者暂停封装函数
var playpaused =function(audio){
    let musicTime = $('#musicTime', parent.document);
    let playpaused = $('#playpaused', parent.document);
    var cutime = null;
    // alert(musicTime.val())
    if(audio[0].paused){
        audio[0].play();
        // 给表单滑块设置最大值
        musicTime.attr('max',audio[0].duration)
        playpaused.attr('src','images/暂停.svg');
        // 启动计时器
         cutime = setInterval(function(){
            // console.log(myaudio[0].currentTime,$('#musicTime').val())
            
            musicTime.val(audio[0].currentTime);
            
            if(audio[0].paused){
                // 停止计时器
                clearInterval(cutime)
            }
            // 判断是否播放结束
            if(audio[0].ended){
                playpaused.attr('src','images/视频播放.svg');
            }
        },1000)
    }else{
       
        // alert($('#playpaused').attr('src'))
        audio[0].pause();
        playpaused.attr('src','images/视频播放.svg');
        
    }
}

// 歌单列表输出封装函数
var musicTbody = function(data, status){
    $('tbody').empty();
           for (let i = 0; i < data.length; i++) {
               $('tbody').append(
                   `<tr>
             <th scope="row">` + (i + 1) + `</th>
             <td><img name='`+data[i].id+`' src="images/视频播放.svg"/></td>
             <td ><span class="d-inline-block text-truncate" style="max-width: 100px;">` + data[i].musicname + `</span></td>
             <td ><span class="d-inline-block text-truncate" style="max-width: 100px;">` + data[i].time + `</span></td>
             <td ><span class="d-inline-block text-truncate" style="max-width: 100px;">` + data[i].singer + `</span></td>
             <td ><span class="d-inline-block text-truncate" style="max-width: 100px;">` + data[i].album + `</span></td>
             <td><button id="` + data[i].id + `">移除歌单</button></td>

         </tr>`
               )
               //    移除歌单事件
               $("tbody tr").eq(i).on("click", "button", function () {
                   $.get("/music_remove?id=" + data[i].id, (data, status) => {
                       if (data.code == 200) {
                           $("tbody tr").eq($(this).parent().parent().index()).remove();
                           let tr_num = $("tbody tr").length;
                           for (let j = 0; j < tr_num; j++) {
                               $("tbody tr").eq(j).children("th").text((j + 1));
                           }
                       }
                   })

               })
            //    添加播放事件
            $("tbody tr").eq(i).on("click", "img", function () {
                // 获取iframe外的元素
                // console.log(data)
                
                let audio = $('#audio', parent.document);
                audio.attr('src',data[i].path)
                playpaused(audio)
            })
           }
}

// 注销

$("#loginout").click(function(){
    // alert("注销")
    $.get('/users/loginout',(data, status)=>{
        if(data['code']==200){
            window.location.href='http://127.0.0.1:3000/findmusic'
        }
    })
})