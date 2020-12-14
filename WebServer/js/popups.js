$('.call_Pop').click(function() {
    var $href = $(this).attr('href');
    
    if($href.indexOf("event") == -1) {
        if($href.indexOf("?") != -1) {
            var $hr = $href.split("?");
            postLayer_popup($hr[0], $hr[1]);
        } else {
            postLayer_popup($href);
        }
    } else {
        eventLayer_popup($href);
    }
});
function postLayer_popup(mode, id=0) {

    var $el = $('#post_popup');
    var isDim = true;
    $('#pop_delbtn').attr('style', 'display:none');
    $('input[name=action]').val(mode);
    console.log(mode);
    $('#popup_title').text("새 글 작성");
    if(id != 0) {
        $('#popup_title').text("글 수정");
        $('input[name=postnum]').val(id);
        var titleVal = $('#title' + id).text();
        var contentVal = $('#content' + id).text();
        $('input[name=title]').val(titleVal);
        $('textarea[name=content]').val(contentVal);
    } else {
        $('input[name=title]').val('');
        $('textarea[name=content]').val('');
    }
    
    $('.eventForm').attr('style', 'display:none;');
    $('.postForm').attr('style', "display:'';");
    

    isDim ? $('.popup_layer').fadeIn() :
    $el.fadeIn();

    $('.pop_bg').fadeIn();

    var $elWidth = ~~($el.outerWidth()), 
    $elHeight = ~~($el.outerHeight()),
    docWidth = $(document).width(),
    docHeight = $(document).height();

    if($elHeight < docHeight || $elWidth < docWidth) {
        $el.css({
            marginTop: -$elHeight / 2,
            marginLeft: -$elWidth/2
        })
    } else {
        $el.css({top: 0, left: 0});
    }

    $el.find('a.pop_btn').click(function() {
        isDim ? $('.popup_layer').fadeOut() :
        $el.fadeOut();
        $('.pop_bg').fadeOut();
        return false;
    });

    $('.pop_bg').click(function() {
        $('.popup_layer').fadeOut();
        $('.pop_bg').fadeOut();
        return false;
    });
}

function convertDate(text) {
    var t = text.split(' ');
    var y = t[3];
    var d = t[2]
    var m = "01";
    switch(t[1]) {
        case "Jan":
            m = "01";
            break;
        case "Feb":
            m = "02";
            break;
        case "Mar":
            m = "03";
            break;
        case "Apr":
            m = "04";
            break;
        case "May":
            m = "05";
            break;
        case "Jun":
            m = "06";
            break;
        case "Jul":
            m = "07";
            break;
        case "Aug":
            m = "08";
            break;
        case "Sep":
            m = "09";
            break;
        case "Oct":
            m = "10";
            break;
        case "Nov":
            m = "11";
            break;
        case "Dec":
            m = "12";
            break;
        default:
            m = "null";
    }
    return y + '-' + m + '-' + d;
}

function eventLayer_popup(mode, arg = null) {
    //#new_event
    //#edit_event
    var $el = $('#post_popup');
    var isDim = true;
    $('#pop_delbtn').attr('style', 'display:none');
    $('input[name=action]').val(mode);
    console.log(mode);
    $('#popup_title').text("새 일정");
    if(arg != null && mode == "#edit_event") {
        $('#popup_title').text("일정 수정");
        var delLink = '/deleteEvents/' + arg.id;
        $('#pop_delbtn').attr("onClick", "location.href='" + delLink + "'");
        $('#pop_delbtn').attr('style', 'display:inline');
        
        $('input[name=postnum]').val(arg.id);
        var titleVal = arg.title;
        var startVal = convertDate(arg.start.toString());
        if(arg.end) {
            var endVal = convertDate(arg.end.toString());
        } else {
            var endVal = startVal;
        }
        
        $('input[name=title]').val(titleVal);
        $('input[name=start]').val(startVal);
        $('input[name=end]').val(endVal);
    } else if (arg != null) {
        $('input[name=title]').val('');
        var startVal = convertDate(arg.start.toString());
        if(arg.end) {
            var endVal = convertDate(arg.end.toString());
        } else {
            var endVal = startVal;
        }
        $('input[name=start]').val(startVal);
        $('input[name=end]').val(endVal);
    } else {
        var today = convertDate(new Date().toString());
        $('input[name=title]').val('');
        $('input[name=start]').val(today);
        $('input[name=end]').val(today);
    }

    $('.postForm').attr('style', 'display:none;');
    $('.eventForm').attr('style', "display:'';");

    isDim ? $('.popup_layer').fadeIn() :
    $el.fadeIn();

    $('.pop_bg').fadeIn();

    var $elWidth = ~~($el.outerWidth()), 
    $elHeight = ~~($el.outerHeight()),
    docWidth = $(document).width(),
    docHeight = $(document).height();

    if($elHeight < docHeight || $elWidth < docWidth) {
        $el.css({
            marginTop: -$elHeight / 2,
            marginLeft: -$elWidth/2
        })
    } else {
        $el.css({top: 0, left: 0});
    }

    $el.find('a.pop_btn').click(function() {
        isDim ? $('.popup_layer').fadeOut() :
        $el.fadeOut();
        $('.pop_bg').fadeOut();
        return false;
    });

    $('.pop_bg').click(function() {
        $('.popup_layer').fadeOut();
        $('.pop_bg').fadeOut();
        return false;
    });
}