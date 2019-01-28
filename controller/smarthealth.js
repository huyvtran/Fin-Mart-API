
var wrapper = require('./wrapper.js');
// var response_status = require('./responsestatus');
var base=require('./baseController');
var con=require('../bin/dbconnection.js');
var handler = require('./HandlerController');

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var smarthealth1 = function(req, res, next) {
  var mongo_conn=require('../bin/mongo_conn.js');
  mongoose.connect(mongo_conn, { autoIndex: false });
  var RequestSchema = new Schema({
    MasterData: {

      header : {
         CustomerReferenceID : Number,
                QuoteId : Number,
                PolicyTermYear : Number,
      },
      child : Object
    } 
});
var RBLog = mongoose.model('smarthealth',RequestSchema);
base.send_response("success",RBLog,res);
}

var smarthealth = function(req, res, next) {
var memeberlength = req.body.HealthRequest.MemberList.length;
var age = "";
var apitype = "";
var adultcounter = 0;
var childcounter = 0;
if(memeberlength>1){
  apitype = "GetFloterComparison";
}
else{
  apitype = "GetIndividualComparison";
}
for (var i = 0; i < memeberlength; i++) {
  // console.log(req.body.HealthRequest.MemberList[i]);
  age += req.body.HealthRequest.MemberList[i].Age + ",";
  if(req.body.HealthRequest.MemberList[i].MemberType =="Adult"){
    adultcounter++;
  }
  else{
    childcounter++;
  }
}
age = age.replace(/,\s*$/, "");
//console.log(age);
//console.log(adultcounter);
//console.log(childcounter);

var floterIndividualRequest = {
  "Sum": req.body.HealthRequest.SumInsured,
  "strAge": age,
  "IsTopUp": 0,
  "PinCode": req.body.HealthRequest.pincode,
  "AdulMemb": adultcounter,
  "ChilMemb": childcounter,
  "TotMemb": memeberlength,
  "AddOn1": "0_0_0_0_0",
  "AddOn2": "0_0_0_0_0",
  "AddOn3": "0_0_0_0_0",
  "Para1": "0_0_0_0_0",
  "Para2": "0_0_0_0_0",
  "Para3": "0_0_0_0_0",
  "Para4": "0_0_0_0_0",
  "Para5": "0_0_0_0_0",
  "Para6": "0_0_0_0_0",
  "IFAID": "7BaxTwKLbS2mDfX6s3ls7g=="
};


//console.log(floterIndividualRequest);
// console.log(apitype);
wrapper('/WMDataservice/api/HealthInsurance/'+apitype, 'POST', {
  "Sum": req.body.HealthRequest.SumInsured,
  "strAge": age,
  "IsTopUp": 0,
  "PinCode": req.body.HealthRequest.pincode,
  "AdulMemb": adultcounter,
  "ChilMemb": childcounter,
  "TotMemb": memeberlength,
  "AddOn1": "0_0_0_0_0",
  "AddOn2": "0_0_0_0_0",
  "AddOn3": "0_0_0_0_0",
  "Para1": "0_0_0_0_0",
  "Para2": "0_0_0_0_0",
  "Para3": "0_0_0_0_0",
  "Para4": "0_0_0_0_0",
  "Para5": "0_0_0_0_0",
  "Para6": "0_0_0_0_0",
  "IFAID": "7BaxTwKLbS2mDfX6s3ls7g=="
  }, function(datax) {
   // console.log("--------------------------------------");
   // console.log(datax);
   // console.log("--------------------------------------");
    var CustomerReferenceID = "";
    if(datax!=null){     
      var data = datax.sort(function(first, second) {
        var a = first.GrossPremiumStep;
        var b = second.GrossPremiumStep;
        
        if(a > b) {
            return 1;
        } else if(a < b) {
            return -1;
        } else {
            return 0;
        }
    });
      var newdata= [];
      for(i = 0; i< data.length; i++) {
        // if (data[i].PlanID === 0) {
        //     continue;
        // }
        var logo = data[i].InsuLogoName;
       // console.log("......."+logo);
        var imagepath = "";
        if(logo!=""){
            var filename = data[i].InsuLogoName.split('.');
           // console.log(filename);
            imagepath =   "http://" + req.headers.host + "/uploads/InsurerLogo/" + filename[0] + ".png";
            //console.log(filename.split('.'));
        }
              var newresponse = {};
               newresponse.CustomerReferenceID=0;
               newresponse.QuoteId=0;
               newresponse.PolicyTermYear=1;
               newresponse.PlanName = data[i].Plantitl;
               newresponse.InsurerName = data[i].InsuShorName;
               newresponse.InsurerLogoName=imagepath;
               newresponse.ProductName = data[i].ProdName;
               newresponse.PlanID = data[i].PlanID;
               newresponse.ZoneID = 0;
               newresponse.OtherPlanID = "";
               newresponse.ProdID = data[i].ProdID;
               newresponse.InsurerId = data[i].InsuID;
               newresponse.ServiceTax = 0;
               newresponse.SumInsured = data[i].SumInsu;
               newresponse.HMBValue = "";
               newresponse.IsOnlinePayment = 0;
               newresponse.KeyFeatures = "";
               newresponse.BroucherDownloadLink = "";
               newresponse.Discount = 0;
               newresponse.Deductible_Amount = data[i].Deductible;
               newresponse.NetPremium = data[i].FinalPremium;
               //newresponse.GrossPremium = 0;
               newresponse.GrossPremium = data[i].GrossPremiumStep;
               newresponse.DiscountPercent ="";
               newresponse.Premium = "";
               newresponse.Group_name = "";
               newresponse.QuoteStatus = "";
               newresponse.ProposerPageUrl = "";
               newresponse.pincode = data[i].pincode;
               newresponse.FinalProductID = data[i].FinalProductID;
               newresponse.servicetaxincl =data[i].servicetaxincl;
               newresponse.BasicPremium = data[i].GrossPremium;
               newresponse.GrossPremiumStep = data[i].GrossPremium;
               newresponse.LstbenfitsFive =data[i].LstbenfitsAll;
               newdata.push(newresponse);
              // console.log("..............PlanID................");
              // console.log(data[i].PlanID); 
      }
      
      //console.log(newdata);
      //res.send(newdata);
      // console.log("******************************************************************************************");
      var uniqueInsurerId = [];
      var uniqueData = [];
      var remainingData = [];
      for(i = 0; i< newdata.length; i++){
        CustomerReferenceID =0;// data[0].CustomerReferenceID;
        var insIDProdName = newdata[i].InsurerId + "|" + newdata[i].ProductName;
        //console.log(insIDProdName);
          if(uniqueInsurerId.indexOf(insIDProdName) === -1){
                uniqueInsurerId.push(insIDProdName);
                uniqueData.push(newdata[i]);
          }else{            
                remainingData.push(newdata[i]);              
          }
      }
//console.log(uniqueInsurerId);
      var final = {"header" :uniqueData , "child" : remainingData};
    //  console.log(".............");
    //  console.log(final);
      //base.send_response("success",final,res);

     manageHealthRequest(req, res, next,final,CustomerReferenceID);      

    }
    else{
      base.send_response("failure",data, res);
    }
  },8);
}


