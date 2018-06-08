var router = require('koa-router')();
var koa=require('koa');
var cors=require('koa-cors');
var bodyParser=require('koa-bodyparser');
const fs = require('mz/fs')
var app=new koa();

app.use(cors());

app.use(bodyParser())

let books={
    "count":0,
    "data":[]
}

// let books=[
//     {
//         id:'002305',
//         Name:'爱丽丝梦游仙境',
//         author:'刘易斯·卡罗尔',
//         price:34.00
//     },
//     {
//         id:'002306',
//         Name:'哈利波特',
//         author:'J.K.罗琳',
//         price:34.00
//     }
// ];


router.get('/get', async (ctx, next) => {
    await fs.readFile('book.json','utf-8').then((books)=>{
        console.log(books);
        if(books){
            let newResult=JSON.parse(books);
            let id=ctx.query.id;
            newResult.data.forEach((item)=>{
                if(item.id===id){
                    ctx.body = item;
                }
            })
        }
        else{
            ctx.body='数据不存在';
        }
    })
});


router.post('/post', async (ctx, next) => {
    newBookList=ctx.request.body;
    books.data.push(newBookList);
    var len=books.data.length;
    books.count=len;
    let newBooks=JSON.stringify(books);
    await fs.writeFile('book.json', newBooks);
    ctx.body='保存成功';

})

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000,()=>{
    console.log('服务已启动');
});