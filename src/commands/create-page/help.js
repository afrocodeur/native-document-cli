export const createPageHelp = (args) => {
    return [
        '',
        '<font color="cyan" bold>Usage:</font>',
        '<tab/><font color="green">nd create:page</font> <font color="gray"><pageName></font>',
        '',
        '<font color="cyan" bold>Examples:</font>',
        '<tab/><font color="green">nd create:page dashboard</font>',
        '<tab/><font color="green">nd create:page user-profile</font>',
        '',
        '<font color="gray">Run with --params for more details</font>',
        ...(args?.includes('--params') ? [
            '',
            '<font color="cyan" bold>Parameters:</font>',
            '',
            '<tab/><font color="green">pageName</font>',
            '<tab repeat="2"/><font color="gray">Type    : string</font>',
            '<tab repeat="2"/><font color="gray">Required: yes</font>',
            '<tab repeat="2"/><font color="gray">Example : dashboard, user-profile, settings</font>',
            '<tab repeat="2"/><font color="gray">Note    : kebab-case recommended</font>',
            '',
            '<font color="cyan" bold>Generates:</font>',
            '<tab/><font color="gray">src/pages/pageName/PageNamePage.js</font>',
            '<tab/><font color="gray">src/pages/pageName/pageName.css</font>',
        ] : []),
    ];
};