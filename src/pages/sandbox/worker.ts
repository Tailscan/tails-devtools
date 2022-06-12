import {
  completionsFromClassList,
  resolveCompletionItem,
} from "./tailwindcss-intellisense/completionProvider";
import { provideClassNameHover } from "./tailwindcss-intellisense/hoverProvider";
import { createState } from "./tailwindcss-intellisense/state";
import { State } from "./tailwindcss-intellisense/types";

export class TailwindCSS {
  public state: State;
  constructor(config: any) {
    this.state = createState(config || {}) as State;
  }

  changeUserConfig(config: any) {
    this.state = createState(config) as State;
  }

  provideCompletionItems() {
    const suggestions = completionsFromClassList(this.state, "");
    return suggestions.items;
  }

  async resolveCompletionItem(item: any) {
    const resolvedItem = await resolveCompletionItem(this.state, item);
    return resolvedItem;
  }

  async doHover(className: string) {
    const css = await provideClassNameHover(this.state, className);
    return css;
  }
}
