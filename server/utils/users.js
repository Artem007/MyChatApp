const fs=require('fs');

class User {
  constructor(){
    this.users=[];
    var usersJSON=JSON.stringify(this.users);
    fs.writeFileSync('./server/utils/data/userData.json',usersJSON);
  }
  addUser(id,name,room){
    this.users.push({id,name,room});
    var usersJSON=JSON.stringify(this.users);
    fs.writeFileSync('./server/utils/data/userData.json',usersJSON);
  }
  getUser(id){
    return this.users.find((user)=>user.id===id);
  }
  removeUser(id){
    var user=this.users.find((user)=>user.id===id);
    this.users=this.users.filter((user)=>!(user.id===id));
    var usersJSON=JSON.stringify(this.users);
    fs.writeFileSync('./server/utils/data/userData.json',usersJSON);
    return user;
  }
  getUsersList(room){
    var names=this.users.filter((user)=>user.room===room).map((user)=>user.name);
    return names;
  }
  checkUserName(name,callback){
    fs.readFile('./server/utils/data/userData.json','utf8',(err,users)=>{
      if(users===""){
        callback(false)
      }else{
        var users=JSON.parse(users);
        var user=users.find((user)=>user.name===name);
        callback(user);
      }
    });
  }
}

module.exports={User}

// var users=new User();

// users.addUser(1,'Andy','Tennis');
// users.addUser(2,'Rafa','Tennis');
// users.addUser(3,'Roger','Tennis');
// users.addUser(4,'Novak','Tennis');
//
// users.removeUser(2);

// users.checkUserName('Rafa',(user)=>{
//   if(user){
//     console.log('Can not create');
//   }else{
//     console.log('Can create');
//   }
// });

// users.addUser(5,'Tony','Song');
// users.addUser(6,'Taylor','Song');
//
// console.log(users.getUsersList("Tennis"));
// console.log(users.users);
