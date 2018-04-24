"use strict";

function getCookie(name) {
    var matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
};


var preloader = (function () {
    var percentsTotal = 0;
    var preloader = $('.preloader');
    var imgPath = $('*').map(function (ndx, element) {
        var background = $(element).css('background-image');
        var isImg = $(element).is('img');
        var path = '';
        if (background != 'none') {
            path = background.replace('url("', '').replace('")', '');
        }
        if (isImg) {
            path = $(element).attr('src');
        }
        if (path) return path;
    });

    var setPercents = function (total, current) {
        var percents = Math.ceil(current / total * 100);

        $('.loading-value').text(percents + '%');
        $('.big.circle').css({'stroke-dasharray': percents * 1.57 + ' ' + '157'});

        if (percents >= 100) {
            preloader.fadeOut();
        }
    }

    var loadImages = function (images) {

        if (!images.length) preloader.fadeOut();

        images.forEach(function (img, i, images) {
            var fakeImage = $('<img>', {
                attr: {
                    src: img
                }
            });

            fakeImage.on('load error', function () {
                percentsTotal++;
                setPercents(images.length, percentsTotal);
            });
        });

    }
    return {
        init: function () {
            var imgs = imgPath.toArray();
            loadImages(imgs);
            //console.log(imgs);
        }
    }
}());

preloader.init();

var deltaScreen, direction, indexSlide, nextSlide, prevSlide, pressKey, raceCall, Trigger_Anim = false, Trig_FL = true, menuitem;
var canvas, stage, exportRoot, fnStartAnimation, canvasTimeline;
function init() {
    canvas = document.getElementById("canvas");
    // animation_container = document.getElementById("animation_container");
    // dom_overlay_container = document.getElementById("dom_overlay_container");
    handleComplete();
}
function handleComplete() {
    //This function is always called, irrespective of the content. You can use the variable "stage" after it is created in token create_stage.
    exportRoot = new lib_race.race_all_v2();
    stage = new createjs.Stage(canvas);
    stage.addChild(exportRoot);
    //Registers the "tick" event listener.
    fnStartAnimation = function () {
        createjs.Ticker.setFPS(lib_race.properties.fps);
        createjs.Ticker.addEventListener("tick", stage);
    };

    fnStartAnimation();
}
init();


var indicator = new WheelIndicator({
    elem: document.querySelector('#fullContainer'),
    callback: function (e) {
        if (Trigger_Anim) {
            console.log(e.direction); // "up" or "down"
            deltaScreen = e.direction;
            slideDoit();
        }

    }
});


var sec7_inn = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'sec7_in-end') {
                $('#sec7').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeInSine', complete: function () {
                        console.log('sec7_inn-end');
                        indexSlide = 'sec7';
                        nextSlide = '';
                        prevSlide = 'sec6';
                        Trigger_Anim = true;
                    }
                })
            }
        },
        go: function () {
            canvasTimeline.sec7.gotoAndPlay('sec7_in');
        }
    }
}());
var sec7_to_sec6 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'sec7_out-end' && direction === 'up') {
                $('#section7').removeClass('active');
                $('#section6').addClass('active');
                sec6_inn.go();
            }
        },
        go: function () {
            $('#sec7').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    canvasTimeline.sec7.gotoAndPlay('sec7_out');

                }
            });
        }
    }
}());
var sec6_to_sec7 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'good_out-end' && direction === 'down' && nextSlide === 'sec7') {
                $('#section6').removeClass('active');
                $('#section7').addClass('active');
                sec7_inn.go();
            }
        },
        go: function () {
            $('#sec6').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    canvasTimeline.sec6.gotoAndPlay('good_out');
                    nav_menu(7);
                }
            });
        }
    }
}());
var sec6_inn = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'good_in-end') {

                $('#sec6').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeInSine', complete: function () {
                        console.log('sec6_inn-end');
                        indexSlide = 'sec6';
                        nextSlide = 'sec7';
                        prevSlide = 'sec5-r1';
                        Trigger_Anim = true;
                    }
                })
            }
        },
        go: function () {
            canvasTimeline.sec6.gotoAndPlay('good_in');
            nav_menu(6);
        }
    }
}());

var sec5_hf1_from_sec6 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'linesec5_all_out_in-end' && direction === 'up' && prevSlide === 'sec5-r1') {
                $('#sec5_half').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeInSine', complete: function () {
                        console.log('sec5_hf1_from_sec6-end');
                        indexSlide = 'sec5-r1';
                        nextSlide = 'sec6';
                        prevSlide = 'sec5';
                        Trigger_Anim = true;
                    }
                });
            }
        },
        go: function () {
            canvasTimeline.linesec5.gotoAndPlay('linesec5_all_out_in');
        }
    }
}());
var sec6_to_sec5_hf1 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'good_out-end' && direction === 'up' && prevSlide === 'sec5-r1') {
                sec5_hf1_from_sec6.go();
                nav_menu(5);
            }
        },
        go: function () {

            $('#sec6').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    $('#section6').removeClass('active');
                    $('#section5').addClass('active');
                    canvasTimeline.sec6.gotoAndPlay('good_out');
                }
            });
        }
    }
}());
var sec5_hf1_to_sec6 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'linesec5_all_out-end') {
                sec6_inn.go();
            }
        },
        go: function () {

            $('#sec5_half').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    $('#section5').removeClass('active');
                    $('#section6').addClass('active');
                    canvasTimeline.linesec5.gotoAndPlay('linesec5_all_out');
                }
            });
        }
    }
}());
var sec5_hf1_to_sec5 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'linesec5_trans_out-end' && direction === 'up') {
                $('#sec5_txt').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeIn', complete: function () {
                        console.log('sec5_hf1_to_sec5-end');
                        indexSlide = 'sec5';
                        nextSlide = 'sec5-r1';
                        prevSlide = 'sec4-r2';
                        Trigger_Anim = true;
                    }
                })
            }
        },
        go: function () {
            $('#sec5_half').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    canvasTimeline.linesec5.gotoAndPlay('linesec5_trans_out');
                    $('#dirapack').velocity({bottom: '10%'}, {duration: 1000, easing: 'easeInSine'});
                    var twes06hs1_ = TweenMax.to($('#packpill_in'), 0.7, {"transform": "rotateZ(-8deg)", yoyo: false, repeat: 0, ease: Power2.easeIn});
                    $('.back_osnova').velocity({right: '0%'}, {delay: 700, duration: 700, easing: 'easeIn'});
                }
            });
        }
    }
}());
var sec5_to_sec5_hf1 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'linesec5_trans_in-end') {
                $('#sec5_half').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeInSine', complete: function () {
                        console.log('sec5_to_sec5_hf1-end');
                        indexSlide = 'sec5-r1';
                        nextSlide = 'sec6';
                        prevSlide = 'sec5';
                        Trigger_Anim = true;
                    }
                })
            }
        },
        go: function () {
            $('#sec5_txt').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    canvasTimeline.linesec5.gotoAndPlay('linesec5_trans_in');
                    $('#dirapack').velocity({bottom: '25%'}, {duration: 1000, easing: 'easeInSine'});
                    var twes06s1_ = TweenMax.to($('#packpill_in'), 0.7, {"transform": "rotateZ(0deg)", yoyo: false, repeat: 0, ease: Power2.easeIn});
                    $('.back_osnova').velocity({right: '-25%'}, {delay: 700, duration: 700, easing: 'easeIn'});

                }
            });
        }
    }
}());


