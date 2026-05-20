/**
 * Convert kebab-case to PascalCase
 * dashboard        → Dashboard
 * user-profile     → UserProfile
 * my-awesome-page  → MyAwesomePage
 */
export const toPascalCase = (str) => {
    return str
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};

/**
 * Convert PascalCase or any string to kebab-case
 * UserProfile      → user-profile
 * AuthService      → auth-service
 * MyAwesomePage    → my-awesome-page
 * my_awesome_page  → my-awesome-page
 */
export const toKebabCase = (str) => {
    return str
        .replace(/([a-z])([A-Z])/g, '$1-$2')  // PascalCase → kebab
        .replace(/_/g, '-')                     // snake_case → kebab
        .toLowerCase();
};



/**
 * Get the component class name from page name
 * dashboard     → DashboardPage
 * user-profile  → UserProfilePage
 */
export const toPageName = (str) => {
    return `${toPascalCase(str)}Page`;
};

/**
 * Get the CSS class name from page name
 * dashboard     → dashboard
 * user-profile  → user-profile
 */
export const toCssClass = (str) => str;