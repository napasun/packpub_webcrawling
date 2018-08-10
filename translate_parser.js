var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('./DB/books.db');
var cheerio = require("cheerio"); 

const isbn = "9781786461407"
let htmlReplace = (s) => s.replace(/(<([^>]+)>)/ig,"");
let replace = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#x2013;/g, '-').replace(/&apos;/g, '\'').replace(/&#xA0;/g, ' ').replace(/&amp;/g, '&');

db.get('SELECT * FROM content WHERE isbn = ? and contentIndex = 4'
    , [isbn]
    ,(err, rows) =>
    {
        const h = cheerio.load(rows.content);
        let temp = h;
        
        
        let sr = temp("img").attr("src");

        temp("h2.title").prepend("# ").append("\n");
        temp("h3.title").prepend("\n## ").append("\n");
        temp("h4.title").prepend("\n### ").append("\n");
        
        temp("pre.programlisting").prepend("\n\n```java\n").append("\n```\n");
        temp("strong").prepend("**").append("**");
        temp("img").each(function(i, elem) {
            temp(this).parent().prepend("\n![](" + temp(this).attr("src") + ")").append("\n");
        });
        temp("code.literal").each(function(i, elem) {
            //temp(this).prepend("&lt;span style='color:red'&gt;").append("&lt;/span&gt;");
            temp(this).prepend("[[").append("]]");
        });
        //temp("p").prepend("\n").append("\n");
        temp("p").each(function(i, elem) {
            temp(this).text("sdf");
            console.log(temp(this).text())
            //console.log(temp(this).html())
        });
           
        
        temp("ul").prepend("\n");
        temp("ol").prepend("\n");
        temp("ul").find("li").prepend("\n* ");
        temp("ol").find("li").each(function(i, elem) {
            temp(this).prepend("\n"+temp(this).parent().attr("start")+". ");
        });        

        //console.log(temp.html());
        //console.log(replace(htmlReplace(temp.html())));
    }
);

db.close();