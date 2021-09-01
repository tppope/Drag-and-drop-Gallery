let galeria;
let zobrazenie = [];
let jsonLet;
var cookieName = 'tplCookieConsent';


document.addEventListener("DOMContentLoaded", () => {
    galeria = document.getElementById("galeria");
    checkCookie();
    const searchValue = getCookie('search');

    if(searchValue){
        $("#filter").val(searchValue);
    }

    fetch('resources/photos.json')
        .then(response => response.json())
        .then(json => nacitatJson(json));
});

function nacitatJson(json){
    jsonLet = json;
    const zobrazenieCookies = getCookie('zobrazenieCookie');
    if(zobrazenieCookies){
        zobrazenie = JSON.parse(zobrazenieCookies);
    }else{
        naplnZobrazenie();
    }

    nacitatObrazky();
}

function naplnZobrazenie(){
    jsonLet.photos.forEach((value,index) => {
       zobrazenie[index] = index;
    });
}

function nacitatObrazky() {
    zobrazenie.forEach((polozka) => {
        let obrazok = document.createElement("img");
        obrazok.setAttribute("src","resources/images/" + jsonLet.photos[polozka].src);
        obrazok.setAttribute("alt",jsonLet.photos[polozka].title);
        obrazok.setAttribute("id",polozka);
        obrazok.setAttribute("data-target","#carouselExample");
        obrazok.classList.add("stvorec");
        obrazok.classList.add("ui-state-default")

        galeria.appendChild(obrazok);
    });
    dajDoCarousel();
}

function filter(filterText)
{
    setCookie('search',encodeURIComponent(filterText.value), 30);
    zobrazenie = [];
    let pozicia = 0;
    jsonLet.photos.forEach((value,index) => {
        if(value.title.toLowerCase().indexOf(filterText.value.toLowerCase()) !== -1 || value.description.toLowerCase().indexOf(filterText.value.toLowerCase()) !== -1){
            zobrazenie[pozicia] = index;
            pozicia ++;
        }
    });
    $("#galeria").empty();
    nacitatObrazky();
}

$(function (){
    $("#galeria").sortable(
        {
            update:  function (){
               let obrazky = $("#galeria img");
                jQuery.each(obrazky,(index,value)=>{
                    zobrazenie[index] = value.id;
                })
                dajDoCarousel();
           }
        }
    );
    $("#galeria").disableSelection();
});

function nastavSlideTo()
{
    let obrazky = $("#galeria img");
    jQuery.each(obrazky,(index,value)=>{
       $(value).attr("data-slide-to", index);
    });
}

function dajDoCarousel(){
    setCookie("zobrazenieCookie",JSON.stringify(zobrazenie),30)
    nastavSlideTo();
    $(".carousel-inner").empty();
    zobrazenie.forEach((polozka,index) =>{
        let carouselObrazok = document.createElement("img");
        carouselObrazok.classList.add(...["d-block", "w-100"]);
        carouselObrazok.setAttribute("src", "resources/images/" + jsonLet.photos[polozka].src);
        carouselObrazok.setAttribute("alt",jsonLet.photos[polozka].title);

        let divObrazok = document.createElement("div");
        divObrazok.classList.add("carousel-item");
        if(index === 0)
            divObrazok.classList.add("active");

        let caption = document.createElement("div");
        let nazov = document.createElement("h5");
        nazov.innerText = jsonLet.photos[polozka].title;
        let popis = document.createElement("p");
        popis.innerText = jsonLet.photos[polozka].description;
        caption.appendChild(nazov);
        caption.appendChild(popis);
        divObrazok.appendChild(carouselObrazok);
        divObrazok.appendChild(caption);
        $(".carousel-inner").get(0).append(divObrazok);


    });

}

function startStop(button){

    if( ! $(button).hasClass('btn-primary')){
        $('.carousel').carousel('pause');
        button.classList.remove("btn-secondary");
        button.classList.add("btn-primary");
        button.innerText = "Start Slideshow";
    }
    else{
        $('.carousel').carousel('cycle');
        button.classList.remove("btn-primary");
        button.classList.add("btn-secondary");
        button.innerText = "Stop Slideshow";
    }
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return decodeURIComponent(c.substring(name.length, c.length));
        }
    }
    return "";
}

function checkCookie(){


    var _shouldShowPopup = function () {
        if (getCookie(cookieName)) {
            return false;
        } else {
            return true;
        }
    };

    // Show the cookie popup on load if not previously accepted
     if (_shouldShowPopup()) {
         $('#cookieModal').modal({backdrop: 'static', keyboard: false});
     }

    // Modal dismiss btn - consent
    $('#cookieModalConsent').on('click', function () {
        setCookie(cookieName, 1, 30);
    });
}
