import { Div } from 'native-document/elements';

import './{{cssClass}}.css';

export function {{componentName}}(props, children) {
    return Div({ class: '{{cssClass}}', ...props }, children);
}