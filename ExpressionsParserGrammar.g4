grammar ExpressionsParserGrammar;

expression
:
	left = expression identity_operation =
	(
		IDENTITY
		| NOT_IDENTITY
	) right = expression # identity_operation
	| left = expression equality_operation =
	(
		EQUALS
		| NOT_EQUALS
		| MORE_THAN
		| LESS
		| MORE_OR_EQUALS
		| LESS_OR_EQUALS
	) right = expression # equality_operation
	| left = expression mul_or_div =
	(
		MUL
		| DIV
	) right = expression # mul_div_expr
	| left = expression plus_minus =
	(
		PLUS
		| MINUS
	) right = expression # add_expr
	| NOT expr = expression # not_expr
	| left = expression AND right = expression # and_expr
	| left = expression OR right = expression # or_expr
	| LPAREN expr = expression RPAREN # brackets_expr
	| < assoc = right > condition = expression QUERY_OP true_exp = expression
	COLON false_exp = expression # question_expr
	| POWER_FUNC LPAREN expr1 = expression COMMA expr2 = expression RPAREN #
	power_expr
	| FIRST_VAL_FUNC LPAREN first_str_func = STRING_VALUE
	(
		(
			COMMA config = STRING_VALUE
		)?
	) RPAREN # first_val_func
	| FIRST_STR_FUNC LPAREN first_str_func = STRING_VALUE RPAREN # first_str_func
	| LAST_VAL_FUNC LPAREN last_str_func = STRING_VALUE
	(
		(
			COMMA config = STRING_VALUE
		)?
	) RPAREN # last_val_func
	| LAST_STR_FUNC LPAREN last_str_func = STRING_VALUE RPAREN # last_str_func
	| SUBMISSION_VAL_FUNC LPAREN sumission_val_str = STRING_VALUE RPAREN #
	submission_val_func
	| SUBMISSION_STR_FUNC LPAREN submission_str = STRING_VALUE RPAREN #
	submission_str_func
	| DATE_FORMAT_FUNC LPAREN date_format_expr = expression COMMA formatParam =
	STRING_VALUE RPAREN # date_format_func
	| NEW DATE LPAREN
	(
		(
			expr = expression
			(
				COMMA expr = expression
			)*
		)
	)* RPAREN # date
	| DATE_FORMAT_DISTANCE LPAREN left = expression COMMA right = expression ((COMMA opt=options)?)
	RPAREN # date_format_distance_func
	| DIFFERENCE_IN_HOURS LPAREN left = expression COMMA right = expression
	RPAREN # dif_in_hours
	| DIFFERENCE_IN_DAYS LPAREN left = expression COMMA right = expression
	RPAREN # dif_in_days
	| DIFFERENCE_IN_MINUTES LPAREN left = expression COMMA right = expression
	RPAREN # dif_in_minutes
	| DATE_ADD LPAREN date = expression COMMA d = duration RPAREN # dateAddFunc
	| DATE_SUBTRACT LPAREN date = expression COMMA d = duration RPAREN #
	dateSubtractFunc
	| MAX LPAREN args = expression
	(
		COMMA args = expression
	)* RPAREN # max_expr
	| MIN LPAREN args = expression
	(
		COMMA args = expression
	)* RPAREN # min_expr
	| NOW LPAREN RPAREN # now
	| numLiteral = NUMBER_LITERAL # process_number
	| strValueLiteral = STRING_VALUE # process_str
	| PRINT LPAREN
	(
		expr = expression
	)
	(
		COMMA expr = expression
	)* RPAREN # print_expr
	| boolLiteral =
	(
		TRUE
		| FALSE
	)# process_bool
	| 
	NULL #null_expr
	| UNDEFINED #undefined
	 
;
UNDEFINED: 'undefined';

NULL: 'null';


DATE_FORMAT_DISTANCE
:
	'dateFormatDistance'
;

duration
:
	L_CURLY_BRACE duration_element
	(
		COMMA duration_element
	)* R_CURLY_BRACE
;

duration_element
:
	years_element
	| month_element
	| weeks_element
	| days_element
	| hours_element
	| minutes_element
	| seconds_element
;


options:L_CURLY_BRACE option_element (COMMA option_element)* R_CURLY_BRACE;

option_element
:
	include_seconds
	| add_suffix
;

years_element
:
	YEARS COLON value = expression
;

month_element
:
	MONTHS COLON value = expression
;

weeks_element
:
	WEEKS COLON value = expression
;

days_element
:
	DAYS COLON value = expression
;

hours_element
:
	HOURS COLON value = expression
