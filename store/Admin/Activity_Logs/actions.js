import axios from 'axios';
export default {

    async  fetchActivtyLogs({ commit }, { user_actions, date_range, SessionId }) {

        return await axios({
            method: 'POST',
            url: `${this.$axios.defaults.baseURL}/api/admin/activity_logs`,
            headers: {
                Authorization: SessionId
            },
            data: {
                user_actions
            },
            params: { ...date_range }
        }).then(res => {
            if (Array.isArray(res.data.activity_logs))
                commit('setActivityLogs', res.data.activity_logs)
            else
                commit('setActivityLogs', [])

            return res
        }


        ).catch(err => err)
    }
}