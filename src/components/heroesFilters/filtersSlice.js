import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { useHttp } from '../../hooks/http.hook';

const initialState = {
    activeFilter: 'all',
    filters: [],
    filtersLoadingStatus: 'idle'
}

export const fetchFilters = createAsyncThunk(
	'filters/fetchFilters',
	async () => {
		const { request } = useHttp();
		return await request("http://localhost:3001/filters")
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
				state.filters = action.payload;
			})
			.addCase(fetchFilters.rejected, (state) => { state.filtersLoadingStatus = 'error' })
			.addDefaultCase(() => {})
	}
})

const { reducer, actions } = filtersSlice;

export default reducer;
export const { activeFilterChanged } = actions;