var sec5_inn = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'linesec5_in-end') {
                $('#sec5').velocity({opacity: 1}, {duration: 1000, easing: 'easeInSine'});
                var twes05s1_ = TweenMax.to($('.ovsst0'), 0.7, {"transform": "scale(1)", yoyo: false, repeat: 0, ease: Power2.easeIn});
                var twes05s2_ = TweenMax.to($('.ovsst2'), 0.7, {"transform": "scale(1)", yoyo: false, delay: 0.3, repeat: 0, ease: Power2.easeIn});
                var twes05s3_ = TweenMax.to($('.ovsst4'), 0.7, {"transform": "scale(1)", yoyo: false, delay: 0.5, repeat: 0, ease: Power2.easeIn});
                var twes05s4_ = TweenMax.to($('#packpill'), 0.7, {"transform": "scale(1)", yoyo: false, delay: 0.7, repeat: 0, ease: Power2.easeIn});
                var twes06_ = TweenMax.to($('#pilul'), 1, {"transform": "scale(1)", "left": 0, "top": 0, yoyo: false, delay: 1, repeat: 0, ease: Power2.easeIn});
                var twes062_ = TweenMax.to($('#pilul2'), 1, {"transform": "scale(0.7)", "right": 0, "bottom": 0, yoyo: false, delay: 1, repeat: 0, ease: Power2.easeIn});
                var twes07_ = TweenMax.to($('#goodic'), 0.5, {"transform": "scale(1)", "right": "3%", "top": 0, yoyo: false, delay: 1, repeat: 0, ease: Power2.easeIn});


                $('#ftext_5').velocity({opacity: 1, marginTop: -30}, {delay: 400, duration: 1000, easing: 'easeIn'});
                $('#sec5_txt #ftext_op').velocity({opacity: 1}, {delay: 500, duration: 900, easing: 'easeIn'});
                $('#button5').velocity({opacity: 1, marginTop: 30}, {delay: 600, duration: 1000, easing: 'easeIn'});
                $('#button5 #btn_text p').velocity({opacity: 1, marginTop: 0}, {delay: 700, duration: 1000, easing: 'easeIn'});
                $('#button5 #btn_str').velocity({opacity: 1, right: '20%'}, {
                    delay: 800, duration: 1000, easing: 'easeIn', complete: function () {
                        console.log('sec5_inn-end');
                        indexSlide = 'sec5';
                        nextSlide = 'sec5-r1';
                        prevSlide = 'sec4-r2';
                        Trigger_Anim = true;
                    }
                });

            }
        },
        go: function () {
            canvasTimeline.race2.visible = false;
            canvasTimeline.linesec5.gotoAndPlay('linesec5_in');
            nav_menu(5);
        }
    }
}());

var sec4_hf2_from_sec5 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road2_show-end' && direction === 'up') {
                $('#sec4_half_2').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeInSine', complete: function () {
                        console.log('sec4_hf2_inn-end');
                        indexSlide = 'sec4-r2';
                        nextSlide = 'sec5';
                        prevSlide = 'sec4-r1';
                        Trigger_Anim = true;
                    }
                })
            }
        },
        go: function () {
            canvasTimeline.race2.racein2.parallax26.gotoAndPlay('road2_show');

        }
    }
}());
var sec5_to_sec4_hf2 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'linesec5_out-end' && direction === 'up') {
                canvasTimeline.race2.visible = true;
                sec4_hf2_from_sec5.go();
            }
        },
        go: function () {
            $('#sec5').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    $('#section5').removeClass('active');
                    $('#section4').addClass('active');
                    canvasTimeline.linesec5.gotoAndPlay('linesec5_out');
                }
            })

        }
    }
}());
var sec4_hf2_to_sec5 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road2_hide-end' && direction === 'down') {
                sec5_inn.go();
            }
        },
        go: function () {
            $('#sec4_half_2').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    $('#section4').removeClass('active');
                    $('#section5').addClass('active');
                    canvasTimeline.race2.racein2.parallax26.gotoAndPlay('road2_hide');
                }
            })

        }
    }
}());

var sec4_hf2_inn = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road2_trans_in-end') {
                $('#sec4_half_2').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeInSine', complete: function () {
                        // console.log('sec4_hf2_inn-end');
                        // indexSlide = 'sec4-r2';
                        // nextSlide = 'sec5';
                        // prevSlide = 'sec4-r1';
                        // Trigger_Anim = true;
                    }
                })
                $('#ftext_4h').velocity({opacity: 1, translateY: -50}, {delay: 300, duration: 1000, easing: 'easeIn'});
                $('#diraman6').velocity({opacity: 1}, {
                    duration: 100, easing: 'easeIn', complete: function () {

                        var twes06 = TweenMax.to($('#man6'), .5, {"transform": "scale(1)", yoyo: false, delay: 0.8, repeat: 0, ease: Power2.easeIn});

                        var dir06 = TweenMax.to($('#dir6_big'), 0.7, {"transform": "scale(1)", yoyo: false, repeat: 0, ease: Power2.easeIn});
                        var dir062 = TweenMax.to($('#dir6_med'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.3, repeat: 0, ease: Power2.easeIn});
                        var dir063 = TweenMax.to($('#dir6_small'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.4, repeat: 0, ease: Power2.easeIn});

                        var twes_61 = TweenMax.to($('#head6'), 1, {"transform": "rotateZ(5deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                        var twes_62 = TweenMax.to($('#allhand6'), 1, {"transform": "rotateZ(-7deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                    }
                });

                $('#h4fic1').velocity({opacity: 1}, {delay: 500, duration: 1000, easing: 'easeIn'});
                $('#h4fic2').velocity({opacity: 1}, {delay: 800, duration: 1000, easing: 'easeIn'});
                $('#h4fic3').velocity({opacity: 1}, {
                    delay: 1100, duration: 1000, easing: 'easeIn', complete: function () {
                        console.log('sec4_hf2_inn-end');
                        indexSlide = 'sec4-r2';
                        nextSlide = 'sec5';
                        prevSlide = 'sec4-r1';
                        Trigger_Anim = true;
                    }
                });
            }
        },
        go: function () {
            canvasTimeline.race2.gotoAndPlay('road2_trans_in');

        }
    }
}());

