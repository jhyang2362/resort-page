var express = require('express');
var router = express.Router();
var oracledb = require('oracledb');
let cusnum=1;


// router.post('/signup',function(req,res){
//   let pname=req.body.personName;
//   let pdate=req.body.personBirthDate;
//   let pbloodtype=req.body.personBloodType;
//   let pemail=req.body.personEmail;
//   let ppocket=req.body.personPocket;
//   let pid=req.body.personID;
//   let ppwd=req.body.personPwd;
//   let ppwd2=req.body.personPwd2;
//
//   var sql='insert into personInfo (name,birthDate,bloodType,email,coinPocket,id,pwd)'+
//     'values(:name,:birthDate,:bloodType,:email,:coinPocket,:id,:pwd)';
//       db.query(sql,{
//         params:{
//           name:pname,
//           birthDate:pdate,
//           bloodType:pbloodtype,
//           email:pemail,
//           coinPocket:ppocket,
//           id:pid,
//           pwd:ppwd
//         }
//       }).then(function(results){
//         })
//     res.redirect('/');
// });
//
// router.get('/login',function(req,res){
//   res.render('login.ejs');
// });

router.post('/loginverify',function(req,res){
  var id=req.body.id;
  var password=req.body.password;
  var sql="select customer_email,customer_password,customer_name from customer where customer_email='"+id+"'and customer_password='"+password+"'";

  oracledb.getConnection(
    {
      user :"jhyang2362",
      password  :"1qaz1qaz",
      connectString :"dongguk-resort.chlmmb1ouqst.ap-northeast-2.rds.amazonaws.com/ORCL"
    },
    function(err, connection){
      if(err) {
        console.error(err.message);
        return;
      }
      connection.execute(sql,function(err, result){
          if(err) {
            console.error(err.message);
          //  doRelease(connection);
          }
          //console.log(result.metaData);
          //console.log(result.rows);
          //doRelease(connection);
          console.log(result.rows);
          if(id==result.metaData.customer_email && password==result.metaData.customer_password){
              req.session.user={
              name:result.rows.customer_name
          };
          req.session.save(() => {
              //var user=req.session.user;
              res.render('index.ejs',{name:req.session.user.name})
          });
          }
        }
      );
    }
  );

});
router.post('/signup_verify',function(req,res){
  var num=cusnum++;
  var name=req.body.customer_name;
  var address=req.body.customer_address;
  var email=req.body.customer_email;
  var password=req.body.customer_password;
  var phone=req.body.customer_phone_number;
  var card_number=req.body.card_number;

  var sql="insert into customer customer_number,customer_name,customer_address,customer_email,customer_password,customer_phone_number,card_number"
  +"values ("+num+",'"+name+"','"+address+"','"+email+"','"+password+"','"+phone+"','"+card_number+"'";
  console.log(sql);
  oracledb.getConnection(
    {
      user :"jhyang2362",
      password  :"1qaz1qaz",
      connectString :"dongguk-resort.chlmmb1ouqst.ap-northeast-2.rds.amazonaws.com/ORCL"
    },
    function(req,err, connection){
      if(err) {
        console.error(err.message);
        return;
      }
      connection.execute(sql,function(err, result){
          if(err) {
            console.error(err.message);
          //  doRelease(connection);
          }
          console.log(result.rows);

          console.log(result.metaData);
          console.log(result.rows);
          //doRelease(connection);
        }
      );
    }
  );
  res.redirect('/index');
});


router.get('/',function(req,res){
    //if(req.session.user){
    //var user=req.session.user;
    //res.render('index.ejs',{name:req.session.user.name});
    res.render('index.ejs');
    //}
  //  else{
    //res.render('index.ejs',{name:null});
  //  res.render('index.html');
  //  }
});
router.get('/index',function(req,res){
    if(req.session.user){
      var name=req.session.user.name;
      res.render('index.ejs',{name:name});
    }
    else{
      res.render('index.ejs',{name:null});
    }
});
router.get('/login',function(req,res){

    res.render('login.ejs');
});
router.get('/logout',function (req,res) {
    req.session.user= null;
    //왜 req.session.destroy() 가 3.0 에서는 안 될까?
    res.redirect('/');
})
router.get('/signup',function(req,res){
  //let title='학생 성적표 등록하기';
  res.render('signup.ejs');
});

router.get('/about',function(req,res){
  res.render('about.ejs');
});

router.get('/Rooms',function(req,res){
  res.render('Rooms.ejs');
});

router.get('/Amenities',function(req,res){
  res.render('Amenities.ejs');
});

router.get('/blog',function(req,res){
  res.render('blog.ejs');
});

router.get('/blog-single',function(req,res){
  res.render('blog-single.ejs');
});

router.get('/Restaurant',function(req,res){
  res.render('Restaurant.ejs');
});

router.get('/QnA',function(req,res){
  res.render('QnA.ejs');
});

function doRelease(connection){
  connection.release(
    function(err){
      if(err) console.error(err.message);
    }
  )
}
module.exports = router;
