import {Context} from "../../context/Context.js";
import path from "path";

export const resolveDestination = (serviceName, feature) => {
    if (feature) {
        return path.join(Context.features, feature, 'services', serviceName);
    }
    return path.join(Context.coreServices, serviceName);
};

export const resolveRelativePath = (serviceName, name, feature) => {
    if (feature) {
        return `src/features/${feature}/services/${serviceName}/${name}.js`;
    }
    return `src/core/services/${serviceName}/${name}.js`;
};