var manageHealthRequest = function(req, res, next,responsedata,CustomerReferenceID) {

var parameter = [];

if(req.body.HealthRequestId){
  parameter.push(req.body.HealthRequestId); 
}
else{
  parameter.push(0);
}
// CustomerReferenceID
parameter.push(CustomerReferenceID); 
parameter.push(req.body.HealthRequest.CityID); 
parameter.push(req.body.HealthRequest.ContactEmail); 
parameter.push(req.body.HealthRequest.ContactMobile); 
parameter.push(req.body.HealthRequest.ContactName); 
parameter.push(req.body.HealthRequest.DeductibleAmount); 
parameter.push(req.body.HealthRequest.ExistingCustomerReferenceID); 
parameter.push(req.body.HealthRequest.HealthType); 
parameter.push(req.body.HealthRequest.MaritalStatusID); 
parameter.push(req.body.HealthRequest.PolicyFor); 
parameter.push(req.body.HealthRequest.PolicyTermYear); 
parameter.push(req.body.HealthRequest.ProductID); 
parameter.push(req.body.HealthRequest.SessionID);
parameter.push(req.body.HealthRequest.SourceType);
parameter.push(req.body.HealthRequest.SumInsured);
parameter.push(req.body.HealthRequest.SupportsAgentID);
parameter.push(req.body.fba_id);
parameter.push(req.body.agent_source);

//console.log("Length:"+req.body.HealthRequest.MemberList.length);
var memberlist = "";
for (var i = 0; i < req.body.HealthRequest.MemberList.length; i++) {
   memberlist += req.body.HealthRequest.MemberList[i].MemberDOB +","+req.body.HealthRequest.MemberList[i].MemberGender +","+req.body.HealthRequest.MemberList[i].MemberNumber +","+req.body.HealthRequest.MemberList[i].MemberType +","+req.body.HealthRequest.MemberList[i].MemberTypeID +","+req.body.HealthRequest.MemberList[i].Age +"|";
 } 
// console.log("=========================memberlist============================");
// console.log(memberlist);
 parameter.push(memberlist);
 parameter.push(req.body.HealthRequest.pincode);
//console.log(parameter);
//console.log("...............2435.............");
  con.execute_proc('call ManageHealthRequest(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',parameter,function(data) {
  //  console.log("............................");
  //  console.log(data[0][0]);
    if(data[0][0].SavedStatus=="0"){
      var response = {
        "HealthRequestId" : data[0][0].HealthRequestId,
        "health_quote": responsedata
      };
   //   console.log(responsedata);
      base.send_response("Success", response,res);
    }
    else{
      base.send_response("Failure",null,res);
    }
  });
};



