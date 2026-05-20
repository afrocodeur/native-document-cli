import {Context} from "../../context/Context.js";
import path from "path";

export const resolveDestination = (componentName, feature) => {
    if (feature) {
        return path.join(Context.features, feature, 'components', componentName);
    }
    return path.join(Context.components, componentName);
};

export const resolveRelativePath = (componentName, feature) => {
    if (feature) {
        return `src/features/${feature}/components/${componentName}`;
    }
    return `src/components/${componentName}`;
};