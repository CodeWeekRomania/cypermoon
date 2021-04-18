var rating = 0;
var sites = [];

function getRelatedNews(q, url) {
    $.ajax({
        url: 'http://localhost:8080/getRelated',
        data: {
            'q': q,
            'url': url,
        }
    }).done(function(data) {
        for (var news of data.articles) {
            var newSite = document.createElement("a")
            newSite.innerText = news.title
            newSite.classList.add("sec-color")
            newSite.href = news.url
            newSite.target = "_blank"
            document.getElementById("sites").appendChild(newSite)
            document.getElementById("sites").appendChild(document.createElement("br"))
        }
        setColor();
    });
}

function rate(url, rating) {
	$.ajax({
        url: 'http://localhost:8080/giveRating',
        data: {
            'url': url,
			'rating': rating
        }
    }).done(function(data) {
        success = data.success;
        console.log(success);
        if (success == 1) {
            console.log("Rated succesfully");
        }
        else {
			console.log("Error at rate");
        }
    });
}
function getAverageRating(url, callback) {
    $.ajax({
        url: 'http://localhost:8080/getRating',
        data: {
            'url': url
        }
    }).done(function(data) {
        let result = data.map(data => data.rating);
        var sum = 0;
        for (var i = 0; i < result.length; ++i) {
            sum += result[i];
        }
        if (result.length != 0) {
            var average = (sum * 1.0) / (result.length * 1.0);
            callback(average);
        }
        else
            callback(2);
    });
}
function checkUrl(url, callback) {
    var found;
    $.ajax({
        url: 'http://localhost:8080/checkUrl',
        data: {
            'url': url
        }
    }).done(function(data) {
        if (Object.keys(data).length!=0) {
            console.log(data);
            found = data.found;
            console.log(found);
            callback(found);
        }
    });
}


function setColor() {
    console.log('set')
    var prim, sec;
    if(rating > 70)
    {
        prim = "#64D27A"
        sec = "#C0F3CB"
        document.getElementById("scoretext").innerText="FACT"
        document.getElementById("scoretext").classList.add("bigtext")
        document.getElementsByClassName("progress")[0].style.stroke = "#64D27A";
    }
    else if(rating > 30)
    {
        prim = "#D2B564"
        sec = "#F3E5C0"
        document.getElementById("scoretext").innerText="QUESTIONABLE"
        document.getElementById("scoretext").classList.add("smalltext")
        document.getElementsByClassName("progress")[0].style.stroke = "#D2B564";
    }
    else
    {
        prim = "#D26464"
        sec = "#F3C0C0"
        document.getElementById("scoretext").innerText="LIE"
        document.getElementById("scoretext").classList.add("bigtext")
        document.getElementsByClassName("progress")[0].style.stroke = "#D26464";
    }
    const primary = document.getElementsByClassName("prim-color")
    for(var x=0; x<primary.length; x++)
    {
        primary[x].style.color = prim
    }
    const primarybg = document.getElementsByClassName("primbg-color")
    for(var x=0; x<primarybg.length; x++)
    {
        primarybg[x].style.backgroundColor = prim
    }
    const secondary = document.getElementsByClassName("sec-color")
    for(var x=0; x<secondary.length; x++)
    {
        secondary[x].style.color = sec
    }
    const secondarybg = document.getElementsByClassName("secbg-color")
    for(var x=0; x<secondarybg.length; x++)
    {
        secondarybg[x].style.backgroundColor = sec
    }
    document.getElementsByClassName("progress")[0].style.strokeDashoffset = (100-rating)/100 * -745
    return 0;
}

function setScore() {
    document.getElementById("score").innerText = rating
}


function setRated(item) {
    const dots = document.getElementsByClassName("ratebtn")
    for(var x=0; x<dots.length; x++)
    {
        if(x<=item)
        {
            dots[x].classList.replace('secbg-color', 'primbg-color')
        }
        else{
            dots[x].classList.replace('primbg-color', 'secbg-color')
        }
    }
    setColor()
}

function addListeners(url) {
    $('#star1').on("click", function(e){
        rate(url, 1);
        setRated(0);
        e.preventDefault();
 
    });
    $('#star2').on("click", function(e){
        rate(url, 2);
        setRated(1);
        e.preventDefa+ult();
 
    });
    $('#star3').on("click", function(e){
        rate(url, 3);
        setRated(2);
        e.preventDefault();
 
    });
    $('#star4').on("click", function(e){
        rate(url, 4);
        setRated(3);
        e.preventDefault();
 
    });
    $('#star5').on("click", function(e){
        rate(url, 5);
        setRated(4);
        e.preventDefault();
 
    });
}

chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    var url = tabs[0].url;
    var truncatedUrl = "";
    var sl = 0;
    for (var x = 0; x < url.length; ++x) {
        if (url[x] == '/') {
            sl++;
            if (sl >= 3) {
                break;
            }
        }
        else {
            if (sl == 2) {
                truncatedUrl += url[x];        
            }
        }
    }
    url = truncatedUrl;
    console.log(url);
    getAverageRating(url, function(ad) {
    rating = (ad / 5) * 100;
    rating = parseInt(rating);
    console.log("AD:" + ad);
        checkUrl(url, function(fnd) {
            if (fnd == true) {
                rating = 0;    
            }
        }); 
    });

    addListeners(url);
    getRelatedNews("vaccine", url);

    setTimeout(function(){
        setColor();
        setScore();
    }, 200);
});