var sec4_hf2_to_sec4_hf1 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road2_trans_out-end' && direction === 'up') {
                $('#sec4_half').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeInSine', complete: function () {
                        console.log('sec4_hf2_to_sec4_hf1-end');
                        indexSlide = 'sec4-r1';
                        nextSlide = 'sec4-r2';
                        prevSlide = 'sec4';
                        Trigger_Anim = true;
                    }
                })
            }
        },
        go: function () {
            $('#sec4_half_2').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    canvasTimeline.race2.gotoAndPlay('road2_trans_out');

                }
            })
        }
    }
}());
var sec4_hf1_to_sec4_hf2 = (function () {
    return {
        inn: function (raceCall) {

        },
        go: function () {
            $('#sec4_half').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    sec4_hf2_inn.go();

                }
            })
        }
    }
}());
var sec4_hf1_inn = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road2_show-end' && nextSlide === 'sec4-r1') {
                console.log('sec4_hf1_inn-end');
                $('#ftext_4').velocity({opacity: 1, translateY: -50}, {delay: 300, duration: 1000, easing: 'easeIn'});
                $('#diraman3').velocity({opacity: 1}, {
                    duration: 100, easing: 'easeIn', complete: function () {

                        var twes03 = TweenMax.to($('#man3'), .5, {"transform": "scale(1)", yoyo: false, delay: 0.8, repeat: 0, ease: Power2.easeIn});


                        var dir03 = TweenMax.to($('#dir3_big'), 0.7, {"transform": "scale(1)", yoyo: false, repeat: 0, ease: Power2.easeIn});
                        var dir032 = TweenMax.to($('#dir3_med'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.3, repeat: 0, ease: Power2.easeIn});
                        var dir033 = TweenMax.to($('#dir3_small'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.4, repeat: 0, ease: Power2.easeIn});

                        var twesl2 = TweenMax.to($('#lefthand3'), 1, {"transform": "rotateZ(19deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                        var twes22 = TweenMax.to($('#righthand3'), 1, {"transform": "rotateZ(15deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                        var twes32 = TweenMax.to($('#head3'), 1, {"transform": "rotateZ(9deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                        var twes42 = TweenMax.to($('#shvabra'), 1, {"transform": "translateX(-17px)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                        var twes52 = TweenMax.to($('#shv_inn'), 1, {"transform": "rotateZ(2deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                    }
                });
                $('#diraman4').velocity({opacity: 1}, {
                    delay: 300, duration: 100, easing: 'easeIn', complete: function () {
                        var twes04 = TweenMax.to($('#man4'), .5, {"transform": "scale(1)", yoyo: false, delay: 0.8, repeat: 0, ease: Power2.easeIn});

                        var dir04 = TweenMax.to($('#dir4_big'), 0.7, {"transform": "scale(1)", yoyo: false, repeat: 0, ease: Power2.easeIn});
                        var dir042 = TweenMax.to($('#dir4_med'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.3, repeat: 0, ease: Power2.easeIn});
                        var dir043 = TweenMax.to($('#dir4_small'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.4, repeat: 0, ease: Power2.easeIn});

                        var twes_41 = TweenMax.to($('#head4'), 1, {"transform": "rotateZ(10deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                        var twes_42 = TweenMax.to($('#allhand4'), 1, {"transform": "rotateZ(10deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                    }
                });
                $('#diraman5').velocity({opacity: 1}, {
                    delay: 500, duration: 100, easing: 'easeIn', complete: function () {
                        var twes05 = TweenMax.to($('#man5'), .5, {"transform": "scale(1)", yoyo: false, delay: 0.8, repeat: 0, ease: Power2.easeIn});

                        var dir05 = TweenMax.to($('#dir5_big'), 0.7, {"transform": "scale(1)", yoyo: false, repeat: 0, ease: Power2.easeIn});
                        var dir052 = TweenMax.to($('#dir5_med'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.3, repeat: 0, ease: Power2.easeIn});
                        var dir053 = TweenMax.to($('#dir5_small'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.4, repeat: 0, ease: Power2.easeIn});

                        var twes_51 = TweenMax.to($('#head5'), 1, {"transform": "rotateZ(7deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                        var twes_52 = TweenMax.to($('#allhand5'), 1, {"transform": "rotateZ(-7deg)", yoyo: true, repeat: -1, ease: Linear.easeNone});

                    }
                });
                $('#h4ic1').velocity({opacity: 1}, {delay: 500, duration: 1000, easing: 'easeIn'});
                $('#h4ic2').velocity({opacity: 1}, {delay: 800, duration: 1000, easing: 'easeIn'});
                $('#h4ic3').velocity({opacity: 1}, {delay: 1100, duration: 1000, easing: 'easeIn'});
                $('#h4ic4').velocity({opacity: 1}, {
                    delay: 1400, duration: 1000, easing: 'easeIn', complete: function () {
                        indexSlide = 'sec4-r1';
                        nextSlide = 'sec4-r2';
                        prevSlide = 'sec4';
                        Trigger_Anim = true;
                    }
                });


            }
        },
        go: function () {
            canvasTimeline.race2.racein2.parallax26.gotoAndPlay('road2_show');
            nav_menu(4.5);
            $('#sec4_half').velocity({opacity: 1}, {
                duration: 1000, easing: 'easeInSine', complete: function () {

                }
            });
        }
    }
}());

var sec4_to_sec4_hf1 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'pack_out-end' && nextSlide === 'sec4-r1' && direction === 'down') {
                canvasTimeline.race2.visible = true;
                console.log('sdfsdfsdfsdfsdf');
                sec4_hf1_inn.go();

            }
        },
        go: function () {

            $('#sec4').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    canvasTimeline.kishpage.gotoAndPlay('pack_out');
                }
            });
        }
    }
}());

