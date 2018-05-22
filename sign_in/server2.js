var http = require('http')
var fs = require('fs')
var url = require('url')
var port = process.argv[2]

if (!port) {
    console.log('请指定端口号好不啦？\nnode server.js 8888 这样不会吗？')
    process.exit(1)
}

var server = http.createServer(function (request, response) {
    var parsedUrl = url.parse(request.url, true)
    var pathWithQuery = request.url
    var queryString = ''
    if (pathWithQuery.indexOf('?') >= 0) {
        queryString = pathWithQuery.substring(pathWithQuery.indexOf('?'))
    }
    var path = parsedUrl.pathname
    var query = parsedUrl.query
    var method = request.method

    /******** 从这里开始看，上面不要看 ************/

    console.log('方方说：含查询字符串的路径\n' + pathWithQuery)

    if (path == "/") {
        var string = fs.readFileSync('./index.html', 'utf8')
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.write(string)

        response.end()
    } else if (path == "/main.js") {
        var js = fs.readFileSync('./main.js', 'utf8')
        response.setHeader('Content-Type', 'text/javascript; charset=utf-8')
        response.write(js)
        response.end()
    } else if (path === "/sign_up" && method == "GET") {
        var string = fs.readFileSync('./sign_up.html', 'utf8')
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.statusCode = 200
        response.write(string)
        response.end()
    } else if (path === "/sign_up" && method == "POST") {

        readbody(request).then((data) => {
            let hash = {}
            let strings = data.split('&')

            strings.forEach((element) => {
                let parts = element.split('=')
                let key = parts[0]
                let value = parts[1]
                hash[key] = value
            })
            let {
                userName,
                password,
                password_confirmation
            } = hash
            console.log()
            let users = fs.readFileSync('./db/db')

            try {
                users = JSON.parse(users) // []
            } catch (exception) {
                users = []
            }

            users.push({
                userName: decodeURIComponent(userName),
                password: decodeURIComponent(password)
            })
            let usersString = JSON.stringify(users)
            let hashString = JSON.stringify(hash.userName)
            fs.writeFileSync('./db/db', usersString)
            console.log(usersString)

            response.statusCode = 200
            response.write(JSON.stringify(hashString))
            response.end()
        })


    } else if (path === "/sign_in" && method == "GET") {
        var string = fs.readFileSync('./sign_in.html', 'utf8')
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.statusCode = 200
        response.write(string)
        response.end()
    } else if (path === "/sign_in" && method == "POST") {
        readbody(request).then((data) => {
            let hash = {}
            let strings = data.split('&')

            strings.forEach((element) => {
                let parts = element.split('=')
                let key = parts[0]
                let value = parts[1]
                hash[key] = value
            })
            let {
                userName,
                password,
                password_confirmation
            } = hash
            
            let users = fs.readFileSync('./db/db')

            try {
                users = JSON.parse(users) // []
            } catch (exception) {
                users = []
            }
            console.log(users)
            let found
            users.forEach((e) => {
                if (e.userName === decodeURIComponent(userName) && e.password === decodeURIComponent(password)) {
                    found = true
                }
            })
            let name = decodeURIComponent(userName)
            if(found === true){
                response.setHeader('Set-Cookie', `sign_in_userName=${userName}`)
                response.statusCode = 200
                response.write(userName)
                response.end()
            }else{
                response.statusCode = 401
                response.end()
            }
        })
    }else if(path === "/index"){
        var string = fs.readFileSync('./index.html', 'utf8')
        response.setHeader('Content-Type', 'text/html; charset=utf-8')
        response.statusCode = 200
        response.write(string)
        response.end()
    } else {
        response.statusCode = 404
        response.setHeader('Content-Type', 'text/html;charset=utf-8')
        response.write('请求失败')
        response.end()
    }

    /******** 代码结束，下面不要看 ************/
})

function readbody(request) {
    return new Promise((resolve, reject) => {
        let data = ''
        request.on('data', (chunk) => {
            data += chunk
        }).on("end", () => {
            resolve(data)
        })
    })
}

server.listen(port)
console.log('监听 ' + port + ' 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:' + port)