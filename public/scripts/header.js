import typeWriting from "./external/typeWriting.js";

function Header(){
    const title = $("#TITLE").attr("subtitle");
    const $subtitle = $("#header_subtitle_content");
    const cursor = $("#header_blink");
    
    typeWriting(cursor, $subtitle, title);
}

window.addEventListener('load', () => {
    new Header();
});