import { createStore } from "redux";

const system = {
    name: '',
    email: '',
    state: '',
    city: '',
    address: '',
    isLoading: false,
}

const dispatcher = (state = system, { type, payload }) => {

    switch (type) {
        case 'userUpdate': state.name = payload.name;
            state.email = payload?.email ? payload?.email : state.email;
            state.state = payload.state;
            state.city = payload.city;
            state.address = payload.address;
            return { ...state };
        case 'setIsLoading': state.isLoading = payload;
            return { ...state };
        default: return { ...state };
    }
};

const store = createStore(dispatcher);
export default store;