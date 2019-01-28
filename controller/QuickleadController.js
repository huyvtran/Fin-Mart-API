var con=require('../bin/dbconnection.js');
var base = require('./baseController');
var wrapper = require('./wrapper.js');

var QuickLead = function (req, res, next) {

var ProductId = 0;
if(req.body.ProductId == 1)
{
  ProductId = 13;
}
else if(req.body.ProductId == 2)
{
  ProductId = 4;
}
else if(req.body.ProductId == 3)
{
  ProductId = 8;
}

else if(req.body.ProductId == 4)
{
  ProductId = 5;
}

else if(req.body.ProductId == 5)
{
  ProductId = 2;
}

else if(req.body.ProductId == 6)
{
  ProductId = 3;
}

else if(req.body.ProductId == 7)
{
  ProductId = 6;
}

else if(req.body.ProductId == 8)
{
  ProductId = 1;
}
else if(req.body.ProductId == 9)
{
  ProductId = 11;
}

wrapper('/BankAPIService.svc/createOtherLoanLeadReq', 'POST', {
   "brokerId": req.body.brokerId,
  "Source": "DC",
  "Name": req.body.Name,
  "EMail": req.body.EMail,
  "Mobile": req.body.Mobile,
  "Status": "43",
  "ProductId":ProductId,
  "Loan_amt": req.body.Loan_amt,
  "FBA_Id": req.body.FBA_Id,
  "Monthly_income": req.body.Monthly_income,
  "Remark": req.body.Remark,
  "followupDate": req.body.followupDate,
  "empCode": "Rb40000432"
  }, function(data) {
  // console.log(data);
    if(data!=null){
      var respose = JSON.parse(data);
    //  console.log(respose);
      if(respose.Status=="1"){

         var parameter = [];
          parameter.push(req.body.brokerId);
          parameter.push(req.body.Name);
          parameter.push(req.body.EMail);
          parameter.push(req.body.Mobile);
          parameter.push("43");
          parameter.push(ProductId);
          parameter.push(req.body.Loan_amt);
          parameter.push(req.body.FBA_Id);
          parameter.push(req.body.Monthly_income);
          parameter.push(req.body.Remark);
          parameter.push(req.body.followupDate);
          parameter.push("Rb40000432");
          parameter.push(respose.Lead_Id);
          // console.log("**********************************************************");
          // console.log(parameter);
          con.execute_proc('call insert_quick_lead(?,?,?,?,?,?,?,?,?,?,?,?,?)',parameter,function(respdata) {
          // console.log("**********************************************************");
          // console.log(respdata);
            if(respdata[0][0].SavedStatus == 0){
              QuickLeadLive(req, res, respose.Lead_Id,next);
            //  console.log("--------"+respose.Lead_Id);
              base.send_response("Lead Submitted Successfully", respose,res);
            }else{
              base.send_response(respdata[0][0].respose, null,res);       
            } 
          });
       // base.send_response("Success",respose,res);
      }
      else{
        base.send_response(respose.Errorinfo,null,res);
      }    
    }
    else{
        base.send_response("failure",data, res);
    }
  },6);
};


var quikleadfromrupeeboss = function (req, res, next) {
  //dumpdatacontroller(req, res, next);
          var parameter = [];        
                
          parameter.push(req.body.Broker_Id);
          parameter.push(req.body.Email);
          parameter.push(req.body.FBA_Id);
          parameter.push(req.body.FollowUp_Date);
          parameter.push(req.body.Lead_Date);
          parameter.push(req.body.Lead_Status_Id);
          parameter.push(req.body.Lead_id);
          parameter.push(req.body.Loan_Amt);
          parameter.push(req.body.Mobile);
          parameter.push(req.body.MonthlyIncome);
          parameter.push(req.body.Name);
          parameter.push(req.body.Product_Id);
          parameter.push(req.body.Remark);       
        //  console.log("**********************************************************");
        //  console.log(parameter);
          con.execute_proc('call quickleadrequest_data(?,?,?,?,?,?,?,?,?,?,?,?,?)',parameter,function(respdata) {
          // console.log("**********************************************************");
          // console.log(respdata);
            if(respdata[0][0].SavedStatus == 0){
              base.send_response("Success", respdata,res);
            }else{
              base.send_response("Failed to save data", null,res);       
            } 
          });
};

