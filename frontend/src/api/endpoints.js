export const endpoints = {
    auth: {
        login: 'api/login/',
        user: 'api/user/'
    },
    profile: 'api/employee_profile/',
    attendance : {
        scan: 'api/scan_qr/',
        manual: 'api/manual_attendance/'
    },
    leave: {
        request: 'api/request_leave',
        status: 'api/request_leave'
    },
    summary: {
        status: 'api/employee_status/'
    }
};