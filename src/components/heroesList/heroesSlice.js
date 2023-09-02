import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from '@reduxjs/toolkit'
import { useHttp } from '../../hooks/http.hook';


const heroesAdapter = createEntityAdapter(); 

const initialState = heroesAdapter.getInitialState({
	heroesLoadingStatus: 'idle'
})

export const fetchHeroes = createAsyncThunk(
	'heroes/fetchHeroes',
	async () => {
		const { request } = useHttp();
		return await request("http://localhost:3001/heroes")
	}
);

const heroesSlice = createSlice({
	name: 'heroes',
	initialState,
	reducers: {
		heroAdd: (state, action) => {
			heroesAdapter.addOne(state, action.payload);
		},
		heroDelete: (state, action) => { 
			heroesAdapter.removeOne(state, action.payload);
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchHeroes.pending, (state) => { state.heroesLoadingStatus = 'loading' })
			.addCase(fetchHeroes.fulfilled, (state, action) => {
				state.heroesLoadingStatus = 'idle';
				heroesAdapter.setAll(state, action.payload)
			})
			.addCase(fetchHeroes.rejected, (state) => { state.heroesLoadingStatus = 'error' })
			.addDefaultCase(() => {})
	}
});


const { reducer, actions } = heroesSlice;

const { selectAll } = heroesAdapter.getSelectors((state) => state.heroes);


// мемоизирует значения в стейте, чтобы не было ререндера при получении одного и того же значения
// например фильтра 'all'
export const filteredHeroesSelector = createSelector(
	(state) => state.filters.activeFilter,
	selectAll,
	(filter, heroes) => filter === 'all' ? heroes : heroes.filter(({element}) => element === filter)
)

export default reducer;
export const { heroAdd, heroDelete } = actions;