;

minutes_element
:
	MINUTES COLON value = expression
;

seconds_element
:
	SECONDS COLON value = expression
;

include_seconds
:
	INCLUDE_SECONDS COLON seconds = expression
;

add_suffix
:
	ADD_SUFFIX COLON suffix = expression
;

SECONDS
:
	'seconds'
;

MINUTES
:
	'minutes'
;

HOURS
:
	'hours'
;

DAYS
:
	'days'
;

WEEKS
:
	'weeks'
;

MONTHS
:
	'months'
;

YEARS
:
	'years'
;

OR
:
	'||'
;

AND
:
	'&&'
;

NOT
:
	'!'
;

DIFFERENCE_IN_MINUTES
:
	'differenceInMinutes'
;

DIFFERENCE_IN_DAYS
:
	'differenceInDays'
;

DIFFERENCE_IN_HOURS
:
	'differenceInHours'
;

DATE_ADD
:
	'dateAdd'
;

DATE_SUBTRACT
:
	'dateSubtract'
;

INCLUDE_SECONDS
:
	'includeSeconds'
;

ADD_SUFFIX
:
	'addSuffix'
;
// ----------------- lexer -----------------
// using the NA pattern marks this Token class as 'irrelevant' for the Lexer.
// AdditionOperator defines a Tokens hierarchy but only the leafs in this hierarchy define
// actual Tokens that can appear in the text

COLON
:
	':'
;

QUERY_OP
:
	'?'
;

NOW
:
	'now'
;

NEW
:
	'new'
;

DATE
:
	'Date'
;

PLUS
:
	'+'
;

MINUS
:
	'-'
;

MUL
:
	'*'
;

DIV
:
	'/'
;

LPAREN
:
	'('
;

RPAREN
:
	')'
;

NUMBER_LITERAL
:
	DecimalIntegerLiteral '.' [0-9] [0-9_]* ExponentPart?
	| '.' [0-9] [0-9_]* ExponentPart?
	| DecimalIntegerLiteral ExponentPart?
;

/// Numeric Literals

HexIntegerLiteral
:
	'0' [xX] [0-9a-fA-F] HexDigit*
;

OctalIntegerLiteral
:
	'0' [0-7]+
;

OctalIntegerLiteral2
:
	'0' [oO] [0-7] [_0-7]*
;

BinaryIntegerLiteral
:
	'0' [bB] [01] [_01]*
;

BigHexIntegerLiteral
:
	'0' [xX] [0-9a-fA-F] HexDigit* 'n'
;

BigOctalIntegerLiteral
:
	'0' [oO] [0-7] [_0-7]* 'n'
;

BigBinaryIntegerLiteral
:
	'0' [bB] [01] [_01]* 'n'
;

BigDecimalIntegerLiteral
:
	DecimalIntegerLiteral 'n'
;

HexDigit
:
	[_0-9a-fA-F]
;

ExponentPart
:
	[eE] [+-]? [0-9_]+
;

DecimalIntegerLiteral
:
	'0'
	| [1-9] [0-9_]*
;

IDENTITY
:
	'==='
;

NOT_IDENTITY
:
	'!=='
;

EQUALS
:
	'=='
;

NOT_EQUALS
:
	'!='
;

MORE_THAN
:
	'>'
;

LESS
:
	'<'
;

MORE_OR_EQUALS
:
	'>='
;

LESS_OR_EQUALS
:
	'<='
;

FIRST_VAL_FUNC
:
	'firstVal'
;

FIRST_STR_FUNC
:
	'firstStr'
;

LAST_VAL_FUNC
:
	'lastVal'
;

LAST_STR_FUNC
:
	'lastStr'
;

SUBMISSION_VAL_FUNC
:
	'submissionVal'
;

SUBMISSION_STR_FUNC
:
	'submissionStr'
;

POWER_FUNC
:
	'power'
;

DATE_FORMAT_FUNC
:
	'dateFormat'
;

MAX
:
	'max'
;

MIN
:
	'min'
;

COMMA
:
	','
;

L_CURLY_BRACE
:
	'{'
;

R_CURLY_BRACE
:
	'}'
;

PRINT
:
	'print'
;

TRUE
:
	'true'
;

FALSE
:
	'false'
;

STRING_VALUE
:
	'"'
	(
		'\\"'
		| .
	)*? '"'
;

WS
:
	[ \r\t\n]+ -> skip
;

COMMENT
:
	'/*' .*? '*/' -> skip
;

LINE_COMMENT
:
	'//' ~[\r\n]* -> skip
;