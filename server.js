const express = require('express')
const path = require('path')
const fs = require('fs')

const cors = require('cors')

const app = express()
app.use(cors())

// 设置静态文件目录（确保client.html在此目录）
app.use(express.static(__dirname))

// 显式处理根路径
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'client.html'))
})


const IMAGE_FOLDER = path.join(__dirname, 'img')

function scanImages(dir, parentPath = '') {
    let results = []
    const list = fs.readdirSync(dir)
    list.forEach(file => {
        const fullPath = path.join(dir, file)
        const stat = fs.statSync(fullPath)
        if (stat && stat.isDirectory()) {
            results = results.concat(scanImages(fullPath, path.join(parentPath, file)))
        } else if (/\.(jpg|png|gif|webp)$/i.test(file)) {
            results.push({
                path: path.join(parentPath, file).replace(/\\/g, '/'),
                name: path.basename(file, path.extname(file)),
                fullName: path.join(parentPath, path.basename(file, path.extname(file))).replace(/\\/g, '/')
            })
        }
    })
    return results
}

app.get('/api/images', (req, res) => {
    res.json(scanImages(IMAGE_FOLDER))
})

app.use('/images', express.static(IMAGE_FOLDER))
app.use(express.static('public'))

app.listen(3000, () => {
    console.log('服务已启动: http://localhost:3000')
})
