$(function () {
    let pieSvg = new Snap('.pie');
    let pieCir = pieSvg.select('.cir');
    let pieCirLength = getCircleLength(pieCir);

    let $addTodo = $('#add_todo'),
        $todoList = $('ul.todo'),
        $checkBtn = $('.todo__checkBox');

    let $timer = $('.todo__count-down'),
        count,
        $player = $('.player'),
        $playBtn = $player.find('.player-btn');
    let workTime = 25 * 60 * 1000;
    let restTime = 5 * 60 * 1000;
    let proportion = pieCirLength / workTime;

    $checkBtn.on('click', function () {
        let $this = $(this);
        $this.parent('.todo__item').addClass('check');
        $this.find('.material-icons').text('radio_button_checked');

    });



    function doSomething(val) {
        let $template = $('#doSomething');

        return $template.html().replace('{{something}}', val);
    }

    $addTodo.on('keyup', function (e) {
        if (e.keyCode == 13) {
            let $this = $(this);
            let newThings = $this.val();

            $this.val("");

            $todoList.append(doSomething(newThings));
        }
    });




    pieCir.attr({
        strokeDasharray: pieCirLength,
        strokeDashoffset: pieCirLength
    });

    $playBtn.on('click', function () {
        $player.toggleClass('start');

        if(!$player.hasClass('start')) {
            $playBtn.find('.material-icons').text('play_circle_filled');

            clearInterval(count);
        } else {
            $playBtn.find('.material-icons').text('pause_circle_filled');
            count = setInterval(function () {
                workTime -= 30;
                if(workTime <= 0) {
                    clearInterval(count);
                    $('body').addClass('rest');
                    count = setInterval(function () {
                        restTime -=30;
                        displayTime(restTime);

                        if(restTime <= 0) {
                            clearInterval(count);
                        }
                    }, 30);
                }

                displayTime(workTime);

            }, 30);
        }

    });

    function displayTime(time) {
        let newTime = getTimeRemaining(time);

        if (newTime.seconds < 10) {
            newTime.seconds = "0" + newTime.seconds;
        }

        if (newTime.minutes < 10) {
            newTime.minutes = "0" + newTime.minutes;
        }

        $timer.text(newTime.minutes + ":" + newTime.seconds);

        pieCir.attr({
            strokeDashoffset: time * proportion
        });
    }


    function getCircleLength(el) {
        let r = el.attr('r');
        let circleLength = 2 * Math.PI * r;
        return circleLength;
    }

    function getTimeRemaining(endtime){
        var t = Math.ceil(endtime / 1000);
        var seconds = Math.floor( t % 60 );
        var minutes = Math.floor( (t / 60) % 60 );
        return {
            'minutes': minutes,
            'seconds': seconds
        };
    }


});