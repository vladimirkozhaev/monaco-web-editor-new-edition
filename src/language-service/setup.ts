import * as monaco from "monaco-editor-core";
import { languageExtensionPoint, languageID } from "./config";
import { richLanguageConfiguration, monarchLanguage } from "./TodoLang";
import { TodoLangWorker } from "./todoLangWorker";
import { WorkerManager } from "./WorkerManager";
import DiagnosticsAdapter from "./DiagnosticsAdapter";

import { TodoCompleteonItemProvider } from "./TodoCompleteonItemProvider";
import TodoLangFormattingProvider from "../todo-lang/TodoLangFormattingProvider";

export function setupLanguage() {
    (window as any).MonacoEnvironment = {
        getWorkerUrl: function (moduleId, label) {
            if (label === languageID)
                return "./todoLangWorker.js";
            return './editor.worker.js';
        }
    }
    monaco.languages.register(languageExtensionPoint);
    monaco.languages.onLanguage(languageID, () => {
        monaco.languages.setMonarchTokensProvider(languageID, monarchLanguage);
        monaco.languages.setLanguageConfiguration(languageID, richLanguageConfiguration);
        const client = new WorkerManager();

        const worker: WorkerAccessor = (...uris: monaco.Uri[]): Promise<TodoLangWorker> => {
            return client.getLanguageServiceWorker(...uris);
        };
        //Call the errors provider
        new DiagnosticsAdapter(worker);
        monaco.languages.registerDocumentFormattingEditProvider(languageID, new TodoLangFormattingProvider(worker));
        //monaco.languages.registerCompletionItemProvider(languageID, new TodoCompleteonItemProvider(worker))
    });

}

export type WorkerAccessor = (...uris: monaco.Uri[]) => Promise<TodoLangWorker>;