var dumpdatacontroller = function(req, res, next) {
    wrapper('/BankAPIService.svc/GetQuickLeadDetail', 'GET',{
    },function(response) {
      if(response != null && response != ''){
      //  console.log(response.length);
      //console.log("---------------------------------------"); 
        for(var i=0; i<response.length; i++){
        //   console.log(i);
          // var Lead_Date_Format = new Date(response[i].Lead_Date)
          // var FollowUp_Date_Format = new Date(response[i].FollowUp_Date)
          var dumpdataparameter = [];
          dumpdataparameter.push(response[i].Broker_Id);
          dumpdataparameter.push(response[i].Email);
          dumpdataparameter.push(response[i].FBA_Id);
        //  dumpdataparameter.push(formatDate(FollowUp_Date_Format));
        //  dumpdataparameter.push(formatDate(Lead_Date_Format));

          dumpdataparameter.push(response[i].FollowUp_Date);
          dumpdataparameter.push(response[i].Lead_Date);

          dumpdataparameter.push(response[i].Lead_Status_Id);
          dumpdataparameter.push(response[i].Lead_id);
          dumpdataparameter.push(response[i].Loan_Amt);
          dumpdataparameter.push(response[i].Mobile);
          dumpdataparameter.push(response[i].MonthlyIncome);
          dumpdataparameter.push(response[i].Name);
          dumpdataparameter.push(response[i].Product_Id);
          dumpdataparameter.push(response[i].Remark);
          //console.log(dumpdataparameter);
          con.execute_proc('call quickleadrequest_data(?,?,?,?,?,?,?,?,?,?,?,?,?)',dumpdataparameter,function(savedata) {
              if(savedata[0][0].SavedStatus == 0){
                status=1;
              }
              else{
              //  console.log(dumpdataparameter);
               // console.log(savedata);
                status=0;
              }
          });
        }
        
             base.send_response("Record saved successfully","Success",res);
        //base.send_response("Success",response,res);
      }else{
        base.send_response("Failure",null,res);
      }

    },6);
}



var QuickLeadLive = function (req, res,leadid, next) {
//  console.log(".........."+leadid);
wrapper('/api/quick-lead-live', 'POST', {
   "brokerId": req.body.brokerId,
  "Source": "DC",
  "Name": req.body.Name,
  "EMail": req.body.EMail,
  "Mobile": req.body.Mobile,
  "Status": "43",
  "ProductId":req.body.ProductId,
  "Loan_amt": req.body.Loan_amt,
  "FBA_Id": req.body.FBA_Id,
  "Monthly_income": req.body.Monthly_income,
  "Remark": req.body.Remark,
  "followupDate": req.body.followupDate,
  "empCode": "Rb40000432",
  "leadid" : leadid
  }, function(data) {
  // console.log(data);
    if(data!=null){
      var respose = JSON.parse(data);
    //  console.log(respose);
        
    }
    else{
        //base.send_response("failure",data, res);
    }
  },14);
};

var QuickLead_live = function (req, res, next) {
//  console.log("*******************"+req.body.leadid);

var ProductId = 0;
if(req.body.ProductId == 1)
{
  ProductId = 13;
}
else if(req.body.ProductId == 2)
{
  ProductId = 4;
}
else if(req.body.ProductId == 3)
{
  ProductId = 8;
}

else if(req.body.ProductId == 4)
{
  ProductId = 5;
}

else if(req.body.ProductId == 5)
{
  ProductId = 2;
}

else if(req.body.ProductId == 6)
{
  ProductId = 3;
}

else if(req.body.ProductId == 7)
{
  ProductId = 6;
}

else if(req.body.ProductId == 8)
{
  ProductId = 1;
}
else if(req.body.ProductId == 9)
{
  ProductId = 11;
}

  var parameter = [];
          parameter.push(req.body.brokerId);
          parameter.push(req.body.Name);
          parameter.push(req.body.EMail);
          parameter.push(req.body.Mobile);
          parameter.push("43");
          parameter.push(ProductId);
          parameter.push(req.body.Loan_amt);
          parameter.push(req.body.FBA_Id);
          parameter.push(req.body.Monthly_income);
          parameter.push(req.body.Remark);
          parameter.push(req.body.followupDate);
          parameter.push("Rb40000431");
          parameter.push(req.body.leadid);
          // console.log("**********************************************************");
          // console.log(parameter);
          con.execute_proc('call insert_quick_lead(?,?,?,?,?,?,?,?,?,?,?,?,?)',parameter,function(respdata) {
          // console.log("**********************************************************");
          // console.log(respdata);
            if(respdata[0][0].SavedStatus == 0){
              //QuickLeadLive(req, res, next);
              //base.send_response("Lead Submitted Successfully", respose,res);
            }else{
              //base.send_response(respdata[0][0].respose, null,res);       
            } 
          });
};


module.exports = {"QuickLead":QuickLead,"quikleadfromrupeeboss":quikleadfromrupeeboss,"dumpdatacontroller":dumpdatacontroller,"QuickLead_live":QuickLead_live};