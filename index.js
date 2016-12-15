var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.get('/',function(req,res){
    res.sendFile(__dirname+'/index.html');
})

var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'aractakipdb'
});

connection.connect();

connection.query('SELECT * from kullanici', function(err, rows, fields) {
          
		  if (!err)
			  var i=0;
 //            console.log('The solution is: ', rows);
           else
             console.log('Error while performing Query.');
});

var queryString1 = 'SELECT * FROM Kullanici WHERE ? and ?';
var queryStringArac = 'Select * from Arac where ?';
var queryStringKonum = 'SELECT* FROM Konum WHERE ? ORDER BY KonumId DESC LIMIT 1';
//var queryString2 = 'INSERT INTO mesaj SET gonderen_id=?,alan_id=?,?';
//var queryString3 = 'SELECT adi FROM kullanici';
var username_ = {"kullaniciAdi":"onur"};
var password_ = {"Sifre":"125"};
var users = [];
var ids = [];
var kullaniciId;
var data;

io.sockets.on('connection',function(socket){	

	console.log('one user connected '+socket.id);
 //   ids.push(socket.id);	
	
		
    socket.on('disconnect',function(){
		
		console.log('one user disconnected '+socket.id);
    
	})	

    socket.on('KullaniciAdi',function(data){
	    username_=data;
        console.log('Kullanıcı Adi : ',username_);
		

	})
	
	
	
	socket.on('Sifre',function(password_){
			
		    connection.query(queryString1, [username_,password_], function(err, rows, fields) {
			
	             if (err) throw err;
		           console.log(rows);
          
		         if(rows==""){
			      
				  socket.emit('yanlis',{'yanlis': 'yanlis'});
				  console.log('false');
		         }
		          else{
		          socket.emit('dogru',{'dogru': 'dogru'});
				  socket.emit('kullanici',{'kullanici': rows});
				  
				  console.log('Giriş Yapan Kullanıcı: ',rows);
		          console.log('true');
				  
					  
		          }
		  
            });
			
			 
		
           console.log(password_);
		   
		  
    })
	
	
	
	socket.on('kullaniciId',function(kullaniciId){
		
		
		    connection.query(queryStringArac, [kullaniciId], function(err, rows, fields) {
			
	             if (err) throw err;
//		           console.log(rows);
          
		         if(rows==""){
			       
		         }
		          else{
					  	          
				  socket.emit('kullaniciId',{'kullaniciId': rows});				  
				  console.log('arac rows : ',rows);
		      				  					  
		          }
		  
            });
		
           console.log(kullaniciId);
		   
		  
    })
	

	
		socket.on('AracId',function(AracId){
		
		
		    connection.query(queryStringKonum, [AracId], function(err, rows, fields) {
			
	             if (err) throw err;
//		           console.log(rows);
          
					socket.emit('Konum',{'Konum': rows});				  
					console.log('Konum rows : ',rows);
		  
            });
		
           console.log(kullaniciId);
		   
		  
    })
	
	
	
	
	
	
	
	
	
	
	
	
	
	
		
		
})


http.listen(3000,function(){
    console.log('server listening on port 3000');
})