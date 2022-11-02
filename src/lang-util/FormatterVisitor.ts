import {
  ANTLRInputStream,
  CommonTokenStream,
  ANTLRErrorListener,
  RecognitionException,
  Recognizer,
  CharStream,
  Token,
  ParserRuleContext,
} from 'antlr4ts';

import { AbstractParseTreeVisitor } from 'antlr4ts/tree/AbstractParseTreeVisitor';

import {
  NowContext,
  Years_elementContext,
  Month_elementContext,
  Weeks_elementContext,
  Days_elementContext,
  Hours_elementContext,
  Minutes_elementContext,
  Seconds_elementContext,
  Duration_elementContext,
  Print_exprContext,
  UndefinedContext,
  Null_exprContext,
  Max_exprContext,
  Min_exprContext,
  OptionsContext,
  Include_secondsContext,
  Add_suffixContext,
  Date_format_distance_funcContext,
  Option_elementContext,
} from '../ANTLR/ExpressionsParserGrammarParser';

import { DurationContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { DateAddFuncContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { DateSubtractFuncContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Not_exprContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Or_exprContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { And_exprContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Add_exprContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Dif_in_minutesContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Dif_in_hoursContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Dif_in_daysContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { DateContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Mul_div_exprContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Brackets_exprContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Power_exprContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { First_val_funcContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { First_str_funcContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Last_val_funcContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Last_str_funcContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Submission_val_funcContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Submission_str_funcContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Date_format_funcContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Process_numberContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Process_strContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { ExpressionContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Equality_operationContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Identity_operationContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Process_boolContext } from '../ANTLR/ExpressionsParserGrammarParser';
import { Question_exprContext } from '../ANTLR/ExpressionsParserGrammarParser';

import { ExpressionsParserGrammarParser } from '../ANTLR/ExpressionsParserGrammarParser';
import { ExpressionsParserGrammarLexer } from '../ANTLR/ExpressionsParserGrammarLexer';

import { ExpressionsParserGrammarVisitor } from './../ANTLR/ExpressionsParserGrammarVisitor';
import { ExpressionsErrorListener } from './ExpressionsErrorListener';
import { ILanguageError } from './ILanguageError';




const DEBUG_DATE = false;



interface Callbacks {
  firstVal: (fieldSpec: string, config?: string) => Promise<any>;
  firstStr: (fieldSpec: string) => Promise<string>;
  lastVal: (fieldSpec: string, config?: string) => Promise<any>;
  lastStr: (fieldSpec: string) => Promise<string>;
  submissionVal: (fieldSpec: string) => Promise<any>;
  submissionStr: (fieldSpec: string, format?: string) => Promise<string>;
  dateFormat: (fieldSpec: string, format?: string) => string;
}



export interface ExpressionResult {
  value: any;
  lexResult: any;
  parseErrors: ILanguageError[];
  lexErrors: ILanguageError[];
  hasError: boolean;
}



function retireveNodeText(node: ExpressionContext): string {
  return node.text;
}

class FormatterVisitor extends AbstractParseTreeVisitor<string> implements ExpressionsParserGrammarVisitor<string> {
  private _tab: number = 0;
  constructor() {
    super();

  }

  private tabPlus() {
    this._tab++;
  }

  private tabMinus() {
    this._tab--;
  }
  private createTabs() {
    let tabStr: string = "";
    
    for (let i = 0; i < this._tab; i++) {
      tabStr += "\t"
    }
    return tabStr;
  }
  //	async visit(/*@NotNull*/ tree: ParseTree) {
  //		return await super.visit(tree)
  //	}



  protected defaultResult() {
    return 'Method not implemented.';
  }

  /**
   * Visit a parse tree produced by the `not_expr`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitNot_expr(ctx: Not_exprContext) {
    return "!" + this.visit(ctx._expr)
  }

  /**
   * Visit a parse tree produced by the `and_expr`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAnd_expr(ctx: And_exprContext) {
    return this.visit(ctx._left) + " && " + this.visit(ctx._right)
  }

  /**
   * Visit a parse tree produced by the `or_expr`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitOr_expr(ctx: Or_exprContext) {
    return this.visit(ctx._left) + " || " + this.visit(ctx._right)
  }

  visitNow(ctx: NowContext) {
    return " now() "
  }

  visitDate(ctx: DateContext) {
    let str: string = ctx.expression().map(expr => this.visit(expr)).filter(e => {

      return e.trim() != ""
    }).join(", ")
    return "new Date(" + str + ")"
  }

  visitDif_in_minutes(ctx: Dif_in_minutesContext) {
    return "differenceInMinutes" + "(" + this.visit(ctx._left) + ", " + this.visit(ctx._right) + ")"
  }

  visitDif_in_days(ctx: Dif_in_daysContext) {
    return "differenceInDays" + "(" + this.visit(ctx._left) + ", " + this.visit(ctx._right) + ")"
  }

  visitDif_in_hours(ctx: Dif_in_hoursContext) {
    return "differenceInHours" + "(" + this.visit(ctx._left) + ", " + this.visit(ctx._right) + ")"
  }
  /**
   * Visit a parse tree produced by the `add_expr`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitAdd_expr(ctx: Add_exprContext) {
    let left: string = this.visit(ctx._left)
    let right: string = this.visit(ctx._right)
    return left + ' ' + ctx._plus_minus.text + ' ' + right;
  }

  /**
   * Visit a parse tree produced by the `mul_div_expr`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitMul_div_expr(ctx: Mul_div_exprContext) {
    let left: string = this.visit(ctx._left)
    let right: string = this.visit(ctx._right)
    return left + ' ' + ctx._mul_or_div.text + ' ' + right;
  }

  /**
   * Visit a parse tree produced by the `brackets_expr`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitBrackets_expr(ctx: Brackets_exprContext) {
    return '( ' + this.visit(ctx._expr) + ' )'
  }

  /**
   * Visit a parse tree produced by the `power_expr`(
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitPower_expr(ctx: Power_exprContext) {
    return "power(" + this.visit(ctx._expr1) + ", " + this.visit(ctx._expr2) + ")"
  }

  /**
   * Visit a parse tree produced by the `last_val_func`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFirst_val_func(ctx: First_val_funcContext): string {
    return ctx.FIRST_VAL_FUNC().text+'( '+ctx._first_str_func.text+ ctx._config?(', '+ctx._config.text):''+' )'
  }

  /**
   * Visit a parse tree produced by the `last_str_func`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitFirst_str_func(ctx: First_str_funcContext): string {
   return ctx.FIRST_STR_FUNC().text+'( '+ctx._first_str_func.text+' )'
  }
  /**
   * Visit a parse tree produced by the `last_val_func`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLast_val_func(ctx: Last_val_funcContext) {
    return ctx.LAST_VAL_FUNC().text+'( '+ctx._last_str_func.text+' )'
  }

  visitSubmission_val_func(ctx: Submission_val_funcContext) {
    return ctx.SUBMISSION_VAL_FUNC().text+'( '+ctx._sumission_val_str.text+' )'
  }

  visitSubmission_str_func(ctx: Submission_str_funcContext): string {
    return ctx.SUBMISSION_STR_FUNC().text+'( '+ctx._submission_str.text+' )'
  }

  /**
   * Visit a parse tree produced by the `process_number`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitProcess_number(ctx: Process_numberContext) {
    return retireveNodeText(ctx)
  }

  /**
   * Visit a parse tree produced by the `process_str`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitProcess_str(ctx: Process_strContext): any {
    return retireveNodeText(ctx)
  }

  /**
   * Visit a parse tree produced by the `last_str_func`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitLast_str_func(ctx: Last_str_funcContext) {
    return ctx.LAST_STR_FUNC().text+'( '+ctx._last_str_func.text+' )'
  }

  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.dateFormatFunction`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitDate_format_func(ctx: Date_format_funcContext) {
    return "dateFormat(" + this.visit(ctx._date_format_expr) + ", " + ctx._formatParam.text + ")"
  }

  visitUndefined(ctx: UndefinedContext) {
    return retireveNodeText(ctx)
  }

  visitNull_expr(ctx: Null_exprContext) {
    return retireveNodeText(ctx)
  }

  visitIdentity_operation(ctx: Identity_operationContext) {
    return this.visit(ctx._left) + " " + ctx._identity_operation.text + " " + this.visit(ctx._right)
  }

  visitEquality_operation(ctx: Equality_operationContext) {
    return this.visit(ctx._left) + " " + ctx._equality_operation.text + " " + this.visit(ctx._right)
  }

  /**
   * Visit a parse tree produced by the `process_bool`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitProcess_bool(ctx: Process_boolContext) {
    return retireveNodeText(ctx)
  }

  /**
   * Visit a parse tree produced by the `question_expr`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitQuestion_expr(ctx: Question_exprContext) {
    return this.visit(ctx._condition) + " ? " + this.visit(ctx._true_exp) + " : " + this.visit(ctx._false_exp)
  }

  /**
   * Visit a parse tree produced by the `dateAddFunc`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitDateAddFunc(ctx: DateAddFuncContext) {

    return "dateAdd( " + this .visit(ctx._date) + " , " + this.visit(ctx._d) + " )"

  }

  /**
   * Visit a parse tree produced by the `dateSubtractFunc`
   * labeled alternative in `ExpressionsParserGrammarParser.expression`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitDateSubtractFunc(ctx: DateSubtractFuncContext) {
    return "dateSubtract( " + this.visit(ctx._date) + " , " + this.visit(ctx._d) + " )"
  }

  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.duration`.
   * @param ctx the parse tree
   * @return the visitor result
   */

  visitDuration(ctx: DurationContext) {
    this._tab++;
    let str: string = "{\n" + this.createTabs() + ctx.duration_element().map(de => this.visit(de)).join(",\n" + this.createTabs()) + "\n" + this.createTabs() + "}"
    this._tab--;
    return str
  }

  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.years_element`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitYears_element(ctx: Years_elementContext) {
    return 'years :' + this.visit(ctx._value)
  }

  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.month_element`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitMonth_element(ctx: Month_elementContext) {
    return 'month :' + this.visit(ctx._value)
  }
  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.weeks_element`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitWeeks_element(ctx: Weeks_elementContext) {
    return 'weeks :' + this.visit(ctx._value)
  }

  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.days_element`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitDays_element(ctx: Days_elementContext) {
    return 'days :' + this.visit(ctx._value)
  }

  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.hours_element`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitHours_element(ctx: Hours_elementContext) {
    return 'hours :' + this.visit(ctx._value)
  }

  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.minutes_element`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitMinutes_element(ctx: Minutes_elementContext) {
    return 'minutes :' + this.visit(ctx._value)
  }
  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.seconds_element`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitSeconds_element(ctx: Seconds_elementContext) {
    return 'seconds :' + this.visit(ctx._value)
  }

  visitOption_element(ctx: Option_elementContext) {
    return ctx.add_suffix()?this.visit(ctx.add_suffix()):this.visit(ctx.include_seconds())
  }

  visitOptions(ctx: OptionsContext) {
    return ctx.L_CURLY_BRACE().text +" "+ctx.option_element().map(opt=>this.visit(opt)).join(',')+" "+ctx.R_CURLY_BRACE().text
  }

  visitInclude_seconds(ctx: Include_secondsContext) {
    return ctx.INCLUDE_SECONDS().text+ctx.COLON().text+" "+this.visit(ctx.expression())
  }

  visitAdd_suffix(ctx: Add_suffixContext) {
    return ctx.ADD_SUFFIX().text+ctx.COLON().text+" "+this.visit(ctx.expression())
  }

  visitDate_format_distance_func(ctx: Date_format_distance_funcContext) {
    this.tabPlus()
    let str: string = "dateFormatDistance { \n" + this.createTabs() + this.visit(ctx._left) + " ,\n" + this.createTabs() + this.visit(ctx._right) + ctx._opt ? (",\n" + this.createTabs() + this.visit(ctx._opt)) : "" + " }";
    this.tabMinus()
    return str
  }
  /**
   * Visit a parse tree produced by `ExpressionsParserGrammarParser.duration_element`.
   * @param ctx the parse tree
   * @return the visitor result
   */
  visitDuration_element(ctx: Duration_elementContext) {
    if (ctx.years_element()){
      return this.visit(ctx.years_element())
    }
    if (ctx.month_element()){
      return this.visit(ctx.month_element())
    }
    if (ctx.days_element()){
      return this.visit(ctx.days_element())
    }
    if (ctx.hours_element()){
      return this.visit(ctx.hours_element())
    }
    if (ctx.minutes_element()){
      return this.visit(ctx.minutes_element())
    }
    if (ctx.seconds_element()){
      return this.visit(ctx.seconds_element())
    }
  }

  visitPrint_expr(ctx: Print_exprContext) {
    return ctx.PRINT().text+ctx.LPAREN().text+ ' ' +ctx.expression().map(exp=>this.visit(exp)).join(' ') +' '+ ctx.LPAREN().text
  }

  visitMax_expr(ctx: Max_exprContext) {
    return ctx.MAX().text+"( "+ctx.expression().map(exp=>this.visit(exp)).join(', ') +' )'
  }

  visitMin_expr(ctx: Min_exprContext) {
    return ctx.MIN().text+"( "+ctx.expression().map(exp=>this.visit(exp)).join(', ') +' )'
  }


}

export function calcFormatted(text: string): ExpressionResult {


  var chars: CharStream = new ANTLRInputStream(text);
  const lexer = new ExpressionsParserGrammarLexer(chars);

  var lexerErrorListener: ExpressionsErrorListener = new ExpressionsErrorListener();
  var parserErrorListener: ExpressionsErrorListener = new ExpressionsErrorListener();
  lexer.removeErrorListeners();
  lexer.addErrorListener(lexerErrorListener);
  const tokens = new CommonTokenStream(lexer);

  const parser = new ExpressionsParserGrammarParser(tokens);
  parser.removeErrorListeners();

  parser.addErrorListener(parserErrorListener);
  const tree = parser.expression();

  var parseErrors: Array<ILanguageError> = [];
  var lexErrors: ILanguageError[] = [];
  //var callbacksVisitor: CallbacksVisitor = new CallbacksVisitor(callbacks);
  //callbacksVisitor.visit(tree);
  //const promises = callbacksVisitor.promises;
  // Promise.all(promises);
  var exprParsingVisitor: FormatterVisitor = new FormatterVisitor();
  let exprVisit: string;
  try {
    exprVisit = exprParsingVisitor.visit(tree);
  } catch (e) {
    console.log(e.text)
  }
  return {
    value: exprVisit,
    lexResult: 1,
    parseErrors: parserErrorListener.getErrors(),
    lexErrors: lexerErrorListener.getErrors(),
    hasError: lexerErrorListener.getErrors().length > 0 || parserErrorListener.getErrors().length > 0,
  };
}

export function errorText(expression: string, result: ExpressionResult): string {
  if (!result.hasError) {
    return '';
  }
  return `Expression '${expression}' had error(s): '${JSON.stringify({
    lexErrors: result.lexErrors,
    parseErrors: result.parseErrors,
  })}'`;
}