async function md(data) {
    // '''text''' : <b>
    // ''text'' : <i>
    // ~~text~~ : <s>
    // --text-- : <s>
    // __text__ : <u>
    //[[''text'']] : ''text'' (문법적용x)

    var result = new String(data);
    
    result = await replaceMark(result, "'''", "<b>", "</b>");
    result = await replaceMark(result, "''", "<i>", "</i>");
    result = await replaceMark(result, "~~", "<s>", "</s>");
    result = await replaceMark(result, "--", "<s>", "</s>");
    result = await replaceMark(result, "__", "<u>", "</u>", true);

    return result;
}

function replaceMark(text, find, replace1, replace2, isLast = false) {
    // indexOf(find, index) : index 오른쪽으로 첫번째 find 위치 반환
    // lastIndexOf(find, index) : index 왼쪽으로 첫번째 find 위치 반환
    var result = new String(text);
    var index1 = result.indexOf(find);
    var index2 = result.indexOf(find, index1+1);
    var indexPointer = 0;

    while(result.indexOf(find) != -1) {
        index1 = result.indexOf(find, indexPointer);
        if(index1 == -1) index2 = index1;
        else index2 = result.indexOf(find, index1+1);

        if(result.indexOf(find, indexPointer) >= index2) {
            break;
        } else {
            if(result.lastIndexOf("[[", index1) == -1 || result.indexOf("]]", index2) == -1) {
                result = result.replace(find, replace1);
                result = result.replace(find, replace2);
                indexPointer = index2 + find.length - 1;
            } else {
                indexPointer = result.indexOf("]]", indexPointer);
                if(isLast == true) {
                    result = result.replace("[[", "");
                    result = result.replace("]]", "");
                    indexPointer -= 4;
                }
            }
        };
    }
    if(isLast) {
        while(result.indexOf("[[") != -1 && result.indexOf("]]") != 1) {
            result = result.replace("[[", "");
            result = result.replace("]]", "");
        }
    }
    return result;
}

async function init() {
    
    const post = document.getElementsByClassName("post_content");
    for(var i=0; i<post.length; i++) {
        var newText = await md(post[i].innerText);
        post[i].innerHTML = newText;
    }
    
    
}

init();