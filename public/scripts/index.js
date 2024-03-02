/*
    ! WARNING !
    YOU ARE **NOT** ACCESSING TO NORMAL FILE
    This File is Secured By : 
    WDWIZ {IDBI}, IDBI Union

    We are politely Reommend You
    **NOT TO READ, EDIT THIS FILE **

    IF YOU DON'T :
    YOU ARE VIOLATING : 
     - IDBI Technology Shield

    REMEBER : NO ONE IS PROTECTED IN FRONT OF IDBI
*/

import typeWriting from "./external/typeWriting.js";
import "./external/hangul.min.js";

let sectionMover;

function pageScroll(){
    const $li = $(".navbar_list");
    const $pages = $(".pages");

    $li.each((idx, dom) => {
        dom.addEventListener('click', () => {
            $pages.css("display", "none");
            $pages.eq(idx).css("display", "block");

            $li.eq(idx).addClass('watching');
            $li.eq(1 - idx).removeClass('watching');
        });
    });
}

function searchConfig(){
    const $inp = $("#search_inp");
    const $searchResults = $(".searchResult_list");
    const $searchResults_page = $("#searchResult_page_wrap");
    const $button = $(".searchResult_page_btn");

    let data = [];
    let dataPage = 0;
    let maxPage = 0;
    const dataPerPage = 5;

    // preSearch
    $inp.on('input', () => {
        const val = $inp.val();
        dataPage = 0;

        preSearch(val)
            .then(_data => showPreResults(_data, dataPage));
    });

    $button.each((idx) => {
        const $box = $button.eq(idx);
        
        $box.on('click', () => {
            const dir = (idx - 0.5) * 2;
    
            if (dir + dataPage < maxPage && dir + dataPage >= 0) dataPage += dir;
    
            showPreResults(data, dataPage);
        });
    });

    function showPreResults(_data, page = 0){
        data = _data;

        maxPage = Math.ceil(_data.length / dataPerPage);
        $searchResults.css('display', 'none');
        $searchResults_page.css('display', 'block');
        $("#searchResult_page").text(`${page + 1} / ${maxPage}`);

        for (let i = 0; i < dataPerPage && i < data.length - dataPerPage * page; i++){
            $searchResults.eq(i).css('display', 'flex');
            $searchResults.eq(i).html(`
                <p class="searchResult_text name text">${data[i + dataPerPage * page].name}</p>
                <p class="searchResult_text stuid text">${data[i + dataPerPage * page].stuid}</p>
                <p class="searchResult_text score text"><span class="good">${data[i + dataPerPage * page].scores.good}</span> / <span class="bad">${data[i + dataPerPage * page].scores.bad}</span></p>
            `);
        }
    }

    // reSearch
    $searchResults.each((idx) => {
        const $box = $searchResults.eq(idx);

        $box.click(() => {
            reSearch(data[idx + dataPage * dataPerPage].stuid)
                .then(_data => sectionMover(1, _data));
        });
    });

    setTimeout(() => {
        $inp.focus();
    }, 100);
}

function sectionManager(){
    const $inp = $("#search_inp");
    const $page0_section0 = $("#page0_section0");
    const $page0_section1 = $("#page0_section1");
    const $profile_img = $("#profile_img");
    const $profile_info = $("#profile_info");

    let watching = 0;

    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function loadImg(url){
        return new Promise(resolve => {
            const image = new Image();
            image.src = url;
            image.onload = () => resolve();
        });
    }

    $(".option_btn#goBack").click(section0);
    $(".option_btn#submit").click(section2);

    async function section0(){
        if (watching == 2) return;
        watching = 0;
        $page0_section1.removeClass('profile_show');
        await delay(2000);
        $page0_section0.removeClass('page0_section0_hide1');
        $(".header").removeClass('header2');
        await delay(1000);
        $inp.focus();
    }

    async function section1(profileData = {}){
        const gisu = profileData.gisu;
        const gisuEnd = (() => {
            switch (gisu % 10){
                case 1 : return "st";
                case 2 : return "nd";
                case 3 : return "rd";
                default : return "th";
            }
        })();
        const stuid = profileData.stuid;
        const name = profileData.name;
        const background_url = profileData.profileImg;

        watching = 1;
        $(".header").addClass('header2');
        $page0_section0.addClass('page0_section0_hide1');
        await delay(1500);
        if (watching != 1) return;
        await loadImg(background_url);
        $profile_img.css({
            "background" : `url(${background_url})`,
            "background-size" : "cover",
            "background-position" : "center"
        });
        $profile_info.html(`${gisu}<span style="font-size: 50px; font-weight: 700;">${gisuEnd}</span> ${stuid}<br/>${name}`);
        $profile_img.addClass('loading');
        await delay(300);
        $profile_img.removeClass('loading');
        await delay(2000);
        $page0_section1.addClass('profile_show');
        await delay(8000);
        if (watching != 1) return;
        await section2();
    }

    async function section2(){
        if (watching != 1) return;
        watching = 2;
        $page0_section1.removeClass('profile_show');
        await delay(2000);
        $page0_section0.addClass('page0_section0_hide2');
        $page0_section0.removeClass('page0_section0_hide1');
    }

    function sectionMover(idx, data = ""){
        if (!(0 <= idx || idx <= 2)) return;

        if (idx == 0) section0();
        else if (idx == 1) section1(data);
        else if (idx == 2) section2();
    }

    return sectionMover;
}

async function preSearch(val){
    let method = 0;

    let _val = val;

    let data = [];

    if (parseInt(val)){
        _val = parseInt(_val);
        method = 1;
    }

    await $.ajax({
        "type" : "post",
        "url" : "/search/presearch",
        "async" : true,
        "headers" : {
            "Content-Type" : "application/json",
            "X-HTTP-Method-Override" : "POST"
        },
        "dataType" : "text",
        "data" : JSON.stringify({
            "value" : _val,
            "method" : method
        }),
        "success" : (res) => {
            res = JSON.parse(res).data;
            data = res;
        },
        "error" : (req, status, err) => {
            console.log(err);
        }
    });

    return data;
}

async function reSearch(stuid){
    let data = [];

    await $.ajax({
        "type" : "post",
        "url" : "/search/research",
        "async" : true,
        "headers" : {
            "Content-Type" : "application/json",
            "X-HTTP-Method-Override" : "POST"
        },
        "dataType" : "text",
        "data" : JSON.stringify({
            "value" : stuid
        }),
        "success" : (res) => {
            res = JSON.parse(res).data[0];
            data = res;
            console.log(data);
        },
        "error" : (req, status, err) => {
            console.log(err);
        }
    });

    return data;
}

window.onload = () => {
    pageScroll();
    searchConfig();
    sectionMover = sectionManager();
}