var getHealthRequest = function(req, res, next) {
 // console.log("test");
var parameter = [];
if(req.body.fba_id){
  parameter.push(req.body.fba_id); 
}
else{
  parameter.push(null);
}
if(req.body.count){
  parameter.push(req.body.count);
}
else{
  parameter.push(0);
  req.body.count=0;
}
if(req.body.type){
  parameter.push(req.body.type);
  
}
else{
  parameter.push(0);
  req.body.type=0;
}
//console.log(parameter);
if(req.body.type == 0)
{
  con.execute_proc('call getHealthRequest(?,?,?)',parameter,function(data) {
    var quoteresponse = [];
    var applicationquote = [];
   // console.log(data[0].length);
    for (var i = 0; i < data[0].length; i++) {
    
      data[0][i].progress_image = null;
      var healthrequest = data[0][i];
      var arr = JSON.parse(data[0][i].MemberList);

      healthrequest.MemberList =arr;// array(data[0][i].MemberList);
     // console.log("---------------------healthrequest---------------------");
     // console.log(healthrequest);
      var response ={
        "fba_id" : data[0][i].FBAID,
        "HealthRequestId" : data[0][i].HealthRequestId,
        "agent_source" : data[0][i].agent_source,
        "crn" : data[0][i].crn,
        "selectedPrevInsID" : data[0][i].selectedPrevInsID,
        "HealthRequest" : healthrequest
      };
    
      quoteresponse.push(response);
    }
   // console.log(quoteresponse);

    for (var i = 0; i < data[1].length; i++) {
      data[1][i].progress_image = handler.validateimage(req,data[1][i].StatusPercent);
      var healthrequest = data[1][i];
      var arr = JSON.parse(data[1][i].MemberList);


      
      healthrequest.MemberList =arr;
      var response ={
        "fba_id" : data[1][i].FBAID,
        "HealthRequestId" : data[1][i].HealthRequestId,
        "agent_source" : data[1][i].agent_source,
        "crn" : data[1][i].crn,
        "selectedPrevInsID"  : data[1][i].selectedPrevInsID,
        "insImage" : data[1][i].insImage,
        "HealthRequest" :healthrequest
      };
      applicationquote.push(response);
    }
  //  console.log("******************************");
    var responsedata = {"quote":quoteresponse,"application":applicationquote};
    base.send_response("Success", responsedata,res);
  });
}
else if(req.body.type == 1)
{
    con.execute_proc('call getHealthRequest(?,?,?)',parameter,function(data) {
    var quoteresponse = [];
    var applicationquote = [];
    for (var i = 0; i < data[0].length; i++) {
      data[0][i].progress_image = null;
      var healthrequest = data[0][i];
      var arr = JSON.parse(data[0][i].MemberList);
      healthrequest.MemberList =arr;// array(data[0][i].MemberList);
      var response ={
        "fba_id" : data[0][i].FBAID,
        "HealthRequestId" : data[0][i].HealthRequestId,
        "agent_source" : data[0][i].agent_source,
        "crn" : data[0][i].crn,
        "selectedPrevInsID" : data[0][i].selectedPrevInsID,
        "HealthRequest" : healthrequest
      };
      quoteresponse.push(response);
    }
    var responsedata = {"quote":quoteresponse,"application":[]};
    base.send_response("Success", responsedata,res);
  });
}
else if(req.body.type == 2)
{
    con.execute_proc('call getHealthRequest(?,?,?)',parameter,function(data) {
    var quoteresponse = [];
    var applicationquote = [];
    for (var i = 0; i < data[0].length; i++) {
      data[0][i].progress_image = handler.validateimage(req,data[0][i].StatusPercent);
      var healthrequest = data[0][i];
      var arr = JSON.parse(data[0][i].MemberList);
      
      healthrequest.MemberList =arr;
      var response ={
        "fba_id" : data[0][i].FBAID,
        "HealthRequestId" : data[0][i].HealthRequestId,
        "agent_source" : data[0][i].agent_source,
        "crn" : data[0][i].crn,
        "selectedPrevInsID"  : data[0][i].selectedPrevInsID,
        "insImage" : data[0][i].insImage,
        "HealthRequest" :healthrequest
      };
      applicationquote.push(response);
    }
    var responsedata = {"quote":[],"application":applicationquote};
    base.send_response("Success", responsedata,res);
  });
}
else
{
  base.send_response("Failure type not match",null,res);
}
};



