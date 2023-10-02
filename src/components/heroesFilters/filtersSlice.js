import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit'
import { useHttp } from '../../hooks/http.hook';

// const initialState = {
//     activeFilter: 'all',
//     filters: [],
//     filtersLoadingStatus: 'idle'
// }

const filtersAdapter = createEntityAdapter(); 

const initialState = filtersAdapter.getInitialState({
	filtersLoadingStatus: 'idle',
	activeFilter: 'all'
})

export const fetchFilters = createAsyncThunk(
	'filters/fetchFilters',
	async () => {
		const { request } = useHttp();
		const data = await request("https://script.google.com/macros/s/AKfycbwK3BgIKt80xgHdy8Y26UscI-dk-Yx0Ro2Hl2RmDHsbvJw6lJ1PeHeQlj8dODisusCsJA/exec");
		return await data.filters;
		// http://localhost:3001/filters
	}
);

const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		activeFilterChanged: (state, action) => { 
			state.filtersLoadingStatus = 'idle';
			state.activeFilter = action.payload; 
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchFilters.pending, (state) => { state.filtersLoadingStatus = 'loading' })
			.addCase(fetchFilters.fulfilled, (state, action) => {
				state.filtersLoadingStatus = 'idle';
				// state.filters = action.payload;
				filtersAdapter.setAll(state, action.payload);
			})
			.addCase(fetchFilters.rejected, (state) => { state.filtersLoadingStatus = 'error' })
			.addDefaultCase(() => {})
	}
})

const { reducer, actions } = filtersSlice;


export default reducer;
export const { selectAll } = filtersAdapter.getSelectors((state) => state.filters);

export const { activeFilterChanged } = actions;