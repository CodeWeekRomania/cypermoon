const NewsApiKey = '0a830ecc9a09413382093f027ab8ee1f';

var mysql = require('mysql');
var express = require('express');
var fs = require('fs');
var cors = require('cors');

const NewsApi = require('newsapi');
const newsapi = new NewsApi(NewsApiKey);

var app = express();
app.use(cors());

var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "12345",
	database: "FakeNewsDetector"
});

var fileData;

fs.readFile('test.txt', 'utf-8', function (err, data) {
  if (err) throw err;
  fileData = data;
});

app.get('/checkUrl', function (req, res) {
	var url = req.query.url;
	console.log("Searching for:  " + url);
	var sql = "SELECT * FROM `Blacklist` WHERE `url` LIKE '%" + url + "%'";
	con.query(sql, function (err, result, fields) {
    	if (err) throw err;
		console.log(result);
		if (Object.keys(result).length!=0) {
			console.log("sent 1 in db");
			res.send({found: '1'});		
		}
 	});
	var str = '\n' + url;
	if (fileData.indexOf(str) >= 0) {
		console.log("sent 1 in file");
		res.send({found: '1'});		
	}
});

app.get('/getRating', function (req, res) {
	var url = req.query.url;
	var sql = "SELECT * FROM Rating WHERE `url` = '" + url + "' ";
	con.query(sql, function (err, result, fields) {
    	if (err) throw err;
		res.send(result);
 	});
});

app.get('/giveRating', function (req, res) {
	var url = req.query.url;
	var rating = req.query.rating;
	var sql = "INSERT INTO `Rating` (`url`, `rating`, `ip`) VALUES ('" + url + "','" + rating + "', 'noip')";
	console.log(sql);
	con.query(sql, function (err, result) {
    	if (err) throw err;
    	console.log("1 record inserted");
		res.send({
			success: '1'
		});
  	});
});

app.get('/getRelated', function (req, res) {
	var q = req.query.q;
	var url = req.query.url;
	newsapi.v2.everything({
  		q: q,
  		sortBy: 'relevancy',
		excludeDomains: url,
		pageSize: 3,
		language: 'en'
	}).then(response => {
		res.send(response);
	});
});

app.listen(8080);