var deleteHealthRequest = function(req, res, next) {
  var parameter = [];

  if(req.body.HealthRequestId){
    parameter.push(req.body.HealthRequestId); 
  }
  else{
    parameter.push(0);
  }
  con.execute_proc('call deleteHealthRequest(?)',parameter,function(data) {
      if(data[0][0].SavedStatus=="0"){
        base.send_response("Success", data[0],res);
      }
      else{
        base.send_response("Failure",null,res);
      }
  });
};

var setQuoteToApplicationHealthRequest = function(req, res, next) {
  var parameter = [];

  if(req.body.HealthRequestId){
    parameter.push(req.body.HealthRequestId); 
  }
  else{
    parameter.push(0);
  }
  parameter.push(req.body.selectedPrevInsID); 
  parameter.push(req.body.insImage); 
  
  con.execute_proc('call setQuoteToApplicationHealthRequest(?,?,?)',parameter,function(data) {
      if(data[0][0].SavedStatus=="0"){
        base.send_response("Success", data[0],res);
      }
      else{
        base.send_response("Failure",null,res);
      }
  });
};


var GetCompareBenefits = function (req, res, next) {
wrapper('/WMDataservice/api/HealthInsurance/GetCompareBenefits', 'POST', {
   "StrProdBeneID": req.body.StrProdBeneID,
  "IFAID": "27bgc7eiR5RoCV5xXvTcTQ==",
  }, function(data) {
    // console.log(data);
     if(data!=null && data.length>0){
        base.send_response("Success", data,res);    
     }
     else{
        base.send_response("Failed to fetch", null,res);
     }
  },8);
};

