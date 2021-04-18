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
function getAverageRating(url) {
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
        var average = (sum * 1.0) / (result.length * 1.0);
        console.log(average);
        return average;
    });
}

