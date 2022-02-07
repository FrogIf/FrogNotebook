# sql实例

## 批量复制一个数据表的数据, 修改部分字段后追加加入到数据表中

借鉴:http://blog.csdn.net/huangjing_whlg/article/details/20464237
```sql
	INSERT INTO "OA_PAY_COST" (
		"ID",
		"PERSON_CODE",
		"PERSON_NAME",
		"PRETAX_SALARY",
		"COMPUTER_SUBSIDY",
		"PHONE_SUBSIDY",
		"OTHER_SUBSIDY",
		"SOCIAL_SECURITY",
		"PUBLIC_FUNDS",
		"LUNCH",
		"YEAR_AWARD",
		"EFFECTIVE_DATE",
		"CREATE_BY",
		"CREATE_DATE",
		"UPDATE_BY",
		"UPDATE_DATE",
		"REMARKS",
		"DEL_FLAG"
	) SELECT
		SYS_GUID (),
		"PERSON_CODE",
		"PERSON_NAME",
		"PRETAX_SALARY",
		"COMPUTER_SUBSIDY",
		"PHONE_SUBSIDY",
		"OTHER_SUBSIDY",
		"SOCIAL_SECURITY",
		"PUBLIC_FUNDS",
		"LUNCH",
		"YEAR_AWARD",
		#{newMonth},
		"CREATE_BY",
		"CREATE_DATE",
		"UPDATE_BY",
		"UPDATE_DATE",
		"REMARKS",
		"DEL_FLAG"
	FROM
		OA_PAY_COST QT
	WHERE
		DEL_FLAG = '0'
	AND QT.EFFECTIVE_DATE = #{oldMonth}
	AND NOT EXISTS (
		SELECT
			1
		FROM
			OA_PAY_COST PT
		WHERE
			DEL_FLAG = '0'
		AND PT.EFFECTIVE_DATE = #{newMonth}
		AND QT.PERSON_CODE = PT.PERSON_CODE
	)
```
功能描述, 将newMonth这个月没有, 但是oldMonth这个月有的数据复制一份, 并修改部分字段后, 存入当前表中.
