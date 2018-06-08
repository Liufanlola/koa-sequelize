const Sequelize=require('sequelize');
var router = require('koa-router')();
var koa=require('koa');
var cors=require('koa-cors');
var bodyParser=require('koa-bodyparser');
var app=new koa();

app.use(cors());

app.use(bodyParser())

//连接数据库
const sequelize=new Sequelize('h5test','root','TestYlch092',{
    host:'106.14.189.63',
    dialect:'mysql',
    port:3975,
    operatorsAliases:false,

    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    }
});

//测试是否连接上
sequelize
    .authenticate()
    .then(()=>{
        console.log('Connection has been established successfully.');
    })
    .catch(err=>{
        onsole.error('Unable to connect to the database:', err);
    });

//创建model类（数据表）
const Book=sequelize.define('book',{
    bookId:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{ notEmpty: true, }
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{ notEmpty: true, }
    },
    author:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{ notEmpty: true, }
    },
    price:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{ notEmpty: true, }
    }
},{
    timestamps:false,
    freezeTableName: true,
});

Book.sync({force: false}).then(function() {
    console.log("Server successed to start");
}).catch(function(err){
    console.log("Server failed to start due to error: %s", err);
});

// 向数据库中插入数据
router.post('/post', async (ctx, next) => {
    newBookList=ctx.request.body;
    return sequelize.transaction(function(t){
        return Book.create(newBookList,{
            transaction:t
        }).then(result=>{
            ctx.body='保存成功';
        }).catch(err=>{
            ctx.body='发生错误';
        })
    })
});

//查询数据
router.get('/get', async (ctx, next) => {
    let id=ctx.query.bookId;
    return sequelize.transaction((t)=>{
        return Book.findOne({
            bookId:id
        },{
            transaction:t
        }).then(result=>{
            ctx.body=result;
        }).catch(err=>{
            ctx.body=err;
        })
    });
});

//更新数据
router.post('/post', async (ctx, next) => {
    newBookList=ctx.request.body;
    return sequelize.transaction(function(t){
        return Book.update( newBookList,{ where:{ 'bookId':newBookList.bookId }},{
            transaction:t
        }).then(result=>{
            ctx.body='保存成功';
        }).catch(err=>{
            ctx.body='发生错误';
        })
    })
});

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000,()=>{
    console.log('服务已启动');
});