window.addEventListener("scroll", function () {
    const s_header = document.getElementById("s_header");
    s_header.classList.add("little");

    const underline_nav = document.getElementById("underline_nav");
    underline_nav.style.top = s_header.offsetHeight - 2 + "px";
});

//window.addEventListener("load", function () {
const s_header = document.getElementById("s_header");
s_header.classList.add("little");
const underline_nav = document.getElementById("underline_nav");
underline_nav.style.top = s_header.offsetHeight - 2 + "px";
//});