var sec4_inn = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'pack_in-end' && nextSlide === 'sec4') {
                console.log('sec4_inn-end');
                indexSlide = 'sec4';
                nextSlide = 'sec4-r1';
                prevSlide = 'sec3';
                Trigger_Anim = true;
            }
        },
        go: function () {
            canvasTimeline.kishpage.gotoAndPlay('pack_in');
            nav_menu(4);
            $('#sec4').velocity({opacity: 1}, {
                duration: 1000, easing: 'easeInSine', complete: function () {

                }
            });
        }
    }
}());
var sec4_inn_from_sec4_hf1 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'pack_in-end' && prevSlide === 'sec4' && direction === 'up') {
                console.log('sec4_inn_from_sec4_hf1-end');
                indexSlide = 'sec4';
                nextSlide = 'sec4-r1';
                prevSlide = 'sec3';
                Trigger_Anim = true;
            }
        },
        go: function () {
            canvasTimeline.kishpage.gotoAndPlay('pack_in');
            $('#sec4').velocity({opacity: 1}, {
                duration: 1000, easing: 'easeInSine', complete: function () {

                }
            });
        }
    }
}());
var sec4_hf1_to_sec4 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road2_hide-end' && prevSlide === 'sec4' && direction === 'up') {
                canvasTimeline.race2.visible = false;
                sec4_inn_from_sec4_hf1.go();
                console.log('sdfsdfdsfsfd');

            }
        },
        go: function () {
            $('#sec4_half').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    canvasTimeline.race2.racein2.parallax26.gotoAndPlay('road2_hide');
                }
            });
        }
    }
}());
var sec4_to_sec3 = (function () {
    return {
        inn: function (raceCall) {
            console.log(raceCall);
            if (raceCall === 'pack_out-end' && prevSlide === 'sec3' && direction === 'up') {

                $('#sec3').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeInSine', complete: function () {
                        console.log('sec3_inn-end');
                        canvasTimeline.race.visible = true;
                        canvasTimeline.race.racein.parallax26.gotoAndPlay('road_show');
                        indexSlide = 'sec3';
                        nextSlide = 'sec4';
                        prevSlide = 'sec2';
                        Trigger_Anim = true;
                    }
                });
            }
        },
        go: function () {
            $('#sec4').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    $('#section4').removeClass('active');
                    $('#section3').addClass('active');
                    canvasTimeline.kishpage.gotoAndPlay('pack_out');
                }
            });
        }
    }
}());
var sec3_to_sec4 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road_hide-end' && nextSlide === 'sec4' && direction === 'down') {
                canvasTimeline.race.visible = false;
                sec4_inn.go();
            }
        },
        go: function () {
            $('#sec3').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    $('#section3').removeClass('active');
                    $('#section4').addClass('active');
                    canvasTimeline.race.racein.parallax26.gotoAndPlay('road_hide');
                }
            });
        }
    }
}());

var sec3_to_sec2 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road_trans_out-end' && prevSlide === 'sec2') {
                $('#sec2').velocity({opacity: 1}, {
                    duration: 1000, easing: 'easeInSine', complete: function () {
                        console.log('sec3_to_sec2-end');
                        indexSlide = 'sec2';
                        nextSlide = 'sec3';
                        prevSlide = 'sec1_trans';
                        Trigger_Anim = true;
                    }
                });
            }
        },
        go: function () {
            $('#sec3').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    $('#section3').removeClass('active');
                    $('#section2').addClass('active');
                    canvasTimeline.race.gotoAndPlay('road_trans_out');
                }
            });
        }
    }
}());

var sec2_to_sec3 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road_trans_in-end' && nextSlide === 'sec3') {
                // $('#sec3').velocity({opacity: 1}, {
                //     duration: 1000, easing: 'easeInSine', complete: function () {
                // $('#sec2').velocity({opacity: 1}, {
                //     duration: 1000, easing: 'easeIn', complete: function () {
                //
                //     }
                // });


                var twes21 = TweenMax.to($('#man2'), .5, {"transform": "scale(1)", yoyo: false, delay: 0.8, repeat: 0, ease: Power2.easeIn});


                var dir21 = TweenMax.to($('#dir2_big'), 0.7, {"transform": "scale(1)", yoyo: false, repeat: 0, ease: Power2.easeIn});
                var dir022 = TweenMax.to($('#dir2_med'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.3, repeat: 0, ease: Power2.easeIn});
                var dir023 = TweenMax.to($('#dir2_small'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.4, repeat: 0, ease: Power2.easeIn});


                var ln12 = document.getElementById("LeftHand2");
                var ln22 = document.getElementById("RightHand2");
                var ln32 = document.getElementById("head2");
                var twesl2 = TweenMax.to(ln12, 1, {"transform": "matrix( 0.999847412109375, 0.0154266357421875, -0.0154266357421875, 0.999847412109375, 41.1,56.1)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                var twes22 = TweenMax.to(ln22, 1, {"transform": "matrix( 0.987823486328125, 0.15557861328125, -0.15557861328125, 0.987823486328125, 131.45,68.1)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                var twes32 = TweenMax.to(ln32, 1, {"transform": "matrix( 0.999053955078125, -0.04022216796875, 0.04022216796875, 0.999053955078125, 94.4,38.7)", yoyo: true, repeat: -1, ease: Linear.easeNone});
                $('#ftext_3').velocity({opacity: 1, translateY: -50}, {delay: 300, duration: 1000, easing: 'easeIn'});

                $('#ic_41_1').velocity({opacity: 1}, {
                    delay: 100, duration: 100, easing: 'easeIn', complete: function () {
                        $(this).addClass('active');
                        $('#icon_21_txt_inn').velocity({opacity: 1, translateX: -45}, {delay: 100, duration: 1300, easing: 'easeIn'});
                        $('#triang_41').velocity({opacity: 1}, {duration: 500, easing: 'easeIn'});
                    }
                });

                $('#ic_41_2').velocity({opacity: 1}, {
                    delay: 500, duration: 100, easing: 'easeIn', complete: function () {
                        $(this).addClass('active');
                        $('#icon_22_txt_inn').velocity({opacity: 1, translateX: -45}, {delay: 500, duration: 1300, easing: 'easeIn'});
                        $('#triang_42').velocity({opacity: 1}, {duration: 500, easing: 'easeIn'});
                    }
                });

                $('#ic_41_3').velocity({opacity: 1}, {
                    delay: 100, duration: 100, easing: 'easeIn', complete: function () {
                        $(this).addClass('active');
                        $('#icon_23_txt_inn').velocity({opacity: 1, translateX: 45}, {delay: 100, duration: 1300, easing: 'easeIn'});
                        $('#triang_43').velocity({opacity: 1}, {duration: 500, easing: 'easeIn'});
                    }
                });

                $('#ic_41_4').velocity({opacity: 1}, {
                    delay: 500, duration: 100, easing: 'easeIn', complete: function () {
                        $(this).addClass('active');
                        $('#icon_24_txt_inn').velocity({opacity: 1, translateX: 45}, {delay: 500, duration: 1300, easing: 'easeIn'});
                        $('#triang_44').velocity({opacity: 1}, {duration: 500, easing: 'easeIn'});
                    }
                });

                $('#ic_41_5').velocity({opacity: 1}, {
                    delay: 100, duration: 100, easing: 'easeIn', complete: function () {
                        $(this).addClass('active');
                        $('#triang_45').velocity({opacity: 1}, {delay: 100, duration: 500, easing: 'easeIn'});
                        $('#icon_25_txt_inn').velocity({opacity: 1, translateX: 45}, {
                            delay: 500, duration: 1300, easing: 'easeIn', complete: function () {

                                console.log('sec3_inn-end');
                                indexSlide = 'sec3';
                                nextSlide = 'sec4';
                                prevSlide = 'sec2';
                                Trigger_Anim = true;

                            }
                        });
                    }
                });

                // $('#ic_41_5').fadeIn(600, function () {
                //     $(this).addClass('active');
                //     $('#icon_25_txt_inn').velocity({opacity: 1, translateX: 45}, {delay:500, duration: 1300, easing: 'easeIn', complete: function () {
                //         console.log('sec3_inn-end');
                //         indexSlide = 'sec3';
                //         nextSlide = 'sec4';
                //         prevSlide = 'sec2';
                //         Trigger_Anim = true;
                //
                //     }});
                // });

            }
        },
        go: function () {
            $('#sec2').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeInSine', complete: function () {
                    $('#section2').removeClass('active');
                    $('#section3').addClass('active');
                    canvasTimeline.race.gotoAndPlay('road_trans_in');
                    nav_menu(3);
                }
            });
        }
    }
}());


