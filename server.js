var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var app = express();
app.use(morgan('combined'));

function createTemplate(data)
{
    
var date=data.date;
var heading=data.heading;
var title=data.title;
var content=data.content;

var htmlTemplate=`
    <html>
    <head>
        <title>
            artical-one | Abhi
        </title>
        
        <meta name="viexport" content="width-device-width, initial-scale-1"/>
        
         <link href="/ui/style.css" rel="stylesheet" />
        
    </head>
    <body>
        <div class="Contenet">
            <div>
                <a href = "/">Home</a>
            </div>
            <hr/>
            <h3>
                ${heading}
            </h3>
            <div>
                ${date.toDateString()}
            </div>
            <div>
               ${content}
            </div>
        </div>
    </body>
</html>
`;

return htmlTemplate;
}

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ME', 'index.html'));
});

var pool = new Pool(config);

app.get('/test-db', function (req, res) {

  pool.query('SELECT * FROM test',function(err,result){
      
      if(err)
      {
                res.status(500).send(err.toString());
      }
      
      else
      {
                res.send(JSON.stringify(result));
      }
      
  });
});

var counter = 0;

app.get('/counter', function (req, res) {
  
  counter+=1;
  res.send(counter.toString());
});

var names =[];
app.get('/submit-name', function (req, res) {
    
    var name =req.query.name;
    
    names.push(name);
    
    res.send(JSON.stringify(names));
});

app.get('/articles/:articleName', function (req, res) {
   
   pool.query("SELECT  * FROM article WHERE title =$1",[req.params.articleName],function(err,result){
       
        if(err)
      {
                res.status(500).send(err.toString());
      }
      
      else
      {
                if(result.rows.length === 0)
                    res.status(404).send('Article not found');
                    
                else
                    {
                        var articleData = result.rows[0];
                        
                        res.send(createTemplate(articleData));
                    }
      }
   });
});



app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});


app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


var port = 8080; 
app.listen(8080, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
