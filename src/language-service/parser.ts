import { ExpressionsParserGrammarParser, ExpressionContext } from "../ANTLR/ExpressionsParserGrammarParser";
import { ExpressionsParserGrammarLexer } from "../ANTLR/ExpressionsParserGrammarLexer";
import { ANTLRInputStream, CommonTokenStream } from "antlr4ts";
import { ExpressionsErrorListener } from "../lang-util/ExpressionsErrorListener";
import { ILanguageError } from "../lang-util/ILanguageError";


function parse(code: string): {ast:ExpressionContext, errors: ILanguageError[]} {
    const inputStream = new ANTLRInputStream(code);
    const lexer = new ExpressionsParserGrammarLexer(inputStream);
    lexer.removeErrorListeners()
    const todoLangErrorsListner = new ExpressionsErrorListener();
    lexer.addErrorListener(todoLangErrorsListner);
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new ExpressionsParserGrammarParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(todoLangErrorsListner);
    const ast =  parser.expression()
    const errors: ILanguageError[]  = todoLangErrorsListner.getErrors();
    return {ast, errors};
}
export function parseAndGetASTRoot(code: string): ExpressionContext {
    const {ast} = parse(code);
    return ast;
}
export function parseAndGetSyntaxErrors(code: string): ILanguageError[] {
    const {errors} = parse(code);
    return errors;
}