var sec1_half_inn = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'first_all_out_in-end' && prevSlide === 'sec1_trans') {
                $('.fbutt').velocity({opacity: 1}, {duration: 500, easing: 'easeIn'});
                $('#block_first').velocity({opacity: 1}, {
                    duration: 500, easing: 'easeIn', complete: function () {
                        console.log('sec1_half_inn-end');
                        indexSlide = 'sec1_trans';
                        nextSlide = 'sec2';
                        prevSlide = 'sec1';
                        Trigger_Anim = true;
                    }
                });
            }
        },
        go: function () {
            canvasTimeline.plafirst.gotoAndPlay('first_all_out_in');
        }
    }
}());
var sec2_to_sec1_half = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road_hide-end' && prevSlide === 'sec1_trans') {
                console.log(raceCall);
                canvasTimeline.race.visible = false;
                canvasTimeline.plafirst.visible = true;
                $('#section2').removeClass('active');
                $('#section1').addClass('active');
                sec1_half_inn.go();

            }
        },
        go: function () {
            $('#sec2').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeIn', complete: function () {
                    canvasTimeline.race.racein.parallax26.gotoAndPlay('road_hide');

                }
            });
        }
    }
}());
var sec2_inn = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'road_show-end' && nextSlide === 'sec2') {

                console.log('sec2_inn-end');
                indexSlide = 'sec2';
                nextSlide = 'sec3';
                prevSlide = 'sec1_trans';
                Trigger_Anim = true;
            }
        },
        go: function () {

            canvasTimeline.plafirst.visible = false;
            canvasTimeline.race.visible = true;
            canvasTimeline.race.racein.parallax26.gotoAndPlay('road_show');
            // $('#sec2').velocity({opacity: 1}, {
            //     duration: 1000, easing: 'easeIn', complete: function () {
            //
            //     }
            // });

            var twes01 = TweenMax.to($('#man'), .5, {"transform": "scale(1)", yoyo: false, delay: 0.8, repeat: 0, ease: Power2.easeIn});


            var dir01 = TweenMax.to($('#dir1_big'), 0.7, {"transform": "scale(1)", yoyo: false, repeat: 0, ease: Power2.easeIn});
            var dir012 = TweenMax.to($('#dir1_med'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.3, repeat: 0, ease: Power2.easeIn});
            var dir013 = TweenMax.to($('#dir1_small'), .75, {"transform": "scale(1)", yoyo: false, delay: 0.4, repeat: 0, ease: Power2.easeIn});


            var ln1 = document.getElementById("LeftHand");
            var ln2 = document.getElementById("RightHand");
            var ln3 = document.getElementById("head");
            var twesl = TweenMax.to(ln1, 1, {"transform": "matrix( 0.999847412109375, 0.0154266357421875, -0.0154266357421875, 0.999847412109375, 41.1,56.1)", yoyo: true, repeat: -1, ease: Linear.easeNone});
            var twes2 = TweenMax.to(ln2, 1, {"transform": "matrix( 0.987823486328125, 0.15557861328125, -0.15557861328125, 0.987823486328125, 131.45,68.1)", yoyo: true, repeat: -1, ease: Linear.easeNone});
            var twes3 = TweenMax.to(ln3, 1, {"transform": "matrix( 0.999053955078125, -0.04022216796875, 0.04022216796875, 0.999053955078125, 94.4,38.7)", yoyo: true, repeat: -1, ease: Linear.easeNone});
            $('#ftext_2').velocity({opacity: 1, translateY: -50}, {delay: 300, duration: 1000, easing: 'easeIn'});
            $('#ic_1_1').fadeIn(100, function () {
                $(this).addClass('active');
                $('#icon_1_txt_inn').velocity({opacity: 1, translateX: -45}, {delay: 100, duration: 1300, easing: 'easeIn'});
            });
            $('#ic_2_1').fadeIn(1200, function () {
                $(this).addClass('active');
                $('#icon_2_txt_inn').velocity({opacity: 1, translateX: 45}, {delay: 1100, duration: 1300, easing: 'easeIn'});
            });
            $('#ic_3_1').fadeIn(1600, function () {
                $(this).addClass('active');
                $('#icon_3_txt_inn').velocity({opacity: 1, translateX: -45}, {delay: 1500, duration: 1300, easing: 'easeIn'});
            });
            $('#ic_4_1').fadeIn(600, function () {
                $(this).addClass('active');
                $('#icon_4_txt_inn').velocity({opacity: 1, translateX: 45}, {delay: 500, duration: 1300, easing: 'easeIn'});
            });
            $('#ic_5_1').fadeIn(600, function () {
                $(this).addClass('active');
                $('#icon_5_txt_inn').velocity({opacity: 1, translateX: -45}, {delay: 500, duration: 1300, easing: 'easeIn'});
            });
            $('#ic_6_1').fadeIn(2000, function () {
                $(this).addClass('active');
                $('#icon_6_txt_inn').velocity({opacity: 1, translateX: 45}, {delay: 1800, duration: 1300, easing: 'easeIn'});
            });
        }
    }
}());

var sec1_to_half = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'first_trans_in-end' && nextSlide === 'sec1_trans') {
                console.log('sec1_to_half-end');
                indexSlide = 'sec1_trans';
                nextSlide = 'sec2';
                prevSlide = 'sec1';
                Trigger_Anim = true;
            }
        },
        go: function () {
            canvasTimeline.plafirst.gotoAndPlay('first_trans_in');
            $('.ftext').addClass('active');
            $('#pharm_union').velocity({opacity: 0}, {
                duration: 1000, easing: 'easeIn', complete: function () {
                    $('#scroll_down').addClass('hide');
                }
            });
        }
    }
}());
var sec1_to_sec2 = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'first_all_out-end' && nextSlide === 'sec2') {
                sec2_inn.go();
            }
        },
        go: function () {
            $('.fbutt').velocity({opacity: 0}, {duration: 500, easing: 'easeIn'});
            $('#block_first').velocity({opacity: 0}, {
                duration: 500, easing: 'easeIn', complete: function () {
                    $('#section1').removeClass('active');
                    $('#section2').addClass('active');
                    canvasTimeline.plafirst.gotoAndPlay('first_all_out');
                    nav_menu(2);
                }
            });
        }
    }
}());

