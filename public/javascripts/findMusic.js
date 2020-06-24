$(function () {
    $.get('/musiclist', (data, status) => {
        musicTbody(data, status)
    })
})

// 播放或者暂停封装函数
var playpaused = function (audio) {
    let musicTime = $('#musicTime', parent.document);
    let playpaused = $('#playpaused', parent.document);
    var cutime = null;
    // alert(musicTime.val())
    if (audio[0].paused) {
        audio[0].play();
        // 给表单滑块设置最大值
        musicTime.attr('max', audio[0].duration)
        playpaused.attr('src', 'images/暂停.svg');
        // 启动计时器
        cutime = setInterval(function () {
            // console.log(myaudio[0].currentTime,$('#musicTime').val())

            musicTime.val(audio[0].currentTime);

            if (audio[0].paused) {
                // 停止计时器
                clearInterval(cutime)
            }
            // 判断是否播放结束
            if (audio[0].ended) {
                playpaused.attr('src', 'images/视频播放.svg');
            }
        }, 1000)
    } else {

        // alert($('#playpaused').attr('src'))
        audio[0].pause();
        playpaused.attr('src', 'images/视频播放.svg');

    }
}
// const musicId =null
// 歌单列表输出封装函数
var musicTbody = function (data, status) {
    $('tbody').empty();
    for (let i = 0; i < data.length; i++) {
        $('tbody').append(
            `<tr>
             <th scope="row">` + (i + 1) + `</th>
             <td><img name='` + data[i].id + `' src="images/视频播放.svg"/></td>
             <td ><span class="d-inline-block text-truncate" style="max-width: 100px;">` + data[i].musicname + `</span></td>
             <td ><span class="d-inline-block text-truncate" style="max-width: 100px;">` + data[i].time + `</span></td>
             <td ><span class="d-inline-block text-truncate" style="max-width: 100px;">` + data[i].singer + `</span></td>
             <td ><span class="d-inline-block text-truncate" style="max-width: 100px;">` + data[i].album + `</span></td>
             <td><button id="` + data[i].id + `" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">添加到歌单</button></td>

         </tr>`
        )
        //   添加到歌单事件
        $("tbody tr").eq(i).on("click", "button", function () {
            let musicId = data[i].id
            $.get("/findsort?id=" + data[i].id, (data, status) => {
                if (data) {
                    $('#playlist').empty();
                    if (data['code'] == 400) {
                        $('#playlist').html(`<a href="/users/" type="button" class="btn btn-secondary">去登陆</a>`)
                    } else {
                        for (let i = 0; i < data.length; i++) {
                            $('#playlist').append(`<button name="`+musicId+`" type="button" class="btn btn-secondary">` + data[i]['sort'] + `</button>`)
                        }
                        $('#playlist').append(`<button type="button" class="btn btn-secondary">创建表单</button>`)
                    }

                } else {
                    $('#playlist').html(`<button type="button" class="btn btn-secondary">创建表单</button>`)
                }
            })
            
        })
        //    添加播放事件
        $("tbody tr").eq(i).on("click", "img", function () {
            // 获取iframe外的元素
            // console.log(data)

            let audio = $('#audio', parent.document);
            audio.attr('src', data[i].path)
            playpaused(audio)
        })
    }
}
//将歌曲添加到自己的歌单里
$("#playlist").on("click", "button", function () {
    let id = $(this).attr('name')
    
    if($(this).text()=="创建表单"){
        // 创建表单
        $("#playlist").html(`
  
            <label class="sr-only" for="inlineFormInputGroupUsername2">Username</label>
            <div class="input-group mb-2 mr-sm-2">
                <div class="input-group-prepend">
                <div class="input-group-text">@</div>
                </div>
                <input type="text" class="form-control" id="inlineFormInputGroupUsername2" placeholder="名称">
            </div>
            <button id="createOk" onclick="" class="btn btn-primary mb-2">创建</button>
        
        `)
    }else{
        let sort = $(this).text()
        $.get('/addMyPlayList?sort='+sort+'&id='+id,(data, status)=>{
            if(data["code"]==200){
                alert(data["msg"])
            }else{
                alert(data["msg"])
            }
        })
    }
    
})

// 创建歌单ok
$("#playlist").on('click','#createOk',function(){
    let sort = $("#inlineFormInputGroupUsername2").val()
    $.get('createOk?sort='+sort,(data, status)=>{
        $("#exampleModalCenter").modal("hide")
        // alert(data["msg"])
    })
})