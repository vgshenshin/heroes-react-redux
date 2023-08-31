import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    activeFilter: 'all',
    filters: [],
    filtersLoadingStatus: 'idle'
}

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		filtersFetching: (state) => { state.filtersLoadingStatus = 'loading' },
		filtersFetched: (state, action) => {
			state.filtersLoadingStatus = 'idle';
			state.filters = action.payload;
		},
		filtersFetchingError: (state) => { state.filtersLoadingStatus = 'error' },
		activeFilterChanged: (state, action) => { 
			state.filtersLoadingStatus = 'idle';
			state.activeFilter = action.payload; 
		}
	}
})

const { reducer, actions } = filtersSlice;

export default reducer;
export const {
	filtersFetching,
	filtersFetched,
	filtersFetchingError,
	activeFilterChanged
} = actions;