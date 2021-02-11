import axios from 'axios';
import moment from "moment";
export default {

    async  fetchPrintLogs({ commit }, { date_range, SessionId }) {

        return await axios({
            method: 'POST',
            url: `${this.$axios.defaults.baseURL}/api/transaction/print-logs/select`,
            headers: {
                Authorization: SessionId
            },
          
            params: { ...date_range }

        //     const v = res.data.view;
      
        }).then(res => {

const v = res.data.view


            if (Array.isArray(v))
      
                commit('setPrintLogs' ,v)
                
            else
                commit('setPrintLogs', [])

            return res
        
    }

        ).catch(err => err)
    }
    
}