var ComparePremium = function (req, res, next) {
    var helth_req_id = [];
    helth_req_id.push(req.body.HealthRequestId);
    helth_req_id.push(req.body.PlanID);

    if(req.body.ProdID && req.body.ProdID!=0){
      helth_req_id.push(req.body.ProdID);
    }
    else{
      helth_req_id.push(null);
    }
//console.log(helth_req_id);
    var getcomparedata;
  con.execute_proc('call get_compare_premium(?,?,?)',helth_req_id,function(response) {
    if(response!=null){      

// console.log( {
//     "CityID": response[0][0].CityID,
//     "PlanID": response[0][0].PBPlanID,
//     "HealthRequestId": req.body.HealthRequestId,
//     "FBAID": response[0][0].fba_id,
//     "ContactEmail": response[0][0].ContactEmail,
//     "ContactMobile": response[0][0].ContactMobile,
//     "ContactName": response[0][0].ContactName,
//     "DeductibleAmount": 0,
//     "ExistingCustomerReferenceID": 0,
//     "HealthType": "Health",
//     "MaritalStatusID": response[0][0].MaritalStatusID,
//     "MemberList": req.body.MemberList,
//     "PolicyFor": response[0][0].PolicyFor,
//     "PolicyTermYear": 1,
//     "ProductID": 2,
//     "SessionID": "",
//     "SourceType": "APP",
//     "SumInsured": response[0][0].SumInsured,
//     "SupportsAgentID": 2
//   });
wrapper('/api/SmartHealth', 'POST', {
    "CityID": response[0][0].CityID,
    "PlanID": response[0][0].PBPlanID,
    "HealthRequestId": req.body.HealthRequestId,
    "FBAID": response[0][0].fba_id,
    "ContactEmail": response[0][0].ContactEmail,
    "ContactMobile": response[0][0].ContactMobile,
    "ContactName": response[0][0].ContactName,
    "DeductibleAmount": 0,
    "ExistingCustomerReferenceID": 0,
    "HealthType": "Health",
    "MaritalStatusID": response[0][0].MaritalStatusID,
    "MemberList": req.body.MemberList,
    "PolicyFor": response[0][0].PolicyFor,
    "PolicyTermYear": 1,
    "ProductID": 2,
    "SessionID": "",
    "SourceType": "APP",
    "SumInsured": response[0][0].SumInsured,
    "SupportsAgentID": 2
  }, function(data) {
    if(data!=null && data.length>0){
//console.log("----------wrapper retured----");
       var memberlistparameter = []; 
       var memberlist = "";
       for (var i = 0; i < req.body.MemberList.length; i++) {
            memberlist += req.body.MemberList[i].MemberDOB +","+req.body.MemberList[i].MemberGender +","+req.body.MemberList[i].MemberNumber +","+req.body.MemberList[i].MemberType +","+req.body.MemberList[i].MemberTypeID +"|";
        } 
        memberlistparameter.push(memberlist); 
        memberlistparameter.push(req.body.HealthRequestId);
        con.execute_proc('call saved_member_list(?,?)',memberlistparameter,function(data) {
        // if(data[0][0].SavedStatus == 0){
        //   base.send_response("Record saved successfully",data[0][0],res);
        // }
        // else{
        //   base.send_response("Failure", "",res);        
        // }
      });

      var compare_premium_parameter = [];
      compare_premium_parameter.push(req.body.HealthRequestId);
      compare_premium_parameter.push(data[0].CustomerReferenceID);
      con.execute_proc('call compare_premium(?,?)',compare_premium_parameter,function(responsedata) {
        if(responsedata[0][0].SavedStatus == "0"){
          if(data[0].QuoteStatus == "Success"){
              var parameterCompare = [];
              parameterCompare.push(req.body.HealthRequestId); 
              parameterCompare.push(req.body.selectedPrevInsID); 
              parameterCompare.push(req.body.insImage); 
              con.execute_proc('call setQuoteToApplicationHealthRequest(?,?,?)',parameterCompare,function(datacompare) {
              if(datacompare[0][0].SavedStatus=="0"){
                      var response={
                        NetPremium : data[0].NetPremium,
                        ProposerPageUrl : data[0].ProposerPageUrl,
                      }
//console.log("---*******************************************------------------------");
//console.log(response);
                      base.send_response("Success",response,res);
                  }
                  else{
                    base.send_response("Failure",null,res);
                  }
              });
        }
        else{
          base.send_response("Failure", null,res);        
        }
      }else{
          base.send_response("Failure", null,res);        
        }
      });
    }
    else{
        base.send_response("failure",null, res);
    }
  },2);
//console.log('done');
     //   base.send_response("Success",response,res);
    }else{
         base.send_response("failure",null,res);
    }
  
  });

};

module.exports = {"smarthealth":smarthealth,"getHealthRequest":getHealthRequest,"deleteHealthRequest":deleteHealthRequest,"setQuoteToApplicationHealthRequest":setQuoteToApplicationHealthRequest,"GetCompareBenefits":GetCompareBenefits,"ComparePremium":ComparePremium};
