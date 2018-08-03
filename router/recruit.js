var express = require('express');
var router = express.Router();

var client = require("./main.js").client;
var n_th = require('./main.js').n_th;
var dates = require('./main.js').dates;

router.get('/', function(req, res) {
    if (req.query.filter && req.query.filter == 'checkSurvived') {
        console.log('hello');
        var email = req.query.email;
        var query = `SELECT survived, name FROM application WHERE email = '` + email + `'`;
        client.query(query, function(error, result){
            if (error) {
                console.log(error);
            } else {
                res.send(result);
            }
        });
    } else {
        require('date-utils');
        var date = new Date();
        date.setHours(date.getHours() + 9); //서버 로컬 시간이 표준시간과 정확히 9시간 차이남
        var time = date.toFormat('YYYY-MM-DD HH24:MI:SS');
        
        var recruit_wait = 1; // 모집전 상태인 경우 1, 모집중 상태인 경우 0으로 변경
        
        if (recruit_wait == 1) {
            res.render('recruit/recruit-none', {'n_th': n_th, 'due_month': dates.due_month, 'due_day': dates.due_day}); // 모집전
        } else if (time < '2018-08-18 00:00:00') {
            res.render('recruit/recruit-ing', {'due_day': dates.due_day}); // '모집 종료일' 설정, 지원중 노출은 '모집 종료일' 자정 전 까지
        } else if (time < '2018-08-19 00:00:00') {
            res.render('recruit/recruit-fin'); // '1차 발표일' 설정, 모집종료 노출은 '1차 발표일' 자정 전 까지
        } else if (time < '2018-08-20 00:00:00') {
            res.render('recruit/recruit-result1', {'n_th': n_th}); // '2차 발표일' 설정, 1차 발표 노출은 '2차 발표일' 자정 전 까지
        } else if (time < '2018-08-21 00:00:00') {
            res.render('recruit/recruit-result2', {'n_th': n_th}); // '최종 합격일' 설정, 2차발표 노출은 '최종 합격일' 자정 전 까지
        }
    }
});

router.post('/', function(req, res){
    var day = req.body.day;
    var hour = req.body.hour;
    var min = req.body.min;
    var email = req.body.email;

    var query = `UPDATE application SET interview_date = ` + day + `, interview_hour = ` + hour + `, interview_min = ` + min + ` WHERE email = '` + email + `'`;
    client.query(query, function(error, result){
        if (error) {
            console.log(error);
        } else {
            res.send(result);
        }
    });
});

module.exports = router;
