import { ANTLRInputStream, CharStream, CommonTokenStream, Token } from "antlr4ts";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { AbstractParseTreeVisitor } from "antlr4ts/tree/AbstractParseTreeVisitor";
import { ParseTree } from "antlr4ts/tree/ParseTree";
import { ExpressionsParserGrammarLexer } from "../ANTLR/ExpressionsParserGrammarLexer";
import { ExpressionContext, ExpressionsParserGrammarParser } from "../ANTLR/ExpressionsParserGrammarParser";

import { ExpressionsParserGrammarVisitor } from './../ANTLR/ExpressionsParserGrammarVisitor';
import { ILanguageError } from "./ILanguageError";
import { ExpressionsErrorListener } from "./ExpressionsErrorListener";





export class SuggestionVisitor extends AbstractParseTreeVisitor<Array<ParseTree>> implements ExpressionsParserGrammarVisitor<Array<ParseTree>> {

	private _line: number;
	private _charPosInLine: number;

	constructor(line: number, charPosInLine: number) {
		super()
		this._line = line;
		this._charPosInLine = charPosInLine
	}
	protected defaultResult() {
		return [];
	}


	visit(tree: ParseTree): Array<ParserRuleContext> {
		let parseRuleContext: ParserRuleContext = tree as ParserRuleContext;

		return []

	}



}

function getSuggestionsErrors(text: string, line: number, charPosInLine: number): Array<ILanguageError> {
	var chars: CharStream = new ANTLRInputStream(text);
	const lexer = new ExpressionsParserGrammarLexer(chars);

	var lexerErrorListener: ExpressionsErrorListener = new ExpressionsErrorListener();
	lexer.removeErrorListeners();
	lexer.addErrorListener(lexerErrorListener);
	let tokensStream: CommonTokenStream = new CommonTokenStream(lexer);

	let parser: ExpressionsParserGrammarParser = new ExpressionsParserGrammarParser(tokensStream);
	parser.removeErrorListeners();

	let tokens: Array<Token> = lexer.getAllTokens()
	var parserErrorListener: ExpressionsErrorListener = new ExpressionsErrorListener(tokens);
	parser.addErrorListener(parserErrorListener);


	let tree: ExpressionContext = parser.expression();


	var exprParsingVisitor: SuggestionVisitor = new SuggestionVisitor(line, charPosInLine);



	let errors: Array<ILanguageError> = lexerErrorListener.getErrors().concat(parserErrorListener.getErrors())

	return errors;
}





