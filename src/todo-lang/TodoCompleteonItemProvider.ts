import * as monaco from "monaco-editor-core";
import { WorkerAccessor } from "./setup";

export class TodoCompleteonItemProvider implements monaco.languages.CompletionItemProvider {

	constructor(private worker: WorkerAccessor) {

	}
	
	provideCompletionItems(model: monaco.editor.ITextModel, position: monaco.Position, context: monaco.languages.CompletionContext, token: monaco.CancellationToken){

		
		return this.suggest(model.uri, model.getValue(), position.lineNumber,position.c)

	}

	private async suggest(r: monaco.Uri, code: string, line:number,charPosInLine:number): Promise<monaco.languages.CompletionList> {
		// get the worker proxy
		const worker = await this.worker(r);
		// call the validate methode proxy from the langaueg service and get errors
		return await worker.suggest(code, line,charPosInLine);

		
	}


}