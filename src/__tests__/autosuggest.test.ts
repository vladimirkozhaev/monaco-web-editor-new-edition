import { ExpressionsParserGrammarParser } from '../ANTLR/ExpressionsParserGrammarParser';
import { ExpressionsParserGrammarLexer } from '../ANTLR/ExpressionsParserGrammarLexer';
import { getSuggestions } from '../lang-util/SuggestionVisitor';

describe('Test of the language equations', () => {
	it('initial test', async () => {
		let suggestions:Array<string>=getSuggestions('print',0,5)[0].expectedTokens
		console.log("suggestions",suggestions)
		expect(suggestions).toEqual(["'undefined'",
           "'!'",
           "'now'",
           "'('",
           "'firstVal'",
           "'print'"]);
	});
});