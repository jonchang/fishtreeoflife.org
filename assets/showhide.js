function makeShowHide(button_id, content_id) {
    var content = document.getElementById(content_id);
    content.style.display = "none";
    var button = document.getElementById(button_id);
    button.setAttribute("role", "button");

    var show = function() {
        content.style.display = "block";
        button.innerHTML = button.innerHTML.replace("Show", "Hide");
        button.onclick = hide;
        return false;
    }

    var hide = function() {
        content.style.display = "none";
        button.innerHTML = button.innerHTML.replace("Hide", "Show");
        button.onclick = show;
        return false;
    }

    button.onclick = show;
    return true;
}