var sec1_to_half_back = (function () {
    return {
        inn: function (raceCall) {
            if (raceCall === 'first_trans_out-end') {
                console.log('sec1_to_half_back-end');
                indexSlide = 'sec1';
                nextSlide = 'sec1_trans';
                prevSlide = '';
                Trigger_Anim = true;
            }
        },
        go: function () {
            canvasTimeline.plafirst.gotoAndPlay('first_trans_out');
            $('#pharm_union').velocity({opacity: 1}, {
                delay: 2000,
                duration: 1000, easing: 'easeIn', complete: function () {
                    $('.ftext').removeClass('active');
                }
            });
        }
    }
}());
var sec1_inn = (function () {

    return {
        inn: function (raceCall) {
            if (raceCall === 'first_in-end') {
                console.log('sec1_inn-end');

                indexSlide = 'sec1';
                nextSlide = 'sec1_trans';
                prevSlide = '';
                Trigger_Anim = true;
            }
        },
        go: function () {
            $('#topMenu_block').velocity({marginTop: 0}, {delay: 100, duration: 1000, easing: 'easeIn'});
            $('#canvas').addClass('view');
            $('.ftext').velocity({opacity: 1, translateY: -50}, {delay: 300, duration: 1000, easing: 'easeIn'});
            $('.fbutt').velocity({opacity: 1, marginTop: -30}, {delay: 400, duration: 1000, easing: 'easeIn'});
            $('#delimiter').velocity({height: '100%'}, {delay: 400, duration: 500, easing: 'easeIn'});
            $('#lang_ru').velocity({opacity: 1, right: 51}, {delay: 800, duration: 500, easing: 'easeIn'});
            $('#lang_ukr').velocity({opacity: 1, right: -5}, {delay: 1000, duration: 500, easing: 'easeIn'});
            $('#btn_text p').velocity({opacity: 1, marginTop: 0}, {delay: 500, duration: 1000, easing: 'easeIn'});
            $('#header_logo').velocity({opacity: 1, marginTop: 0}, {delay: 600, duration: 1000, easing: 'easeIn'});
            $('#btn_str').velocity({opacity: 1, right: '20%'}, {delay: 900, duration: 1000, easing: 'easeIn'});
            $('#header_slogan').velocity({opacity: 1, marginLeft: 0}, {delay: 1200, duration: 1000, easing: 'easeIn'});
            $('#nav_item1').velocity({opacity: 1, marginTop: 0}, {delay: 1400, duration: 500, easing: 'easeIn'});
            $('#nav_item2').velocity({opacity: 1, marginTop: 0}, {delay: 1600, duration: 500, easing: 'easeIn'});
            $('#nav_item3').velocity({opacity: 1, marginTop: 0}, {delay: 1800, duration: 500, easing: 'easeIn'});
            $('#line_menu_3_').velocity({y1: '+=1100', y2: '+=1100'}, {delay: 1900, duration: 2000, easing: 'easeIn'});
            $('#menu_item_1').velocity({opacity: 1}, {delay: 2200, duration: 200, easing: 'easeIn'});
            $('#menu_item_2').velocity({opacity: 1}, {delay: 2400, duration: 200, easing: 'easeIn'});
            $('#menu_item_3').velocity({opacity: 1}, {delay: 2600, duration: 200, easing: 'easeIn'});
            $('#menu_item_4').velocity({opacity: 1}, {delay: 2800, duration: 200, easing: 'easeIn'});
            $('#menu_item_5').velocity({opacity: 1}, {
                delay: 3000, duration: 200, easing: 'easeIn', complete: function () {
                    $('#geo_circ').addClass('show');
                    $('#icons_geo').addClass('show');
                    $('#menu_item_7 span').addClass('show');
                    $('#scroll_down').addClass('show');
                }
            });
            $('#menu_item_6').velocity({opacity: 1}, {delay: 3200, duration: 200, easing: 'easeIn'});

            //$('#menu_item_7').velocity({opacity: 1}, {delay: 3400, duration: 200, easing: 'easeIn'});
            //$('#geo_circ').addClass('show');geo_circ_hov

            $('#scroll_down_inn').velocity({opacity: 1, bottom: 0}, {delay: 3000, duration: 1000, easing: 'easeIn'});
            $('#button_share').velocity({opacity: 1}, {delay: 3400, duration: 1000, easing: 'easeIn'});

            $('#pharm_union').velocity({opacity: 1, bottom: '7%'}, {
                delay: 3400,
                duration: 1000, easing: 'easeIn', complete: function () {
                    $('#geo_circ_hov').css({'display': 'block'});
                }
            });
        }
    }

}());


var slideDoit = function () {
    console.log(Trigger_Anim);
    if ((pressKey === 'down' && Trigger_Anim === true) || ( deltaScreen === 'down' && Trigger_Anim === true)) {
        direction = 'down';
        Trigger_Anim = false;
        switch (nextSlide) {
            case 'sec1_trans':
                sec1_to_half.go();
                break;
            case 'sec2':
                sec1_to_sec2.go();
                break;
            case 'sec3':
                sec2_to_sec3.go();
                break;
            case 'sec4':
                sec3_to_sec4.go();
                break;
            case 'sec4-r1':
                sec4_to_sec4_hf1.go();
                break;
            case 'sec4-r2':
                sec4_hf1_to_sec4_hf2.go();
                break;
            case 'sec5':
                sec4_hf2_to_sec5.go();
                break;
            case 'sec5-r1':
                sec5_to_sec5_hf1.go();
                break;
            case 'sec6':
                sec5_hf1_to_sec6.go();
                break;
            case 'sec7':
                sec6_to_sec7.go();
                break;
            default:
                Trigger_Anim = true;
                break;
        }

    }
    if ((pressKey === 'up' && Trigger_Anim === true) || (deltaScreen === 'up' && Trigger_Anim === true)) {
        direction = 'up';
        Trigger_Anim = false;
        console.log(prevSlide);
        switch (prevSlide) {
            case 'sec1':
                sec1_to_half_back.go();
                break;
            case 'sec1_trans':
                sec2_to_sec1_half.go();
                break;
            case 'sec2':
                sec3_to_sec2.go();
                break;
            case 'sec3':
                sec4_to_sec3.go();
                break;
            case 'sec4':
                sec4_hf1_to_sec4.go();
                break;
            case 'sec4-r1':
                sec4_hf2_to_sec4_hf1.go();
                break;
            case 'sec4-r2':
                sec5_to_sec4_hf2.go();
                break;
            case 'sec5':
                sec5_hf1_to_sec5.go();
                break;
            case 'sec5-r1':
                sec6_to_sec5_hf1.go();
                break;
            case 'sec6':
                sec7_to_sec6.go();
                break;
            default:
                Trigger_Anim = true;
                break;
        }

    }
};

