import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	heroes: [],
	heroesLoadingStatus: 'idle'
}

const heroesSlice = createSlice({
	name: 'heroes',
	initialState,
	reducers: {
		heroesFetching: (state) => { state.heroesLoadingStatus = 'loading' },
		heroesFetched: (state, action) => {
			state.heroesLoadingStatus = 'idle';
			state.heroes = action.payload;
		},
		heroesFetchingError: (state) => { state.heroesLoadingStatus = 'error' },
		heroAdd: (state, action) => { 
			state.heroesLoadingStatus = 'idle';
			state.heroes.push(action.payload) 
		},
		heroDelete: (state, action) => { state.heroes = state.heroes.filter(item => item.id !== action.payload) }
	}
})

const { reducer, actions } = heroesSlice;

export default reducer;
export const {
	heroesFetching,
	heroesFetched,
	heroesFetchingError,
	heroAdd,
	heroDelete
} = actions;