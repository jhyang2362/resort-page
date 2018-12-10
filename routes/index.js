var express = require('express');
var router = express.Router();


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
  var sql="select id,pwd,name from personInfo where id='"+id+"'and pwd='"+password+"'";

  db.query(sql).then(function(results){

    //console.log(results[0].name);
    if((id==results[0].id) && (password==results[0].pwd)){

    req.session.user={
        id: results[0].id,
        name:results[0].name
    };
    req.session.save(() => {
      //var user=req.session.user;
      res.render('index.ejs',{name:req.session.user.name})
    });

    //console.log(req.session.user);
    }
    else {
      res.redirect('/')
    }
  });
});
router.get('/',function(req,res){
    //if(req.session.user){
    //var user=req.session.user;
    //console.log(user);
    //res.render('index.ejs',{name:req.session.user.name});
    res.render('index');
    //}
  //  else{
    //res.render('index.ejs',{name:null});
  //  res.render('index.html');
  //  }
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
module.exports = router;
