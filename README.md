# file-static-server
静态文件服务器。

### Usage
```bash
npm install -g file-static-server
file-static-server
```

### Options
| 短格式 | 长格式 | 描述 |
| --- | --- | --- |
| -V | --version | 打印版本号。 |
| -h | --help | 打印帮助信息。 |
| -P | --port | 设置侦听端口，默认为8080。 |

### Example
```bash
file-static-server -P 3300

file-static-server /home/project/www

file-static-server -P 3300 /home/project/test
```