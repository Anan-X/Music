
// $("#hr").hover(
//     function(){
//        $(".footerPlayer").css("visibility","none")
//     },
//     function(){
//         $(".footerPlayer").css("visibility","hidden")
//     }
// );
$("#mymusic").click(function(){
    $("#iframe").attr("src","/myMusic") 
})
$("#findmusic").click(function(){
    $("#iframe").attr("src","/findMusic") 
})
$("#uploadmusic").click(function(){
    $("#iframe").attr("src","/uploadMusic") 
})
var myaudio = $("#audio")

// 播放或者暂停封装函数
var playpaused =function(){
    var cutime = null;
    if(myaudio[0].paused){
        myaudio[0].play();
        // 给表单滑块设置最大值
        $('#musicTime').attr('max',myaudio[0].duration)
        $('#playpaused').attr('src','images/暂停.svg');
        // 启动计时器
         cutime = setInterval(function(){
            // console.log(myaudio[0].currentTime,$('#musicTime').val())
            
            $('#musicTime').val(myaudio[0].currentTime);
            
            if(myaudio[0].paused){
                // 停止计时器
                clearInterval(cutime)
            }
            // 判断是否播放结束
            if(myaudio[0].ended){
                $('#playpaused').attr('src','images/视频播放.svg');
            }
        },1000)
    }else{
       
        // alert($('#playpaused').attr('src'))
        myaudio[0].pause();
        $('#playpaused').attr('src','images/视频播放.svg');
        
    }
}

$("#playpaused").click(function(){
    playpaused();
})
    // 当播放器进度条发生变化时触发
$('#musicTime').change(function(){
    myaudio[0].currentTime=$('#musicTime').val();
})

