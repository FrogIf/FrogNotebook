# 扩展巴科斯范式

## 符号表

* `=` -- 定义
* `,` -- 串接
* `;` -- 终止
* `|` -- 分隔, 并列选项, 只能选一个
* `[...]` -- 可选
* `{...}` -- 重复, 可出现任意次数，包括0次
* `(...)` -- 分组
* `"..."` -- 双引号, 字面值
* `'...'` -- 单引号, 同双引号
* `(*...*)` -- 注释
* `?...?` -- 特殊序列
* `-` -- 除外

示例:

```bnf
 (* a simple program in EBNF − Wikipedia *)
 program = 'PROGRAM' , white space , identifier , white space ,
            'BEGIN' , white space ,
            { assignment , ";" , white space } ,
            'END.' ;
 identifier = alphabetic character , [ { alphabetic character | digit } ] ;
 number = [ "-" ] , digit , [ { digit } ] ;
 string = '"' , { all characters − '"' } , '"' ;
 assignment = identifier , ":=" , ( number | identifier | string ) ;
 alphabetic character = "A" | "B" | "C" | "D" | "E" | "F" | "G"
                      | "H" | "I" | "J" | "K" | "L" | "M" | "N"
                      | "O" | "P" | "Q" | "R" | "S" | "T" | "U"
                      | "V" | "W" | "X" | "Y" | "Z" ;
 digit = "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" ;
 white space = ? white space characters ? ;
 all characters = ? all visible characters ? ;
```