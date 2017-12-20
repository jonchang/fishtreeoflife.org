function makeShowHide(button_id, content_id) {
    var content = document.getElementById(content_id);
    content.style.display = "none";
    var button = document.getElementById(button_id);
    button.setAttribute("role", "button");

    var show = function(e) {
        e.stopPropagation();
        e.preventDefault();
        content.style.display = "block";
        button.innerHTML = button.innerHTML.replace("Show", "Hide");
        button.onclick = hide;
    }

    var hide = function(e) {
        e.stopPropagation();
        e.preventDefault();
        content.style.display = "none";
        button.innerHTML = button.innerHTML.replace("Hide", "Show");
        button.onclick = show;
    }

    button.onclick = show;
}
