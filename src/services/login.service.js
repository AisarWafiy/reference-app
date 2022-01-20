import axios from 'axios'
import { alertModelStatusMsgRequest } from 'actions/alertModal.actions'
import { alertActions } from 'actions/alert.actions'

export const loginResponse = (userId, dispatch, oktaAuth) => {

    axios.get(
        process.env.REACT_APP_SERVER_URI +
        '/api/user/info?userId=' + userId
    ).then(response => {
        const getData = response?.data?.result
        if (!getData.rolePerData.role) {
            dispatch(alertModelStatusMsgRequest(true, 'User Authentication is Successfull but role is not tagged in BCConnect system. Please contact IT Support Team.'))
        }
        else {
            if (!getData.user.active) {
                dispatch(alertModelStatusMsgRequest(true, 'User Authentication is Successfull but User is inactive in BCConnect system'))
            }
            else
                localStorage.setItem('loginUserPermissionsData', JSON.stringify(getData))
        }
    }).catch(err => {

        axios.get(
            process.env.REACT_APP_SERVER_URI +
            '/api/user/users'
        ).then(response => {
            let UserData = response?.data?.result;
            let index = UserData.findIndex(x => x.userId == userId)
            if (index == -1) {
                dispatch(alertModelStatusMsgRequest(true, 'User Authentication is Successfull but user information not found in BCConnect system. Please try after sometime.'))
            }
            else {
                dispatch(alertModelStatusMsgRequest(true, 'Waiting for BCConnect Application server...'))
            }
        }).catch(err => {
            dispatch(alertModelStatusMsgRequest(true, 'Waiting for BCConnect Application server...'))
        })
    })
}