var raceFirstCall = function (raceCall) {
    console.log('callback: ' + raceCall);
    sec1_inn.inn(raceCall);
    sec1_to_half.inn(raceCall);
    sec1_to_half_back.inn(raceCall);
    sec1_to_sec2.inn(raceCall);
    sec2_inn.inn(raceCall);
    sec2_to_sec3.inn(raceCall);
    sec3_to_sec4.inn(raceCall);
    sec3_to_sec2.inn(raceCall);
    sec4_inn.inn(raceCall);
    sec4_hf1_inn.inn(raceCall);
    sec4_to_sec4_hf1.inn(raceCall);
    sec4_hf2_inn.inn(raceCall);
    sec4_hf2_to_sec5.inn(raceCall);
    sec5_inn.inn(raceCall);
    sec5_to_sec5_hf1.inn(raceCall);
    sec5_hf1_to_sec6.inn(raceCall);
    sec6_inn.inn(raceCall);
    sec6_to_sec7.inn(raceCall);
    sec7_inn.inn(raceCall);
    sec2_to_sec1_half.inn(raceCall);
    sec1_half_inn.inn(raceCall);
    sec4_to_sec3.inn(raceCall);
    sec7_to_sec6.inn(raceCall);
    sec6_to_sec5_hf1.inn(raceCall);
    sec5_hf1_from_sec6.inn(raceCall);
    sec5_hf1_to_sec5.inn(raceCall);
    sec5_to_sec4_hf2.inn(raceCall);
    sec4_hf2_from_sec5.inn(raceCall);
    sec4_hf1_to_sec4.inn(raceCall);
    sec4_hf2_to_sec4_hf1.inn(raceCall);
    sec4_inn_from_sec4_hf1.inn(raceCall);
};


var nav_menu = function (menuitem) {
    if(menuitem === 2){
        $('#line_osnova').css('stroke-dashoffset','525');
        $('.menu_items').removeClass('active');
        $('#menu_item_2').addClass('active');
        $('#line_menu_items').css('color','#1ca9a3');
        $('#line_osnova').css('stroke','#4fe5b8');
        $('.line_menu_sv').css('fill','#4fe5b8');
        $('.circ_sm').css('background','#4fe5b8');
        $('.circ_bg').css('border-color','#4fe5b8');
        $('.geo').css('fill','#20a91b');
        $('.korz').css('stroke','#ffffff');
        $('#geo_circ.show').css('border-color','#4fe5b8');
        $('#geo_circ_hov').css('border-color','#4fe5b8');
    }
    if(menuitem === 3){
        $('#line_osnova').css('stroke-dashoffset','440');
        $('.menu_items').removeClass('active');
        $('#menu_item_3').addClass('active');
    }
    if(menuitem === 4){
        $('#line_osnova').css('stroke-dashoffset','373');
        $('.menu_items').removeClass('active');
        $('#menu_item_4').addClass('active');
        $('#line_menu_items').css('color','#ffffff');
        $('#line_osnova').css('stroke','#ffffff');
        $('.line_menu_sv').css('fill','#ffffff');
        $('.circ_sm').css('background','#ffffff');
        $('.circ_bg').css('border-color','#ffffff');
        $('.geo').css('fill','#ffffff');
        $('.korz').css('stroke','#2f5e74');
        $('#geo_circ.show').css('border-color','#ffffff');
        $('#geo_circ_hov').css('border-color','#ffffff');
    }
    if(menuitem === 4.5){
        $('#line_osnova').css('stroke-dashoffset','373');
        // $('.menu_items').removeClass('active');
        // $('#menu_item_2').addClass('active');
        $('#line_menu_items').css('color','#1ca9a3');
        $('#line_osnova').css('stroke','#4fe5b8');
        $('.line_menu_sv').css('fill','#4fe5b8');
        $('.circ_sm').css('background','#4fe5b8');
        $('.circ_bg').css('border-color','#4fe5b8');
        $('.geo').css('fill','#20a91b');
        $('.korz').css('stroke','#ffffff');
        $('#geo_circ.show').css('border-color','#4fe5b8');
        $('#geo_circ_hov').css('border-color','#4fe5b8');
    }
    if(menuitem === 5){
        $('#line_osnova').css('stroke-dashoffset','298');
        $('.menu_items').removeClass('active');
        $('#menu_item_5').addClass('active');
        $('#line_menu_items').css('color','#ffffff');
        $('#line_osnova').css('stroke','#ffffff');
        $('.line_menu_sv').css('fill','#ffffff');
        $('.circ_sm').css('background','#ffffff');
        $('.circ_bg').css('border-color','#ffffff');
        $('.geo').css('fill','#ffffff');
        $('.korz').css('stroke','#2f5e74');
        $('#geo_circ.show').css('border-color','#ffffff');
        $('#geo_circ_hov').css('border-color','#ffffff');
    }
    if(menuitem === 6){
        $('#line_osnova').css('stroke-dashoffset','210');
        $('.menu_items').removeClass('active');
        $('#menu_item_6').addClass('active');
        $('#line_menu_items').css('color','#ffffff');
        $('#line_osnova').css('stroke','#ffffff');
        $('.line_menu_sv').css('fill','#ffffff');
        $('.circ_sm').css('background','#ffffff');
        $('.circ_bg').css('border-color','#ffffff');
        $('.geo').css('fill','#ffffff');
        $('.korz').css('stroke','#2f5e74');
        $('#geo_circ.show').css('border-color','#ffffff');
        $('#geo_circ_hov').css('border-color','#ffffff');
    }
    if(menuitem === 7){
        $('#line_osnova').css('stroke-dashoffset','125');
        $('.menu_items').removeClass('active');
        $('#menu_item_7').addClass('active');
        $('#line_menu_items').css('color','#1ca9a3');
        $('#line_osnova').css('stroke','#4fe5b8');
        $('.line_menu_sv').css('fill','#4fe5b8');
        $('.circ_sm').css('background','#4fe5b8');
        $('.circ_bg').css('border-color','#4fe5b8');
        $('.geo').css('fill','#20a91b');
        $('.korz').css('stroke','#ffffff');
        $('#geo_circ.show').css('border-color','#4fe5b8');
        $('#geo_circ_hov').css('border-color','#4fe5b8');
    }
};


