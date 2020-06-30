module.exports = {
    apps: [
        {
            name: "ottawa-site",
            script: 'index.ts',
            args: [],
            autorestart: true,
            log_date_format : "YYYY-MM-DD HH:mm"
        }
    ]
};