# mysql 常用命令

## 导出常用命令

下列方式述自带库名语句:

```
/usr/local/mysql/bin/mysqldump  -u用户名 -p密码 [--default-character-set=utf8mb4] --all-databases > /保存路径/文件名.sql

/usr/local/mysql/bin/mysqldump -u用户名 -p密码 --databases 数据库1 数据库2... > 保存路径/文件名.sql
```



指定单库备份默认不自带库名语句:

```
/usr/local/mysql/bin/mysqldump -u用户名 -p密码 [-B] db > /保存路径/文件名.sql  
```

-B 可以带建库语句

-t 主要数据

-d 只要结构

## 导入常用命令

导入如果带库名则不需要指定DB

```
mysql -uusername -ppassword [db1] < tb1tb2.sql
```

更多参数[https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html)

## binlog 查看sql
通过binlog 看sql
/usr/local/zftmysql/bin/mysqlbinlog --base64-output=decode-rows -v --start-datetime='2022-04-25 20:00:00' --stop-datetime='2022-04-25 21:30:00' binlog/binlog.000038

## 备份

添加定时任务`crontab -e`
```
* 8 * * * /data/db_backup/cron_backup.sh >/dev/null  2>&1 &
```

脚本`cron_backup.sh`
```
#!/bin/bash
cd `dirname $0`
pwd
mkdir sqls 2>/dev/null
echo "clear sql files before one week ago."
find ./sqls/ -name "*.sql"  -ctime +30  -exec rm -rf 2>/dev/null {}  \;
echo "dump today's db ."

# --skip-extended-insert fobid multivalue insert sql
# --complete-insert use total sql include col name

mysqldump --single-transaction -u${user} -p${password} -h ${host} -P ${port} --default-character-set=utf8mb4 --skip-extended-insert --complete-insert --ignore-table=${ignoreTable} -B  ${database} > sqls/${database}.`date +%Y%m%d`.sql
```

## 用户及授权

### 创建用户

```
CREATE USER 'finley'@'localhost' IDENTIFIED BY 'password';
```

### 修改密码

```
ALTER USER 'jeffrey'@'localhost' IDENTIFIED BY 'new_password'
```



### 删除用户

```
DROP USER 'finley'@'localhost';
```

### 授权

```
GRANT ALL ON *.* TO 'finley'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES 
```

详细见(https://dev.mysql.com/doc/refman/8.0/en/creating-accounts.html)[https://dev.mysql.com/doc/refman/8.0/en/creating-accounts.html]