var loadFonDone = function () {
    sec1_inn.go();
    canvasTimeline.race.visible = false;
    canvasTimeline.race2.visible = false;
    canvasTimeline.plafirst.gotoAndPlay('first_in');



    // $('#section1').removeClass('active');
    // $('#section5').addClass('active');
    //
    // var twes05s1_ = TweenMax.to($('.ovsst0'), 0.7, {"transform": "scale(1)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    // var twes05s2_ = TweenMax.to($('.ovsst2'), 0.7, {"transform": "scale(1)", yoyo: false, delay: 0.3, repeat: 0, ease: Power2.easeIn});
    // var twes05s3_ = TweenMax.to($('.ovsst4'), 0.7, {"transform": "scale(1)", yoyo: false, delay: 0.5, repeat: 0, ease: Power2.easeIn});
    // var twes05s4_ = TweenMax.to($('#packpill'), 0.7, {"transform": "scale(1)", yoyo: false, delay: 0.7, repeat: 0, ease: Power2.easeIn});
    // var twes06_ = TweenMax.to($('#pilul'), 1, {"transform": "scale(1)", "left": 0, "top": 0, yoyo: false, delay: 1, repeat: 0, ease: Power2.easeIn});
    // var twes062_ = TweenMax.to($('#pilul2'), 1, {"transform": "scale(0.7)", "right": 0, "bottom": 0, yoyo: false, delay: 1, repeat: 0, ease: Power2.easeIn});
    // var twes07_ = TweenMax.to($('#goodic'), 0.5, {"transform": "scale(1)", "right": "3%", "top": 0, yoyo: false, delay: 1, repeat: 0, ease: Power2.easeIn});
    //
    // canvasTimeline.linesec5.gotoAndPlay('linesec5_trans_in');
    // $('#dirapack').velocity({bottom: '25%'}, {duration: 1000, easing: 'easeInSine'});
    // var twes06s1_ = TweenMax.to($('#packpill_in'), 0.7, {"transform": "rotateZ(0deg)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    // $('.back_osnova').velocity({right: '-25%'}, {delay: 700, duration: 700, easing: 'easeIn'});


};

/* Click Butirat */

$('#spis_1_h_inn').click(function () {
    // var twes05li2_ = TweenMax.to($('#spis_2 .goodsm'), 0.7, {"filter": "blur(5px)", "transform": "translateX(-100px) translateY(0px)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    // var twes05li3_ = TweenMax.to($('#spis_3 .goodsm'), 0.7, {"filter": "blur(5px)", "transform": "translateX(-100px) translateY(0px)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    $('#spis_2').velocity({opacity: 0}, {duration: 500, easing: 'easeInSine'});
    $('#spis_3').velocity({opacity: 0}, {
        duration: 500, easing: 'easeInSine', complete: function () {
            $('#spis_1_tx').fadeIn("slow");
        }
    });

});

$('#spis_1 .close').click(function () {
    $('#spis_1_tx').fadeOut("slow");
        // var twes05li2_ = TweenMax.to($('#spis_2 .goodsm'), 0.7, {"filter": "blur(0px)", "transform": "translateX(0px) translateY(0px)", yoyo: false, repeat: 0, ease: Power2.easeIn});
        // var twes05li3_ = TweenMax.to($('#spis_3 .goodsm'), 0.7, {"filter": "blur(0px)", "transform": "translateX(0px) translateY(0px)", yoyo: false, repeat: 0, ease: Power2.easeIn});
        $('#spis_2').velocity({opacity: 1}, { duration: 500, easing: 'easeInSine'});
        $('#spis_3').velocity({opacity: 1}, { duration: 500, easing: 'easeInSine'});
});


$('#spis_2_h_inn').click(function () {
    // var twes05li2_ = TweenMax.to($('#spis_1 .goodsm'), 0.7, {"filter": "blur(5px)", "transform": "translateX(-100px) translateY(0px)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    // var twes05li3_ = TweenMax.to($('#spis_3 .goodsm'), 0.7, {"filter": "blur(5px)", "transform": "translateX(-100px) translateY(0px)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    $('#spis_1').velocity({marginTop: -225, opacity: 0}, {duration: 500, easing: 'easeInSine'});
    // $('#spis_1_h').velocity({opacity: 0}, {duration: 500, easing: 'easeInSine'});
    $('#spis_3').velocity({opacity: 0}, {
        duration: 500, easing: 'easeInSine', complete: function () {
            $('#spis_2_tx').fadeIn("slow");
        }
    });

});

$('#spis_2 .close').click(function () {
    $('#spis_2_tx').fadeOut("slow");
    // var twes05li2_ = TweenMax.to($('#spis_1 .goodsm'), 0.7, {"filter": "blur(0px)", "transform": "translateX(0px) translateY(0px)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    // var twes05li3_ = TweenMax.to($('#spis_3 .goodsm'), 0.7, {"filter": "blur(0px)", "transform": "translateX(0px) translateY(0px)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    $('#spis_1').velocity({marginTop: 0, opacity: 1}, {duration: 500, easing: 'easeInSine'});
    // $('#spis_1_h').velocity({opacity: 1}, { duration: 500, easing: 'easeInSine'});
    $('#spis_3').velocity({opacity: 1}, { duration: 500, easing: 'easeInSine'});
});


$('#spis_3_h_inn').click(function () {
    // var twes05li2_ = TweenMax.to($('#spis_1 .goodsm'), 0.7, {"filter": "blur(5px)", "transform": "matrix(1, 0, 0, 1, -100, 100)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    // var twes05li3_ = TweenMax.to($('#spis_2 .goodsm'), 0.7, {"filter": "blur(5px)", "transform": "matrix(1, 0, 0, 1, -100, 100)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    $('#spis_1').velocity({marginTop: -365, opacity: 0}, {duration: 500, easing: 'easeInSine'});
    $('#spis_2').velocity({opacity: 0}, {duration: 500, easing: 'easeInSine', complete: function () {
            $('#spis_3_tx').fadeIn("slow");
        }
    });

});

$('#spis_3 .close').click(function () {
    $('#spis_3_tx').fadeOut("slow");
    // var twes05li2_ = TweenMax.to($('#spis_1 .goodsm'), 0.7, {"filter": "blur(0px)", "transform": "matrix(1, 0, 0, 1, 0, 0)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    // var twes05li3_ = TweenMax.to($('#spis_2 .goodsm'), 0.7, {"filter": "blur(0px)", "transform": "matrix(1, 0, 0, 1, 0, 0)", yoyo: false, repeat: 0, ease: Power2.easeIn});
    $('#spis_1').velocity({marginTop: 0, opacity: 1}, {duration: 500, easing: 'easeInSine'});
    $('#spis_2').velocity({opacity: 1}, {duration: 500, easing: 'easeInSine'});
    // $('#spis_1_h').velocity({opacity: 1}, {delay:200, duration: 500, easing: 'easeInSine'});
    // $('#spis_2_h').velocity({opacity: 1}, {delay:200, duration: 500, easing: 'easeInSine'});
});

/* Click Butirat End */


window.document.onkeydown = function (e) {
    if (!e) e = event;
    if (e.keyCode === 40) {
        console.log('press dowm');
        pressKey = 'down';
        slideDoit();
    }
    if (e.keyCode === 38) {
        console.log('press up');
        pressKey = 'up';
        slideDoit();
    }
};




