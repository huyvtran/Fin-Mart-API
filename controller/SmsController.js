var con=require('../bin/dbconnection.js');
var base=require('./baseController');
var wrapper = require('./wrapper.js');
const https = require('http');
class SMSController{};
//for sending OTP
SMSController.sendMessage = function (phoneno, message) {
  message=encodeURIComponent(message);
  

// https.get('http://alrt.co.in/http-api.php?username=finmrt&password=pass1234&senderid=FINMRT&route=1&number='+phoneno+',&message='+message, (resp) => {
  
//  });


https.get('http://sms.cell24x7.com:1111/mspProducerM/sendSMS?user=rupee&pwd=apirupee&sender=FINMRT&mobile='+phoneno+'&msg='+message+'&mt=0', (resp) => {
  
 });
};
SMSController.send = function (req, res, next) {
   var reqlog = [];
  reqlog.push("smslog");
  reqlog.push(JSON.stringify(req.body));
  reqlog.push("123");
  reqlog.push("API Called");
  con.execute_proc('call InsertLog(?,?,?,?)',reqlog,function(data) {
  });
	group=req.body.group_id;
	if(!group){
		 base.send_response("group id required",null,res);
	}
	get_data(group,function(data){
            //console.log(data)
            if(!data)
            {
                base.send_response("Failure","",res);
            }else{
                get_mobiles_and_msg(data,function(data){
                    send_sms(data,function(msgid){
                       update_msg_id(group,msgid);
                            base.send_response("Success",msgid,res);
                        // msg=msgid.split(":");
                        // if(msg.length==2){
                        //     update_msg_id(group,msg[1]);
                        //     base.send_response("Success",msg[1],res);
                        // }
                           // base.send_response("Failure",msg,res);
                    });
		});
            }
		
	});
    //res.send(now);
}
function send_sms(data,cb){
    //console.log("sendsm")
   var request = require('request');
   message=encodeURIComponent(data.msg);
   //var url='http://vas.mobilogi.com/api.php?username=rupeeboss&password=pass1234&route=1&sender=FINMRT&mobile[]='+data.mobile+'&message[]='+data.msg ;
  // var url='http://vas.mobilogi.com/api.php?username=finmrt&password=pass1234&route=5&sender=FINMRT&mobile[]='+data.mobile+'&message[]='+message ;

  var url = 'https://api.instaalerts.zone/SendSMS/sendmsg.php?uname=RUPBOS&pass=S~N9p7K4&send=FINMRT&dest='+data.mobile+'&msg='+message ;
  // console.log(url);
   request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    cb(body);
  }else{
      cb(null);
  }
});
}
function get_mobiles_and_msg(data,cb){
	
	var mobiles="";
	//console.log(data[0][0].mobileno);
        for (var i = 0, len = data[0].length; i < len; i++) {
            mobiles+=(data[0][i].mobileno);
            
            if(i < len-1){
                mobiles+=",";
            }
          }
	cb({mobile:mobiles,msg:data[0][0].message});
}
function get_data(group,cb){
	//curr=get_curr_dateTime();

		con.execute_proc('call get_sms(?)',[group],function(data) {
			if(data!==null)
			{
				cb(data);		
			}
			else
			{
				cb(null);
			}	
	   	});


}
function update_msg_id(group,msgid){
    con.execute_proc('call update_msgid(?,?)',[group,msgid],function(data) {
			if(data!==null)
			{
				console.log("msgid updated");
			}
			else
			{
				console.log("msgid updation failed");
			}	
	   	});
}
function get_curr_dateTime(){
	var dt = new Date();
    var year, month, day;
    year = String(dt.getFullYear());
    month = String(dt.getMonth() + 1);
    if (month.length == 1) {
        month = "0" + month;
    }
    day = String(dt.getDate());
    if (day.length == 1) {
        day = "0" + day;
    }
    return year + "-" + month + "-" + day+" "+dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
}
module.exports=SMSController;