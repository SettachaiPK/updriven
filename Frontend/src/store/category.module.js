import { checkCookie } from '../helpers/authHeader';
import { categoryService } from '../services'

export const category = {
    namespaced: true,
    state: {
        _list: []
    },
    getters: {
        _list: state => state._list,
        option_ilst(state) {
            var option = []
            state._list.forEach(category => {
                option.push({
                    abbreviation: category.category_name,
                    name: category.category_name
                })
            })
            return option
        },
        is_list: state => state._list.length? true: false,
    },
    actions: {
        get_list({ commit }) {
            return new Promise((resolve, reject) => {        
                categoryService.test_list().then(
                    res => {
                        commit('fetch_list', res);
                        resolve(res)
                    },
                    error => {
                        reject(error)
                    }
                ).catch(err => {
                    reject(err)
                })
            })
        },
    },
    mutations: {
        fetch_list(state, input) {
            state._list = input
        }
    }
}